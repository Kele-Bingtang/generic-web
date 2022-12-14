<template>
  <div class="projects-container">
    <el-tabs type="border-card" v-model="activeName" class="projects-tabs" :before-leave="switchTab">
      <el-tab-pane v-for="item in tabs" :key="item.name" :label="item.label" :name="item.name" :lazy="true">
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
    </el-tabs>

    <el-dialog v-draggable-dialog :title="dialogTitle[operatorType]" :visible.sync="dialogVisible" width="30%">
      <el-form ref="projectForm" :model="projectForm" :rules="projectRules" label-width="110px">
        <el-form-item label="???????????????" prop="projectName">
          <el-input v-model="projectForm.projectName" placeholder="?????????????????????"></el-input>
        </el-form-item>
        <el-form-item label="??????????????????" prop="baseUrl" class="item-base-url">
          <el-tooltip effect="dark" content="" placement="right">
            <div slot="content" style="line-height: 1.5715">
              ????????????????????? '/' ?????????????????? ???
              <br />
              ??? ????????????????????????'/shop01' ??????
              <br />
              ????????? '/'
            </div>
            <i class="el-icon-question"></i>
          </el-tooltip>
          ???
          <el-input v-model="projectForm.baseUrl" placeholder="???????????????????????????" style="width: 384px"></el-input>
        </el-form-item>
        <el-form-item label="???????????????" prop="description">
          <el-input
            type="textarea"
            :autosize="{ minRows: 4 }"
            v-model="projectForm.description"
            placeholder="?????????????????????"
          ></el-input>
        </el-form-item>
        <el-form-item label="????????????" prop="databaseName">
          <el-input v-model="projectForm.databaseName" placeholder="??????????????????"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button v-waves @click="dialogVisible = false">??? ???</el-button>
        <el-button
          v-waves
          type="primary"
          @click="operatorType === 'add' ? addProjectConfirm() : operatorType === 'edit' ? editProjectConfirm() : ''"
        >
          ??? ???
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
  queryProjectListOwner,
  deleteProject,
  updateProject,
  defaultProjectData,
} from "@/api/project";
import { UserModule } from "@/store/modules/user";
import notification from "@/utils/notification";
import { DataModule } from "@/store/modules/data";
import { refreshPage } from "@/utils/layout";

type Project = ProjectModule.Project;

type UserProjectSearch = ProjectModule.UserProjectSearch;

export interface CommonTab {
  id?: number;
  label: string;
  name: string;
}

@Component({ components: { ProjectCard } })
export default class GenericProject extends Vue {
  public activeName = "all";
  public dialogVisible = false;
  public operatorType: "add" | "edit" | "" = "";
  public dialogTitle: { [propName: string]: string } = {
    add: "????????????",
    edit: "????????????",
  };
  public tabs: Array<CommonTab> = [
    {
      label: "????????????",
      name: "all",
    },
    {
      label: "????????????",
      name: "create",
    },
    {
      label: "????????????",
      name: "join",
    },
  ];
  public projectList: Array<Project> = [];
  public projectForm = { ...defaultProjectData };

  public projectRules = {
    projectName: [{ required: true, message: "?????????????????????", trigger: "change" }],
    baseUrl: [{ required: true, message: "???????????????????????????", trigger: "change" }],
    description: [{ required: true, message: "?????????????????????", trigger: "change" }],
  };

  mounted() {
    this.initProject();
  }

  public initProject(condition?: UserProjectSearch) {
    queryProjectListOwner(condition).then(res => {
      this.projectList = res.data;
    });
  }

  public switchTab(activeName: string, oldActiveName: string) {
    if (activeName === oldActiveName) {
      return;
    }
    if (activeName === "create") {
      this.initProject({ enterType: 0 });
    } else if (activeName === "join") {
      this.initProject({ enterType: 1 });
    } else {
      this.initProject();
    }
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
        project.createUser = UserModule.userInfo.username;
        project.modifyUser = UserModule.userInfo.username;
        insertProject(project as Project).then(res => {
          if (res.status === "success") {
            notification.success("???????????????");
            refreshPage(this);
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
    this.projectForm.modifyUser = UserModule.userInfo.username;
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
        project.createUser = UserModule.userInfo.username;
        project.modifyUser = UserModule.userInfo.username;
        updateProject(project as Project).then(res => {
          if (res.status === "success") {
            notification.success("???????????????");
            refreshPage(this);
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
      DataModule.updateProject(project);
      this.$router.push({
        path: `/project/details/${projectName}/${secretKey}`,
        query: {
          baseUrl: baseUrl,
        },
      });
    }
  }

  public deleteProject(project: Project) {
    this.$confirm("?????????????????????????????????, ?????????????", "??????", {
      confirmButtonText: "??????",
      cancelButtonText: "??????",
      type: "warning",
    })
      .then(() => {
        deleteProject(project).then(res => {
          if (res.data) {
            notification.success("???????????????");
            refreshPage(this);
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
