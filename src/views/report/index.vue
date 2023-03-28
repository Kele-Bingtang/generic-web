<template>
  <div class="report-container" v-if="reportKeyList.length > 0">
    <el-row :gutter="10">
      <el-col :span="2">
        <div class="header">
          <h2>{{ reportSetting.reportTitle }}</h2>
          <span>{{ reportSetting.description }}</span>
        </div>
      </el-col>
      <el-col :span="18" v-if="allowFilter">
        <report-search
          :init-obj="searchRow"
          :data="reportDataList[0]"
          :report-key-list="reportKeyList"
          @handle-report-search="handleReportSearch"
        ></report-search>
      </el-col>
      <el-col :span="allowFilter ? 4 : 22">
        <div class="btn-container">
          <el-button
            v-waves
            type="primary"
            size="small"
            icon="el-icon-plus"
            @click="handleAddReport()"
            v-if="reportSetting.allowAdd"
            class="btn-item"
          >
            添加
          </el-button>
          <el-button
            v-waves
            type="primary"
            plain
            size="small"
            icon="el-icon-edit"
            @click="handleEditReport()"
            v-if="reportSetting.allowEdit"
            class="btn-item"
          >
            编辑
          </el-button>
          <el-button
            v-waves
            type="danger"
            plain
            size="small"
            icon="el-icon-delete"
            @click="handleDeleteReport()"
            v-if="reportSetting.allowDelete"
            class="btn-item"
          >
            删除
          </el-button>
          <el-button
            v-waves
            type="success"
            plain
            size="small"
            icon="el-icon-upload2"
            @click="handleExportReport()"
            v-if="reportSetting.allowExport"
            class="btn-item"
          >
            导出
          </el-button>
          <el-button
            v-waves
            type="info"
            plain
            size="small"
            icon="el-icon-s-promotion"
            @click="handleToColPage"
            class="btn-item"
          >
            跳转至字段配置页面
          </el-button>
        </div>
      </el-col>
    </el-row>

    <template v-if="reportDataList.length > 0">
      <el-table
        :data="reportDataList"
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
          v-if="needRender(reportDataList[0], reportKeyList[index - 1])"
          :key="reportKeyList[index - 1]"
          :prop="reportKeyList[index - 1]"
          :label="getLabel(index - 1)"
          :width="columnWidth(index - 1)"
          :align="columnAlign(index - 1)"
        ></el-table-column>
      </el-table>
      <el-dialog
        v-draggable-dialog
        :title="operateTitle[operateStatus]"
        :visible.sync="dialogVisible"
        :width="reportSetting.dialogWidth"
        :close-on-click-modal="false"
      >
        <report-form
          :data="operateRow"
          :report-key-list="reportKeyList"
          :status="operateStatus"
          @cancel="dialogVisible = false"
          @confirm="handleConfirmReport"
        ></report-form>
      </el-dialog>
      <pagination
        v-show="reportDataList.length > 0"
        :total="reportDataList.length"
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
import { defaultReportSetting, queryOneReport } from "@/api/report";
import { defaultServiceData, queryOneService } from "@/api/service";
import { ServiceColModule } from "@/api/service-col";
import Pagination, { Paging, paging } from "@/components/Pagination/index.vue";
import constant from "@/config/constant";
import { Page } from "@/types/http";
import message from "@/utils/message";
import notification from "@/utils/notification";
import { isNumber } from "@/utils/validate";
import { Component, Vue } from "vue-property-decorator";
import ReportForm from "./components/ReportForm.vue";
import ReportSearch from "./components/ReportSearch.vue";

const REPORT_SETTING = "GenericReportSetting";

export interface ReportData {
  [key: string]: ServiceColModule.ServiceCol;
}

@Component({ name: "GenericReport", components: { Pagination, ReportForm, ReportSearch } })
export default class extends Vue {
  public index!: number;

