<template>
  <el-card shadow="never" class="service-col-container">
    <div class="search-container">
      <div class="search-content">
        <el-button v-waves type="primary" icon="Plus" @click="handleAddServiceCol()" :disabled="isVisitor">
          添加
        </el-button>
        <el-button v-waves type="success" icon="DocumentCopy" @click="handleCopyServiceCol()" :disabled="isVisitor">
          复制
        </el-button>
        <el-button v-waves type="warning" icon="Upload" @click="handleExport">导出</el-button>
        <el-button v-waves icon="Refresh" @click="handleReset">重置</el-button>
        <el-button v-waves type="primary" plain icon="Pointer" @click="handleRegenerate" :disabled="isVisitor">
          生成新增字段
        </el-button>
        <el-button v-waves type="danger" plain icon="Delete" @click="handleDeleteInvalid" :disabled="isVisitor">
          删除失效字段
        </el-button>
        <el-button v-waves type="success" plain icon="Files" @click="fieldDialogVisible = true" :disabled="isVisitor">
          字段合并
        </el-button>
        <el-button v-waves type="success" plain icon="Files" @click="batchDialogVisible = true" :disabled="isVisitor">
          批量操作
        </el-button>
      </div>
    </div>

    <template v-if="serviceColList.length > 0">
      <el-table
        :data="serviceColList"
        border
        highlight-current-row
        style="width: 100%"
        v-loading="loading"
        @row-click="handleRowClick"
        @row-dblclick="handleEditServiceCol(tempClickRow)"
        :tooltip-effect="settings.tooltipEffect"
      >
        <!-- <el-table-column type="selection" width="55"></el-table-column> -->
        <el-table-column prop="tableCol" label="字段名" sortable></el-table-column>
        <el-table-column prop="jsonCol" label="请求名" sortable></el-table-column>
        <el-table-column prop="reportCol" label="报表名" sortable></el-table-column>
        <el-table-column prop="isWhereKey" label="where 条件" show-overflow-tooltip>
          <template #default="{ row }">
            {{ filterIsWhereKey(row.isWhereKey) }}
          </template>
        </el-table-column>
        <el-table-column prop="allowInsert" label="添加" width="80px" sortable>
          <template #default="{ row }">
            {{ filterStatus(row.allowInsert) }}
          </template>
        </el-table-column>
        <el-table-column prop="allowUpdate" label="更新" width="80px" sortable>
          <template #default="{ row }">
            {{ filterStatus(row.allowUpdate) }}
          </template>
        </el-table-column>
        <el-table-column prop="allowFilter" label="查询" width="80px" sortable>
          <template #default="{ row }">
            {{ filterStatus(row.allowFilter) }}
          </template>
        </el-table-column>
        <el-table-column prop="allowRequest" label="请求" width="80px" sortable>
          <template #default="{ row }">
            {{ filterStatus(row.allowRequest) }}
          </template>
        </el-table-column>
        <el-table-column prop="orderBy" label="排序顺序" width="110px" sortable></el-table-column>
        <el-table-column prop="displaySeq" label="出现顺序" width="110px" sortable></el-table-column>
        <el-table-column prop="queryFilter" label="筛选条件" width="110px" sortable>
          <template #default="{ row }">
            {{ filterQueryArr[row.queryFilter] }}
          </template>
        </el-table-column>
        <el-table-column prop="defaultValue" label="默认值" width="100px"></el-table-column>
        <!-- <el-table-column prop="dataEncrypt" label="加密">
          <template #default="{ row }">
            {{ encryptArr[row.dataEncrypt] }}
          </template>
        </el-table-column> -->
        <el-table-column prop="colType" label="类型" width="90px"></el-table-column>
        <el-table-column prop="colLength" label="长度" width="70px"></el-table-column>

        <el-table-column label="操作" width="220px">
          <template #default="{ row }">
            <el-button link icon="Search" @click="handleReadServiceCol(row)">查看</el-button>
            <el-button link type="primary" icon="Edit" @click="handleEditServiceCol(row)" :disabled="isVisitor">
              编辑
            </el-button>
            <el-button link type="danger" icon="Delete" @click="handleDeleteServiceCol(row)" :disabled="isVisitor">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <Pagination
        v-show="serviceColList.length > 0"
        :total="serviceColList.length"
        :paging="paging"
        @pagination="handleSizeChange"
      />
    </template>
    <template v-else>
      <el-empty>
        <el-button v-waves icon="Plus" @click="handleAddServiceCol()" :disabled="isVisitor">创建字段</el-button>
      </el-empty>
    </template>

    <el-dialog
      v-if="serviceColList.length > 0"
      v-model="fieldDialogVisible"
      title="属性配置"
      width="70%"
      draggable
      :close-on-click-modal="false"
      destroy-on-close
    >
      <ServiceField :data="serviceColList" />
    </el-dialog>

    <el-dialog
      v-if="serviceColList.length > 0"
      v-model="batchDialogVisible"
      title="批量操作"
      width="70%"
      draggable
      :close-on-click-modal="false"
      destroy-on-close
    >
      <ServiceBatch :data="serviceColList" @confirm="handleBatchConfirm" />
    </el-dialog>

    <DragDrawer
      v-model:visible="serviceColDrawer.visible"
      :placement="serviceColDrawer.placement"
      v-model:width="serviceColDrawer.width"
      :draggable="serviceColDrawer.draggable"
      :with-header="serviceColDrawer.withHeader"
      :close-on-click-modal="false"
    >
      <ServiceColForm
        :data="operateRow"
        :status="operateStatus"
        @confirm="handleConfirmAdd"
        @cancel="serviceColDrawer.visible = false"
      ></ServiceColForm>
    </DragDrawer>
  </el-card>
