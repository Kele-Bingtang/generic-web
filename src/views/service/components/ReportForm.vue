<template>
  <div class="report-form-component">
    <div class="form-header">
      <span class="form-title">{{ operateTitle[status] }}</span>
      <el-button v-waves @click="$emit('cancel')">取 消</el-button>
      <el-button v-waves type="primary" @click="handleConfirmSave" :loading="loading">
        {{ loading ? "提交中 ..." : "保 存" }}
      </el-button>
    </div>
    <div class="form-content">
      <el-form
        ref="dataForm"
        :model="reportForm"
        :rules="rules"
        label-width="80px"
        class="report-form"
        :disabled="readonly"
      >
        <el-form-item prop="reportTitle" label="报表名称">
          <el-input v-model="reportForm.reportTitle" placeholder="请输入字段名称"></el-input>
        </el-form-item>
        <el-form-item prop="description" label="报表描述">
          <el-input v-model="reportForm.description" placeholder="请输入请求名称"></el-input>
        </el-form-item>
        <el-form-item label="显示条数">
          <el-input v-model="reportForm.pageSize" placeholder="一页显示的条数"></el-input>
        </el-form-item>
      </el-form>

      <el-form
        ref="dataForm"
        :model="reportForm"
        :rules="rules"
        label-width="80px"
        class="report-form"
        :disabled="readonly"
        inline
      >
        <el-form-item label="添加">
          <el-select v-model="tempReport.allowAdd" placeholder="请选择" class="select-item">
            <el-option label="允许" value="0"></el-option>
            <el-option label="不允许" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="更新">
          <el-select v-model="tempReport.allowEdit" placeholder="请选择" class="select-item">
            <el-option label="允许" value="0"></el-option>
            <el-option label="不允许" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="删除">
          <el-select v-model="tempReport.allowDelete" placeholder="请选择" class="select-item">
            <el-option label="允许" value="0"></el-option>
            <el-option label="不允许" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="查询">
          <el-select v-model="tempReport.allowFilter" placeholder="请选择" class="select-item">
            <el-option label="允许" value="0"></el-option>
            <el-option label="不允许" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="导出">
          <el-select v-model="tempReport.allowExport" placeholder="请选择" class="select-item">
            <el-option label="允许" value="0"></el-option>
            <el-option label="不允许" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="图标">
          <el-select v-model="tempReport.chartType" placeholder="请选择" class="select-item">
            <el-option label="不开启" value="0"></el-option>
            <el-option label="饼图" value="1"></el-option>
            <el-option label="折线图" value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">
import { ReportModule } from "@/api/report";
import constant from "@/config/constant";
import { Form } from "element-ui";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import CodeMirror from "@/components/CodeMirror/index.vue";
import { commonRules } from "./service-form-rules";

@Component({
  components: { CodeMirror },
})
export default class ReportForm extends Vue {
  @Prop({ required: true })
  public status!: string;
  @Prop({ required: true })
  public data!: ReportModule.Report;
  @Prop({ required: true })
  public baseUrl!: string;

  public operateTitle = constant.operateTitle;
  public loading = false;
  public tempReport = {
    allowAdd: "0",
    allowEdit: "0",
    allowDelete: "0",
    allowFilter: "0",
    allowExport: "0",
    chartType: "0",
  };
  public rules = { ...commonRules };

  get reportForm() {
    return this.data;
  }

  get readonly() {
    return this.status === "read";
  }

  @Watch("data", { immediate: true })
  public onDataChange() {
    let { allowAdd, allowEdit, allowDelete, allowFilter, allowExport, chartType } = this.reportForm;
    this.tempReport = {
      allowAdd: allowAdd + "",
      allowEdit: allowEdit + "",
      allowDelete: allowDelete + "",
      allowFilter: allowFilter + "",
      allowExport: allowExport + "",
      chartType: chartType + "",
    };
  }

  public handleConfirmSave() {
    (this.$refs.dataForm as Form).validate(async valid => {
      if (valid) {
        let { reportForm, status } = this;
        let { allowAdd, allowEdit, allowDelete, allowFilter, allowExport, chartType } = this.tempReport;
        reportForm = {
          ...reportForm,
          allowAdd: Number(allowAdd),
          allowEdit: Number(allowEdit),
          allowDelete: Number(allowDelete),
          allowFilter: Number(allowFilter),
          allowExport: Number(allowExport),
          chartType: Number(chartType),
        };
        this.$emit("confirm", reportForm, status);
      }
    });
  }
}
</script>

<style lang="scss" scoped>
.report-form-component {
  height: 100%;
  .form-header {
    display: flex;
    margin-bottom: 32px;
    padding: 20px 20px 0;
    .form-title {
      flex: 1;
    }
  }
  .form-content {
    display: flex;
    flex-direction: column;
    padding: 0 20px;
    .code-mirror {
      line-height: 20px;
    }
  }
}
</style>
<style lang="scss">
.report-form-component {
  .form-content {
    .CodeMirror {
      height: 200px;
      font-family: inherit;
    }
  }
}
</style>
