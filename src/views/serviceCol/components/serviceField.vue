<template>
  <div class="service-field-container">
    <el-button v-waves type="primary" plain icon="Plus" @click="handleAddField" style="margin-bottom: 10px">
      新增
    </el-button>
    <el-table :data="fieldList" border highlight-current-row>
      <el-table-column property="field" label="Field">
        <template #default="{ row }">
          <template v-if="row.edit">
            <el-input v-model="row.field" />
          </template>
          <span v-else>{{ row.field }}</span>
        </template>
      </el-table-column>
      <el-table-column property="parentField" label="ParentField">
        <template #default="{ row }">
          <template v-if="row.edit">
            <el-select v-model="row.parentField" clearable placeholder="请选择 parentField" style="width: 100%">
              <template v-for="item in fieldList" :key="item">
                <el-option
                  v-if="item.field !== row.field && item.parentField !== row.field"
                  :label="item.field"
                  :value="item.field || ''"
                ></el-option>
              </template>
            </el-select>
          </template>
          <span v-else>{{ row.parentField }}</span>
        </template>
      </el-table-column>
      <el-table-column property="description" label="Description">
        <template #default="{ row }">
          <template v-if="row.edit">
            <el-input v-model="row.description" />
          </template>
          <span v-else>{{ row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column property="jsonCol" label="jsonCol" width="300px">
        <template #default="{ row }">
          <template v-if="row.edit">
            <el-select
              v-model="row.jsonCol"
              multiple
              clearable
              collapse-tags
              collapse-tags-tooltip
              :max-collapse-tags="2"
              placeholder="请选择 jsonCol"
              style="width: 100%"
            >
              <el-option v-for="item in jsonColList" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </template>
          <span v-else>{{ row.jsonCol.join(", ") }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180px">
        <template #default="{ row }">
          <template v-if="row.edit">
            <el-button link type="primary" icon="Select" @click="handleConfirm(row)">确定</el-button>
            <el-button link type="danger" icon="CloseBold" @click="handleCancel(row)">取消</el-button>
          </template>
          <template v-else>
            <el-button link type="primary" icon="Edit" @click="handleEditServiceCol(row)">编辑</el-button>
            <el-button link type="danger" icon="Delete" @click="handleDeleteServiceCol(row)">删除</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts" name="ServiceFiled">
import type { ServiceColModule } from "@/api/serviceCol";
import { deleteField, insertField, queryFieldListPages, updateField, type FieldModule } from "@/api/field";
import { message } from "@/utils/layout/message";
import { useUserStore } from "@/stores/user";

type Field = Partial<FieldModule.Field> & {
  edit?: boolean;
};

interface ServiceFieldProps {
  data: ServiceColModule.ServiceCol[];
}
const props = defineProps<ServiceFieldProps>();

const route = useRoute();
const userStore = useUserStore();
const fieldList = ref<Field[]>([]);
const status = ref<"" | "add" | "edit">("");
const tempClickRow = ref<Field>();

const jsonColList = computed(() => {
  const jsonColList = props.data.map(item => item.jsonCol);
  return jsonColList.filter(item => {
    for (const field of fieldList.value) {
      if (field.jsonCol?.includes(item)) {
        return false;
      }
    }
    return true;
  });
});

onMounted(() => {
  initFieldList();
});

const initFieldList = () => {
  const { serviceId } = route.params;
  queryFieldListPages(Number(serviceId)).then(res => {
    if (res.status === "success") {
      fieldList.value = res.data as Field[];
    }
  });
};

const handleAddField = () => {
  status.value = "add";
  fieldList.value.push({
    field: "",
    parentField: "",
    description: "",
    jsonCol: [],
    edit: true,
  });
};

const handleConfirm = (row: Field) => {
  const field = { ...row };
  delete field.createTime;
  delete field.modifyTime;
  delete field.edit;
  if (status.value === "add") {
    const { serviceId } = route.params;
    field.serviceId = Number(serviceId);
    field.createUser = userStore.userInfo.username;
    field.modifyUser = userStore.userInfo.username;
    insertField(field as FieldModule.Field)
      .then(res => {
        if (res.status === "success") {
          message.success(res.message);
          row.id = res.data.id;
        } else {
          handleCancel(row);
        }
      })
      .catch(() => {
        handleCancel(row);
      });
  } else if (status.value === "edit") {
    delete field.createUser;
    field.modifyUser = userStore.userInfo.username;
    updateField(field as FieldModule.Field)
      .then(res => {
        if (res.status === "success") {
          message.success(res.message);
        } else {
          handleCancel(row);
        }
      })
      .catch(() => {
        handleCancel(row);
      });
  }
  row.edit = false;
};
const handleCancel = (row: Field) => {
  if (status.value === "add") {
    fieldList.value.pop();
  } else {
    row.field = tempClickRow.value?.field;
    row.parentField = tempClickRow.value?.parentField;
    row.description = tempClickRow.value?.description;
    row.jsonCol = tempClickRow.value?.jsonCol;
  }
  row.edit = false;
};

const handleEditServiceCol = (row: Field) => {
  tempClickRow.value = { ...row };
  status.value = "edit";
  row.edit = true;
};
const handleDeleteServiceCol = (row: Field) => {
  if (row.id) {
    deleteField({ id: row.id }).then(res => {
      if (res.status === "success") {
        fieldList.value = fieldList.value.filter(field => field.id !== row.id);
        message.success(res.message);
      }
    });
  }
};
</script>
