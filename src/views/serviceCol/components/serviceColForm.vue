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
      <div class="title">API 配置</div>
      <el-form
        ref="dataFormRef"
        :model="serviceColForm"
        :rules="rules"
        label-width="120px"
        class="service-form"
        :disabled="readonly"
        inline
      >
        <el-form-item prop="tableCol" label="字段名称">
          <el-input v-model="serviceColForm.tableCol" placeholder="请输入字段名称"></el-input>
        </el-form-item>
        <el-form-item prop="jsonCol" label="请求名称">
          <el-input v-model="serviceColForm.jsonCol" placeholder="请输入请求名称"></el-input>
        </el-form-item>
        <el-form-item prop="reportCol" label="报表名称">
          <el-input v-model="serviceColForm.reportCol" placeholder="请输入报表名称"></el-input>
        </el-form-item>
        <el-form-item label="where 条件">
          <el-select v-model="tempServiceCol.isWhereKey" placeholder="请选择" class="select-item">
            <el-option label="不作为" value="0"></el-option>
            <el-option label="作为（值为空传）" value="1"></el-option>
            <el-option label="作为（值为空不传）" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="添加">
          <el-select v-model="tempServiceCol.allowInsert" placeholder="请选择" class="select-item">
            <el-option label="允许" value="1"></el-option>
            <el-option label="不允许" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="更新">
          <el-select v-model="tempServiceCol.allowUpdate" placeholder="请选择" class="select-item">
            <el-option label="允许" value="1"></el-option>
            <el-option label="不允许" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="查询">
          <el-select v-model="tempServiceCol.allowFilter" placeholder="请选择" class="select-item">
            <el-option label="允许" value="1"></el-option>
            <el-option label="不允许" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="请求">
          <el-select v-model="tempServiceCol.allowRequest" placeholder="请选择" class="select-item">
            <el-option label="允许" value="1"></el-option>
            <el-option label="不允许" value="0"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="加密">
          <el-select v-model="tempServiceCol.dataEncrypt" placeholder="请选择" class="select-item">
            <el-option v-for="(item, index) in encryptArr" :key="item" :label="item" :value="index + ''"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="字段类型">
          <el-select v-model="serviceColForm.colType" placeholder="请选择" filterable clearable class="select-item">
            <el-option v-for="item in colTypeOptions" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="筛选条件">
          <el-select v-model="tempServiceCol.queryFilter" placeholder="请选择筛选条件" class="select-item">
            <el-option
              v-for="(item, index) in filterQueryArr"
              :key="item"
              :label="item"
              :value="index + ''"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序顺序">
          <el-input v-model="serviceColForm.orderBy" placeholder="请选择排序顺序"></el-input>
        </el-form-item>
        <el-form-item label="默认值" v-if="serviceColForm.isWhereKey === 0">
          <el-input v-model="serviceColForm.defaultValue" placeholder="请输入默认值"></el-input>
        </el-form-item>
      </el-form>

      <div class="title">报表配置</div>
      <el-form :model="serviceColForm" label-width="120px" class="service-form" :disabled="readonly" inline>
        <el-form-item label="列对齐">
          <el-select v-model="tempServiceCol.colAlign" placeholder="请选择" class="select-item">
            <el-option label="左对齐" value="0"></el-option>
            <el-option label="居中" value="1"></el-option>
            <el-option label="右对齐" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="字段显示">
          <el-select v-model="tempServiceCol.allowShowInReport" placeholder="请选择" class="select-item">
            <el-option label="允许" value="1"></el-option>
            <el-option label="不允许" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="弹出框显示">
          <el-select v-model="tempServiceCol.allowShowInDetail" placeholder="请选择" class="select-item">
            <el-option label="允许" value="1"></el-option>
            <el-option label="不允许" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="出现顺序">
          <el-input v-model="serviceColForm.displaySeq" placeholder="请输入出现顺序"></el-input>
        </el-form-item>
        <el-form-item label="显示宽度大小">
          <el-input v-model="reportColWidth" placeholder="请输入显示宽度"></el-input>
        </el-form-item>
        <el-form-item label="弹出框宽度大小">
          <el-input v-model="detailColWidth" placeholder="请输入弹出框宽度"></el-input>
        </el-form-item>
      </el-form>
      <div>
        <div class="title">
          下拉设置
          <el-tooltip effect="dark" content="" placement="right">
            <template #content>
              <div style="line-height: 1.5715">
                如果该字段是下拉值选择，则填写。
                <br />
                如果下面两个或者三个都填，则查询的值都会作为下拉值，查询的值优先级顺序：自定义 > 接口 > SQL
              </div>
            </template>
            <el-icon style="margin-left: 5px"><QuestionFilled /></el-icon>
          </el-tooltip>
        </div>
        <el-tabs v-model="activeName">
          <el-tab-pane label="自定义" name="custom">
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px">
              <div>
                <span>数字模式</span>
                <el-tooltip
                  class="box-item"
                  effect="dark"
                  content="存储内容输入 0, 1 等为数字而不是字符串。切换后不会立马生效，需要让文本框内容变化才会生效"
                  placement="top"
                >
                  <el-icon style="margin: 0 5px"><QuestionFilled /></el-icon>
                </el-tooltip>
                <el-switch v-model="useNumber" inline-prompt active-text="开启" inactive-text="关闭" />
              </div>
              <el-button type="primary" icon="Plus" circle @click="addCustomSelect" />
            </div>
            <el-form inline>
              <template v-for="(select, index) in customDropDownList" :key="select.id">
                <el-row>
                  <el-col :span="11">
                    <el-form-item label="存储内容（value）">
                      <el-input v-if="useNumber" v-model.number="select.value" placeholder="请输入存储内容"></el-input>
                      <el-input v-else v-model="select.value" placeholder="请输入存储内容"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item label="展示内容（label）">
                      <el-input v-model="select.label" placeholder="请输入展示内容"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="1">
                    <el-button type="danger" icon="Minus" circle @click="removeCustomSelect(index)" />
                  </el-col>
                </el-row>
              </template>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="接口" name="service" lazy>
            <el-space>
              <el-select
                v-model="dropdownServiceTemp.service"
                placeholder="请选择接口"
                clearable
                @change="serviceSelectChange"
              >
                <el-option
                  v-for="item in dropdownServiceList"
                  :key="item.serviceId"
                  :label="item.serviceName"
                  :value="item.serviceId"
                />
              </el-select>
              <el-select v-model="dropdownServiceTemp.valueColumn" placeholder="存储内容字段：Value" clearable>
                <el-option
                  v-for="item in dropdownServiceColList"
                  :key="item.serviceColId"
                  :label="item.serviceColJsonName"
                  :value="item.serviceColId"
                />
              </el-select>
              <el-select v-model="dropdownServiceTemp.labelColumn" placeholder="展示内容内容字段：Label" clearable>
                <el-option
                  v-for="item in dropdownServiceColList"
                  :key="item.serviceColId"
                  :label="item.serviceColJsonName"
                  :value="item.serviceColId"
                />
              </el-select>
            </el-space>
          </el-tab-pane>
          <el-tab-pane name="sql" lazy>
            <template #label>
              <span>SQL</span>
              <el-tooltip effect="dark" content="" placement="right">
                <template #content>
                  <div style="line-height: 1.5715">
                    两种写法：
                    <br />
                    指定 Value 和 Label，如：select code as value, name as label from generic.role
                    <br />
                    按顺序读取，第一个是 Value，第二个是 Label：select code, name from generic.role
                    <br />
                    如果 SQL 查询出一个，则该值作为 Value 和 Label，如果查询出多个，则取前两个作为 Value 和 Label
                  </div>
                </template>
                <el-icon style="margin-left: 5px"><QuestionFilled /></el-icon>
              </el-tooltip>
            </template>
            <CodeMirror v-model:value="serviceColForm.dropdownSql" cmMode="sql" :readonly="readonly" />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="ServiceColForm">
