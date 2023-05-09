<template>
  <div class="category-container" v-if="projectSecretKey">
    <el-card shadow="never" class="category-info">
      <el-row :gutter="10" style="height: 100%">
        <el-col :span="18" style="height: 100%; border-right: 1px solid #f0f0f0">
          <div class="project-info">
            <div class="info-item">
              <span>接口地址</span>
              <span>{{ url }}</span>
              <el-icon class="copy-icon" v-copy="url"><DocumentCopy /></el-icon>
            </div>
            <div class="info-item">
              <span>项目密钥</span>
              <span>{{ projectSecretKey }}</span>
              <el-icon class="copy-icon" v-copy="projectSecretKey"><DocumentCopy /></el-icon>
            </div>
          </div>
        </el-col>
        <el-col :span="4" style="height: 100%">
          <div class="project-action">
            <el-button v-waves plain type="primary" icon="UserFilled" @click="handleEnterMember">项目成员</el-button>
            <el-button
              v-waves
              plain
              type="danger"
              icon="CaretRight"
              @click="handleLeaveProject"
              v-if="userInfo.username !== project.createUser"
            >
              退出项目
            </el-button>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <el-card shadow="never">
      <el-tabs
        v-model="activeName"
        type="card"
        :addable="!isVisitor"
        @tab-click="clickTab"
        @tab-add="addTab"
        @tab-remove="removeTab"
      >
        <el-tab-pane
          v-for="item in tabs"
          :key="item.id"
          :label="item.title"
          :name="item.name"
          :closable="item.closable"
          :lazy="true"
        >
          <ServiceTable :category-id="item.id" v-if="activeName === item.name" />
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <el-dialog draggable title="创建目录" v-model="dialogVisible" width="30%">
      <el-form ref="categoryFormRef" :model="categoryForm" :rules="categoryRules" label-width="80px">
        <el-form-item label="目录编码" prop="categoryCode">
          <el-input v-model="categoryForm.categoryCode" placeholder="请输入目录编码，且英文"></el-input>
        </el-form-item>
        <el-form-item label="目录名称" prop="categoryName">
          <el-input v-model="categoryForm.categoryName" placeholder="请输入目录名称"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button v-waves @click="dialogVisible = false">取 消</el-button>
          <el-button v-waves type="primary" @click="addTabConfirm">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="Category">
import ServiceTable from "@/views/service/index.vue";
import { useUserStore } from "@/stores/user";
import { useDataStore } from "@/stores/data";
import { message } from "@/utils/layout/message";
import { deleteCategory, queryCategoryList, insertCategory } from "@/api/category";
import { defaultProjectData, queryGenericOneProject } from "@/api/project";
import { removeOneMember } from "@/api/user";
import { ElMessageBox, ElNotification, type FormInstance, type TabPaneName, type TabsPaneContext } from "element-plus";

interface CategoryTab {
  id: number;
  title: string;
  name: string;
  closable: boolean;
}

const defaultTabData: CategoryTab = {
  id: -1,
  title: "默认目录",
  name: "default",
  closable: false,
};

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const dataStore = useDataStore();
const categoryFormRef = shallowRef<FormInstance>();

const activeName = ref("default");
const dialogVisible = ref(false);
const project = ref({ ...defaultProjectData });
const tabs = ref<CategoryTab[]>([]);
const categoryForm = reactive({
  categoryCode: "",
  categoryName: "",
});
const categoryRules = {
  categoryCode: [{ required: true, message: "请输入目录名编码，且英文", trigger: "change" }],
  categoryName: [{ required: true, message: "请输入目录名称", trigger: "change" }],
};

const url = computed(() => import.meta.env.VITE_API_URL + "/generic-api" + route.query.baseUrl);
const projectSecretKey = computed(() => route.params && (route.params.secretKey as string));
const userInfo = computed(() => userStore.userInfo);
const isVisitor = computed(() => dataStore.isVisitor);

onBeforeMount(() => {
  initCategory();
});

