<template>
  <div class="service-container">
    <div class="search-container">
      <div class="search-content">
        <el-input v-model="searchParams.serviceName" placeholder="接口名称" style="width: 200px" />
        <el-input v-model="searchParams.serviceUrl" placeholder="接口地址" style="width: 200px; margin-left: 10px" />
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
        <el-button v-waves type="warning" icon="el-icon-upload2" style="float: right">
          导出
        </el-button>
        <el-button v-waves type="primary" icon="el-icon-plus" @click="handleAddService()" style="float: right">
          添加
        </el-button>
      </div>
    </div>
    <template v-if="serviceData.length > 0">
      <el-table
        :data="serviceData"
        border
        highlight-current-row
        row-key="id"
        :key="tableKey"
        style="width: 100%"
        v-loading="loading"
        ref="table"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="serviceName" label="接口名称" width="180px">
          <template slot-scope="{ row }">
            <el-button type="text" @click="toServiceCol(row)">{{ row.serviceName }}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="reportTitle" label="报表名称" width="180px"></el-table-column>
        <el-table-column prop="status" label="接口状态" width="100px">
          <template slot-scope="{ row }">
            <el-tag :type="filterStatusTagType(row.status)">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="serviceUrl" label="接口地址">
          <template slot-scope="{ row }">
            <el-tooltip effect="dark" content="复制接口相对地址" placement="top">
              <el-tag type="info" v-clipboard:copy="row.serviceUrl" v-clipboard:success="onSuccess">
                {{ row.serviceUrl }}
                <i class="el-icon-document-copy"></i>
              </el-tag>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="serviceDesc" label="接口描述"></el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>

        <el-table-column label="操作" width="240px">
          <template slot-scope="{ row }">
            <el-button type="text" icon="el-icon-search" @click="handleReadService(row)" class="btn-info">
              查看
            </el-button>
            <el-button type="text" icon="el-icon-edit" @click="handleEditService(row)">编辑</el-button>
            <el-button type="text" icon="el-icon-delete" @click="handleDeleteService(row)" class="btn-danger">
              删除
            </el-button>
            <el-dropdown @command="command => handleCommand(command, row)">
              <span style="margin-left: 5px">
                <i class="el-icon-d-arrow-right"></i>
                更多
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="handleCopyFullUrl" icon="el-icon-document-copy">
                  复制完整链接
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
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
        <el-button v-waves icon="el-icon-plus" @click="handleAddService()">创建接口</el-button>
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
        :base-url="url"
        @confirm="handleConfirmAdd"
        @cancel="serviceDrawer.visible = false"
      ></service-form>
    </drag-drawer>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Pagination, { Paging, paging } from "@/components/Pagination/index.vue";
import {
  defaultServiceData,
  deleteService,
  insertService,
  queryServiceListPages,
  ServiceModule,
  updateService,
} from "@/api/service";
import constant from "@/config/constant";
import DragDrawer from "@/components/DragDrawer/index.vue";
import ServiceForm from "./components/ServiceForm.vue";
import notification from "@/utils/notification";
import { refreshPage } from "@/utils/layout";
import { DataModule } from "@/store/modules/data";
import { UserModule } from "@/store/modules/user";
import message from "@/utils/message";
import { Page } from "@/types/http";

type Service = ServiceModule.Service;
type ServiceInsert = ServiceModule.ServiceInsert;
type ServiceUpdate = ServiceModule.ServiceUpdate;

@Component({
  components: { Pagination, DragDrawer, ServiceForm },
})
export default class GenericService extends Vue {
  @Prop({ required: true })
  public categoryId!: number;

  public row!: Service;

  public tableKey = 0;
  public showAddress = false;
  public loading = false;
  public paging = { ...paging };
  public serviceData: Array<Service> = [];
  public searchParams = {
    serviceName: "",
    serviceUrl: "",
  };
  public statusOptions = constant.serviceStatusOptions;
  public operateStatus = "";
  public rules = {
    date: [{ required: true, message: "date is required", trigger: "change" }],
    name: [{ required: true, message: "name is required", trigger: "change" }],
    title: [{ required: true, message: "title is required", trigger: "blur" }],
  };
  public operateRow = { ...defaultServiceData };
  public serviceDrawer = {
    visible: false,
    placement: "right",
    width: 700,
    draggable: true,
    withHeader: false,
  };

