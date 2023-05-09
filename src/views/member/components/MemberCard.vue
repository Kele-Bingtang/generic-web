<template>
  <div class="member-card">
    <el-row :gutter="10" class="user-list-item">
      <el-col :span="3" class="item-info">
        <img src="@/assets/images/default_member.jpg" alt="头像" class="avatar" />
      </el-col>
      <el-col :lg="3" :md="3" :sm="3" class="item-info vertical">
        <p>{{ member.username }}</p>
        <el-tag v-if="isCreator && userInfo.username === member.username">创建者</el-tag>
        <el-tag type="info" v-if="!(isCreator && userInfo.username === member.username) && member.role.code">
          {{ member.role.name }}
        </el-tag>
        <el-tag
          v-if="userInfo.username === member.username"
          style="margin-top: 5px; color: #ffffff; background-color: rgb(59 89 153)"
        >
          你自己
        </el-tag>
      </el-col>
      <el-col :lg="4" :md="4" :sm="4" class="item-info">
        <p>{{ member.email }}</p>
      </el-col>
      <el-col :lg="3" :md="3" :sm="3" class="item-info">
        <p>{{ member.phone }}</p>
      </el-col>
      <el-col :lg="1" :md="1" :sm="1" class="item-info">
        <p>{{ getGender(member.gender) }}</p>
      </el-col>
      <el-col :lg="3" :md="3" :sm="3" class="item-info">
        <p>{{ member.birthday }}</p>
      </el-col>
      <el-col :lg="6" :md="6" :sm="6" class="item-info">
        <el-radio-group
          v-model="member.roleSelect"
          @input="(roleCode: string) => handleSelect(roleCode, member)"
          :disabled="!hasPermission(member)"
        >
          <el-tooltip effect="dark" content="只读" placement="top">
            <el-radio label="visitor">游客</el-radio>
          </el-tooltip>
          <el-tooltip effect="dark" content="可编辑、删除" placement="top">
            <el-radio label="developer">开发者</el-radio>
          </el-tooltip>
          <el-tooltip effect="dark" content="可编辑、删除、可修改非管理员权限" placement="top">
            <el-radio label="admin">管理员</el-radio>
          </el-tooltip>
        </el-radio-group>
        <template v-if="hasPermission(member)">
          <el-popconfirm title="这确定删除这个成员吗？" @confirm="handleRemoveMember(member)">
            <template #reference>
              <el-button v-waves link type="danger" icon="Delete">移除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts" name="MemberCard">
import { useUserStore } from "@/stores/user";
import type { Member } from "../index.vue";

const userStore = useUserStore();

interface MemberCardProps {
  member: Member;
  isCreator?: boolean;
  isAdmin?: boolean;
}

interface MemberEmits {
  (e: "select", roleCode: string, member: Member): void;
  (e: "remove", member: Member): void;
}

const props = withDefaults(defineProps<MemberCardProps>(), {
  isCreator: false,
  isAdmin: false,
});

const emits = defineEmits<MemberEmits>();

const userInfo = computed(() => userStore.userInfo);

const hasPermission = (member: Member) => {
  // 自己无法操作自己
  if (userInfo.value.username === member.username) return false;
  // 如果是创建者
  if (props.isCreator) return true;
  // 如果其他人是管理员
  if (userInfo.value.username !== member.username && member.role.code === "admin") return false;
  // 如果自己是管理员
  if (props.isAdmin) return true;
  return false;
};

const getGender = (gender: number) => {
  if (gender === 0) return "保密";
  else if (gender === 1) return "男";
  else if (gender === 2) return "女";
};

const handleSelect = (roleCode: string, member: Member) => {
  emits("select", roleCode, member);
};

const handleRemoveMember = (member: Member) => {
  emits("remove", member);
};
</script>

<style lang="scss" scoped>
.member-card {
  .user-list-item {
    padding: 8px 16px;
    color: rgb(0 0 0 / 85%);
    border-bottom: 1px solid #f0f0f0;

    .item-info {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 60px;
      padding: 0 10px;
      font-size: 14px;
      color: rgb(0 0 0 / 85%);

      &.vertical {
        flex-direction: column;

        & > p {
          margin-top: 0;
          margin-bottom: 6px;
        }
      }

      .avatar {
        width: 50px;
      }
    }
  }
}
</style>