import type { ServiceColModule } from "@/api/serviceCol";
import constant from "@/config/constant";
import type { FormInstance } from "element-plus";
import { commonRules } from "./formRules";
import { filterQueryArr } from "../common";
import CodeMirror from "@/components/CodeMirror/index.vue";
import { queryServiceAndServiceColList, type ServiceModule } from "@/api/service";
import { useDataStore } from "@/stores/data";

interface ServiceColFormProps {
  status: string;
  data: ServiceColModule.ServiceCol | Partial<ServiceColModule.ServiceCol>;
}

interface ServiceColFormEmits {
  (e: "confirm", ServiceColForm: ServiceColModule.ServiceCol, status: string): void;
}

const props = defineProps<ServiceColFormProps>();
const emits = defineEmits<ServiceColFormEmits>();

const operateTitle = constant.operateTitle;
const rules = { ...commonRules };

const dataStore = useDataStore();
const dataFormRef = shallowRef<FormInstance>();
const loading = ref(false);
const reportColWidth = ref("");
const detailColWidth = ref("");
const activeName = ref("custom");
const customDropDownList = ref<{ id: number; value: string; label: string }[]>([]);
const dropdownServiceList = ref<ServiceModule.ServiceAndServiceCol[]>([]);
const dropdownServiceColList = ref<ServiceModule.ServiceColList[]>([]);
const dropdownServiceTemp = ref<{
  service: number | string;
  valueColumn: number | string;
  labelColumn: number | string;
}>({
  service: "",
  valueColumn: "",
  labelColumn: "",
});
const useNumber = ref(false);

