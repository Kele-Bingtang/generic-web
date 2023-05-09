<template>
  <el-card shadow="never" class="report-container">
    <el-row :gutter="10">
      <el-col :span="2">
        <div class="header">
          <h2>{{ reportSetting.reportTitle }}</h2>
          <span>{{ reportSetting.description }}</span>
        </div>
      </el-col>
      <el-col :span="18" v-if="allowFilter">
        <ReportSearch
          :init-obj="searchRow"
          :data="reportDataList[0]"
          :report-key-list="reportKeyList"
          @handle-report-search="handleReportSearch"
        ></ReportSearch>
      </el-col>
      <el-col :span="allowFilter ? 4 : 22">
        <el-row :gutter="10" class="btn-container">
          <el-col :span="6">
            <el-button
              v-waves
              type="primary"
              size="small"
              icon="Plus"
              @click="handleAddReport()"
              :disabled="isVisitor"
              v-if="reportSetting.allowAdd"
            >
              添加
            </el-button>
          </el-col>
          <el-col :span="6">
            <el-button
              v-waves
              type="primary"
              plain
              size="small"
              icon="EditPen"
              @click="handleEditReport()"
              :disabled="reportDataList.length === 0 || isVisitor"
              v-if="reportSetting.allowEdit"
            >
              编辑
            </el-button>
          </el-col>
          <el-col :span="6">
            <el-button
              v-waves
              type="danger"
              plain
              size="small"
              icon="Delete"
              @click="handleDeleteReport()"
              :disabled="reportDataList.length === 0 || isVisitor"
              v-if="reportSetting.allowDelete"
            >
              删除
            </el-button>
          </el-col>
          <el-col :span="6">
            <el-button
              v-waves
              type="warning"
              plain
              size="small"
              icon="Upload"
              @click="handleExport()"
              :disabled="reportDataList.length === 0"
              v-if="reportSetting.allowExport"
            >
              导出
            </el-button>
          </el-col>
        </el-row>
        <el-row class="btn-container">
          <el-col :span="24">
            <el-button v-waves type="info" plain size="small" icon="Promotion" @click="handleToColPage">
              跳转至字段配置页面
            </el-button>
          </el-col>
        </el-row>
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
        :tooltip-effect="settings.tooltipEffect"
      >
        <el-table-column type="index" :index="indexMethod" v-if="reportSetting.allowRow" />
        <template v-for="index in dataLength">
          <el-table-column
            v-if="needRender(reportDataList[0], reportKeyList[index - 1])"
            :key="reportKeyList[index - 1]"
            :prop="reportKeyList[index - 1]"
            :label="getLabel(index - 1)"
            :width="columnWidth(index - 1)"
            :align="columnAlign(index - 1)"
            sortable
            show-overflow-tooltip
          ></el-table-column>
        </template>
      </el-table>
      <el-dialog
        draggable
        :title="operateTitle[operateStatus]"
        v-model="dialogVisible"
        :width="reportSetting.dialogWidth"
        :close-on-click-modal="false"
      >
        <ReportForm
          ref="reportFormRef"
          :data="operateRow"
          :report-key-list="reportKeyList"
          :status="operateStatus"
          @cancel="dialogVisible = false"
          @confirm="handleConfirmReport"
        ></ReportForm>
      </el-dialog>
      <Pagination
        v-show="reportDataList.length > 0"
        :total="reportDataList.length"
        :paging="paging"
        @pagination="handleSizeChange"
      />
    </template>
    <template v-else>
      <el-empty></el-empty>
    </template>
  </el-card>
</template>

<script lang="ts">
export interface ReportData {
  [key: string]: any;
}
</script>

<script setup lang="ts" name="Report">
import { operateGenericDataForm, queryGenericData } from "@/api/genericApi";
import { defaultReportSetting, queryOneReport } from "@/api/report";
import { defaultServiceData, queryOneService } from "@/api/service";
import Pagination, { pageSetting, type Paging } from "@/components/Pagination/index.vue";
import constant from "@/config/constant";
import settings from "@/config/settings";
import { useDataStore } from "@/stores/data";
import { exportJsonToExcel, formatJsonToArray } from "@/utils/excel";
import { message } from "@/utils/layout/message";
import { isNumber } from "@/utils/layout/validate";
import { ElMessageBox, ElNotification } from "element-plus";
import ReportForm from "./components/reportForm.vue";
import ReportSearch from "./components/reportSearch.vue";

const REPORT_SETTING = "GenericReportSetting";
const DROPDOWN = "Dropdown";

const operateTitle = constant.operateTitle;

