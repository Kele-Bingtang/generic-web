<template>
  <div class="report-container">
    <div class="btn-container">
      <el-button v-waves type="primary" size="small" icon="el-icon-plus" @click="handleAddReport()">添加</el-button>
      <el-button v-waves type="primary" plain size="small" icon="el-icon-edit" @click="handleEditReport()">
        编辑
      </el-button>
      <el-button v-waves type="danger" plain size="small" icon="el-icon-delete" @click="handleDeleteReport()">
        删除
      </el-button>
      <el-button v-waves type="info" plain size="small" icon="el-icon-s-promotion" @click="handleToColPage">
        跳转至字段配置页面
      </el-button>
    </div>

    <template v-if="reportList.length > 0">
      <el-table
        :data="reportList"
        border
        highlight-current-row
        style="width: 100%"
        v-loading="loading"
        ref="table"
        @row-click="handleRowClick"
        @row-dblclick="handleEditReport"
      >
        <el-table-column
          v-for="index in dataLength"
          v-if="needRender(reportList[0], index - 1)"
          :key="getObjectKey(index - 1)"
          :prop="getObjectKey(index - 1)"
          :label="getLabel(index - 1)"
          :width="columnWidth(index - 1)"
          :align="columnAlign(index - 1)"
        ></el-table-column>
      </el-table>
      <el-dialog
        v-draggable-dialog
        :title="operateTitle[operateStatus]"
        :visible.sync="dialogVisible"
        width="60%"
        :close-on-click-modal="false"
      >
        <report-form
          :data="operateRow"
          :status="operateStatus"
          @cancel="dialogVisible = false"
          @confirm="handleConfirmReport"
        ></report-form>
      </el-dialog>
      <pagination
        v-show="reportList.length > 0"
        :total="reportList.length"
        :paging="paging"
        @pagination="handleSizeChange"
      />
    </template>
    <template v-else>
      <el-empty></el-empty>
    </template>
  </div>
</template>

<script lang="ts">
import { operateGenericDataForm, queryGenericData } from "@/api/generic-api";
import { defaultServiceData, queryOneService, ServiceModule } from "@/api/service";
import { ServiceColModule } from "@/api/service-col";
import Pagination, { Paging, paging } from "@/components/Pagination/index.vue";
import constant from "@/config/constant";
import { Page } from "@/types/http";
import message from "@/utils/message";
import notification from "@/utils/notification";
import { isNumber } from "@/utils/validate";
import { Component, Vue } from "vue-property-decorator";
import ReportForm from "./components/ReportForm.vue";

const REPORT_SETTING = "GenericReportSetting";

interface ReportData {
  [key: string]: ServiceColModule.ServiceCol;
}

@Component({ name: "GenericReport", components: { Pagination, ReportForm } })
export default class extends Vue {
  public index!: number;

  public serviceData = { ...defaultServiceData };
  public reportList: Array<ReportData> = [];
  public reportKeyList: string[] = [];
  public loading = false;
  public paging = { ...paging };
  public operateStatus: "add" | "edit" | "" = "";
  public dialogVisible = false;
  public operateRow: any = {};
  public operateTitle = constant.operateTitle;
  // 暂时不需要
  public reportColDrawer = {
    visible: false,
    placement: "right",
    width: 700,
    draggable: true,
    withHeader: false,
  };

  get dataLength() {
    let { reportList } = this;
    if (reportList.length > 0) {
      let keys = Object.keys(this.reportList[0]);
      return keys.length;
    }
    return 0;
  }

  mounted() {
    this.initReportData();
  }

  public initReportData(page?: Page) {
    let { serviceId, secretKey } = this.$route.params;
    if (!serviceId || !isNumber(serviceId) || !secretKey) {
      message.error("无效链接");
      return new Promise(resolve => resolve(false));
    }
    this.loading = true;
    queryOneService({ id: Number(serviceId) }).then(res => {
      if (res.status === "success") {
        this.serviceData = res.data;
        queryGenericData(res.data.fullUrl, secretKey, page).then(res => {
          this.reportList = res.data;
          this.reportKeyList = Object.keys(this.reportList[0]);
          this.initOperatorRow();
        });
      }
    });

    this.loading = false;
  }