  get url() {
    return window.location.origin + this.$route.query.baseUrl;
  }

  mounted() {
    this.loading = false;
    this.initServiceList({ pageNo: 1, pageSize: 20 });
  }

  public initServiceList(page?: Page) {
    let { project } = DataModule;
    let isSuccess = queryServiceListPages(page, { projectId: project.id, categoryId: this.categoryId }).then(res => {
      if (res.status === "success") {
        this.serviceData = res.data;
        return true;
      } else {
        return false;
      }
    });
    return isSuccess;
  }

  public filterStatusTagType(status: string) {
    return constant.serviceStatusType[status];
  }
  public onSuccess() {
    message.success("复制成功！");
  }

  // 查询数据
  public handleSearchService() {
    this.loading = true;
    let { serviceName, serviceUrl } = this.searchParams;
    if (serviceName === "" && serviceUrl === "") {
      this.loading = false;
      this.initServiceList();
      return;
    }
    queryServiceListPages({ pageNo: 1, pageSize: 20 }, { serviceName, serviceUrl }).then(res => {
      if (res.status === "success") {
        this.serviceData = res.data;
      }
    });
    this.loading = false;
  }

  public handleReset() {
    this.initServiceList().then(isSuccess => {
      if (isSuccess) {
        notification.success("重置成功！");
      }
    });
  }

  public handleAddService() {
    this.operateRow = { ...defaultServiceData };
    this.operateStatus = "add";
    this.serviceDrawer.visible = true;
  }

  public handleReadService(row: Service) {
    this.operateRow = Object.assign({}, row);
    this.operateStatus = "read";
    this.serviceDrawer.visible = true;
  }

  public handleEditService(row: Service) {
    this.operateRow = Object.assign({}, row);
    this.operateStatus = "edit";
    this.serviceDrawer.visible = true;
  }

  public handleConfirmAdd(form: Service, status: string) {
    let data: Partial<Service> = { ...form };
    let { username } = UserModule.userInfo;
    if (status === "add") {
      // 删除 Insert 不允许的数据
      delete data.id;
      delete data.createTime;
      delete data.modifyTime;
      // 添加 Insert 需要的其他数据
      data.fullUrl = this.url + data.serviceUrl;
      data.projectId = DataModule.project.id;
      data.categoryId = DataModule.category.id;
      data.createUser = username;
      data.modifyUser = username;
      this.addServiceData(data as ServiceInsert);
    } else if (status === "edit") {
      // 删除 Update 不允许的数据
      delete data.createUser;
      delete data.createTime;
      delete data.modifyTime;
      delete data.projectId;
      delete data.categoryId;
      data.modifyUser = username;
      // 添加 Update 需要的其他数据
      this.editServiceData(data as ServiceUpdate);
    }
  }

  public addServiceData(form: ServiceInsert) {
    insertService(form).then(res => {
      if (res.status === "success") {
        notification.success("添加接口成功！");
        refreshPage(this);
      }
    });
  }

  public editServiceData(form: ServiceUpdate) {
    updateService(form).then(res => {
      if (res.status === "success") {
        notification.success("更新接口成功！");
        refreshPage(this);
      }
    });
  }

  public handleDeleteService(row: Service) {
    this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(() => {
        deleteService(row).then(res => {
          if (res.status === "success") {
            notification.success("删除成功！");
          }
        });
      })
      .catch(() => {});
  }

  public handleCommand(command: string, row: Service) {
    if (command === "handleCopyFullUrl") {
      this.$copyText(row.fullUrl).then(() => {
        this.onSuccess();
      });
    }
  }

  public toServiceCol(row: Service) {
    this.$router.push(`/project/service-col/${row.serviceName}/${row.id}`);
  }

  public handleSizeChange(paging: Paging) {
    this.initServiceList({ pageNo: paging.currentPage, pageSize: paging.pageSize });
    this.paging.currentPage = paging.currentPage;
    this.paging.pageSize = paging.pageSize;
  }
}
</script>

<style lang="scss" scoped>
.service-container {
  .search-container {
    margin-bottom: 10px;
  }
}
</style>
