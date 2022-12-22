<template>
  <div class="member-card">
    <el-row :gutter="10" class="user-list-item">
      <el-col :span="3" class="item-info">
        <img src="@/assets/default_member.jpg" alt="头像" class="avatar" />
      </el-col>
      <el-col :lg="3" :md="3" :sm="3" class="item-info vertical">
        <p>{{ member.username }}</p>
        <el-tag type="primary" v-if="isCreator && userInfo.username === member.username">创建者</el-tag>
        <el-tag type="info" v-if="!(isCreator && userInfo.username === member.username) && member.role.code">
          {{ member.role.name }}
        </el-tag>
        <el-tag
          v-if="userInfo.username === member.username"
          style="color: #fff; background-color: rgb(59, 89, 153); margin-top: 5px"
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
        <p>{{ member.gender }}</p>
      </el-col>
      <el-col :lg="3" :md="3" :sm="3" class="item-info">
        <p>{{ member.birthday }}</p>
      </el-col>
      <el-col :lg="6" :md="6" :sm="6" class="item-info">
        <el-radio-group
          v-model="member.roleSelect"
          @input="roleCode => handleSelect(roleCode, member)"
          :disabled="!hasPermission(member)"
        >
          <el-tooltip effect="dark" content="只读" placement="top">
            <el-radio label="visitor">游客</el-radio>
          </el-tooltip>
          <el-tooltip effect="dark" content="可编辑" placement="top">
            <el-radio label="developer">开发者</el-radio>
          </el-tooltip>

          <el-tooltip effect="dark" content="可编辑、可修改非管理员权限" placement="top">
            <el-radio label="admin">管理员</el-radio>
          </el-tooltip>
          <el-popconfirm title="这确定删除这个成员吗？" @confirm="handleRemoveMember(member)">
            <el-button
              v-waves
              type="text"
              icon="el-icon-delete"
              class="btn-danger"
              slot="reference"
              v-if="hasPermission(member)"
            >
              移除
            </el-button>
          </el-popconfirm>
        </el-radio-group>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { DataModule } from "@/store/modules/data";
import { UserModule } from "@/store/modules/user";
import { Component, Prop, Vue } from "vue-property-decorator";
import { Member } from "../index.vue";

@Component({})
export default class MemberCard extends Vue {
  @Prop({ required: true })
  public member!: Member;
  @Prop({ default: false })
  public isCreator!: Member;
  @Prop({ default: false })
  public isAdmin!: Member;

  get userInfo() {
    return UserModule.userInfo;
  }

  get currentProject() {
    return DataModule.project;
  }

  public hasPermission(member: Member) {
    let { userInfo, isCreator, isAdmin } = this;
    // 自己无法操作自己
    if (userInfo.username === member.username) {
      return false;
    }
    // 如果是创建者
    if (isCreator) {
      return true;
    }
    // 如果其他人是管理员
    if (userInfo.username !== member.username && member.role.code === "admin") {
      return false;
    }
    // 如果自己是管理员
    if (isAdmin) {
      return true;
    }
    return false;
  }

  public handleSelect(roleCode: string, member: Member) {
    this.$emit("select", roleCode, member);
  }

  public handleRemoveMember(member: Member) {
    this.$emit("remove", member);
  }
}
</script>

<style lang="scss" scoped>
.member-card {
  .user-list-item {
    padding: 8px 16px;
    color: rgba(0, 0, 0, 0.85);
    border-bottom: 1px solid #f0f0f0;
    .item-info {
      min-height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 10px;
      color: rgba(0, 0, 0, 0.85);
      font-size: 14px;
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
