<template>
  <div class="category-container">
    <div class="category-info">
      <el-row :gutter="10" style="height: 100%">
        <el-col :span="18" style="height: 100%; border-right: 1px solid #f0f0f0">
          <div class="project-info">
            <div class="info-item">
              <span>接口地址</span>
              <span>{{ url }}</span>
              <i class="el-icon-document-copy copy-icon" v-clipboard:copy="url" v-clipboard:success="onSuccess"></i>
            </div>
            <div class="info-item">
              <span>项目密钥</span>
              <span>{{ projectSecretKey }}</span>
              <i
                class="el-icon-document-copy copy-icon"
                v-clipboard:copy="projectSecretKey"
                v-clipboard:success="onSuccess"
              ></i>
            </div>
          </div>
        </el-col>
        <el-col :span="4" style="height: 100%">
          <div class="project-action">
            <el-button v-waves plain type="primary" icon="el-icon-user-solid" @click="handleEnterMember">
              项目成员
            </el-button>
            <el-button
              v-waves
              plain
              type="danger"
              icon="el-icon-caret-right"
              @click="handleLeaveProject"
              v-if="userInfo.username !== project.createUser"
            >
              退出项目
            </el-button>
          </div>
        </el-col>
      </el-row>
    </div>

    <el-tabs v-model="activeName" type="card" addable @tab-remove="removeTab">
      <el-tab-pane
        v-for="item in tabs"
        :key="item.id"
        :label="item.title"
        :name="item.name"
        :closable="item.closable"
        :lazy="true"
      >
        <service-table :category-id="item.id" v-if="activeName === item.name" />
      </el-tab-pane>
    </el-tabs>

    <el-dialog v-draggable-dialog title="创建目录" :visible.sync="dialogVisible" width="30%">
      <el-form ref="categoryForm" :model="categoryForm" :rules="categoryRules" label-width="80px">
        <el-form-item label="目录编码" prop="categoryCode">
          <el-input v-model="categoryForm.categoryCode" placeholder="请输入目录编码，且英文"></el-input>
        </el-form-item>
        <el-form-item label="目录名称" prop="categoryName">
          <el-input v-model="categoryForm.categoryName" placeholder="请输入目录名称"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button v-waves @click="dialogVisible = false">取 消</el-button>
        <el-button v-waves type="primary" @click="addTabConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Form } from "element-ui";
import { Component, Vue } from "vue-property-decorator";
import ServiceTable from "@/views/service/index.vue";
import { ServiceModule } from "@/api/service";
import { deleteCategory, queryCategoryList, CategoryModule, insertCategory } from "@/api/category";
import { refreshPage } from "@/utils/layout";
import notification from "@/utils/notification";
import message from "@/utils/message";
import { DataModule } from "@/store/modules/data";
import { defaultProjectData, queryGenericOneProject } from "@/api/project";
import { UserModule } from "@/store/modules/user";
import { removeOneMember } from "@/api/user";

export interface CategoryTab {
  id: number;
  title: string;
  name: string;
  closable: boolean;
}

export const defaultTabData: CategoryTab = {
  id: -1,
  title: "默认目录",
  name: "default",
  closable: false,
};

@Component({
  components: { ServiceTable },
})
export default class GenericCategory extends Vue {
  public activeName = "default";
  public dialogVisible = false;
  public project = { ...defaultProjectData };
  public serviceData: Array<ServiceModule.Service> = [];
  public categoryList: Array<CategoryModule.Category> = [];
  public tabs: Array<CategoryTab> = [];
  public categoryForm = {
    categoryCode: "",
    categoryName: "",
  };
  public categoryRules = {
    categoryCode: [{ required: true, message: "请输入目录名编码，且英文", trigger: "change" }],
    categoryName: [{ required: true, message: "请输入目录名称", trigger: "change" }],
  };

  get url() {
    return window.location.origin + this.$route.query.baseUrl;
  }

  get projectSecretKey() {
    return this.$route.params && this.$route.params.secretKey;
  }

  get userInfo() {
    return UserModule.userInfo;
  }

  mounted() {
    this.initCategory();
  }

