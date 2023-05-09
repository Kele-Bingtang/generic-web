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
        ref="dataFormRef"
        :model="reportForm"
        :rules="rules"
        label-width="80px"
        class="report-form"
        :disabled="readonly"
      >
        <el-form-item prop="reportTitle" label="报表名称">
          <el-input v-model.trim="reportForm.reportTitle" placeholder="请输入报表名称"></el-input>
        </el-form-item>
        <el-form-item prop="description" label="报表描述">
          <el-input v-model.trim="reportForm.description" placeholder="请输入报表描述"></el-input>
        </el-form-item>
      </el-form>

      <el-form
        ref="dataFormRef"
        :model="reportForm"
        :rules="rules"
        label-width="70px"
        class="report-form"
        :disabled="readonly"
        inline
      >
        <el-form-item label="显示条数">
          <el-select v-model="reportForm.pageSize" placeholder="一页显示的条数">
            <el-option
              v-for="pageSize in pageSizeOptions"
              :key="pageSize"
              :label="pageSize"
              :value="pageSize"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="弹框宽度">
          <el-input v-model.trim="reportForm.dialogWidth" placeholder="请输入弹框宽度"></el-input>
        </el-form-item>
        <el-form-item label="添加">
          <el-select v-model="tempReport.allowAdd" placeholder="请选择">
            <el-option label="允许" value="1"></el-option>
            <el-option label="不允许" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="编辑">
          <el-select v-model="tempReport.allowEdit" placeholder="请选择">
            <el-option label="允许" value="1"></el-option>
            <el-option label="不允许" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="删除">
          <el-select v-model="tempReport.allowDelete" placeholder="请选择">
            <el-option label="允许" value="1"></el-option>
            <el-option label="不允许" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="查询">
          <el-select v-model="tempReport.allowFilter" placeholder="请选择">
            <el-option label="允许" value="1"></el-option>
            <el-option label="不允许" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="导出">
          <el-select v-model="tempReport.allowExport" placeholder="请选择">
            <el-option label="允许" value="1"></el-option>
            <el-option label="不允许" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="行数">
          <el-select v-model="tempReport.allowRow" placeholder="是否显示行数">
            <el-option label="允许" value="1"></el-option>
            <el-option label="不允许" value="0"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="图表">
          <el-select v-model="tempReport.chartType" placeholder="请选择">
            <el-option label="不开启" value="0"></el-option>
            <el-option label="饼图" value="1"></el-option>
            <el-option label="折线图" value="2"></el-option>
          </el-select>
        </el-form-item> -->
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts" name="ReportForm">
import type { ReportModule } from "@/api/report";
import constant from "@/config/constant";
import { commonRules } from "./reportFormRules";
import { pageSetting } from "@/components/Pagination/index.vue";
import type { FormInstance } from "element-plus";

type Report = ReportModule.Report;

interface ReportFormProps {
  status: string;
  data: Report | Partial<Report>;
  baseUrl: string;
}

interface ReportFormEmits {
  (e: "confirm", reportForm: Report, status: string): void;
}

const props = defineProps<ReportFormProps>();
const emits = defineEmits<ReportFormEmits>();

const rules = { ...commonRules };

const dataFormRef = shallowRef<FormInstance>();
const operateTitle = constant.operateTitle;
const loading = ref(false);
const tempReport = ref({
  allowAdd: "1",
  allowEdit: "1",
  allowDelete: "1",
  allowFilter: "1",
  allowExport: "1",
  allowRow: "0",
  chartType: "0",
});
const pageSizeOptions = ref(pageSetting.pageSizes);

const reportForm = computed(() => props.data);
const readonly = computed(() => props.status === "read");

watch(
  () => props.data,
  () => {
    const { allowAdd, allowEdit, allowDelete, allowFilter, allowRow, allowExport, chartType } = reportForm.value;
    tempReport.value = {
      allowAdd: allowAdd + "",
      allowEdit: allowEdit + "",
      allowDelete: allowDelete + "",
      allowFilter: allowFilter + "",
      allowExport: allowExport + "",
      allowRow: allowRow + "",
      chartType: chartType + "",
    };
  },
  { immediate: true }
);

const handleConfirmSave = () => {
  dataFormRef.value?.validate(async valid => {
    if (valid) {
      const { allowAdd, allowEdit, allowDelete, allowFilter, allowExport, chartType } = tempReport.value;
      const form = {
        ...reportForm.value,
        allowAdd: Number(allowAdd),
        allowEdit: Number(allowEdit),
        allowDelete: Number(allowDelete),
        allowFilter: Number(allowFilter),
        allowExport: Number(allowExport),
        chartType: Number(chartType),
      };
      emits("confirm", form as Report, props.status);
    }
  });
};
</script>

<style lang="scss" scoped>
.report-form-component {
  height: 100%;

  .form-header {
    display: flex;
    margin-bottom: 32px;

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