const route = useRoute();
const router = useRouter();
const dataStore = useDataStore();

const serviceData = ref({ ...defaultServiceData });
const reportSetting = ref({ ...defaultReportSetting });
const reportDataList = ref<ReportData[]>([]);
const reportKeyList = ref<string[]>([]);
const loading = ref(false);
const paging = reactive({ ...pageSetting });
const operateStatus = ref<"add" | "edit" | "">("");
const dialogVisible = ref(false);
const operateRow = ref<{ [key: string]: any }>({});
const searchRow = ref({});
const reportFormRef = shallowRef();

const dataLength = computed(() => {
  if (reportDataList.value.length > 0) {
    const keys = Object.keys(reportDataList.value[0]);
    return keys.length;
  }
  return 0;
});

const allowFilter = computed(() => reportSetting.value.allowFilter === 1);
const isVisitor = computed(() => dataStore.isVisitor);

watch(
  () => reportDataList.value.length,
  () => {
    initOperatorRow();
  }
);

onMounted(() => {
  const { serviceId, secretKey } = route.params;
  if (!serviceId || !isNumber(serviceId as string) || !secretKey) {
    message.error("无效链接");
    return new Promise(resolve => resolve(false));
  }
  initReportSettings().then(res => {
    paging.pageSize = res.pageSize;
    initReportData({ pageNo: 1, pageSize: res.pageSize });
  });
});

const initReportSettings = async () => {
  const { serviceId } = route.params;
  return await queryOneReport({ serviceId: Number(serviceId) }).then(res => {
    reportSetting.value = res.data;
    return res.data;
  });
};

const initReportData = async (page: http.Page = { pageNo: 1, pageSize: reportSetting.value.pageSize || 20 }) => {
  const { serviceId, secretKey } = route.params;
  loading.value = true;
  await queryOneService({ id: Number(serviceId) }).then(async res => {
    if (res.status === "success") {
      serviceData.value = res.data;
      await queryGenericData(res.data.fullUrl, secretKey as string, page).then(res => {
        reportDataList.value = res.data;
        reportKeyList.value = Object.keys((reportDataList && reportDataList.value[0]) || []);
        initQueryParams();
        initOperatorRow();
      });
    }
  });
  loading.value = false;
};

const initOperatorRow = () => {
  const obj = reactive<ReportData & { _generic_temporary?: boolean }>({});
  reportKeyList.value.forEach(key => {
    if (key.indexOf(REPORT_SETTING) === -1 && key.indexOf(DROPDOWN) === -1) {
      if (typeof obj[key] === "number") {
        obj[key] = -1;
      } else if (typeof obj[key] === "boolean") {
        obj[key] = false;
      } else {
        obj[key] = "";
      }
    } else {
      obj[key] = reportDataList.value[0][key];
    }
  });
  // 使用 _generic_temporary 目的是为了不让每次点击新增都初始化，所以初始化携带 _generic_temporary: true 来判断
  obj._generic_temporary = true;
  operateRow.value = { ...obj };
};

const initQueryParams = () => {
  const obj = reactive<ReportData>({});
  reportKeyList.value.forEach((key, index) => {
    const reportColSetting = getReportColSetting(index);
    if (reportColSetting?.allowFilter === 1) {
      if (typeof obj[key] === "number") {
        obj[key] = -1;
      } else if (typeof obj[key] === "boolean") {
        obj[key] = false;
      } else {
        obj[key] = "";
      }
      obj[`_${key}${REPORT_SETTING}`] = reportColSetting;
    }
  });

  searchRow.value = { ...obj };
};

const indexMethod = (index: number) => {
  return index + 1 + (pageSetting.currentPage - 1) * paging.pageSize;
};

const getLabel = (index: number) => {
  const reportColSetting = getReportColSetting(index);
  return reportColSetting?.reportCol || reportColSetting?.jsonCol;
};

const needRender = (obj: ReportData, key: string) => {
  if (key && key.startsWith("_") && (key.indexOf(REPORT_SETTING) !== -1 || key.indexOf(DROPDOWN) !== -1)) {
    return false;
  }
  // 后端已经校验，这里进行二次校验
  const targetKey = `_${key}${REPORT_SETTING}`;
  if (obj[targetKey]?.allowShowInReport === 0) {
    return false;
  }
  return true;
};

const columnWidth = (index: number) => {
  const width = getReportColSetting(index)?.reportColWidth;
  if (width === -1) {
    return "auto";
  } else {
    return width + "";
  }
};

const columnAlign = (index: number) => {
  const align = getReportColSetting(index)?.colAlign;
  if (align === 0) {
    return "left";
  } else if (align === 1) {
    return "center";
  } else if (align === 2) {
    return "right";
  }
};