</template>

<script setup lang="ts" name="ServiceCol">
import {
  defaultServiceColData,
  deleteInvalidColumn,
  deleteServiceCol,
  insertServiceCol,
  queryServiceColListPages,
  updateBatchServiceCol,
  updateColumn,
  updateServiceCol,
  type ServiceColModule,
} from "@/api/serviceCol";
import Pagination, { pageSetting, type Paging } from "@/components/Pagination/index.vue";
import { useUserStore } from "@/stores/user";
import { message } from "@/utils/layout/message";
import { isNumber } from "@/utils/layout/validate";
import { ElMessageBox, ElNotification } from "element-plus";
import DragDrawer from "@/components/DragDrawer/index.vue";
import ServiceColForm from "./components/serviceColForm.vue";
import { exportJsonToExcel, formatJsonToArray } from "@/utils/excel";
import settings from "@/config/settings";
import { filterQueryArr } from "./common";
import ServiceField from "./components/serviceField.vue";
import ServiceBatch from "./components/serviceBatch.vue";
import { useDataStore } from "@/stores/data";
import { queryGenericOneProject } from "@/api/project";

type ServiceCol = ServiceColModule.ServiceCol;
type ServiceColInsert = ServiceColModule.ServiceColInsert;
type ServiceColUpdate = ServiceColModule.ServiceColUpdate;

const route = useRoute();
const userStore = useUserStore();
const dataStore = useDataStore();

const serviceColList = ref<ServiceCol[]>([]);
const tempClickRow = ref({ ...defaultServiceColData }); // 点击某一行后缓存起来
const loading = ref(false);
const paging = reactive({ ...pageSetting });
const operateStatus = ref("");
const operateRow = ref({ ...defaultServiceColData });
const serviceColDrawer = reactive({
  visible: false,
  placement: "right",
  width: 780,
  draggable: true,
  withHeader: false,
});
const fieldDialogVisible = ref(false);
const batchDialogVisible = ref(false);

const isVisitor = computed(() => dataStore.isVisitor);

watch(
  () => serviceColList.value.length,
  () => {
    tempClickRow.value = { ...defaultServiceColData };
  }
);

onMounted(async () => {
  await initProject();
  initServiceCol();
});

const initServiceCol = (page?: http.Page) => {
  const { serviceId } = route.params;
  if (!serviceId || !isNumber(serviceId as string)) {
    message.error("无效链接");
    return new Promise(resolve => resolve(false));
  }
  loading.value = true;
  const isSuccess = queryServiceColListPages(page, { serviceId: Number(serviceId) }).then(res => {
    if (res.status === "success") {
      serviceColList.value = res.data;
      return true;
    } else {
      return false;
    }
  });
  loading.value = false;
  return isSuccess;
};

const initProject = async () => {
  const { secretKey } = route.params;
  // 如果切换项目或不通过项目进来，而是链接进来则需要更新
  if (dataStore.project.id === -1 || dataStore.project.secretKey !== secretKey) {
    const res = await queryGenericOneProject(secretKey as string);
    dataStore.updateProject(res.data);
  }
};

const filterIsWhereKey = (value: number) => {
  if (value === 0) {
    return "不作为";
  } else if (value === 1) {
    return "作为（值为空传）";
  } else if (value === 2) {
    return "作为（值为空不传）";
  }
};

const filterStatus = (value: number) => {
  if (value === 0) {
    return "不允许";
  } else if (value === 1) {
    return "允许";
  } else {
    return "不存在";
  }
};

const handleReadServiceCol = (row: ServiceCol) => {
  operateRow.value = Object.assign({}, row);
  operateStatus.value = "read";
  serviceColDrawer.visible = true;
};

const handleAddServiceCol = () => {
  operateRow.value = { ...defaultServiceColData };
  operateStatus.value = "add";
  serviceColDrawer.visible = true;
};