const initCategory = async () => {
  if (!projectSecretKey.value) {
    message.error("无效链接");
    return;
  }
  await initProject();
  queryCategoryList({ projectId: project.value.id }).then(res => {
    if (res.status === "success" && res.data.length > 0) {
      tabs.value = [];
      res.data.forEach((item, index) => {
        const category = {
          id: item.id,
          title: item.categoryName,
          name: item.categoryCode,
          closable: index !== 0,
        };
        tabs.value.push(category);
      });
      if (tabs.value.length === 0) {
        message.error("获取目录信息失败");
      } else if (tabs.value.length > 1 && tabs.value[0].name !== "default") {
        // 确保默认目录在第一个
        let defaultTab = { ...defaultTabData };
        tabs.value.filter(item => {
          if (item.name === defaultTabData.name) {
            defaultTab = item;
          } else {
            return true;
          }
        });
        defaultTab && tabs.value.unshift(defaultTab);
      }
      // 默认激活第一个目录
      activeName.value = tabs.value[0].name;
      // 默认进入第一个目录
      dataStore.updateCategory(tabs.value[0]);
    } else {
      message.error("获取目录信息失败");
    }
  });
};

const initProject = async () => {
  // 如果切换项目或不通过项目进来，而是链接进来则需要更新
  if (dataStore.project.id === -1 || dataStore.project.secretKey !== projectSecretKey.value) {
    const res = await queryGenericOneProject(projectSecretKey.value);
    project.value = res.data;
    dataStore.updateProject(res.data);
  } else project.value = dataStore.project;
};

const handleLeaveProject = () => {
  removeOneMember(userInfo.value.username, project.value.id as number).then(res => {
    if (res.status === "success") {
      ElNotification.success("离开项目成功");
      router.push("/project");
    }
  });
};

const clickTab = (pane: TabsPaneContext) => {
  const tab = tabs.value.filter(tab => tab.name === pane.paneName);
  dataStore.updateCategory(tab[0]);
};

const addTab = () => {
  dialogVisible.value = true;
  nextTick(() => {
    categoryFormRef.value?.clearValidate();
  });
};

const addTabConfirm = () => {
  categoryFormRef.value?.validate(valid => {
    if (valid) {
      const { username } = userInfo.value;
      const form = { ...categoryForm, projectId: project.value.id || -1, createUser: username, modifyUser: username };
      insertCategory(form).then(res => {
        if (res.status === "success") {
          ElNotification.success("新增目录成功！");
          initCategory();
          dialogVisible.value = false;
        }
      });
    } else {
      return false;
    }
  });
};

const removeTab = (targetName: TabPaneName) => {
  ElMessageBox.confirm("此操作将永久删除该目录, 是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    let targetTab = { ...defaultTabData };
    tabs.value.forEach(tab => {
      if (tab.name === targetName) {
        targetTab = tab;
      }
    });
    if (targetTab && targetTab.id !== defaultTabData.id) {
      deleteCategory({ id: targetTab.id }).then(res => {
        if (res.status === "success") {
          ElNotification.success("新增目录成功！");
        }
      });
    } else {
      message.warning("删除失败，必须保留一个目录");
    }
    if (activeName.value === targetName) {
      // 获取最后一个 tab
      const lastTab = tabs.value.slice(-1)[0];
      activeName.value = lastTab.name;
    }
    tabs.value = tabs.value.filter(tab => tab.name !== targetName);
  });
};

const handleEnterMember = () => {
  router.push(`/project/member/${projectSecretKey.value}`);
};
</script>

<style lang="scss" scoped>
.category-container {
  .category-info {
    height: 130px;
    margin-bottom: 10px;

    .project-info {
      .info-item {
        position: relative;
        display: flex;
        align-items: center;
        height: 32px;
        padding-left: 135px;
        margin-bottom: 10px;
        font-size: 14px;
        line-height: 32px;
        background-color: rgb(68 82 213 / 9.41%);
        border-radius: 16px;

        & > span:first-child {
          position: absolute;
          top: 0;
          left: 0;
          display: inline-block;
          width: 120px;
          height: 32px;
          line-height: 32px;
          color: #ffffff;
          text-align: center;
          background-color: #4579ee;
          border-top-left-radius: 16px;
          border-bottom-left-radius: 16px;
        }

        .copy-icon {
          position: absolute;
          right: 10px;
          line-height: inherit;
          cursor: pointer;
        }
      }
    }

    .project-action {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
    }
  }
}
</style>
