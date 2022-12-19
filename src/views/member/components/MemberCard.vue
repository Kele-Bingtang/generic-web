<template>
  <div class="member-card">
    <ul class="user-list">
      <li class="user-list-item">
        <div class="item-info">
          <img src="@/assets/default_member.jpg" alt="头像" class="avatar" />
        </div>
        <div class="item-info vertical">
          <p>{{ data.username }}</p>
          <el-tag v-if="userInfo.username === data.username" style="color: #fff; background-color: rgb(59, 89, 153)">
            你自己
          </el-tag>
          <el-tag v-if="currentProject.createUser === data.username">创建者</el-tag>
        </div>
        <div class="item-info" v-if="data.email">
          <p>{{ data.email }}</p>
        </div>
        <div class="item-info" v-if="data.phone">
          <p>{{ data.phone }}</p>
        </div>
        <div class="item-info" v-if="data.gender">
          <p>{{ data.gender }}</p>
        </div>
        <div class="item-info" v-if="data.birthday">
          <p>{{ data.birthday }}</p>
        </div>
        <div class="item-info">
          <el-radio-group v-model="radio" @input="handleSelect">
            <el-radio label="1">只读</el-radio>
            <el-radio label="2">可编辑</el-radio>
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
  public data!: Member;

  public radio = "2";

  get userInfo() {
    return UserModule.userInfo;
  }

  get currentProject() {
    return DataModule.project;
  }

  public handleSelect(label: string) {
    this.$emit("select", label);
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
