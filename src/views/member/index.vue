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
            <el-button v-waves type="primary" icon="el-icon-plus" circle @click="handleAddMember"></el-button>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <div class="member-user-card">
      <el-card v-if="showAddMember">
        <div class="add-member">
          <info-selection
            ref="infoSelection"
            :list="allUserInfo"
            id="username"
            separator=" "
            multiple
            onlySearch
            @change="handleSelectMember"
            class="info-selection"
          >
            <template #default="{ option }">
              <span>{{ option.username }}</span>
              <span>-</span>
              <span>{{ option.email }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">
                <el-tag v-if="option.status === '在线'" :type="getUserStatus(option.status)">
                  {{ option.status }}
                </el-tag>
                <el-tag v-if="option.status === '离线'" :type="getUserStatus(option.status)">
                  {{ option.status }}
                </el-tag>
              </span>
            </template>
          </info-selection>
          <el-button v-waves type="primary" @click="confirmAddMember">确认添加</el-button>
          <el-button v-waves type="danger" plain icon="el-icon-close" @click="showAddMember = false">取消</el-button>
        </div>
      </el-card>

      <el-card>
        <member-card
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
import { defaultProjectData, queryGenericOneProject } from "@/api/project";
import {
  addMember,
  queryMemberInProject,
  queryAllMemberNotInProject,
  updateUserRole,
  UserInfoModule,
  removeOneMember,
} from "@/api/user";
import { DataModule } from "@/store/modules/data";
import { UserModule } from "@/store/modules/user";
import message from "@/utils/message";
import notification from "@/utils/notification";
import { Component, Vue } from "vue-property-decorator";
import MemberCard from "./components/MemberCard.vue";
import InfoSelection from "@/components/InfoSelection/index.vue";

export type Member = Omit<UserInfoModule.User, "id" | "password"> & {
  roleSelect: string; // 修改角色的 code
};

@Component({
  components: { MemberCard, InfoSelection },
})
export default class GenericMember extends Vue {
  public memberList: Array<Member> = [];
  public project = { ...defaultProjectData };
  public isCreator = false; // 是否是项目的创建者
  public isAdmin = false; // 是否是项目的管理员，创建者一定是管理者

  public allUserInfo: Array<UserInfoModule.User> = [];
  public showAddMember = false;
  public userStatus: { [key: string]: string } = {
    在线: "success",
    离线: "info",
  };
  public selectMember: string[] = []; // 选择的成员

  async mounted() {
    let { secretKey } = this.$route.params;
    if (secretKey) {
      await this.updateProject(secretKey);
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
        this.memberList.forEach(member => {
          // 修改角色需要
          this.$set(member, "roleSelect", member.role.code);
          let { username } = UserModule.userInfo;
          let { createUser } = this.project;
          // 找到自己
          if (member.username === username) {
            createUser === username ? (this.isCreator = true) : (this.isCreator = false);
            member.role.code === "admin" ? (this.isAdmin = true) : (this.isAdmin = false);
          }
        });
      }
    });
  }

  public handleSelectPermission(roleCode: string, member: Member) {
    let { username } = member;
    updateUserRole(username, this.project.id as number, roleCode).then(res => {
      if (res.status === "success") {
        notification.success(res.data);
      }
    });
  }

  public handleAddMember() {
    this.getOtherUserInfo();
  }

  public getOtherUserInfo() {
    // 获取所有的用户列表
    queryAllMemberNotInProject(this.project.secretKey as string).then(res => {
      this.allUserInfo = res.data;
    });
    this.showAddMember = true;
  }

  public getUserStatus(status: string) {
    return this.userStatus[status];
  }

  public handleSelectMember(selectValue: string[]) {
    this.selectMember = selectValue;
  }

  public confirmAddMember() {
    let usernameList: Array<{ username: string }> = [];
    this.selectMember.forEach(item => {
      usernameList.push({
        username: item,
      });
    });
    addMember(this.project.id as number, usernameList).then(res => {
      if (res.status === "success") {
        this.initMember(this.project.secretKey as string);
        this.getOtherUserInfo();
        notification.success("添加成员成功");
        (this.$refs.infoSelection as any).clearSelection();
      }
    });
  }

  public handleRemoveMember(member: Member) {
    removeOneMember(member.username, this.project.id as number).then(res => {
      if (res.status === "success") {
        this.initMember(this.project.secretKey as string);
        // 只有打开添加成员下拉框，才重新获取成员，否则不请求，减少请求次数
        this.showAddMember ? this.getOtherUserInfo() : "";
        notification.success("删除成员成功");
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
    .add-member {
      width: 540px;
      margin: 10px auto;
      .info-selection {
        width: 320px;
        display: inline-block;
      }
    }
  }
}
</style>
