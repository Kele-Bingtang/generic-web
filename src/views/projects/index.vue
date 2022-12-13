<template>
  <div class="projects-container">
    <el-tabs type="border-card" v-model="activeName" class="projects-tabs">
      <el-tab-pane label="我的项目" name="default">
        <el-row :gutter="10">
          <el-col
            :xs="12"
            :sm="12"
            :md="6"
            :lg="6"
            :xl="4"
            v-for="item in projectList"
            :key="item.id"
            style="margin-bottom: 10px"
          >
            <project-card @header-click="handleHeaderClick(item)">
              <template #header>
                <span>{{ item.projectName }}</span>
              </template>
              <div class="base-url">{{ item.baseUrl }}</div>
              <div class="description">{{ item.description }}</div>
              <template #footer>
                <el-button
                  type="text"
                  icon="el-icon-view"
                  class="btn-primary"
                  @click="handleHeaderClick(item)"
                ></el-button>
                <el-button
                  type="text"
                  icon="el-icon-delete"
                  class="btn-danger"
                  @click="deleteProject(item)"
                ></el-button>
                <el-button
                  type="text"
                  icon="el-icon-setting"
                  class="btn-warning"
                  @click="editProject(item)"
                ></el-button>
              </template>
            </project-card>
          </el-col>
          <el-col :xs="12" :sm="12" :md="6" :lg="6" :xl="4">
            <project-card :only-body="true" class="plus-project" @click.native="addProject">
              <i class="el-icon-plus action"></i>
            </project-card>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="我加入的" name="join" lazy>我加入的</el-tab-pane>
      <el-tab-pane label="我创建的" name="create" lazy>我创建的</el-tab-pane>
    </el-tabs>

    <el-dialog v-draggable-dialog :title="dialogTitle[operatorType]" :visible.sync="dialogVisible" width="30%">
      <el-form ref="projectForm" :model="projectForm" :rules="projectRules" label-width="110px">
        <el-form-item label="项目名称：" prop="projectName">
          <el-input v-model="projectForm.projectName" placeholder="请输入项目名称"></el-input>
        </el-form-item>
        <el-form-item label="接口基础路径" prop="baseUrl" class="item-base-url">
          <el-tooltip effect="dark" content="" placement="right">
            <div slot="content" style="line-height: 1.5715">
              接口基础路径为 '/' 开头有字母或 数
              <br />
              字 组成的字符串如：'/shop01' 不能
              <br />
              有多个 '/'
            </div>
            <i class="el-icon-question"></i>
          </el-tooltip>
          ：
          <el-input v-model="projectForm.baseUrl" placeholder="请输入接口基础路径" style="width: 384px"></el-input>
        </el-form-item>
        <el-form-item label="项目描述：" prop="description">
          <el-input
            type="textarea"
            :autosize="{ minRows: 4 }"
            v-model="projectForm.description"
            placeholder="请输入项目描述"
          ></el-input>
        </el-form-item>
        <el-form-item label="数据库：" prop="databaseName">
          <el-input v-model="projectForm.databaseName" placeholder="请输入数据库"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button v-waves @click="dialogVisible = false">取 消</el-button>
        <el-button
          v-waves
          type="primary"
          @click="operatorType === 'add' ? addProjectConfirm() : operatorType === 'edit' ? editProjectConfirm() : ''"
        >
          确 定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ProjectCard from "@/components/ProjectCard/index.vue";
import { Form } from "element-ui";
import {
  insertProject,
  ProjectModule,
  queryProjectList,
  deleteProject,
  updateProject,
  defaultProjectData,
} from "@/api/project";
import { UserModule } from "@/store/modules/user";

type Project = ProjectModule.Project;

@Component({
  components: { ProjectCard },
})
export default class Projects extends Vue {
  public activeName = "default";
  public dialogVisible = false;
  public operatorType: "add" | "edit" | "" = "";
  public dialogTitle: { [propName: string]: string } = {
    add: "添加项目",
    edit: "编辑项目",
  };

  public projectList: Array<Project> = [];

  public projectForm = { ...defaultProjectData };

  public projectRules = {
    projectName: [{ required: true, message: "请输入项目名称", trigger: "change" }],
    baseUrl: [{ required: true, message: "请输入接口基础路径", trigger: "change" }],
    description: [{ required: true, message: "请输入项目描述", trigger: "change" }],
  };

