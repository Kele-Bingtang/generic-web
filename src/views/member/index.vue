<template>
  <div class="member-container">
    <el-card class="member-title-card">
      <el-row :gutter="10">
        <el-col :lg="1" :md="3" :sm="3" :xs="5">
          <div class="member-logo">
            <svg-icon name="members" width="28" height="28" />
          </div>
        </el-col>
        <el-col :lg="16" :md="16" :sm="14" :xs="15">
          <div class="member-description">
            <p class="description-title">
              <span style="color: var(--el-color-primary)">{{ project.projectName }}</span>
              - 项目成员
            </p>
            <p class="description-content">项目成员管理，可以将已存在的用户添加到你的项目</p>
          </div>
        </el-col>
        <el-col :lg="7" :md="5" :sm="7" :xs="4">
          <div class="member-action">
            <el-button
              v-waves
              type="primary"
              icon="Plus"
              circle
              @click="getOtherUserInfo"
              :disabled="!isAdmin || !isCreator"
            ></el-button>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <div class="member-user-card">
      <el-card v-if="showAddMember">
        <div class="add-member">
          <el-select
            v-model="selectMember"
            filterable
            clearable
            multiple
            collapse-tags
            :max-collapse-tags="2"
            reserve-keyword
            remote
            :remote-method="remoteMethod"
            class="info-selection"
          >
            <el-option v-for="item in queryUserInfo" :key="item.username" :value="item.username">
              <span>{{ item.username }}</span>
              <span>-</span>
              <span>{{ item.email }}</span>
              <span style="float: right; font-size: 13px; color: #8492a6">
                <el-tag v-if="item.status === 1" :type="getUserStatus(item.status + '')">在线</el-tag>
                <el-tag v-if="item.status === 0" :type="getUserStatus(item.status + '')">离线</el-tag>
              </span>
            </el-option>
          </el-select>
          <el-button v-waves type="primary" @click="confirmAddMember">确认添加</el-button>
          <el-button v-waves type="danger" plain icon="Close" @click="showAddMember = false">取消</el-button>
        </div>
      </el-card>

      <el-card>
        <MemberCard
          v-for="item in memberList"
          :key="item.username"
          :member="item"
          :is-creator="isCreator"
          :is-admin="isAdmin"
          @select="handleSelectPermission"
          @remove="handleRemoveMember"
        />
      </el-card>
    </div>
  </div>
</template>

<script lang="ts">
export type Member = Omit<UserInfoModule.User, "id" | "password"> & {
  roleSelect: string; // 修改角色的 code
};
</script>

<script setup lang="ts" name="Member">
import { defaultProjectData, queryGenericOneProject } from "@/api/project";
import {
  addMember,
  queryAllMemberNotInProject,
  queryGenericUserRole,
  queryMemberInProject,
  removeOneMember,
  updateUserRole,
  type UserInfoModule,
} from "@/api/user";
import { useDataStore } from "@/stores/data";
import { useUserStore } from "@/stores/user";
import { message } from "@/utils/layout/message";
import { ElNotification } from "element-plus";
import MemberCard from "./components/MemberCard.vue";

const userStatus: { [key: string]: string } = {
  0: "info",
  1: "success",
};

const dataStore = useDataStore();
const userStore = useUserStore();
const route = useRoute();

const memberList = ref<Member[]>([]);
const project = ref({ ...defaultProjectData });
const isCreator = ref(false); // 是否是项目的创建者
const isAdmin = ref(false); // 是否是项目的管理员，创建者一定是管理者

const allUserInfo = ref<UserInfoModule.User[]>([]);
const queryUserInfo = ref<UserInfoModule.User[]>([]);
const showAddMember = ref(false);
const selectMember = ref<string[]>([]); // 选择的成员

onMounted(async () => {
  const { secretKey } = route.params;
  if (secretKey) {
    await initProject(secretKey as string);
    initUserRole(secretKey as string);
    initMember(secretKey as string);
  } else message.error("无法获取成员信息，密钥无效！");
});

