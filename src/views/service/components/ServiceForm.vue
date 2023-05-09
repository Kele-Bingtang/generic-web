<template>
  <div class="service-form-component">
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
        :model="serviceForm"
        :rules="rules"
        label-width="80px"
        class="service-form"
        :disabled="readonly"
      >
        <el-form-item label="接口名称" prop="serviceName">
          <el-input v-model.trim="serviceForm.serviceName"></el-input>
        </el-form-item>
        <el-form-item label="接口地址" prop="serviceUrl">
          <el-input v-model.trim="serviceForm.serviceUrl">
            <template #prepend>
              {{ baseUrl }}
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="报表名称">
          <el-input v-model.trim="serviceForm.reportTitle"></el-input>
        </el-form-item>
        <el-form-item label="接口状态" style="display: inline-flex">
          <el-select v-model="tempService.status" placeholder="请选择接口状态">
            <el-option label="启用" value="1"></el-option>
            <el-option label="禁用" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否认证" style="display: inline-flex">
          <el-select v-model="tempService.isAuth" placeholder="请选择是否认证">
            <el-option label="启用" value="1"></el-option>
            <el-option label="禁用" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="SQL">
          <el-tooltip class="item" effect="dark" placement="right">
            <template #content>
              <div style="line-height: 1.5715">
                表名/视图下拉值出现条件：项目填写了 databaseName。
                <br />
                如果命令行和表名/视图都填写，则以命令行的内容为主。
                <br />
                命令行的表名要加上数据库名，否则无法查询哪个数据的表。
                <br />
                右侧的验证可以告诉您 sql（Select）是否填写正确。
              </div>
            </template>
            <el-icon><QuestionFilled /></el-icon>
          </el-tooltip>
          <el-button v-waves @click="handleVerify" style="float: right">验 证</el-button>
          <el-tabs v-model="activeName">
            <el-tab-pane label="表名/视图" name="selectTable">
              <el-select
                v-model="tempService.tableOrViewName"
                filterable
                clearable
                placeholder="请选择接表名"
                @change="handleSelectTable"
              >
                <el-option-group v-for="group in tableViewNameList" :key="group.label" :label="group.label">
                  <el-option v-for="item in group.options" :key="item" :label="item" :value="item"></el-option>
                </el-option-group>
              </el-select>
            </el-tab-pane>
            <el-tab-pane label="命令行" name="command" lazy>
              <CodeMirror v-model:value="serviceForm.selectSql" cmMode="sql" class="code-mirror" :readonly="readonly" />
            </el-tab-pane>
          </el-tabs>
        </el-form-item>
        <el-form-item label="接口描述">
          <el-input type="textarea" v-model="serviceForm.serviceDesc" :autosize="{ minRows: 2, maxRows: 4 }"></el-input>
        </el-form-item>
      </el-form>
      <el-form :model="serviceForm" class="demo-form-inline" label-width="100px" :disabled="readonly">
        <el-form-item label="Insert Table">
          <el-select v-model="serviceForm.insertTable" filterable clearable placeholder="请选择接支持插入的表名">
            <el-option v-for="item in tableViewNameList[0].options" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Update Table">
          <el-select v-model="serviceForm.updateTable" filterable clearable placeholder="请选择接支持更新的表名">
            <el-option v-for="item in tableViewNameList[0].options" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Delete Table">
          <el-select v-model="serviceForm.deleteTable" filterable clearable placeholder="请选择接支持删除的表名">
            <el-option v-for="item in tableViewNameList[0].options" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts" name="ServiceForm">
import { verifySql, type ServiceModule } from "@/api/service";
import constant from "@/config/constant";
import type { FormInstance } from "element-plus";
import { commonRules } from "./serviceFormRules";
import CodeMirror from "@/components/CodeMirror/index.vue";
import type { TableView } from "../index.vue";
import { message } from "@/utils/layout/message";
import { useDataStore } from "@/stores/data";

type Service = ServiceModule.Service;

interface ServiceFormProps {
  status: string;
  data: Service | Partial<Service>;
  baseUrl: string;
  tableViewNameList: TableView[];
}

interface ServiceFormEmits {
  (e: "confirm", reportForm: Service, status: string): void;
}

const props = defineProps<ServiceFormProps>();
const emits = defineEmits<ServiceFormEmits>();

const dataStore = useDataStore();
const operateTitle = constant.operateTitle;

const dataFormRef = shallowRef<FormInstance>();
const loading = ref(false);
// 存储下拉框选择的 value 等，然后转换给 serviceForm
const tempService = reactive({
  status: "1",
  isAuth: "0",
  tableOrViewName: "",
});
const rules = ref({ ...commonRules });
const activeName = ref("selectTable");
let selectTable = false;

const serviceForm = computed(() => {
  tempService.status = props.data.status + "";
  tempService.isAuth = props.data.isAuth + "";
  tempService.tableOrViewName = props.data.selectTable || "";
  return props.data;
});
const readonly = computed(() => props.status === "read");

watch(
  () => serviceForm.value.selectSql,
  () => {
    if (serviceForm.value.selectTable && !selectTable) {
      serviceForm.value.selectTable = "";
    }
  }
);

const handleConfirmSave = () => {
  dataFormRef.value?.validate(async valid => {
    if (valid) {
      serviceForm.value.status = parseInt(tempService.status);
      serviceForm.value.isAuth = parseInt(tempService.isAuth);
      emits("confirm", serviceForm.value as Service, props.status);
    }
  });
};

const handleSelectTable = (selectValue: string) => {
  selectTable = true;
  serviceForm.value.selectSql = `select * from ${dataStore.project.databaseName}.${selectValue}`;
  serviceForm.value.selectTable = selectValue;
  serviceForm.value.insertTable = selectValue;
  serviceForm.value.updateTable = selectValue;
  serviceForm.value.deleteTable = selectValue;
  nextTick(() => {
    selectTable = false;
  });
};

const handleVerify = () => {
  const selectSql = serviceForm.value.selectSql;
  if (selectSql) {
    verifySql(selectSql).then(res => {
      if (res.status === "success") {
        if (res.data === -1) {
          message.error("sql 不是查询语句");
          return;
        }
        message.success(`sql 执行成功，返回 ${res.data} 数据`);
      }
    });
  }
};
</script>

<style lang="scss" scoped>
.service-form-component {
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
.service-form-component {
  .form-content {
    .codemirror-container {
      height: 200px;
      font-family: inherit;
    }

    .el-form-item__content {
      display: block;
    }
  }
}
</style>