const handleEditServiceCol = (row: ServiceCol | Partial<ServiceCol>) => {
  operateRow.value = Object.assign({}, row);
  operateStatus.value = "edit";
  serviceColDrawer.visible = true;
};

const handleCopyServiceCol = () => {
  if (tempClickRow.value.id === -1) {
    message.warning("请选择某一行，再执行复制操作");
    return;
  }
  operateRow.value = Object.assign({}, tempClickRow.value);
  operateStatus.value = "copy";
  serviceColDrawer.visible = true;
};

const handleBatchConfirm = (data: ServiceColModule.ServiceColBatchUpdate) => {
  updateBatchServiceCol(data).then(res => {
    if (res.status === "success") {
      message.success(res.message);
      batchDialogVisible.value = false;
      initServiceCol();
    }
  });
};

const handleConfirmAdd = (form: ServiceCol, status: string) => {
  const data: Partial<ServiceCol> = { ...form };
  const { username } = userStore.userInfo;
  if (status === "add") {
    // 删除 Insert 不允许的数据
    delete data.id;
    delete data.createTime;
    delete data.modifyTime;
    // 添加 Insert 需要的其他数据
    data.serviceId = Number(route.params.serviceId);
    data.createUser = username;
    data.modifyUser = username;
    addServiceData(data as ServiceColInsert);
  } else if (status === "edit") {
    // 删除 Update 不允许的数据
    delete data.createUser;
    delete data.createTime;
    delete data.modifyTime;
    delete data.serviceId;
    data.modifyUser = username;
    // 添加 Update 需要的其他数据
    editServiceData(data as ServiceColUpdate);
  }
};

const addServiceData = (form: ServiceColInsert) => {
  insertServiceCol(form).then(res => {
    if (res.status === "success") {
      serviceColDrawer.visible = false;
      ElNotification.success("添加接口成功！");
      initServiceCol();
    }
  });
};
const editServiceData = (form: ServiceColUpdate) => {
  updateServiceCol(form).then(res => {
    if (res.status === "success") {
      serviceColDrawer.visible = false;
      ElNotification.success("更新接口成功！");
      initServiceCol();
    }
  });
};

const handleDeleteServiceCol = (row: ServiceCol) => {
  ElMessageBox.confirm("此操作将永久删除该数据, 是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      deleteServiceCol(row).then(res => {
        if (res.status === "success") {
          ElNotification.success("删除成功！");
          initServiceCol();
        }
      });
    })
    .catch(() => {});
};

const handleExport = () => {
  const tHeader = [
    "id",
    "字段名",
    "请求名",
    "报表名",
    "字段类型",
    "字段长度",
    "Where 条件",
    "默认值",
    "是否加密",
    "筛选条件",
    "排序顺序",
    "是否允许更新",
    "是否允许查询",
    "是否允许请求",
    "是否允许显示在报表",
    "是否允许显示在报表弹框",
    "出现顺序",
    "报表出现长度",
    "报表弹框出现长度",
    "报表列对齐",
  ];
  const filterVal = [
    "id",
    "tableCol",
    "jsonCol",
    "reportCol",
    "colType",
    "colLength",
    "isWhereKey",
    "defaultValue",
    "dataEncrypt",
    "queryFilter",
    "orderBy",
    "allowUpdate",
    "allowFilter",
    "allowRequest",
    "allowShowInReport",
    "allowShowInDetail",
    "displaySeq",
    "reportColWidth",
    "detailColWidth",
    "colAlign",
  ];
  const data = formatJsonToArray(serviceColList.value, filterVal);
  exportJsonToExcel(tHeader, data, "serviceCol-" + new Date().getTime(), undefined, undefined, true, "xlsx");
};

const handleReset = () => {
  initServiceCol().then(isSuccess => {
    if (isSuccess) {
      ElNotification.success("重置成功！");
    }
  });
};

const handleRegenerate = () => {
  updateColumn(Number(route.params.serviceId)).then(res => {
    if (res.status === "success") {
      ElNotification.success(res.message);
      initServiceCol();
    }
  });
};

const handleDeleteInvalid = () => {
  deleteInvalidColumn(Number(route.params.serviceId)).then(res => {
    if (res.status === "success") {
      ElNotification.success(res.message);
      initServiceCol();
    }
  });
};

const handleRowClick = (row: ServiceCol) => {
  tempClickRow.value = row;
};

const handleSizeChange = (pagingParams: Paging) => {
  initServiceCol({ pageNo: pagingParams.currentPage, pageSize: pagingParams.pageSize });
  paging.currentPage = pagingParams.currentPage;
  paging.pageSize = pagingParams.pageSize;
};
</script>

<style lang="scss" scoped>
.service-col-container {
  .search-container {
    margin-bottom: 10px;
  }
}
</style>
