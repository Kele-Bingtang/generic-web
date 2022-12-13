<template>
  <div class="home-container">
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="用户名" prop="pass">
        <el-input v-model="ruleForm.username" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="pass">
        <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm()">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { Form } from "element-ui";
import { Component, Vue } from "vue-property-decorator";
import { UserModule } from "@/store/modules/user";

@Component({})
export default class Home extends Vue {
  public ruleForm = {
    username: "",
    password: "",
  };
  public rules = {
    username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
    password: [{ required: true, message: "请选择密码", trigger: "blur" }],
  };

  public submitForm() {
    (this.$refs.ruleForm as Form).validate(valid => {
      if (valid) {
        UserModule.login({ ...this.ruleForm }).then(res => {
          if (res) {
            this.$notify({
              title: "Success",
              message: "登录成功",
              type: "success",
            });
          } else {
            this.$notify({
              title: "Fail",
              message: "用户名或密码错误",
              type: "error",
            });
          }
        });
      }
    });
  }
}
</script>

<style lang="scss" scoped>
.home-container {
  padding: 20px;
}
</style>
