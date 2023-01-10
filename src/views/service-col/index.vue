<template>
  <div class="service-col-container">
    <div class="search-container">
      <div class="search-content">
        <el-button v-waves type="primary" icon="el-icon-plus" @click="handleAddServiceCol()">添加</el-button>
        <el-button v-waves type="success" icon="el-icon-document-copy" @click="handleCopyServiceCol()">复制</el-button>
        <el-button v-waves type="warning" icon="el-icon-upload2">导出</el-button>
        <el-button v-waves icon="el-icon-refresh" @click="handleReset">重置</el-button>
      </div>
    </div>

    <template v-if="serviceColList.length > 0">
      <el-table
        :data="serviceColList"
        border
        highlight-current-row
        style="width: 100%"
        v-loading="loading"
        ref="table"
        @row-click="handleRowClick"
      >
        <!-- <el-table-column type="selection" width="55"></el-table-column> -->
        <el-table-column prop="tableCol" label="字段名" width="120px"></el-table-column>
        <el-table-column prop="jsonCol" label="请求名" width="120px"></el-table-column>
        <el-table-column prop="reportCol" label="报表名" width="120px"></el-table-column>
        <el-table-column prop="isWhereKey" label="where 条件">
          <template slot-scope="{ row }">
            {{ row.isWhereKey === 0 ? "作为" : "不作为" }}
          </template>
        </el-table-column>
        <el-table-column prop="allowInsert" label="添加">
          <template slot-scope="{ row }">
            {{ filterStatus(row.allowInsert) }}
          </template>
        </el-table-column>
        <el-table-column prop="allowUpdate" label="更新">
          <template slot-scope="{ row }">
            {{ filterStatus(row.allowUpdate) }}
          </template>
        </el-table-column>
        <el-table-column prop="allowFilter" label="查询">
          <template slot-scope="{ row }">
            {{ filterStatus(row.allowFilter) }}
          </template>
        </el-table-column>
        <el-table-column prop="displaySeq" label="出现顺序"></el-table-column>
        <el-table-column prop="defaultValue" label="默认值"></el-table-column>
        <el-table-column prop="dataEncrypt" label="加密">
          <template slot-scope="{ row }">
            {{ row.dataEncrypt === 0 ? "加密" : "不加密" }}
          </template>
        </el-table-column>
        <el-table-column prop="colType" label="类型"></el-table-column>
        <el-table-column prop="colLength" label="长度"></el-table-column>

        <el-table-column label="操作" width="240px">
          <template slot-scope="{ row }">
            <el-button type="text" icon="el-icon-search" @click="handleReadServiceCol(row)" class="btn-info">
              查看
            </el-button>
            <el-button type="text" icon="el-icon-edit" @click="handleEditServiceCol(row)">编辑</el-button>
            <el-button type="text" icon="el-icon-delete" @click="handleDeleteServiceCol(row)" class="btn-danger">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="serviceColList.length > 0"
        :total="serviceColList.length"
        :paging="paging"
        @pagination="handleSizeChange"
      />
    </template>
    <template v-else>
      <el-empty>
        <el-button v-waves icon="el-icon-plus" @click="handleAddServiceCol()">创建字段</el-button>
      </el-empty>
    </template>

    <drag-drawer
      :visible.sync="serviceColDrawer.visible"
      :placement="serviceColDrawer.placement"
      :width.sync="serviceColDrawer.width"
      :draggable="serviceColDrawer.draggable"
      :with-header="serviceColDrawer.withHeader"
    >
      <service-col-form
        :data="operateRow"
        :status="operateStatus"
        @confirm="handleConfirmAdd"
        @cancel="serviceColDrawer.visible = false"
      ></service-col-form>
    </drag-drawer>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import {
  defaultServiceColData,
  deleteServiceCol,
  insertServiceCol,
  queryServiceColListPages,
  ServiceColModule,
  updateServiceCol,
} from "@/api/service-col";
import message from "@/utils/message";
import { isNumber } from "@/utils/validate";
import Pagination, { Paging, paging } from "@/components/Pagination/index.vue";
import { Page } from "@/types/http";
import notification from "@/utils/notification";
import { refreshPage } from "@/utils/layout";
import { UserModule } from "@/store/modules/user";
import ServiceColForm from "./components/ServiceColForm.vue";
import DragDrawer from "@/components/DragDrawer/index.vue";

type ServiceCol = ServiceColModule.ServiceCol;
type ServiceColInsert = ServiceColModule.ServiceColInsert;
type ServiceColUpdate = ServiceColModule.ServiceColUpdate;

