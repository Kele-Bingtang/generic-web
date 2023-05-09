<template>
  <div class="service-batch-container">
    <el-button v-waves type="primary" plain @click="handleConfirm" style="float: right; margin-bottom: 30px">
      确定
    </el-button>
    <el-row :gutter="20">
      <el-col :span="7">
        <el-select v-model="model.operateType" multiple clearable placeholder="请选择操作类型" style="width: 100%">
          <el-option v-for="(item, index) in operateType" :key="item" :label="item" :value="index"></el-option>
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-select v-model="model.operateValue" clearable placeholder="请选择内容" style="width: 100%">
          <el-option value="0" label="不允许"></el-option>
          <el-option value="1" label="允许"></el-option>
        </el-select>
      </el-col>
      <el-col :span="14">
        <el-select
          v-model="model.jsonColList"
          multiple
          clearable
          placeholder="请选择请求名"
          style="width: 100%"
          @focus="handleFocus"
        >
          <el-option
            v-for="item in columnList"
            :key="item.jsonCol"
            :label="item.jsonCol"
            :value="item.jsonCol"
          ></el-option>
        </el-select>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts" name="ServiceBatch">
import type { ServiceColModule } from "@/api/serviceCol";

interface ServiceBatchProps {
  data: ServiceColModule.ServiceCol[];
}

interface ServiceBatchEmit {
  (e: "confirm", reportForm: ServiceColModule.ServiceColBatchUpdate): void;
}

const props = defineProps<ServiceBatchProps>();
const emits = defineEmits<ServiceBatchEmit>();

const operateType = ["添加", "更新", "查询", "请求"];

const model = reactive<{ operateType: number[]; operateValue: string; jsonColList: string[] }>({
  operateType: [],
  operateValue: "",
  jsonColList: [],
});

const columnList = ref<ServiceColModule.ServiceCol[]>();

watch(
  () => props.data,
  () => {
    columnList.value = props.data;
  },
  { immediate: true }
);

const handleFocus = () => {
  const { operateType, operateValue } = model;
  if (operateType.length && operateValue) {
    const ov = Number(operateValue);
    let data = props.data;
    operateType.forEach(item => {
      if (item === 0) {
        data = data.filter(item => item.allowInsert !== ov);
      } else if (item === 1) {
        data = data.filter(item => item.allowUpdate !== ov);
      } else if (item === 2) {
        data = data.filter(item => item.allowFilter !== ov);
      } else if (item === 3) {
        data = data.filter(item => item.allowRequest !== ov);
      }
    });
    columnList.value = data;
  }
};
const handleConfirm = () => {
  const { operateType: op, operateValue: ov, jsonColList } = model;
  const data = {
    allowInsert: op.includes(0) ? Number(ov) : null,
    allowUpdate: op.includes(1) ? Number(ov) : null,
    allowFilter: op.includes(2) ? Number(ov) : null,
    allowRequest: op.includes(3) ? Number(ov) : null,
    jsonColList,
  };
  emits("confirm", data);
};
</script>

<style lang="scss" scoped></style>
