<template>
  <div class="home-container">
    <el-form ref="ruleFormRef" :model="ruleForm" status-icon :rules="rules" label-width="100px" class="demo-ruleForm">
      <el-form-item label="用户名" prop="pass">
        <el-input v-model="ruleForm.username" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="pass">
        <el-input type="password" v-model="ruleForm.password" autocomplete="off" @keyup.enter="submitForm()"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm()">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts" name="Home">
import { useUserStore } from "@/stores/user";
import { ElNotification, type FormInstance } from "element-plus";

const ruleForm = reactive({
  username: "",
  password: "",
});

const router = useRouter();
const userStore = useUserStore();
const ruleFormRef = shallowRef<FormInstance>();

const rules = {
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: true, message: "请选择密码", trigger: "blur" }],
};

const submitForm = () => {
  ruleFormRef.value?.validate(valid => {
    if (valid) {
      userStore.tryLogin({ ...ruleForm }).then(token => {
        if (token) {
          ElNotification.success("登录成功！");
          nextTick(() => {
            router.push("/project/index");
          });
        }
      });
    }
  });
};
</script>

<style lang="scss" scoped></style>