  mounted() {
    this.getProject();
  }

  public getProject() {
    queryProjectList().then(res => {
      this.projectList = res.data;
    });
  }

  public addProject() {
    this.dialogVisible = true;
    this.operatorType = "add";
    this.$nextTick(() => {
      (this.$refs.projectForm as Form).clearValidate();
    });
  }

  public addProjectConfirm() {
    (this.$refs.projectForm as Form).validate(valid => {
      if (valid) {
        let project = {
          ...this.projectForm,
        };
        project.createUser = UserModule.userInfo.userId;
        project.modifyUser = UserModule.userInfo.userId;
        insertProject(project as Project).then(res => {
          if (res.codeMessage === "success") {
            this.$notify({
              title: "Success",
              message: "新增成功",
              type: "success",
              duration: 3000,
            });
            this.$nextTick(() => {
              this.projectForm = { ...defaultProjectData };
              this.getProject();
            });
          } else {
            this.$notify({
              title: "Error",
              message: "新增失败",
              type: "error",
              duration: 3000,
            });
          }
          this.dialogVisible = false;
        });
      } else {
        return false;
      }
    });
  }

  public editProject(project: Project) {
    this.dialogVisible = true;
    this.operatorType = "edit";
    let { id, projectName, baseUrl, description, databaseName } = project;
    this.projectForm = { id, projectName, baseUrl, description, databaseName };
    this.projectForm.modifyUser = UserModule.userInfo.userId;
    this.$nextTick(() => {
      (this.$refs.projectForm as Form).clearValidate();
    });
  }

  public editProjectConfirm() {
    (this.$refs.projectForm as Form).validate(valid => {
      if (valid) {
        let project = {
          ...this.projectForm,
        };
        project.createUser = UserModule.userInfo.userId;
        project.modifyUser = UserModule.userInfo.userId;
        updateProject(project as Project).then(res => {
          if (res.codeMessage === "success") {
            this.$notify({
              title: "Success",
              message: "更新成功",
              type: "success",
              duration: 3000,
            });
            this.$nextTick(() => {
              this.projectForm = { ...defaultProjectData };
              this.getProject();
            });
          } else {
            this.$notify({
              title: "Error",
              message: "更新失败",
              type: "error",
              duration: 3000,
            });
          }
          this.dialogVisible = false;
        });
      } else {
        return false;
      }
    });
  }

  public handleHeaderClick(project: Project) {
    let { id, projectName, secretKey, baseUrl } = project;
    if (id) {
      this.$router.push({
        path: `/project/details/${projectName}/${secretKey}`,
        query: {
          baseUrl: baseUrl,
        },
      });
    }
  }

  public deleteProject(project: Project) {
    this.$confirm("此操作将永久删除该项目, 是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(() => {
        deleteProject(project).then(res => {
          if (res.data) {
            this.$nextTick(() => {
              this.getProject();
            });
            this.$notify({
              title: "Success",
              type: "success",
              message: "删除成功!",
            });
          } else {
            this.$notify({
              title: "Error",
              type: "error",
              message: "删除失败!",
            });
          }
        });
      })
      .catch();
  }
}
</script>

<style lang="scss" scoped>
.projects-container {
  padding: 20px;
  width: 100%;
  height: 100%;
  .projects-tabs {
    width: 100%;
    height: 100%;

    .plus-project {
      text-align: center;
      line-height: 220px;
      color: #999;
      cursor: pointer;
      &:hover {
        background-color: #f2f2f2;
      }
      .el-icon-plus.action {
        font-size: 60px;
      }
    }

    .base-url {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-bottom: 10px;
      font-size: 16px;
      margin-top: 0;
      color: rgba(0, 0, 0, 0.85);
      font-weight: 500;
    }
    .description {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      overflow: hidden;
      color: #999;
    }
  }
}
</style>

<style lang="scss">
.projects-container {
  .action {
    display: inline-block;
    color: inherit;
    font-style: normal;
    text-align: center;
    text-transform: none;
    text-rendering: optimizelegibility;
    -webkit-font-smoothing: antialiased;
  }
  .el-dialog {
    .item-base-url label {
      padding-right: 5px;
    }
  }
}
</style>
