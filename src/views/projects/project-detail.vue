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
      <el-tab-pane
        v-for="item in tabs"
        :key="item.name"
        :label="item.title"
        :name="item.name"
        :closable="item.closable"
      >
        <service-table :data="serviceData" />
      </el-tab-pane>
    </el-tabs>

    <el-dialog v-draggable-dialog title="创建目录" :visible.sync="dialogVisible" width="30%">
      <el-form ref="categoryForm" :model="categoryForm" :rules="getCategoryRules" label-width="80px">
        <el-form-item label="目录名称" prop="category">
          <el-input v-model="categoryForm.category" placeholder="请输入目录名称"></el-input>
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
import { queryCategoryList } from "@/api/category";

export interface Tab {
  title: string;
  name: string;
  closable: boolean;
}

@Component({
  components: { ServiceTable },
})
export default class ProjectDetail extends Vue {
  public activeName = "default";
  public dialogVisible = false;
  public serviceData: Array<ServiceModule.Service> = [];

  public tabs: Array<Tab> = [];
  public categoryForm = {
    category: "",
  };
  public getCategoryRules = {
    category: [{ required: true, message: "请输入目录名称", trigger: "change" }],
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
      res.data.forEach((item, index) => {
        let category = {
          title: item.categoryName,
          name: item.categoryCode,
          closable: index === 0 ? false : true,
        };
        this.tabs.push(category);
      });
      if (this.tabs.length === 0) {
        this.tabs.push({
          title: "默认目录",
          name: "default",
          closable: false,
        });
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

  public removeTab(targetName: string) {
    let tabs = this.tabs;
    let activeName = this.activeName;
    if (activeName === targetName) {
      tabs.forEach((tab, index) => {
        if (tab.name === targetName) {
          let nextTab = tabs[index + 1] || tabs[index - 1];
          if (nextTab) {
            activeName = nextTab.name;
          }
        }
      });
    }
    this.activeName = activeName;
    this.tabs = tabs.filter(tab => tab.name !== targetName);
  }

  public addTabConfirm() {
    (this.$refs.categoryForm as Form).validate(valid => {
      if (valid) {
        this.$notify({
          title: "Success",
          message: "新增成功",
          type: "success",
          duration: 3000,
        });
      } else {
        return false;
      }
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
