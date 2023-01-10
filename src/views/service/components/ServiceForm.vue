<template>
  <div class="service-form-component">
    <div class="form-header">
      <span class="form-title">{{ operateTitle[status] }}</span>
      <el-button v-waves @click="$emit('cancel')">取 消</el-button>
      <el-button v-waves type="primary" @click="handleConfirmSave" :loading="loading">
        {{ loading ? "提交中 ..." : "保 存" }}
      </el-button>
    </div>
    <div class="form-content">
      <el-form
        ref="dataForm"
        :model="serviceForm"
        :rules="rules"
        label-width="80px"
        class="service-form"
        :disabled="readonly"
      >
        <el-form-item label="接口名称" prop="serviceName">
          <el-input v-model="serviceForm.serviceName"></el-input>
        </el-form-item>
        <el-form-item label="接口地址" prop="serviceUrl">
          <el-input v-model="serviceForm.serviceUrl">
            <template slot="prepend">{{ baseUrl }}</template>
          </el-input>
        </el-form-item>
        <el-form-item label="接口状态">
          <el-select v-model="tempService.status" placeholder="请选择接口状态" @change="handleSelectStatus">
            <el-option label="启用" value="0"></el-option>
            <el-option label="禁用" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="SQL">
          <code-mirror v-model="serviceForm.selectSql" cmMode="sql" class="code-mirror" :readonly="readonly" />
        </el-form-item>
        <el-form-item label="接口描述">
          <el-input type="textarea" v-model="serviceForm.serviceDesc" :autosize="{ minRows: 2, maxRows: 4 }"></el-input>
        </el-form-item>
      </el-form>
      <el-form :model="serviceForm" class="demo-form-inline" label-width="100px" :disabled="readonly">
        <el-form-item label="Insert Table">
          <el-input v-model="serviceForm.insertTable"></el-input>
        </el-form-item>
        <el-form-item label="Update Table">
          <el-input v-model="serviceForm.updateTable"></el-input>
        </el-form-item>
        <el-form-item label="Delete Table">
          <el-input v-model="serviceForm.deleteTable"></el-input>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">
import { ServiceModule } from "@/api/service";
import constant from "@/config/constant";
import { Form } from "element-ui";
import { Component, Prop, Vue } from "vue-property-decorator";
import CodeMirror from "@/components/CodeMirror/index.vue";
import { commonRules } from "./service-form-rules";

@Component({
  components: { CodeMirror },
})
export default class ServiceForm extends Vue {
  @Prop({ required: true })
  public status!: string;
  @Prop({ required: true })
  public data!: ServiceModule.Service;
  @Prop({ required: true })
  public baseUrl!: string;

  public operateTitle = constant.operateTitle;
  public loading = false;
  // 存储下拉框选择的 value 等，然后转换给 serviceForm
  public tempService = {
    status: "",
  };
  public rules = { ...commonRules };

  get serviceForm() {
    return this.data;
  }

  get readonly() {
    return this.status === "read";
  }

  public handleSelectStatus(selectValue: string) {
    this.serviceForm.status = selectValue;
  }

  public handleConfirmSave() {
    (this.$refs.dataForm as Form).validate(async valid => {
      if (valid) {
        let { serviceForm, status } = this;
        serviceForm.status = this.tempService.status;
        this.$emit("confirm", serviceForm, status);
      }
    });
  }
}
</script>

<style lang="scss" scoped>
.service-form-component {
  height: 100%;
  .form-header {
    display: flex;
    margin-bottom: 32px;
    padding: 20px 20px 0;
    .form-title {
      flex: 1;
    }
  }
  .form-content {
    display: flex;
    flex-direction: column;
    padding: 0 20px;
    .code-mirror {
      line-height: 20px;
    }
  }
}
</style>
<style lang="scss">
.service-form-component {
  .form-content {
    .CodeMirror {
      height: 200px;
      font-family: inherit;
    }
  }
}
</style>
