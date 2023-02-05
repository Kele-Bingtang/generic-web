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
          <el-select v-model="tempService.status" placeholder="请选择接口状态">
            <el-option label="启用" value="1"></el-option>
            <el-option label="禁用" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="SQL">
          <el-tooltip class="item" effect="dark" placement="right">
            <div slot="content" style="line-height: 1.5715">
              表名下拉值出现条件：项目填写了 databaseName。
              <br />
              如果命令行和表名都填写，则以命令行的内容为主。
              <br />
              命令行的表名要加上数据库名，否则无法查询哪个数据的表。
              <br />
              右侧的验证可以告诉您 SQL 是否填写正确
            </div>
            <i class="el-icon-question"></i>
          </el-tooltip>
          <el-button v-waves @click="handleVerify" style="float: right">验 证</el-button>
          <el-tabs v-model="activeName">
            <el-tab-pane label="表名" name="selectTable">
              <el-select v-model="tempService.tableName" placeholder="请选择接表名" @change="handleSelectTable">
                <el-option v-for="item in tableNameList" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </el-tab-pane>
            <el-tab-pane label="视图" name="selectView">
              <el-select v-model="tempService.tableName" placeholder="请选择接视图" @change="handleSelectTable">
                <el-option v-for="item in tableNameList" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </el-tab-pane>
            <el-tab-pane label="命令行" name="command" lazy>
              <code-mirror v-model="serviceForm.selectSql" cmMode="sql" class="code-mirror" :readonly="readonly" />
            </el-tab-pane>
          </el-tabs>
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
  name: "ServiceForm",
  components: { CodeMirror },
})
export default class extends Vue {
  @Prop({ required: true })
  public status!: string;
  @Prop({ required: true })
  public data!: ServiceModule.Service;
  @Prop({ required: true })
  public baseUrl!: string;
  @Prop({ default: () => [] })
  public tableNameList!: string[];

  public operateTitle = constant.operateTitle;
  public loading = false;
  // 存储下拉框选择的 value 等，然后转换给 serviceForm
  public tempService = {
    status: "1",
    tableName: "",
  };
  public rules = { ...commonRules };
  public activeName = "selectTable";

  get serviceForm() {
    this.tempService.status = this.data.status + "";
    this.tempService.tableName = this.data.selectTable;
    return this.data;
  }

  get readonly() {
    return this.status === "read";
  }

  public handleConfirmSave() {
    (this.$refs.dataForm as Form).validate(async valid => {
      if (valid) {
        let { serviceForm, status } = this;
        serviceForm.status = parseInt(this.tempService.status);
        this.$emit("confirm", serviceForm, status);
      }
    });
  }

  public handleSelectTable(selectValue: string) {
    this.serviceForm.selectTable = selectValue;
  }

  public handleVerify() {}
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
