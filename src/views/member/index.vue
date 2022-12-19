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
            <p class="description-title">项目成员</p>
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
      <member-card v-for="item in memberList" :key="item.username" :data="item" @select="handleSelect" />
    </el-card>
  </div>
</template>

<script lang="ts">
import { queryMemberInProject, UserInfoModule } from "@/api/user";
import message from "@/utils/message";
import { Component, Vue } from "vue-property-decorator";
import MemberCard from "./components/MemberCard.vue";

export type Member = Omit<UserInfoModule.User, "id" | "password">;

@Component({
  components: { MemberCard },
})
export default class GenericMember extends Vue {
  public memberList: Array<Member> = [];

  mounted() {
    let { secretKey } = this.$route.params;
    if (secretKey) {
      this.initMember(secretKey);
    } else {
      message.error("无法获取成员信息，密钥失效！");
    }
  }

  public initMember(secretKey: string) {
    queryMemberInProject(secretKey).then(res => {
      if (res.status === "success") {
        this.memberList = res.data as unknown as Array<Member>;
      }
    });
  }

  public handleSelect(label: string) {
    console.log(label);
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
