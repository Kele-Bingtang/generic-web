<template>
  <div class="service-container">
    <div class="btn-container">
      <div class="btn-content">
        <el-input v-model="searchParams.serviceName" placeholder="接口名称" style="width: 200px" />
        <el-input v-model="searchParams.serviceUrl" placeholder="接口地址" style="width: 200px; margin-left: 10px" />
        <el-button v-waves type="primary" icon="Search" @click="handleSearchService()" style="margin-left: 10px">
          查询
        </el-button>
        <el-button v-waves icon="Refresh" @click="handleReset">重置</el-button>
        <el-button v-waves type="warning" icon="Upload" style="float: right" @click="handleExport">导出</el-button>
        <el-button
          v-waves
          type="primary"
          icon="Plus"
          @click="handleAddService()"
          style="float: right"
          :disabled="isVisitor"
        >
          添加
        </el-button>
      </div>
    </div>
    <template v-if="serviceData.length > 0">
      <el-table
        :data="serviceData"
        border
        highlight-current-row
        row-key="id"
        :key="tableKey"
        style="width: 100%"
        v-loading="loading"
        ref="table"
        :tooltip-effect="settings.tooltipEffect"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="serviceName" label="接口名称" width="180px" show-overflow-tooltip>
          <template #default="{ row }">
            <el-button link type="primary" @click="toServiceCol(row)">{{ row.serviceName }}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="reportTitle" label="报表名称" width="180px" show-overflow-tooltip>
          <template #default="{ row }">
            <el-button link type="primary" @click="toReport(row)">{{ row.reportTitle }}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="接口状态" width="100px">
          <template #default="{ row }">
            <el-tag :type="filterStatusTagType(row.status)">{{ row.status === 0 ? "禁用" : "启用" }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="serviceUrl" label="接口地址" show-overflow-tooltip>
          <template #default="{ row }">
            <el-tooltip effect="dark" content="复制接口相对地址" placement="top">
              <el-tag type="info" v-copy="row.serviceUrl">
                {{ row.serviceUrl }}
                <i class="DocumentCopy"></i>
              </el-tag>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="serviceDesc" label="接口描述" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>

        <el-table-column label="操作" width="280px">
          <template #default="{ row }">
            <el-button link type="info" icon="Search" @click="handleReadService(row)">查看</el-button>
            <el-button link type="primary" icon="EditPen" @click="handleEditService(row)" :disabled="isVisitor">
              编辑
            </el-button>
            <el-button link type="danger" icon="Delete" @click="handleDeleteService(row)" :disabled="isVisitor">
              删除
            </el-button>
            <el-dropdown @command="command => handleCommand(command, row)" style="vertical-align: middle">
              <el-button link type="info" icon="ArrowRight" @click="() => {}">更多</el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="handleEditReport" icon="Edit" :disabled="isVisitor">
                    报表编辑
                  </el-dropdown-item>
                  <el-dropdown-item command="handleCopyFullUrl" icon="DocumentCopy">复制完整链接</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>

      <Pagination
        v-show="serviceData.length > 0"
        :total="serviceData.length"
        :paging="paging"
        @pagination="handleSizeChange"
      />
    </template>
    <template v-else>
      <el-empty>
        <el-button v-waves icon="Plus" @click="handleAddService()" :disabled="isVisitor">创建接口</el-button>
      </el-empty>
    </template>

    <DragDrawer
      v-model:visible="serviceDrawer.visible"
      :placement="serviceDrawer.placement"
      v-model:width="serviceDrawer.width"
      :draggable="serviceDrawer.draggable"
      :with-header="serviceDrawer.withHeader"
      :close-on-click-modal="false"
    >
      <ServiceForm
        :data="operateRow"
        :status="operateStatus"
        :base-url="url"
        :table-view-name-list="tableViewNameList"
        @confirm="handleServiceConfirm"
        @cancel="serviceDrawer.visible = false"
      ></ServiceForm>
    </DragDrawer>

    <DragDrawer
      v-model:visible="reportDrawer.visible"
      :placement="reportDrawer.placement"
      v-model:width="reportDrawer.width"
      :draggable="reportDrawer.draggable"
      :with-header="reportDrawer.withHeader"
      :close-on-click-modal="false"
    >
      <ReportForm
        :data="reportSetting"
        :status="operateStatus"
        :base-url="url"
        @confirm="handleReportConfirmAdd"
        @cancel="reportDrawer.visible = false"
      ></ReportForm>
    </DragDrawer>
  </div>
</template>

<script setup lang="ts" name="Service">
import { defaultReportSetting, queryOneReport, updateReport, type ReportModule } from "@/api/report";
import {
  defaultServiceData,
  deleteService,
  insertService,
  queryServiceListPages,
  queryTableViewName,
  updateService,
  type ServiceModule,
} from "@/api/service";
import Pagination, { pageSetting, type Paging } from "@/components/Pagination/index.vue";
import constant from "@/config/constant";
import { useDataStore } from "@/stores/data";
import { useUserStore } from "@/stores/user";
import { message } from "@/utils/layout/message";
import { ElMessageBox, ElNotification } from "element-plus";
import useClipboard from "vue-clipboard3";
import DragDrawer from "@/components/DragDrawer/index.vue";
import ServiceForm from "./components/serviceForm.vue";
import ReportForm from "./components/reportForm.vue";
import { exportJsonToExcel, formatJsonToArray } from "@/utils/excel";
import settings from "@/config/settings";
import { useLayoutStore } from "@/stores/layout";

export interface TableView {
  label: string;
  options: string[];
}

type Service = ServiceModule.Service;
type ServiceInsert = ServiceModule.ServiceInsert;
type ServiceUpdate = ServiceModule.ServiceUpdate;

const props = defineProps<{ categoryId: number }>();

const router = useRouter();
const route = useRoute();
const layoutStore = useLayoutStore();
const userStore = useUserStore();
const dataStore = useDataStore();
const { toClipboard } = useClipboard();

const tableKey = ref(0);
const loading = ref(false);
const paging = reactive({ ...pageSetting });
const serviceData = ref<Service[]>([]);
const reportSetting = ref({ ...defaultReportSetting });
const searchParams = reactive({
  serviceName: "",
  serviceUrl: "",
});
const operateStatus = ref("");

const operateRow = ref({ ...defaultServiceData });
const serviceDrawer = reactive({
  visible: false,
  placement: "right",
  width: 700,
  draggable: true,
  withHeader: false,
});
const reportDrawer = reactive({
  visible: false,
  placement: "right",
  width: 700,
  draggable: true,
  withHeader: false,
});
const tableViewNameList = ref<TableView[]>([]);

const url = computed(() => import.meta.env.VITE_API_URL + "/generic-api" + route.query.baseUrl);
const isVisitor = computed(() => dataStore.isVisitor);

onMounted(() => {
  loading.value = false;
  initServiceList({ pageNo: 1, pageSize: 20 });
});

const fullPath = route.fullPath;
onBeforeUnmount(() => {
  // 关闭所有相关的页面
  const pathList = layoutStore.tabNavList.map(item => item.path);
  if (!pathList.includes(fullPath)) {
    serviceData.value.forEach(item => {
      layoutStore.batchRemoveTab([
        `/project/service-col/${item.serviceName}/${item.id}`,
        `/project/report/${item.reportTitle}/${item.id}/${dataStore.project.secretKey}`,
      ]);
    });
  }
});

const initServiceList = (page?: http.Page) => {
  const { project } = dataStore;
  const isSuccess = queryServiceListPages(page, { projectId: project.id, categoryId: props.categoryId }).then(res => {
    if (res.status === "success") {
      serviceData.value = res.data;
      return true;
    } else {
      return false;
    }
  });
  return isSuccess;
};

const initTableViewNameList = () => {
  if (!Object.keys(tableViewNameList.value).length) {
    const { project } = dataStore;
    if (project.databaseName) {
      queryTableViewName(project.databaseName).then(res => {
        if (res.status === "success") {
          const tableList = res.data.table;
          const viewList = res.data.view;
          tableViewNameList.value = [
            {
              label: "table",
              options: tableList,
            },
            {
              label: "view",
              options: viewList,
            },
          ];
        }
      });
    }
  }
};

const filterStatusTagType = (status: number) => {
  return constant.serviceStatusType[status] as "warning" | "success";
};

const onSuccess = () => {
  message.success("复制成功！");
};

// 查询数据
const handleSearchService = () => {
  loading.value = true;
  const { serviceName, serviceUrl } = searchParams;
  if (serviceName === "" && serviceUrl === "") {
    loading.value = false;
    initServiceList();
    return;
  }
  queryServiceListPages({ pageNo: 1, pageSize: 20 }, { serviceName, serviceUrl }).then(res => {
    if (res.status === "success") {
      serviceData.value = res.data;
    }
  });
  loading.value = false;
};

const handleReset = () => {
  initServiceList().then(isSuccess => {
    if (isSuccess) {
      ElNotification.success("重置成功！");
    }
  });
};

const handleAddService = () => {
  operateRow.value = { ...defaultServiceData } as Service;
  operateStatus.value = "add";
  serviceDrawer.visible = true;
  initTableViewNameList();
};

const handleReadService = (row: Service) => {
  operateRow.value = Object.assign({}, row);
  operateStatus.value = "read";
  serviceDrawer.visible = true;
  initTableViewNameList();
};

const handleEditService = (row: Service) => {
  operateRow.value = Object.assign({}, row);
  operateStatus.value = "edit";
  serviceDrawer.visible = true;
  initTableViewNameList();
};

const handleServiceConfirm = (form: Service, status: string) => {
  const data: Partial<Service> = { ...form };
  const { username } = userStore.userInfo;
  if (status === "add") {
    // 删除 Insert 不允许的数据
    delete data.id;
    delete data.createTime;
    delete data.modifyTime;
    // 添加 Insert 需要的其他数据
    data.fullUrl = url.value + data.serviceUrl;
    data.projectId = dataStore.project.id;
    data.categoryId = dataStore.category.id;
    data.createUser = username;
    data.modifyUser = username;
    addServiceData(data as ServiceInsert);
  } else if (status === "edit") {
    // 删除 Update 不允许的数据
    delete data.createUser;
    delete data.createTime;
    delete data.modifyTime;
    delete data.projectId;
    delete data.categoryId;
    // 添加 Update 需要的其他数据
    data.modifyUser = username;
    editServiceData(data as ServiceUpdate);
  }
};

const handleReportConfirmAdd = (form: ReportModule.Report) => {
  const data: Partial<ReportModule.Report> = { ...form };
  const { username } = userStore.userInfo;
  // 删除 Update 不允许的数据
  delete data.createUser;
  delete data.createTime;
  delete data.modifyTime;
  delete data.serviceId;
  // 添加 Update 需要的其他数据
  data.modifyUser = username;
  updateReport(data as ReportModule.ReportUpdate).then(res => {
    if (res.status === "success") {
      ElNotification.success("更新报表成功！");
      initServiceList({ pageNo: 1, pageSize: 20 });
      reportDrawer.visible = false;
    }
  });
};

const addServiceData = (form: ServiceInsert) => {
  insertService(form).then(res => {
    if (res.status === "success") {
      ElNotification.success("添加接口成功！");
      initServiceList({ pageNo: 1, pageSize: 20 });
      serviceDrawer.visible = false;
    }
  });
};

const editServiceData = (form: ServiceUpdate) => {
  updateService(form).then(res => {
    if (res.status === "success") {
      ElNotification.success("更新接口成功！");
      initServiceList({ pageNo: 1, pageSize: 20 });
      serviceDrawer.visible = false;
    }
  });
};

const handleDeleteService = (row: Service) => {
  ElMessageBox.confirm("此操作将永久删除该数据, 是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      deleteService(row).then(async res => {
        if (res.status === "success") {
          ElNotification.success("删除成功！");
          await layoutStore.batchRemoveTab([
            `/project/service-col/${row.serviceName}/${row.id}`,
            `/project/report/${row.reportTitle}/${row.id}/${dataStore.project.secretKey}`,
          ]);
          initServiceList({ pageNo: 1, pageSize: 20 });
        }
      });
    })
    .catch(() => {});
};