const getReportColSetting = (index: number) => {
  const obj = reportDataList.value[0];
  const key = reportKeyList.value[index];
  const targetKey = `_${key}${REPORT_SETTING}`;
  return obj[targetKey];
};

const handleRowClick = (row: any) => {
  operateRow.value = { ...row };
};

const handleReportSearch = async (searchParams: ReportData) => {
  const { fullUrl } = serviceData.value;
  const { secretKey } = route.params;
  loading.value = true;
  const page = {
    pageNo: 1,
    pageSize: reportSetting.value.pageSize || 20,
  };
  const keyList = Object.keys(searchParams);
  keyList.forEach((key, index) => {
    if (!needRender(searchParams, keyList[index])) {
      delete searchParams[key];
    }
    if (!searchParams[key]) {
      delete searchParams[key];
    }
  });
  await queryGenericData(fullUrl || "", secretKey as string, page, searchParams).then(res => {
    if (res.status === "success") {
      reportDataList.value = res.data;
    }
  });
  loading.value = false;
};

const handleAddReport = () => {
  if (!operateRow.value._generic_temporary) initOperatorRow();
  else operateRow.value.temp = !operateRow.value.temp;
  operateStatus.value = "add";
  dialogVisible.value = true;
};

const handleEditReport = () => {
  if (operateRow.value._generic_temporary) {
    message.warning("请选择任意一行数据");
    return;
  }
  operateStatus.value = "edit";
  dialogVisible.value = true;
};

const handleConfirmReport = (form: ReportData, status: string) => {
  const { secretKey } = route.params;
  const keyList = Object.keys(form);
  keyList.forEach((key, index) => {
    if (!needRender(form, reportKeyList.value[index])) {
      delete form[key];
    } else if (form[`_${key}${REPORT_SETTING}`]?.allowShowInDetail === 0) {
      // 编辑时，主键不允许去掉
      if (status !== "edit") {
        delete form[key];
      } else if (status === "edit" && form[`_${key}${REPORT_SETTING}`]?.isWhereKey === 0) {
        delete form[key];
      }
    }
  });

  let operate: "insert" | "update" | "delete" = "insert";
  if (status === "add") {
    operate = "insert";
  } else if (status === "edit") {
    operate = "update";
  }
  operateGenericDataForm(serviceData.value.fullUrl as string, secretKey as string, form, operate).then(res => {
    if (res.status === "success") {
      dialogVisible.value = false;
      ElNotification.success(res.message);
      initReportData();
    }
  });
};

const handleDeleteReport = () => {
  if (operateRow.value._generic_temporary) {
    message.warning("请选择任意一行数据");
    return;
  }
  const { secretKey } = route.params;
  if (Object.keys(operateRow.value).length === 0) {
    message.warning("请选择任意一行数据");
    return;
  }
  ElMessageBox.confirm("此操作将永久删除该数据, 是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      operateGenericDataForm(serviceData.value.fullUrl || "", secretKey as string, operateRow.value, "delete").then(
        res => {
          if (res.status === "success") {
            ElNotification.success(res.message);
            initReportData();
          }
        }
      );
    })
    .catch(() => {});
};

const handleExport = () => {
  const tHeader = [];
  const filterVal = [];
  for (let index = 0; index < dataLength.value; index++) {
    if (needRender(reportDataList.value[0], reportKeyList.value[index])) {
      const reportCol = getReportColSetting(index)?.reportCol;
      const value = reportKeyList.value[index];
      tHeader.push(reportCol);
      filterVal.push(value);
    }
  }
  const data = formatJsonToArray(reportDataList.value, filterVal);
  exportJsonToExcel(
    tHeader,
    data,
    reportSetting.value.description + "-" + new Date().getTime(),
    undefined,
    undefined,
    true,
    "xlsx"
  );
};

const handleToColPage = () => {
  const { serviceId, secretKey } = route.params;
  const { serviceName } = serviceData.value;
  router.push(`/project/service-col/${serviceName}/${serviceId}/${secretKey}`);
};

const handleSizeChange = (pagingParams: Paging) => {
  initReportData({ pageNo: pagingParams.currentPage, pageSize: pagingParams.pageSize });
  paging.currentPage = pagingParams.currentPage;
  paging.pageSize = pagingParams.pageSize;
};
</script>

<style lang="scss" scoped>
.report-container {
  .header {
    display: inline-block;

    h2 {
      margin-top: 0;
      margin-bottom: 5px;
    }

    span {
      color: #999999;
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
