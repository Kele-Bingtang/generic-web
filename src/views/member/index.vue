<template>
  <div class="member-container">
    <el-card class="member-title-card">
      <el-row :gutter="10">
        <el-col :span="1">
          <div class="member-logo">
            <svg-icon name="members" width="28" height="28" />
          </div>
        </el-col>
        <el-col :span="16">
          <div class="member-description">
            <p class="description-title">
              <span style="color: var(--theme-color)">{{ project.projectName }}</span>
              - 项目成员
            </p>
            <p class="description-content">项目成员管理，可以将已存在的用户添加到你的项目</p>
          </div>
        </el-col>
        <el-col :span="7">
          <div class="member-action">
            <el-button v-waves type="primary" icon="el-icon-plus" circle></el-button>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <el-card class="member-user-card">
      <member-card
        v-for="item in memberList"
        :key="item.username"
        :member="item"
        :is-creator="isCreator"
        :is-admin="isAdmin"
        @select="handleSelectPermission"
      />
    </el-card>
  </div>
</template>

<script lang="ts">
import { defaultProjectData, queryGenericOneProject } from "@/api/project";
import { queryMemberInProject, updateUserRole, UserInfoModule } from "@/api/user";
import { DataModule } from "@/store/modules/data";
import { UserModule } from "@/store/modules/user";
import message from "@/utils/message";
import notification from "@/utils/notification";
import { Component, Vue } from "vue-property-decorator";
import MemberCard from "./components/MemberCard.vue";

export type Member = Omit<UserInfoModule.User, "id" | "password"> & {
  roleSelect: string; // 修改角色的 code
};

@Component({
  components: { MemberCard },
})
export default class GenericMember extends Vue {
  public memberList: Array<Member> = [];
  public project = { ...defaultProjectData };
  public isCreator = false; // 是否是项目的创建者
  public isAdmin = false; // 是否是项目的管理员，创建者一定是管理者

  mounted() {
    let { secretKey } = this.$route.params;
    if (secretKey) {
      this.updateProject(secretKey);
      this.initMember(secretKey);
    } else {
      message.error("无法获取成员信息，密钥无效！");
    }
  }

  public async updateProject(secretKey: string) {
    // 如果不通过项目进来，而是链接进来，则需要更新
    if (DataModule.project.id === -1) {
      let res = await queryGenericOneProject(secretKey);
      this.project = res.data;
      DataModule.updateProject(res.data);
    } else {
      this.project = DataModule.project;
    }
  }

  public initMember(secretKey: string) {
    queryMemberInProject(secretKey).then(res => {
      if (res.status === "success") {
        this.memberList = res.data as unknown as Array<Member>;
        for (let i = 0; i < this.memberList.length; i++) {
          let member = this.memberList[i];
          // 修改角色需要
          this.$set(member, "roleSelect", member.role.code);
          let { username } = UserModule.userInfo;
          let { createUser } = this.project;
          // 找到自己
          if (member.username === username) {
            createUser === username ? (this.isCreator = true) : (this.isCreator = false);
            member.role.code === "admin" ? (this.isAdmin = true) : (this.isAdmin = false);
            break;
          }
        }
      }
    });
  }

  public handleSelectPermission(roleCode: string, member: Member) {
    let { secretKey } = this.$route.params;
    if (!secretKey) {
      message.warning("您没有权限更新");
    }
    let { username } = member;
    updateUserRole(username, secretKey, roleCode).then(res => {
      if (res.status === "success") {
        notification.success(res.data);
      }
    });
  }
}
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
      background: #4579ee;
      border-radius: 4px;
      box-shadow: 0 10px 50px rgb(12 73 25 / 40%);
      color: #fff;
      font-size: 28px;
      text-align: center;
      line-height: 50px;
    }
    .member-description {
      .description-title {
        margin: 0;
        font-size: 18px;
        font-weight: 700;
        color: rgba(0, 0, 0, 0.85);
        line-height: 1.9;
      }
      .description-content {
        margin: 0;
        font-size: 12px;
        color: #9a9ca0;
        font-weight: 400;
      }
    }
    .member-action {
      height: 50px;
      line-height: 50px;
      text-align: right;
    }
  }
  .member-user-card {
    margin: 15px 0px;
  }
}
</style>
