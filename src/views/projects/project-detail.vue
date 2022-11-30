<template>
  <div class="project-detail-container">
    <div class="project-detail-info">
      <el-row :gutter="10" style="height: 100%">
        <el-col :span="18" style="height: 100%; border-right: 1px solid #f0f0f0">
          <div class="project-info">
            {{ $route.params && $route.params.projectName }}
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
        <catalog-table :data="serviceData" />
      </el-tab-pane>
    </el-tabs>

    <el-dialog v-draggable-dialog title="创建目录" :visible.sync="dialogVisible" width="30%">
      <el-form ref="catalogForm" :model="catalogForm" :rules="catalogueRules" label-width="80px">
        <el-form-item label="目录名称" prop="catalog">
          <el-input v-model="catalogForm.catalog" placeholder="请输入目录名称"></el-input>
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
import CatalogTable, { Service } from "@/components/CatalogTable/index.vue";
import { largeData } from "@/test/table";

@Component({
  components: { CatalogTable },
})
export default class ProjectDetail extends Vue {
  public activeName = "default";
  public dialogVisible = false;
  public serviceData: Service = largeData;

  public tabs = [
    {
      title: "默认目录",
      name: "default",
      closable: false,
    },
    {
      title: "桌面端",
      name: "pc",
      closable: true,
    },
    {
      title: "移动端",
      name: "mobile",
      closable: true,
    },
  ];
  public catalogForm = {
    catalog: "",
  };
  public catalogueRules = {
    catalog: [{ required: true, message: "请输入目录名称", trigger: "change" }],
  };

  mounted() {}

  public clickTab(tab: TabPane, event: Event) {
    // console.log(tab, event);
  }

  public addTab() {
    this.dialogVisible = true;
    this.$nextTick(() => {
      (this.$refs.catalogForm as Form).clearValidate();
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
    (this.$refs.catalogForm as Form).validate(valid => {
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
    height: 100px;
    .project-info {
      padding: 20px;
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
