<template>
  <div class="report-container">
    <template v-if="reportList.length > 0">
      <el-table :data="reportList" border highlight-current-row style="width: 100%" v-loading="loading" ref="table">
        <el-table-column
          v-for="index in dataLength"
          v-if="needRender(reportList[0], index)"
          :key="getObjectKey(reportList[0], index)"
          :prop="getObjectKey(reportList[0], index)"
          :label="getObjectKey(reportList[0], index)"
        ></el-table-column>
      </el-table>

      <pagination
        v-show="reportList.length > 0"
        :total="reportList.length"
        :paging="paging"
        @pagination="handleSizeChange"
      />
    </template>
    <template v-else>
      <el-empty></el-empty>
    </template>
  </div>
</template>

<script lang="ts">
import { queryGenericData } from "@/api/generic-api";
import { queryOneService } from "@/api/service";
import Pagination, { Paging, paging } from "@/components/Pagination/index.vue";
import { Page } from "@/types/http";
import message from "@/utils/message";
import { isNumber } from "@/utils/validate";
import { Component, Vue } from "vue-property-decorator";

@Component({ components: { Pagination } })
export default class GenericReport extends Vue {
  public index!: number;

  public reportList: any[] = [];
  public loading = false;
  public paging = { ...paging };
  public operateStatus = "";
  public reportColDrawer = {
    visible: false,
    placement: "right",
    width: 700,
    draggable: true,
    withHeader: false,
  };

  get dataLength() {
    let { reportList } = this;
    if (reportList.length > 0) {
      let keys = Object.keys(this.reportList[0]);
      return keys.length;
    }
    return 0;
  }

  mounted() {
    this.initReportData();
  }

  public initReportData(page?: Page) {
    let { serviceId, secretKey } = this.$route.params;
    if (!serviceId || !isNumber(serviceId) || !secretKey) {
      message.error("无效链接");
      return new Promise(resolve => resolve(false));
    }
    this.loading = true;
    queryOneService({ id: Number(serviceId) }).then(res => {
      if (res.status === "success") {
        queryGenericData(res.data.fullUrl, secretKey, page).then(res => {
          this.reportList = res.data;
        });
      }
    });

    this.loading = false;
  }

  public getObjectKey(obj: Object, index: number) {
    let keys = Object.keys(obj);
    return keys[index - 1];
  }

  public needRender(obj: Object, index: number) {
    let key = Object.keys(obj)[index - 1];
    if (key.startsWith("_") && key.indexOf("GenericReportSetting") !== -1) {
      return false;
    }
    return true;
  }

  public handleSizeChange(paging: Paging) {
    this.initReportData({ pageNo: paging.currentPage, pageSize: paging.pageSize });
    this.paging.currentPage = paging.currentPage;
    this.paging.pageSize = paging.pageSize;
  }
}
</script>

<style lang="scss" scoped></style>
