<template>
  <div class="search-container">
    <el-form inline label-width="auto" class="search-form">
      <el-form-item
        v-for="index in reportKeyList.length"
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
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></component>
      </el-form-item>
      <el-button
        v-waves
        type="primary"
        plain
        size="small"
        icon="el-icon-search"
        @click="$emit('handle-report-search', searchParams)"
      >
        查询
      </el-button>
    </el-form>
  </div>
</template>

<script lang="ts">
import constant from "@/config/constant";
import { isArray } from "@/utils/validate";
import { Component, Prop, Vue } from "vue-property-decorator";
import { ReportData } from "../index.vue";

const REPORT_SETTING = "GenericReportSetting";

@Component({ name: "ReportSearch" })
export default class extends Vue {
  public index!: number;

  @Prop({ required: true })
  public initObj!: ReportData;
  @Prop({ required: true })
  public data!: ReportData;
  @Prop({ required: true })
  public reportKeyList!: string[];

  get searchParams() {
    return this.initObj;
  }

  public getLabel(index: number) {
    let reportSetting = this.getReportColSetting(index);
    return reportSetting?.reportCol || reportSetting?.jsonCol;
  }

  public getComponent(index: number) {
    let colType = this.getReportColSetting(index)?.colType;
    let type = (constant.colTypeAndComponentTo as { [key: string]: any })[colType];
    if (type && isArray(type)) {
      return type[0];
    }
    return "";
  }

  public getComponentType(index: number) {
    let colType = this.getReportColSetting(index)?.colType;
    let type = (constant.colTypeAndComponentTo as { [key: string]: any })[colType];
    if (type && isArray(type)) {
      return type[1];
    }
  }

  public needRender(index: number, keyList: string[] = this.reportKeyList) {
    let obj = this.data;
    let key = keyList[index];
    if (key && key.startsWith("_") && key.indexOf(REPORT_SETTING) !== -1) {
      return false;
    }
    let targetKey = `_${key}${REPORT_SETTING}`;
    if (obj[targetKey]?.allowFilter === 0) {
      return false;
    }
    return true;
  }

  public getReportColSetting(index: number) {
    let obj = this.data;
    let key = this.reportKeyList[index];
    let targetKey = `_${key}${REPORT_SETTING}`;
    return obj[targetKey];
  }

  public getDateValueFormat(index: number) {
    let type = this.getComponentType(index);
    if (type === "date" || type === "daterange") {
      return "yyyy-MM-dd";
    } else if (type === "datetime" || type === "datetimerange") {
      return "yyyy-MM-dd HH:mm:ss";
    }
  }
}
</script>

<style lang="scss" scoped>
.search-container {
  .search-form {
    .search-form-item {
      margin-bottom: 10px;
    }
  }
}
</style>
