<template>
  <div class="service-form-component">
    <div class="form-header">
      <span class="form-title">{{ operateTitle[status] }}</span>
      <el-button v-waves @click="$emit('cancel')">取 消</el-button>
      <el-button v-waves type="primary" @click="" :loading="loading">
        {{ loading ? "提交中 ..." : "保 存" }}
      </el-button>
    </div>
    <div class="form-content">
      <el-form ref="dataForm" :model="serviceForm" label-width="80px" class="service-form">
        <el-form-item label="活动名称">
          <el-input v-model="serviceForm.name"></el-input>
        </el-form-item>
        <el-form-item label="活动区域">
          <el-select v-model="serviceForm.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动时间">
          <el-col :span="11">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              v-model="serviceForm.date1"
              style="width: 100%"
            ></el-date-picker>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-time-picker placeholder="选择时间" v-model="serviceForm.date2" style="width: 100%"></el-time-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="即时配送">
          <el-switch v-model="serviceForm.delivery"></el-switch>
        </el-form-item>
        <el-form-item label="活动性质">
          <el-checkbox-group v-model="serviceForm.type">
            <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
            <el-checkbox label="地推活动" name="type"></el-checkbox>
            <el-checkbox label="线下主题活动" name="type"></el-checkbox>
            <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="特殊资源">
          <el-radio-group v-model="serviceForm.resource">
            <el-radio label="线上品牌商赞助"></el-radio>
            <el-radio label="线下场地免费"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="活动形式">
          <el-input type="textarea" v-model="serviceForm.desc"></el-input>
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

@Component({})
export default class ServiceForm extends Vue {
  @Prop({ required: true })
  public status!: string;
  @Prop({ required: true })
  public data!: ServiceModule.Service;

  public operateTitle = constant.operateTitle;

  public serviceForm = {
    name: "",
    region: "",
    date1: "",
    date2: "",
    delivery: false,
    type: [],
    resource: "",
    desc: "",
  };
  public loading = false;

  public handleConfirmSave() {
    (this.$refs.dataForm as Form).validate(async valid => {
      if (valid) {
        this.$emit("confirm", this.serviceForm, this.status);
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
  }
}
</style>