const handleCommand = (command: string, row: Service) => {
  if (command === "handleEditReport") {
    queryOneReport({ serviceId: row.id }).then(res => {
      reportSetting.value = res.data;
      operateStatus.value = "edit";
      reportDrawer.visible = true;
    });
  } else if (command === "handleCopyFullUrl") {
    toClipboard(`${row.fullUrl}?secretKey=${dataStore.project.secretKey}`).then(() => {
      onSuccess();
    });
  }
};

const toServiceCol = (row: Service) => {
  router.push(`/project/service-col/${row.serviceName}/${row.id}/${dataStore.project.secretKey}`);
};

const toReport = (row: Service) => {
  router.push(`/project/report/${row.reportTitle}/${row.id}/${dataStore.project.secretKey}`);
};

const handleSizeChange = (pagingParams: Paging) => {
  initServiceList({ pageNo: pagingParams.currentPage, pageSize: pagingParams.pageSize });
  paging.currentPage = pagingParams.currentPage;
  paging.pageSize = pagingParams.pageSize;
};

const handleExport = () => {
  const tHeader = [
    "id",
    "接口名称",
    "接口地址",
    "完整地址",
    "接口状态",
    "接口描述",
    "接口 SQL",
    "查询表名/视图",
    "插入表名/视图",
    "更新表名/视图",
    "删除表名/视图",
    "创建时间",
  ];
  const filterVal = [
    "id",
    "serviceName",
    "serviceUrl",
    "fullUrl",
    "status",
    "serviceDesc",
    "selectSql",
    "selectTable",
    "insertTable",
    "updateTable",
    "deleteTable",
    "createTime",
  ];
  const data = formatJsonToArray(serviceData.value, filterVal);
  exportJsonToExcel(tHeader, data, "service-" + new Date().getTime(), undefined, undefined, true, "xlsx");
};
</script>

<style lang="scss" scoped>
.service-container {
  .btn-container {
    margin-bottom: 10px;
  }
}
</style>
