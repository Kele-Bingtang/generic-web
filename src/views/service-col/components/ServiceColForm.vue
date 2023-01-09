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
        :model="serviceColForm"
        :rules="rules"
        label-width="100px"
        class="service-form"
        :disabled="readonly"
        inline
      >
        <el-form-item label="字段名称">
          <el-input v-model="serviceColForm.tableCol" placeholder="请输入字段名称"></el-input>
        </el-form-item>
        <el-form-item label="请求名称">
          <el-input v-model="serviceColForm.jsonCol" placeholder="请输入请求名称"></el-input>
        </el-form-item>
        <el-form-item label="报表名称">
          <el-input v-model="serviceColForm.reportCol" placeholder="请输入报表名称"></el-input>
        </el-form-item>
        <el-form-item label="where 条件">
          <el-select v-model="tempServiceCol.isWhereKey" placeholder="请选择" class="select-item">
            <el-option label="作为" value="0"></el-option>
            <el-option label="不作为" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="添加">
          <el-select v-model="tempServiceCol.allowInsert" placeholder="请选择" class="select-item">
            <el-option label="允许" value="0"></el-option>
            <el-option label="不允许" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="更新">
          <el-select v-model="tempServiceCol.allowUpdate" placeholder="请选择" class="select-item">
            <el-option label="允许" value="0"></el-option>
            <el-option label="不允许" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="查询">
          <el-select v-model="tempServiceCol.allowFilter" placeholder="请选择" class="select-item">
            <el-option label="允许" value="0"></el-option>
            <el-option label="不允许" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="加密">
          <el-select v-model="tempServiceCol.dataEncrypt" placeholder="请选择" class="select-item">
            <el-option label="加密" value="0"></el-option>
            <el-option label="不加密" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="字段类型">
          <el-select v-model="tempServiceCol.dataEncrypt" placeholder="请选择" filterable clearable class="select-item">
            <el-option v-for="item in mysqlColTypeOptions" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="列对齐">
          <el-select v-model="tempServiceCol.colAlign" placeholder="请选择" class="select-item">
            <el-option label="左对齐" value="0"></el-option>
            <el-option label="居中" value="1"></el-option>
            <el-option label="右对齐" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="报表显示">
          <el-select v-model="tempServiceCol.allowShowInReport" placeholder="请选择" class="select-item">
            <el-option label="允许" value="0"></el-option>
            <el-option label="不允许" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="弹出框显示">
          <el-select v-model="tempServiceCol.allowShowInDetail" placeholder="请选择" class="select-item">
            <el-option label="允许" value="0"></el-option>
            <el-option label="不允许" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="筛选">
          <el-select v-model="tempServiceCol.queryFilter" placeholder="请选择" class="select-item">
            <el-option label="left like" value="0"></el-option>
            <el-option label="right like" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序">
          <el-select v-model="tempServiceCol.orderBy" placeholder="请选择" class="select-item">
            <el-option label="asc" value="0"></el-option>
            <el-option label="desc" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="出现顺序">
          <el-input v-model="serviceColForm.displaySeq" placeholder="请输入出现顺序"></el-input>
        </el-form-item>
        <el-form-item label="默认值">
          <el-input v-model="serviceColForm.defaultValue" placeholder="请输入默认值"></el-input>
        </el-form-item>
        <el-form-item label="长度">
          <el-input v-model="serviceColForm.colLength" placeholder="请输入字段长度"></el-input>
        </el-form-item>
        <el-form-item label="显示长度">
          <el-input v-model="serviceColForm.reportColWidth" placeholder="请输入显示长度"></el-input>
        </el-form-item>
        <el-form-item label="弹出框长度">
          <el-input v-model="serviceColForm.detailColWidth" placeholder="请输入弹出框长度"></el-input>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">
import constant from "@/config/constant";
import { Form } from "element-ui";
import { Component, Prop, Vue } from "vue-property-decorator";
import { commonRules } from "./form-rules";
import { ServiceColModule } from "@/api/service-col";

@Component({})
export default class ServiceColForm extends Vue {
  @Prop({ required: true })
  public status!: string;
  @Prop({ required: true })
  public data!: ServiceColModule.ServiceCol;

  public operateTitle = constant.operateTitle;
  public mysqlColTypeOptions = constant.mysqlColTypeOptions;
  public loading = false;
  // 存储下拉框选择的 value 等，然后转换给 serviceColForm
  public tempService = {
    status: "",
  };
  public rules = { ...commonRules };
  public tempServiceCol = {
    isWhereKey: "1",
    dataEncrypt: "1",
    queryFilter: "",
    orderBy: "",
    allowInsert: "0",
    allowUpdate: "0",
    allowFilter: "0",
    allowShowInReport: "0",
    allowShowInDetail: "0",
    colAlign: "0",
  };

  get serviceColForm() {
    return this.data;
  }

  get readonly() {
    return this.status === "read";
  }

  public handleConfirmSave() {
    (this.$refs.dataForm as Form).validate(async valid => {
      if (valid) {
        let { serviceColForm, status } = this;
        this.$emit("confirm", serviceColForm, status);
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
    .select-item {
      width: 191px;
    }
  }
}
</style>