@Component({ components: { Pagination, DragDrawer, ServiceColForm } })
export default class GenericServiceCol extends Vue {
  public row!: ServiceCol;

  public serviceColList: Array<ServiceCol> = [];
  public tempClickRow = { ...defaultServiceColData }; // 点击某一行后缓存起来
  public loading = false;
  public paging = { ...paging };
  public operateStatus = "";
  public operateRow = { ...defaultServiceColData };
  public serviceColDrawer = {
    visible: false,
    placement: "right",
    width: 700,
    draggable: true,
    withHeader: false,
  };

  mounted() {
    this.initServiceCol();
  }

  public initServiceCol(page?: Page) {
    let { serviceId } = this.$route.params;
    if (!serviceId || !isNumber(serviceId)) {
      message.error("无效链接");
      return new Promise(resolve => resolve(false));
    }
    this.loading = true;
    let isSuccess = queryServiceColListPages(page, { serviceId: Number(serviceId) }).then(res => {
      if (res.status === "success") {
        this.serviceColList = res.data;
        return true;
      } else {
        return false;
      }
    });
    this.loading = false;
    return isSuccess;
  }

  public filterStatus(value: number) {
    if (value === 0) {
      return "允许";
    } else if (value === 1) {
      return "不允许";
    } else {
      return "不存在";
    }
  }

  public handleSearchServiceCol() {}

  public handleReadServiceCol(row: ServiceCol) {
    this.operateRow = Object.assign({}, row);
    this.operateStatus = "read";
    this.serviceColDrawer.visible = true;
  }

  public handleAddServiceCol() {
    this.operateRow = { ...defaultServiceColData };
    this.operateStatus = "add";
    this.serviceColDrawer.visible = true;
  }

  public handleEditServiceCol(row: ServiceCol) {
    this.operateRow = Object.assign({}, row);
    this.operateStatus = "edit";
    this.serviceColDrawer.visible = true;
  }

  public handleCopyServiceCol() {
    if (this.tempClickRow.id === -1) {
      message.warning("请选择某一行，再执行复制操作");
      return;
    }
    this.operateRow = Object.assign({}, this.tempClickRow);
    this.operateStatus = "add";
    this.serviceColDrawer.visible = true;
  }

  public handleConfirmAdd(form: ServiceCol, status: string) {
    let data: Partial<ServiceCol> = { ...form };
    let { username } = UserModule.userInfo;
    if (status === "add") {
      // 删除 Insert 不允许的数据
      delete data.id;
      delete data.createTime;
      delete data.modifyTime;
      // 添加 Insert 需要的其他数据
      data.serviceId = Number(this.$route.params.serviceId);
      data.createUser = username;
      data.modifyUser = username;
      this.addServiceData(data as ServiceColInsert);
    } else if (status === "edit") {
      // 删除 Update 不允许的数据
      delete data.createUser;
      delete data.createTime;
      delete data.modifyTime;
      delete data.serviceId;
      data.modifyUser = username;
      // 添加 Update 需要的其他数据
      this.editServiceData(data as ServiceColUpdate);
    }
  }

  public addServiceData(form: ServiceColInsert) {
    insertServiceCol(form).then(res => {
      if (res.status === "success") {
        notification.success("添加接口成功！");
        refreshPage(this);
      }
    });
  }

  public editServiceData(form: ServiceColUpdate) {
    updateServiceCol(form).then(res => {
      if (res.status === "success") {
        notification.success("更新接口成功！");
        refreshPage(this);
      }
    });
  }

  public handleDeleteServiceCol(row: ServiceCol) {
    this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(() => {
        deleteServiceCol(row).then(res => {
          if (res.status === "success") {
            notification.success("删除成功！");
          }
        });
      })
      .catch(() => {});
  }

  public handleReset() {
    this.initServiceCol().then(isSuccess => {
      if (isSuccess) {
        notification.success("重置成功！");
      }
    });
  }

  public handleRowClick(row: ServiceCol) {
    this.tempClickRow = row;
  }

  public handleSizeChange(paging: Paging) {
    this.initServiceCol({ pageNo: paging.currentPage, pageSize: paging.pageSize });
    this.paging.currentPage = paging.currentPage;
    this.paging.pageSize = paging.pageSize;
  }
}
</script>

<style lang="scss" scoped>
.service-col-container {
  padding: 20px;
  .search-container {
    margin-bottom: 10px;
  }
}
</style>
