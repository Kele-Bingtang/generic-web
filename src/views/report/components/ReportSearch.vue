<template>
  <div class="search-container">
    <el-form inline class="search-form">
      <template v-for="index in reportKeyList.length">
        <el-form-item
          v-if="needRender(index - 1)"
          :key="reportKeyList[index - 1]"
          :prop="reportKeyList[index - 1]"
          class="search-form-item"
        >
          <component
            :is="getComponent(index - 1)"
            :type="getComponentType(index - 1)"
            :value-format="getDateValueFormat(index - 1)"
            v-model="searchParams[reportKeyList[index - 1]]"
            :placeholder="'请输入 ' + getLabel(index - 1)"
            :start-placeholder="getLabel(index - 1) + ' 开始'"
            :end-placeholder="getLabel(index - 1) + ' 结束'"
          ></component>
        </el-form-item>
      </template>
      <el-form-item>
        <el-button
          v-waves
          type="primary"
          plain
          size="small"
          icon="Search"
          @click="$emit('handle-report-search', searchParams)"
          v-if="reportKeyList.length > 0"
        >
          查询
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts" name="ReportSearch">
import constant from "@/config/constant";
import { isArray } from "@/utils/layout/validate";
import type { ReportData } from "@/views/report/index.vue";

const REPORT_SETTING = "GenericReportSetting";
const DROPDOWN = "Dropdown";

interface ReportSearchProps {
  initObj: ReportData;
  data: ReportData;
  reportKeyList: string[];
}

const props = defineProps<ReportSearchProps>();

const searchParams = computed(() => props.initObj);

const getLabel = (index: number) => {
  const reportSetting = getReportColSetting(index);
  return reportSetting?.reportCol || reportSetting?.jsonCol;
};

const needRender = (index: number, keyList: string[] = props.reportKeyList) => {
  const key = keyList[index];
  if (key && key.startsWith("_") && (key.indexOf(REPORT_SETTING) !== -1 || key.indexOf(DROPDOWN) !== -1)) {
    return false;
  }
  const targetKey = `_${key}${REPORT_SETTING}`;
  if (props.data[targetKey]?.allowFilter === 0) {
    return false;
  }
  return true;
};

const getComponent = (index: number) => {
  const colType = getReportColSetting(index)?.colType;
  const type = (constant.colTypeAndComponentSearch as { [key: string]: any })[colType];
  if (type && isArray(type)) {
    return type[0];
  }
  return "";
};

const getComponentType = (index: number) => {
  const colType = getReportColSetting(index)?.colType;
  const type = (constant.colTypeAndComponentSearch as { [key: string]: any })[colType];
  if (type && isArray(type)) {
    return type[1];
  }
};

const getReportColSetting = (index: number) => {
  const obj = props.data;
  const key = props.reportKeyList[index];
  const targetKey = `_${key}${REPORT_SETTING}`;
  return obj[targetKey];
};

const getDateValueFormat = (index: number) => {
  const type = getComponentType(index);
  if (type === "date" || type === "daterange") {
    return "YYYY-MM-DD";
  } else if (type === "datetime" || type === "datetimerange") {
    return "YYYY-MM-DD HH:mm:ss";
  }
};
</script>
