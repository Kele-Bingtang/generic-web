<template>
  <div class="report-form-component">
    <el-switch v-model="inline" active-text="行内表单" style="margin-bottom: 20px"></el-switch>
    <el-form ref="report-form" :inline="inline" :model="reportForm" class="report-form">
      <template v-for="index in reportKeyList.length">
        <el-form-item
          v-if="needRender(index - 1)"
          :key="getObjectKey(index - 1)"
          :prop="getObjectKey(index - 1)"
          :label="getLabel(index - 1)"
          :class="classObj(index)"
        >
          <el-select
            v-if="getReportColDropdown(index - 1)"
            v-model="reportForm[reportKeyList[index - 1]]"
            placeholder="Please Select"
            :style="{ width: columnWidth(index - 1) }"
          >
            <el-option
              v-for="item in getReportColDropdown(index - 1)"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <component
            v-else
            :is="getComponent(index - 1)"
            :type="getComponentType(index - 1)"
            :value-format="getDateValueFormat(index - 1)"
            v-model="reportForm[reportKeyList[index - 1]]"
            :style="{ width: columnWidth(index - 1) }"
          ></component>
        </el-form-item>
      </template>
    </el-form>
    <div class="report-form-footer">
      <el-button v-waves @click="$emit('cancel')">取 消</el-button>
      <el-button v-waves type="primary" @click="$emit('confirm', { ...reportForm }, status)">确 定</el-button>
    </div>
  </div>
</template>

<script setup lang="ts" name="ReportForm">
import constant from "@/config/constant";
import { isArray } from "@/utils/layout/validate";

interface ReportFormProps {
  data: any;
  status: string;
  reportKeyList: string[];
}

const props = defineProps<ReportFormProps>();
const inline = ref(true);

const REPORT_SETTING = "GenericReportSetting";
const DROPDOWN = "Dropdown";

const reportForm = computed(() => reactive({ ...props.data }));

const classObj = (index: number) => {
  const obj: { [key: string]: any } = { "report-form-item": inline.value };
  obj[`report-form-item-${index}`] = true;
  return obj;
};

const getObjectKey = (index: number) => {
  return props.reportKeyList[index];
};

const getLabel = (index: number) => {
  const reportSetting = getReportColSetting(index);
  return reportSetting?.reportCol || reportSetting?.jsonCol;
};

const needRender = (index: number) => {
  const key = props.reportKeyList[index];
  if (key && key.startsWith("_") && (key.indexOf(REPORT_SETTING) !== -1 || key.indexOf(DROPDOWN) !== -1)) {
    return false;
  }
  const targetKey = `_${key}${REPORT_SETTING}`;
  if (reportForm.value[targetKey]?.allowShowInDetail === 0) {
    return false;
  }
  return true;
};

const columnWidth = (index: number) => {
  const width = getReportColSetting(index)?.detailColWidth;
  if (width === -1) {
    return "auto";
  } else {
    return width + "px";
  }
};

const getComponent = (index: number) => {
  const colType = getReportColSetting(index)?.colType;
  const type = (constant.colTypeAndComponent as { [key: string]: any })[colType];
  if (type && isArray(type)) {
    return type[0];
  }
  return "";
};

const getComponentType = (index: number) => {
  const colType = getReportColSetting(index)?.colType;
  const type = (constant.colTypeAndComponent as { [key: string]: any })[colType];
  if (type && isArray(type)) {
    return type[1];
  }
};

const getReportColDropdown = (index: number) => {
  const obj = reportForm.value;
  const key = props.reportKeyList[index];
  const targetKey = `_${key}${DROPDOWN}`;
  return obj[targetKey] as { value: string; label: string }[];
};

const getReportColSetting = (index: number) => {
  const obj = reportForm.value;
  const key = props.reportKeyList[index];
  const targetKey = `_${key}${REPORT_SETTING}`;
  return obj[targetKey];
};

const getDateValueFormat = (index: number) => {
  const type = getComponentType(index);
  if (type === "date") {
    return "yyyy-MM-dd";
  } else if (type === "datetime") {
    return "yyyy-MM-dd HH:mm:ss";
  }
};
</script>

<style lang="scss" scoped>
.report-form-component {
  .report-form-footer {
    text-align: right;
  }
}
</style>