  public serviceData = { ...defaultServiceData };
  public reportSetting = { ...defaultReportSetting };
  public reportDataList: Array<ReportData> = [];
  public reportKeyList: string[] = [];
  public loading = false;
  public paging = { ...paging };
  public operateStatus: "add" | "edit" | "" = "";
  public dialogVisible = false;
  public operateRow: any = {};
  public searchRow: any = {};
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
    let { reportDataList } = this;
    if (reportDataList.length > 0) {
      let keys = Object.keys(this.reportDataList[0]);
      return keys.length;
    }
    return 0;
  }

  get allowFilter() {
    return this.reportSetting.allowFilter === 1;
  }

  mounted() {
    let { serviceId, secretKey } = this.$route.params;
    if (!serviceId || !isNumber(serviceId) || !secretKey) {
      message.error("无效链接");
      return new Promise(resolve => resolve(false));
    }
    this.initReportSettings().then(res => {
      this.paging.pageSize = res.pageSize;
      this.initReportData({ pageNo: 1, pageSize: res.pageSize });
    });
  }

  public async initReportSettings() {
    let { serviceId } = this.$route.params;
    return await queryOneReport({ serviceId: Number(serviceId) }).then(res => {
      this.reportSetting = res.data;
      return res.data;
    });
  }

  public async initReportData(page: Page = { pageNo: 1, pageSize: this.reportSetting.pageSize || 20 }) {
    let { serviceId, secretKey } = this.$route.params;
    this.loading = true;
    await queryOneService({ id: Number(serviceId) }).then(async res => {
      if (res.status === "success") {
        this.serviceData = res.data;
        await queryGenericData(res.data.fullUrl, secretKey, page).then(res => {
          this.reportDataList = res.data;
          this.reportKeyList = Object.keys((this.reportDataList && this.reportDataList[0]) || []);
          this.initQueryParams();
          this.initOperatorRow();
        });
      }
    });
    this.loading = false;
  }

  public initOperatorRow() {
    let obj: ReportData = {};
    this.reportKeyList.forEach(key => {
      if (key.indexOf(REPORT_SETTING) === -1) {
        if (typeof obj[key] === "number") {
          this.$set(obj, key, -1);
        } else if (typeof obj[key] === "boolean") {
          this.$set(obj, key, false);
        } else {
          this.$set(obj, key, "");
        }
      } else {
        obj[key] = this.reportDataList[0][key];
      }
    });
    // 使用 _generic_temporary 目的是为了不让每次点击新增都初始化，所以初始化携带 _generic_temporary: true 来判断
    this.$set(obj, "_generic_temporary", true);
    this.operateRow = { ...obj };
  }

  public initQueryParams() {
    let obj: ReportData = {};
    let reportKeyList = this.reportKeyList;
    reportKeyList.forEach((key, index) => {
      let reportColSetting = this.getReportColSetting(index);
      if (reportColSetting?.allowFilter === 1) {
        if (typeof obj[key] === "number") {
          this.$set(obj, key, -1);
        } else if (typeof obj[key] === "boolean") {
          this.$set(obj, key, false);
        } else {
          this.$set(obj, key, "");
        }
        this.$set(obj, `_${key}${REPORT_SETTING}`, reportColSetting);
      }
    });

    this.searchRow = { ...obj };
  }

  public getLabel(index: number) {
    let reportColSetting = this.getReportColSetting(index);
    return reportColSetting?.reportCol || reportColSetting?.jsonCol;
  }

  public needRender(obj: ReportData, key: string) {
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
    let width = this.getReportColSetting(index)?.reportColWidth;
    if (width === -1) {
      return "auto";
    } else {
      return width + "";
    }
  }

  public columnAlign(index: number) {
    let align = this.getReportColSetting(index)?.colAlign;
    if (align === 0) {
      return "left";
    } else if (align === 1) {
      return "center";
    } else if (align === 2) {
      return "right";
    }
  }

  public getReportColSetting(index: number) {
    let obj = this.reportDataList[0];
    let key = this.reportKeyList[index];
    let targetKey = `_${key}${REPORT_SETTING}`;
    return obj[targetKey];
  }

  public handleRowClick(row: any, column: any, event: any) {
    this.operateRow = { ...row };
  }

  public async handleReportSearch(searchParams: ReportData) {
    let { fullUrl } = this.serviceData;
    let { secretKey } = this.$route.params;
    this.loading = true;
    let page = {
      pageNo: 1,
      pageSize: this.reportSetting.pageSize || 20,
    };
    let keyList = Object.keys(searchParams);
    keyList.forEach((key, index) => {
      if (!this.needRender(searchParams, keyList[index])) {
        delete searchParams[key];
      }
    });
    await queryGenericData(fullUrl || "", secretKey, page, searchParams).then(res => {
      if(res.status === "success") {
        this.reportDataList = res.data;
      }
    });
    this.loading = false;
  }

  public handleAddReport() {
    if (!this.operateRow._generic_temporary) {
      this.initOperatorRow();
    }
    this.operateStatus = "add";
    this.dialogVisible = true;
  }

  public handleEditReport() {
    if (this.operateRow._generic_temporary) {
      message.warning("请选择任意一行数据");
      return;
    }
    this.operateStatus = "edit";
    this.dialogVisible = true;
  }

  public handleConfirmReport(form: ReportData, status: string) {
    let { secretKey } = this.$route.params;
    let keyList = Object.keys(form);
    keyList.forEach((key, index) => {
      if (!this.needRender(form, this.reportKeyList[index])) {
        this.$delete(form, key);
      } else if (form[`_${key}${REPORT_SETTING}`]?.allowShowInDetail === 0) {
        // 编辑时，主键不允许去掉
        if (status !== "edit") {
          this.$delete(form, key);
        } else if (status === "edit" && form[`_${key}${REPORT_SETTING}`]?.isWhereKey === 0) {
          this.$delete(form, key);
        }
      }
    });

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

  public handleExportReport() {}

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
  .header {
    display: inline-block;
    h2 {
      margin-top: 0;
      margin-bottom: 5px;
    }
    span {
      color: #999;
    }
  }
  .btn-container {
    margin-bottom: 10px;
    .btn-item {
      margin: 0 0 10px 10px;
    }
  }
}
</style>