  public async initCategory() {
    await this.updateProject();
    queryCategoryList({ projectId: this.project.id }).then(res => {
      if (res.status === "success" && res.data.length > 0) {
        this.tabs = [];
        this.categoryList = res.data;
        res.data.forEach((item, index) => {
          let category = {
            id: item.id,
            title: item.categoryName,
            name: item.categoryCode,
            closable: index === 0 ? false : true,
          };
          this.tabs.push(category);
        });
        if (this.tabs.length === 0) {
          message.error("获取目录信息失败");
        } else if (this.tabs.length > 1 && this.tabs[0].name !== "default") {
          // 确保默认目录在第一个
          let defaultTab = undefined;
          this.tabs.filter(item => {
            if (item.name === defaultTabData.name) {
              defaultTab = item;
            } else {
              return true;
            }
          });
          defaultTab && this.tabs.unshift(defaultTab);
        }
        // 默认激活第一个目录
        this.activeName = this.tabs[0].name;
        // 默认进入第一个目录
        DataModule.updateCategory(this.tabs[0]);
      } else {
        message.error("获取目录信息失败");
      }
    });
  }

  public async updateProject() {
    // 如果不通过项目进来，而是链接进来，则需要更新
    if (DataModule.project.id === -1) {
      let res = await queryGenericOneProject(this.projectSecretKey);
      this.project = res.data;
      DataModule.updateProject(res.data);
    } else {
      this.project = DataModule.project;
    }
  }

  public handleLeaveProject() {
    removeOneMember(this.userInfo.username, this.project.id as number).then(res => {
      if (res.status === "success") {
        notification.success("离开项目成功");
        this.$router.push("/project");
      }
    });
  }

  public addTab() {
    this.dialogVisible = true;
    this.$nextTick(() => {
      (this.$refs.categoryForm as Form).clearValidate();
    });
  }

  public addTabConfirm() {
    (this.$refs.categoryForm as Form).validate(valid => {
      if (valid) {
        let { username } = UserModule.userInfo;
        let categoryForm = { ...this.categoryForm, projectId: 1, createUser: username, modifyUser: username };
        insertCategory(categoryForm).then(res => {
          if (res.status === "success") {
            notification.success("新增目录成功！");
            // 刷新页面
            refreshPage(this);
          }
        });
      } else {
        return false;
      }
    });
  }

  public removeTab(targetName: string) {
    this.$confirm("此操作将永久删除该目录, 是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }).then(() => {
      let { tabs, activeName } = this;
      let targetTab = { ...defaultTabData };
      tabs.forEach(tab => {
        if (tab.name === targetName) {
          targetTab = tab;
        }
      });
      if (targetTab && targetTab.id !== defaultTabData.id) {
        deleteCategory({ id: targetTab.id }).then(res => {
          if (res.status === "success") {
            notification.success("新增目录成功！");
          }
        });
      } else {
        message.warning("删除失败，必须保留一个目录");
      }
      if (activeName === targetName) {
        // 获取最后一个 tab
        let lastTab = tabs.slice(-1)[0];
        this.activeName = lastTab.name;
      }
      this.tabs = tabs.filter(tab => tab.name !== targetName);
    });
  }

  public handleEnterMember() {
    this.$router.push(`/project/member/${this.projectSecretKey}`);
  }

  public onSuccess() {
    message.success("复制成功！");
  }
}
</script>

<style lang="scss" scoped>
.category-container {
  padding: 20px;
  .category-info {
    height: 130px;
    .project-info {
      padding: 20px;
      .info-item {
        height: 32px;
        background-color: rgba(68, 82, 213, 0.09411764705882353);
        line-height: 32px;
        border-radius: 16px;
        position: relative;
        padding-left: 135px;
        margin-bottom: 10px;
        font-size: 14px;
        & > span:first-child {
          display: inline-block;
          height: 32px;
          line-height: 32px;
          position: absolute;
          left: 0;
          top: 0;
          background-color: #4579ee;
          color: #fff;
          width: 120px;
          text-align: center;
          border-top-left-radius: 16px;
          border-bottom-left-radius: 16px;
        }
        .copy-icon {
          position: absolute;
          right: 10px;
          line-height: inherit;
          cursor: pointer;
        }
      }
    }
    .project-action {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
    }
  }
}
</style>
