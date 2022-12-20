<template>
  <div class="member-card">
    <ul class="user-list">
      <li class="user-list-item">
        <div class="item-info">
          <img src="@/assets/default_member.jpg" alt="头像" class="avatar" />
        </div>
        <div class="item-info vertical">
          <p>{{ member.username }}</p>
          <el-tag type="primary" v-if="isCreator">创建者</el-tag>
          <el-tag type="danger" v-if="!isCreator && member.role.code" style="margin-top: 5px">
            {{ member.role.name }}
          </el-tag>
          <el-tag
            v-if="userInfo.username === member.username"
            style="color: #fff; background-color: rgb(59, 89, 153); margin-top: 5px"
          >
            你自己
          </el-tag>
        </div>
        <div class="item-info" v-if="member.email">
          <p>{{ member.email }}</p>
        </div>
        <div class="item-info" v-if="member.phone">
          <p>{{ member.phone }}</p>
        </div>
        <div class="item-info" v-if="member.gender">
          <p>{{ member.gender }}</p>
        </div>
        <div class="item-info" v-if="member.birthday">
          <p>{{ member.birthday }}</p>
        </div>
        <div class="item-info">
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
          </el-radio-group>
        </div>
      </li>
    </ul>
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
      return true;
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
}
</script>

<style lang="scss" scoped>
.member-card {
  .user-list {
    margin: 0;
    padding: 0;
    list-style: none;
    .user-list-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 16px;
      color: rgba(0, 0, 0, 0.85);
      border-bottom: 1px solid #f0f0f0;
      .item-info {
        min-height: 40px;
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
            margin-bottom: 4px;
          }
        }
        .avatar {
          width: 50px;
        }
      }
    }
  }
}
</style>