const initProject = async (secretKey: string) => {
  // 如果不通过项目进来，而是链接进来，则需要更新
  if (dataStore.project.id === -1) {
    const res = await queryGenericOneProject(secretKey);
    project.value = res.data;
    dataStore.updateProject(res.data);
  } else project.value = dataStore.project;
};

const initUserRole = (secretKey: string) => {
  queryGenericUserRole(secretKey).then(res => {
    if (res.status === "success") {
      dataStore.updateUserRole(res.data);
    }
  });
};

const initMember = (secretKey: string) => {
  queryMemberInProject(secretKey).then(res => {
    if (res.status === "success") {
      memberList.value = res.data as unknown as Member[];
      memberList.value.forEach(member => {
        // 修改角色需要
        member.roleSelect = member.role.code;
        const { username } = userStore.userInfo;
        const { createUser } = project.value;
        // 找到自己
        if (member.username === username) {
          createUser === username ? (isCreator.value = true) : (isCreator.value = false);
          member.role.code === "admin" ? (isAdmin.value = true) : (isAdmin.value = false);
        }
      });
    }
  });
};

const remoteMethod = (query: string) => {
  if (query) {
    queryUserInfo.value = allUserInfo.value.filter(item => {
      return (
        item.username.toLowerCase().includes(query.toLowerCase()) ||
        item.email.toLowerCase().includes(query.toLowerCase())
      );
    });
  } else {
    queryUserInfo.value = [];
  }
};

const handleSelectPermission = (roleCode: string, member: Member) => {
  const { username } = member;
  updateUserRole(username, project.value.id as number, roleCode).then(res => {
    if (res.status === "success") {
      ElNotification.success(res.message);
    }
  });
};

const getOtherUserInfo = () => {
  // 获取所有的用户列表
  queryAllMemberNotInProject(project.value.secretKey as string).then(res => {
    allUserInfo.value = res.data;
  });
  showAddMember.value = true;
};

const getUserStatus = (status: string) => {
  return userStatus[status] as "info" | "success";
};

const confirmAddMember = () => {
  const usernameList: { username: string }[] = [];
  selectMember.value.forEach(item => {
    usernameList.push({
      username: item,
    });
  });
  addMember(project.value.id as number, usernameList).then(res => {
    if (res.status === "success") {
      initMember(project.value.secretKey as string);
      getOtherUserInfo();
      ElNotification.success("添加成员成功");
      // infoSelection.value.clearSelection();
    }
  });
};

const handleRemoveMember = (member: Member) => {
  removeOneMember(member.username, project.value.id as number).then(res => {
    if (res.status === "success") {
      initMember(project.value.secretKey as string);
      // 只有打开添加成员下拉框，才重新获取成员，否则不请求，减少请求次数
      showAddMember.value ? getOtherUserInfo() : "";
      ElNotification.success("删除成员成功");
    }
  });
};
</script>

<style lang="scss" scoped>
.member-container {
  padding: 20px;

  .member-title-card {
    height: 100px;
    padding: 0 25px;

    .member-logo {
      width: 50px;
      height: 50px;
      font-size: 28px;
      line-height: 50px;
      color: #ffffff;
      text-align: center;
      background: #4579ee;
      border-radius: 4px;
      box-shadow: 0 10px 50px rgb(12 73 25 / 40%);
    }

    .member-description {
      .description-title {
        margin: 0;
        font-size: 18px;
        font-weight: 700;
        line-height: 1.9;
        color: rgb(0 0 0 / 85%);
      }

      .description-content {
        margin: 0;
        font-size: 12px;
        font-weight: 400;
        color: #9a9ca0;
      }
    }

    .member-action {
      height: 50px;
      line-height: 50px;
      text-align: right;
    }
  }

  .member-user-card {
    margin: 15px 0;

    .add-member {
      width: 540px;
      margin: 10px auto;

      .info-selection {
        display: inline-block;
        width: 320px;
      }
    }
  }
}
</style>