  public initOperatorRow() {
    let obj: { [key: string]: any } = {};
    Object.keys(this.reportList[0]).forEach(key => {
      if (key.indexOf(REPORT_SETTING) === -1) {
        if (typeof obj[key] === "number") {
          this.$set(obj, key, -1);
        } else {
          this.$set(obj, key, "");
        }
      } else {
        obj[key] = this.reportList[0][key];
      }
    });
    // 使用 _generic_temporary 目的是为了不让每次点击新增都初始化，所以初始化携带 _generic_temporary: true 来判断
    this.$set(obj, "_generic_temporary", true);
    this.operateRow = { ...obj };
  }

  public getObjectKey(index: number) {
    return this.reportKeyList[index];
  }

  public getLabel(index: number) {
    let reportSetting = this.getReportSetting(index);
    return reportSetting?.reportCol || reportSetting?.jsonCol;
  }

  public needRender(obj: ReportData, index: number, keyList: string[] = this.reportKeyList) {
    let key = keyList[index];
    if (key && key.startsWith("_") && key.indexOf(REPORT_SETTING) !== -1) {
      return false;
    }
    // 后端已经校验，这里进行二次校验
    let targetKey = `_${key}${REPORT_SETTING}`;
    if (obj[targetKey]?.allowShowInReport === 0) {
      return false;
    }
    return true;
  }

  public columnWidth(index: number) {
    let width = this.getReportSetting(index)?.reportColWidth;
    if (width === -1) {
      return "auto";
    } else {
      return width + "";
    }
  }

  public columnAlign(index: number) {
    let align = this.getReportSetting(index)?.colAlign;
    if (align === 0) {
      return "left";
    } else if (align === 1) {
      return "center";
    } else if (align === 2) {
      return "right";
    }
  }

  public getReportSetting(index: number) {
    let obj = this.reportList[0];
    let key = this.reportKeyList[index];
    let targetKey = `_${key}${REPORT_SETTING}`;
    return obj[targetKey];
  }

  public handleRowClick(row: any, column: any, event: any) {
    this.operateRow = { ...row };
  }

  public handleAddReport() {
    if (!this.operateRow._generic_temporary) {
      this.initOperatorRow();
    }
    this.operateStatus = "add";
    this.dialogVisible = true;
  }

  public handleEditReport() {
    if (Object.keys(this.operateRow).length === 0) {
      message.warning("请选择任意一行数据");
      return;
    }
    this.operateStatus = "edit";
    this.dialogVisible = true;
  }

  public handleConfirmReport(form: ReportData, status: string) {
    let { secretKey } = this.$route.params;
    let keyList = Object.keys(form);
    for (let i = 0; i < keyList.length; i++) {
      let key = keyList[i];
      if (!this.needRender(form, i, keyList)) {
        this.$delete(form, key);
      } else if (form[`_${key}${REPORT_SETTING}`]?.allowShowInDetail === 0) {
        // 编辑时，主键不允许去掉
        if (status !== "edit") {
          this.$delete(form, key);
        } else if (status === "edit" && form[`_${key}${REPORT_SETTING}`]?.isWhereKey === 0) {
          this.$delete(form, key);
        }
      }
    }
    let operate: "insert" | "update" | "delete" = "insert";
    if (status === "add") {
      operate = "insert";
    } else if (status === "edit") {
      operate = "update";
    }
    operateGenericDataForm(this.serviceData.fullUrl as string, secretKey, form, operate).then(res => {
      if (res.status === "success") {
        this.dialogVisible = false;
        notification.success(res.data);
        this.initReportData();
      }
    });
  }

  public handleDeleteReport() {
    let { secretKey } = this.$route.params;
    if (Object.keys(this.operateRow).length === 0) {
      message.warning("请选择任意一行数据");
      return;
    }
    this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(() => {
        operateGenericDataForm(this.serviceData.fullUrl as string, secretKey, this.operateRow, "delete").then(res => {
          if (res.status === "success") {
            notification.success(res.data);
            this.initReportData();
          }
        });
      })
      .catch(() => {});
  }

  public handleToColPage() {
    let { serviceId } = this.$route.params;
    let { serviceName } = this.serviceData;
    this.$router.push(`/project/service-col/${serviceName}/${serviceId}`);
  }

  public handleSizeChange(paging: Paging) {
    this.initReportData({ pageNo: paging.currentPage, pageSize: paging.pageSize });
    this.paging.currentPage = paging.currentPage;
    this.paging.pageSize = paging.pageSize;
  }
}
</script>

<style lang="scss" scoped>
.report-container {
  padding: 20px;
  .btn-container {
    margin-bottom: 10px;
  }
}
</style>
