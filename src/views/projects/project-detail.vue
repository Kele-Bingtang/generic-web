<template>
  <div class="project-detail-container">
    <div class="project-detail-info">
      <el-row :gutter="10" style="height: 100%">
        <el-col :span="18" style="height: 100%; border-right: 1px solid #f0f0f0">
          <div class="project-info">
            <div class="info-item">
              <span>接口地址</span>
              <span>{{ url }}</span>
            </div>
            <div class="info-item">
              <span>项目密钥</span>
              <span>{{ $route.params && $route.params.secretKey }}</span>
            </div>
          </div>
        </el-col>
        <el-col :span="4" style="height: 100%">
          <div class="project-action">
            <el-button v-waves plain type="primary" icon="el-icon-user-solid">项目成员</el-button>
            <el-button v-waves plain type="danger" icon="el-icon-caret-right">退出项目</el-button>
          </div>
        </el-col>
      </el-row>
    </div>

    <el-tabs v-model="activeName" type="card" addable @tab-click="clickTab" @tab-add="addTab" @tab-remove="removeTab">
      <el-tab-pane v-for="item in tabs" :key="item.id" :label="item.title" :name="item.name" :closable="item.closable">
        <service-table :data="serviceData" />
      </el-tab-pane>
    </el-tabs>

    <el-dialog v-draggable-dialog title="创建目录" :visible.sync="dialogVisible" width="30%">
      <el-form ref="categoryForm" :model="categoryForm" :rules="getCategoryRules" label-width="80px">
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
import { Form, TabPane } from "element-ui";
import { Component, Vue } from "vue-property-decorator";
import ServiceTable from "@/components/ServiceTable/index.vue";
import { queryGenericServiceListPages, ServiceModule } from "@/api/service";
import { deleteCategory, queryCategoryList, CategoryModule, insertCategory } from "@/api/category";
import { refreshPage } from "@/utils/layout";

export interface Tab {
  id: number;
  title: string;
  name: string;
  closable: boolean;
}

export const defaultTabData: Tab = {
  id: -1,
  title: "默认目录",
  name: "default",
  closable: false,
};

@Component({
  components: { ServiceTable },
})
export default class ProjectDetail extends Vue {
  public activeName = "default";
  public dialogVisible = false;
  public serviceData: Array<ServiceModule.Service> = [];
  public categoryList: Array<CategoryModule.Category> = [];
  public tabs: Array<Tab> = [];
  public categoryForm = {
    categoryCode: "",
    categoryName: "",
  };
  public getCategoryRules = {
    categoryCode: [{ required: true, message: "请输入目录名编码，且英文", trigger: "change" }],
    categoryName: [{ required: true, message: "请输入目录名称", trigger: "change" }],
  };

  get url() {
    return window.location.origin + this.$route.query.baseUrl;
  }

  mounted() {
    this.getCategory();
    this.getServiceList();
  }

  public getServiceList() {
    queryGenericServiceListPages(undefined, { pageNo: 1, pageSize: 20 }).then(res => {
      this.serviceData = res.data;
    });
  }

  public getCategory() {
    queryCategoryList().then(res => {
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
          this.$message.error("获取目录信息失败");
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
      } else {
        this.$message.error("获取目录信息失败");
      }
    });
  }

  public clickTab(tab: TabPane, event: Event) {
    // console.log(tab, event);
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
        // TODO：模拟 id 为 1
        let categoryForm = { ...this.categoryForm, projectId: 1, createUser: 1, modifyUser: 1 };
        insertCategory(categoryForm).then(res => {
          if (res.status === "success") {
            this.$notify({
              title: "Success",
              message: "新增成功",
              type: "success",
              duration: 3000,
            });
            // 刷新页面
            refreshPage(this);
          } else {
            this.$notify({
              title: "Error",
              message: "新增失败，原因：" + res.message,
              type: "error",
              duration: 3000,
            });
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
      let targetTab: Tab = { ...defaultTabData };
      tabs.forEach(tab => {
        if (tab.name === targetName) {
          targetTab = tab;
        }
      });
      if (targetTab && targetTab.id !== defaultTabData.id) {
        deleteCategory({ id: targetTab.id }).then(res => {
          if (res.status === "success") {
            this.$notify({
              title: "Success",
              message: "删除成功",
              type: "success",
              duration: 3000,
            });
            // 刷新页面
            // refreshPage(this);
          }
        });
      } else {
        this.$message.warning("删除失败，必须保留一个目录");
      }
      if (activeName === targetName) {
        // 获取最后一个 tab
        let lastTab = tabs.slice(-1)[0];
        this.activeName = lastTab.name;
      }
      this.tabs = tabs.filter(tab => tab.name !== targetName);
    });
  }
}
</script>

<style lang="scss" scoped>
.project-detail-container {
  padding: 20px;
  .project-detail-info {
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
