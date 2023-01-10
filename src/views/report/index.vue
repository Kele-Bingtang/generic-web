<template>
  <div class="report-container">
    <template v-if="reportList.length > 0">
      <el-table
        :data="reportList"
        border
        highlight-current-row
        style="width: 100%"
        v-loading="loading"
        ref="table"
      ></el-table>

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
import Pagination, { Paging, paging } from "@/components/Pagination/index.vue";
import { Page } from "@/types/http";
import message from "@/utils/message";
import { isNumber } from "@/utils/validate";
import { Component, Vue } from "vue-property-decorator";

@Component({ components: { Pagination } })
export default class GenericReport extends Vue {
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

  mounted() {
    this.initReportData();
  }

  public initReportData(page?: Page) {
    let { serviceId } = this.$route.params;
    if (!serviceId || !isNumber(serviceId)) {
      message.error("无效链接");
      return new Promise(resolve => resolve(false));
    }
    this.loading = true;
    // ...
    this.loading = false;
  }

  public handleSizeChange(paging: Paging) {
    this.initReportData({ pageNo: paging.currentPage, pageSize: paging.pageSize });
    this.paging.currentPage = paging.currentPage;
    this.paging.pageSize = paging.pageSize;
  }
}
</script>

<style lang="scss" scoped></style>