const serviceColForm = computed(() => props.data);
const tempServiceCol = computed(() => {
  const {
    isWhereKey,
    dataEncrypt,
    queryFilter,
    orderBy,
    allowInsert,
    allowUpdate,
    allowFilter,
    allowRequest,
    allowShowInReport,
    allowShowInDetail,
    colAlign,
    dropdownValue,
    dropdownService,
  } = props.data;
  if (dropdownValue) customDropDownList.value = JSON.parse(dropdownValue);
  else customDropDownList.value = [];
  if (dropdownService) {
    const arr = dropdownService.split("-");
    dropdownServiceTemp.value.service = Number(arr[0]);
    serviceSelectChange(Number(dropdownService[0]));
    nextTick(() => {
      dropdownServiceTemp.value.valueColumn = Number(arr[1]);
      dropdownServiceTemp.value.labelColumn = Number(arr[2]);
    });
  } else {
    dropdownServiceTemp.value = {
      service: "",
      valueColumn: "",
      labelColumn: "",
    };
  }
  return reactive({
    isWhereKey: isWhereKey + "",
    dataEncrypt: dataEncrypt + "",
    queryFilter: queryFilter + "",
    orderBy: orderBy + "",
    allowInsert: allowInsert + "",
    allowUpdate: allowUpdate + "",
    allowFilter: allowFilter + "",
    allowRequest: allowRequest + "",
    allowShowInReport: allowShowInReport + "",
    allowShowInDetail: allowShowInDetail + "",
    colAlign: colAlign + "",
  });
});

const colTypeOptions = computed(() => Object.keys(constant.colTypeAndComponent));
const readonly = computed(() => props.status === "read");

watch(
  () => [reportColWidth.value, detailColWidth.value],
  ([newReportColWidth, newDetailColWidth]) => {
    if (newReportColWidth) {
      if (newReportColWidth === "auto") serviceColForm.value.reportColWidth = -1;
      else serviceColForm.value.reportColWidth = parseInt(newReportColWidth);
    }
    if (newDetailColWidth) {
      if (newDetailColWidth === "auto") serviceColForm.value.detailColWidth = -1;
      else serviceColForm.value.detailColWidth = parseInt(newDetailColWidth);
    }
  }
);

watch(
  () => props.data,
  () => {
    const { reportColWidth: r, detailColWidth: d } = serviceColForm.value;
    reportColWidth.value = r === -1 ? "auto" : r + "";
    detailColWidth.value = d === -1 ? "auto" : d + "";
    dataFormRef.value?.clearValidate();
  }
);

onMounted(() => {
  const { reportColWidth: r, detailColWidth: d } = serviceColForm.value;
  reportColWidth.value = r === -1 ? "auto" : r + "";
  detailColWidth.value = d === -1 ? "auto" : d + "";
  initServiceAndServiceColList();
});

const initServiceAndServiceColList = () => {
  const { project } = dataStore;
  const isSuccess = queryServiceAndServiceColList(project.id || 0).then(res => {
    if (res.status === "success") {
      dropdownServiceList.value = res.data;
    }
  });
  return isSuccess;
};

const addCustomSelect = () => {
  customDropDownList.value.push(
    reactive({
      id: Math.floor(Math.random() * 10000),
      value: "",
      label: "",
    })
  );
};

const removeCustomSelect = (index: number) => {
  customDropDownList.value.splice(index, 1);
};

const serviceSelectChange = (value: number) => {
  const selectService = dropdownServiceList.value.filter(item => item.serviceId === value);
  dropdownServiceColList.value = selectService[0].serviceColList;
};

const handleConfirmSave = () => {
  dataFormRef.value?.validate(async valid => {
    if (valid) {
      const {
        isWhereKey,
        dataEncrypt,
        queryFilter,
        orderBy,
        allowInsert,
        allowUpdate,
        allowFilter,
        allowRequest,
        allowShowInReport,
        allowShowInDetail,
        colAlign,
      } = tempServiceCol.value;
      const { service, valueColumn, labelColumn } = dropdownServiceTemp.value;
      let dropdownServiceStr = null;
      if (service && valueColumn && labelColumn) dropdownServiceStr = `${service}-${valueColumn}-${labelColumn}`;

      const form = {
        ...serviceColForm.value,
        isWhereKey: Number(isWhereKey),
        dataEncrypt: Number(dataEncrypt),
        queryFilter: Number(queryFilter),
        orderBy: Number(orderBy),
        allowInsert: Number(allowInsert),
        allowUpdate: Number(allowUpdate),
        allowFilter: Number(allowFilter),
        allowRequest: Number(allowRequest),
        allowShowInReport: Number(allowShowInReport),
        allowShowInDetail: Number(allowShowInDetail),
        colAlign: Number(colAlign),
        dropdownValue: customDropDownList.value.length ? JSON.stringify(customDropDownList.value) : null,
        dropdownService: dropdownServiceStr,
      };
      emits("confirm", form as ServiceColModule.ServiceCol, props.status);
    }
  });
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

    .select-item {
      width: 191px;
    }

    .title {
      margin-bottom: 12px;
      font-size: 16px;
      font-weight: 600;
      line-height: 22px;
      color: rgb(0 0 0 / 85%);
    }
  }

  :deep(.el-input) {
    width: 191px;
  }
}
</style>
