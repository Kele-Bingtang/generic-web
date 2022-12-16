<template>
  <div class="catalog-table-component">
    <div class="search-container">
      <div class="search-content">
        <el-input v-model="searchParams.serviceName" placeholder="接口名称" style="width: 200px" />
        <el-button
          v-waves
          type="primary"
          icon="el-icon-search"
          @click="handleSearchService()"
          style="margin-left: 10px"
        >
          查询
        </el-button>
        <el-button v-waves icon="el-icon-refresh" @click="handleReset">重置</el-button>
        <el-button v-waves type="warning" icon="el-icon-plus" @click="handleAddService()" style="float: right">
          导出
        </el-button>
        <el-button v-waves type="primary" icon="el-icon-plus" @click="handleAddService()" style="float: right">
          添加
        </el-button>
      </div>
    </div>
    <template v-if="serviceData.length > 0">
      <el-table
        :data="serviceData.slice((paging.currentPage - 1) * paging.pageSize, paging.currentPage * paging.pageSize)"
        border
        highlight-current-row
        row-key="id"
        :key="tableKey"
        style="width: 100%"
        v-loading="loading"
        ref="table"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="serviceName" label="接口名称" width="180px"></el-table-column>
        <el-table-column prop="reportTitle" label="报表名称" width="180px"></el-table-column>
        <el-table-column prop="status" label="接口状态" width="150px"></el-table-column>
        <el-table-column prop="serviceUrl" label="接口地址"></el-table-column>
        <el-table-column prop="serviceDesc" label="接口描述"></el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>

        <el-table-column label="操作" width="200px">
          <template slot-scope="{ row, $index }">
            <el-button type="text" icon="el-icon-search" @click="handleLookService(row)" class="btn-info">
              查看
            </el-button>
            <el-button type="text" icon="el-icon-edit" @click="handleEditService(row)">编辑</el-button>
            <el-button type="text" icon="el-icon-delete" @click="handleDeleteService(row, $index)" class="btn-danger">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="serviceData.length > 0"
        :total="serviceData.length"
        :paging="paging"
        @pagination="handleSizeChange"
      />
    </template>
    <template v-else>
      <el-empty>
        <el-button icon="el-icon-plus">创建接口</el-button>
      </el-empty>
    </template>

    <drag-drawer
      :visible.sync="serviceDrawer.visible"
      :placement="serviceDrawer.placement"
      :width.sync="serviceDrawer.width"
      :draggable="serviceDrawer.draggable"
      :with-header="serviceDrawer.withHeader"
    >
      <service-form
        :data="operateRow"
        :status="operateStatus"
        @confirm="handleConfirmAdd"
        @cancel="serviceDrawer.visible = false"
      ></service-form>
    </drag-drawer>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Pagination, { Paging, paging } from "@/components/Pagination/index.vue";
import { defaultServiceData, deleteService, ServiceModule } from "@/api/service";
import constant from "@/config/constant";
import DragDrawer from "@/components/DragDrawer/index.vue";
import ServiceForm from "./components/service-form.vue";
import notification from "@/utils/notification";

type Service = ServiceModule.Service;

type ServiceInsert = ServiceModule.ServiceInsert;

@Component({
  components: { Pagination, DragDrawer, ServiceForm },
})
export default class ServiceTable extends Vue {
  @Prop({ required: true })
  public data!: Array<Service>;
  @Prop({ required: true })
  public categoryCode!: string;

  public row!: any;
  public $index!: any;

  public tableKey = 0;
  public showAddress = false;
  public loading = true;
  public paging = paging;
  public searchParams = {
    serviceName: "",
  };
  public statusOptions = constant.statusOptions;
  public operateStatus = "";
  public rules = {
    date: [{ required: true, message: "date is required", trigger: "change" }],
    name: [{ required: true, message: "name is required", trigger: "change" }],
    title: [{ required: true, message: "title is required", trigger: "blur" }],
  };
  public operateRow = { ...defaultServiceData };

  public serviceData: Array<Service> = [];
  public serviceDrawer = {
    visible: false,
    placement: "right",
    width: 800,
    draggable: true,
    withHeader: false,
  };

  mounted() {
    this.serviceData = { ...this.data };
    this.loading = false;
  }

  // 应该将参数 searchParams 传到后台，这里演示本地数据查询
  public handleSearchService() {
    this.loading = true;
    this.serviceData = { ...this.data };
    if (this.searchParams.serviceName === "") {
      this.loading = false;
      return;
    }
    let serviceData = [...this.serviceData];
    if (this.searchParams.serviceName) {
      serviceData = this.serviceData.filter(item => {
        return item.serviceName.indexOf(this.searchParams.serviceName) !== -1;
      });
    }
    this.serviceData = serviceData;
    this.loading = false;
  }

  public handleReset() {
    console.log("通过 " + this.categoryCode + " 查询加载表格");
  }

  public handleAddService() {
    this.operateRow = { ...defaultServiceData };
    this.operateStatus = "add";
    this.serviceDrawer.visible = true;
  }

  public handleLookService(row: Service) {
    this.operateRow = Object.assign({}, row);
    this.operateStatus = "look";
    this.serviceDrawer.visible = true;
  }

  public handleEditService(row: Service) {
    this.operateRow = Object.assign({}, row);
    this.operateStatus = "edit";
    this.serviceDrawer.visible = true;
  }

  public handleConfirmAdd(form: ServiceInsert, status: string) {
    if (status === "add") {
      this.addServiceData(form);
    } else if (status === "edit") {
      this.editServiceData(form);
    }
  }

  public addServiceData(form: ServiceInsert) {
    console.log("add");
    console.log(form);
  }

  public editServiceData(form: ServiceInsert) {
    console.log("edit");
    console.log(form);
  }

  public handleDeleteService(row: Service, index: number) {
    this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(() => {
        this.serviceData.splice(index, 1);
        // deleteService()
        notification.success("删除成功！");
      })
      .catch(() => {});
  }

  public handleSizeChange(paging: Paging) {
    this.paging.currentPage = paging.currentPage;
    this.paging.pageSize = paging.pageSize;
  }
}
</script>

<style lang="scss" scoped>
.catalog-table-component {
  .search-container {
    margin-bottom: 10px;
  }
}
</style>
