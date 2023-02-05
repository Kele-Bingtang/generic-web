<template>
  <div class="report-form-component">
    <el-switch v-model="inline" active-text="行内表单" style="margin-bottom: 20px"></el-switch>
    <el-form ref="report-form" :inline="inline" :model="reportForm" label-width="auto" class="report-form">
      <el-form-item
        v-for="index in reportKeyList.length"
        v-if="needRender(index - 1)"
        :key="getObjectKey(index - 1)"
        :prop="getObjectKey(index - 1)"
        :label="getLabel(index - 1)"
        :class="{ 'report-form-item': inline }"
      >
        <component
          :is="getComponent(index- 1)"
          :type="getComponentType(index- 1)"
          :value-format="getDateValueFormat(index- 1)"
          v-model="reportForm[reportKeyList[index - 1]]"
        ></component>
      </el-form-item>
    </el-form>
    <div class="report-form-footer">
      <el-button @click="$emit('cancel')">取 消</el-button>
      <el-button type="primary" @click="$emit('confirm', { ...reportForm }, status)">确 定</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import constant from "@/config/constant";
import { isArray } from "@/utils/validate";
import { Component, Prop, Vue } from "vue-property-decorator";

const REPORT_SETTING = "GenericReportSetting";

@Component({ name: "ReportForm" })
export default class extends Vue {
  public index!: number;

  @Prop({ required: true })
  public data!: any;
  @Prop({ required: true })
  public status!: string;

  public inline = true;
  public reportKeyList: string[] = [];

  get reportForm() {
    // 使用 _generic_temporary 目的是为了不让每次点击新增都初始化，所以初始化携带 _generic_temporary: true 来判断，这里删除掉
    this.$delete(this.data, "_generic_temporary");
    this.reportKeyList = Object.keys(this.data);
    return this.data;
  }

  public getObjectKey(index: number) {
    return this.reportKeyList[index];
  }

  public getLabel(index: number) {
    let reportSetting = this.getReportSetting(index);
    return reportSetting?.reportCol || reportSetting?.jsonCol;
  }

  public needRender(index: number) {
    let obj = this.reportForm;
    let key = this.reportKeyList[index];
    if (key && key.startsWith("_") && key.indexOf(REPORT_SETTING) !== -1) {
      return false;
    }
    let targetKey = `_${key}${REPORT_SETTING}`;
    if (obj[targetKey]?.allowShowInDetail === 0) {
      return false;
    }
    return true;
  }

  // public columnWidth(index: number) {
  //   let width = this.getReportSetting(index)?.detailColWidth;
  //   if (width === -1) {
  //     return "auto";
  //   } else {
  //     return width + "";
  //   }
  // }

  public getComponent(index: number) {
    let colType = this.getReportSetting(index)?.colType;
    let type = (constant.colTypeAndComponent as { [key: string]: any })[colType];
    if (type && isArray(type)) {
      return type[0];
    }
    console.log(this.getReportSetting(index));
    return "";
  }
  public getComponentType(index: number) {
    let colType = this.getReportSetting(index)?.colType;
    let type = (constant.colTypeAndComponent as { [key: string]: any })[colType];
    if (type && isArray(type)) {
      return type[1];
    }
  }

  public getReportSetting(index: number) {
    let obj = this.reportForm;
    let key = this.reportKeyList[index];
    let targetKey = `_${key}${REPORT_SETTING}`;
    return obj[targetKey];
  }

  public getDateValueFormat(index: number) {
    let type = this.getComponentType(index);
    if (type === "date") {
      return "yyyy-MM-dd";
    } else if (type === "datetime") {
      return "yyyy-MM-dd HH:mm:ss";
    }
  }
}
</script>

<style lang="scss" scoped>
.report-form-component {
  .report-form-footer {
    text-align: right;
  }
}
</style>
<style lang="scss">
.report-form-component {
  .report-form .el-form-item.report-form-item {
    .el-input {
      width: 210px;
    }
    .el-date-editor.el-input {
      width: 210px;
    }
  }
}
</style>
