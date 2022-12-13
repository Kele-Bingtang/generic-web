<template>
  <div class="catalog-table-component">
    <div class="search-container">
      <div class="search-content">
        <el-input v-model="searchParams.serviceName" placeholder="接口名称" style="width: 200px" />
        <el-button v-waves type="primary" icon="el-icon-search" @click="handleSearch()" style="margin-left: 10px">
          查询
        </el-button>
        <el-button v-waves icon="el-icon-refresh" @click="handleReset">重置</el-button>
        <el-button v-waves type="warning" icon="el-icon-plus" @click="handleAdd()" style="float: right">导出</el-button>
        <el-button v-waves type="primary" icon="el-icon-plus" @click="handleAdd()" style="float: right">添加</el-button>
      </div>
    </div>
    <template v-if="serviceData.length > 0">
      <el-table
        :data="serviceData.slice((paging.currentPage - 1) * paging.pageSize, paging.currentPage * paging.pageSize)"
        border
        highlight-current-row
        row-key="id"
        :key="tableKey"
        style="width: 100%"
        v-loading="loading"
        ref="table"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="serviceName" label="接口名称" width="180px"></el-table-column>
        <el-table-column prop="reportTitle" label="报表名称" width="180px"></el-table-column>
        <el-table-column prop="status" label="接口状态" width="150px"></el-table-column>
        <el-table-column prop="serviceUrl" label="接口地址"></el-table-column>
        <el-table-column prop="serviceDesc" label="接口描述"></el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>

        <el-table-column label="操作" width="200px">
          <template slot-scope="{ row, $index }">
            <el-button type="text" icon="el-icon-search" @click="handleLook(row)" class="btn-info">查看</el-button>
            <el-button type="text" icon="el-icon-edit" @click="handleEdit(row)">编辑</el-button>
            <el-button type="text" icon="el-icon-delete" @click="handleDelete(row, $index)" class="btn-danger">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="serviceData.length > 0"
        :total="serviceData.length"
        :paging="paging"
        @pagination="handleSizeChange"
      />

      <el-dialog :title="dialogTitle[dialogStatus]" :visible.sync="dialogFormVisible">
        <el-form
          ref="dataForm"
          :rules="rules"
          :model="tempTableDate"
          label-position="left"
          label-width="80px"
          style="width: 400px; margin-left: 50px"
          :disabled="dialogStatus === 'look'"
        >
          <el-form-item label="姓名" prop="name">
            <el-input v-model="tempTableDate.name" placeholder="请选择姓名" />
          </el-form-item>
          <el-form-item label="日期" prop="date">
            <el-date-picker
              v-model="tempTableDate.date"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="请选择日期"
            />
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="tempTableDate.status" placeholder="请选择状态">
              <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="优先级">
            <el-rate
              v-model="tempTableDate.priority"
              :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
              :max="5"
              style="margin-top: 8px"
            />
          </el-form-item>
          <el-form-item label="地址" prop="address">
            <el-input
              v-model="tempTableDate.address"
              :autosize="{ minRows: 2, maxRows: 4 }"
              type="textarea"
              placeholder="请输入地址"
            />
          </el-form-item>
          <el-form-item label="标题" prop="title">
            <el-input
              v-model="tempTableDate.title"
              :autosize="{ minRows: 2, maxRows: 4 }"
              type="textarea"
              placeholder="请输入标题"
            />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <template v-if="dialogStatus === 'look'">
            <el-button type="primary" @click="dialogFormVisible = false">确定</el-button>
          </template>
          <template v-else>
            <el-button @click="dialogFormVisible = false">取消</el-button>
            <el-button type="primary" @click="dialogStatus === 'add' ? addData() : editData()">确定</el-button>
          </template>
        </div>
      </el-dialog>
    </template>
    <template v-else>
      <el-empty>
        <el-button icon="el-icon-plus">创建接口</el-button>
      </el-empty>
    </template>
  </div>
</template>

<script lang="ts">
import { Form } from "element-ui";
import { Component, Prop, Vue } from "vue-property-decorator";
import Pagination, { Paging, paging } from "@/components/Pagination/index.vue";
import { defaultServiceData, ServiceModule } from "@/api/service";

type Service = ServiceModule.Service;

@Component({
  components: { Pagination },
})
export default class ServiceTable extends Vue {
  @Prop({ required: true })
  public data!: Array<Service>;

  public row!: any;
  public $index!: any;

  public tableKey = 0;
  public showAddress = false;
  public loading = true;
  public paging = paging;
  public searchParams = {
    serviceName: "",
  };
  public statusOptions = [
    {
      value: "Enable",
      label: "Enable",
    },
    {
      value: "Disable",
      label: "Disable",
    },
    {
      value: "Deleted",
      label: "Deleted",
    },
  ];
  public dialogFormVisible = false;
  public dialogStatus = "";
  public dialogTitle: { [propName: string]: string } = {
    look: "查看",
    edit: "编辑",
    add: "创建",
  };
  public rules = {
    date: [{ required: true, message: "date is required", trigger: "change" }],
    name: [{ required: true, message: "name is required", trigger: "change" }],
    title: [{ required: true, message: "title is required", trigger: "blur" }],
  };
  public tempTableDate = defaultServiceData;

  public serviceData: Array<Service> = [];

  mounted() {
    this.serviceData = { ...this.data };
    this.loading = false;
  }

  // 应该将参数 searchParams 传到后台，这里演示本地数据查询
  public handleSearch() {
    this.loading = true;
    this.serviceData = { ...this.data };
    if (this.searchParams.serviceName === "") {
      this.loading = false;
      return;
    }
    let serviceData = [...this.serviceData];
    if (this.searchParams.serviceName) {
      serviceData = this.serviceData.filter(item => {
        return item.serviceName.indexOf(this.searchParams.serviceName) !== -1;
      });
    }
    this.serviceData = serviceData;
    this.loading = false;
  }

  public handleReset() {
    this.$emit("reset");
  }

  public handleAdd() {
    this.tempTableDate = defaultServiceData;
    this.dialogStatus = "add";
    this.dialogFormVisible = true;
    this.$nextTick(() => {
      (this.$refs.dataForm as Form).clearValidate();
    });
  }
  public addData() {
    (this.$refs.dataForm as Form).validate(async valid => {
      if (valid) {
        const serviceData = this.tempTableDate;
        // serviceData.id = Math.round(Math.random() * 100) + 1024 + ""; // 随机一个 id
        // this.serviceData.unshift(serviceData);
        // this.dialogFormVisible = false;
        // this.$notify({
        //   title: "成功",
        //   message: "创建成功",
        //   type: "success",
        //   duration: 2000,
        // });
      }
    });
  }

  public handleLook(row: any) {
    this.tempTableDate = Object.assign({}, row);
    this.dialogStatus = "look";
    this.dialogFormVisible = true;
    this.$nextTick(() => {
      (this.$refs.dataForm as Form).clearValidate();
    });
  }

  public handleEdit(row: any) {
    this.tempTableDate = Object.assign({}, row);
    this.dialogStatus = "edit";
    this.dialogFormVisible = true;
    this.$nextTick(() => {
      (this.$refs.dataForm as Form).clearValidate();
    });
  }
  public editData() {
    (this.$refs.dataForm as Form).validate(async valid => {
      if (valid) {
        const tempData = Object.assign({}, this.tempTableDate);
        const index = this.serviceData.findIndex(v => v.id === tempData.id);
        this.serviceData.splice(index, 1, tempData);
        this.dialogFormVisible = false;
        this.$notify({
          title: "成功",
          message: "更新成功",
          type: "success",
          duration: 2000,
        });
      }
    });
  }
  public handleDelete(row: any, index: number) {
    this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(() => {
        this.serviceData.splice(index, 1);
        this.$notify({
          title: "Success",
          message: "删除成功！",
          type: "success",
          duration: 2000,
        });
      })
      .catch(() => {});
  }

  public handleSizeChange(paging: Paging) {
    this.paging.currentPage = paging.currentPage;
    this.paging.pageSize = paging.pageSize;
  }
}
</script>

<style lang="scss" scoped>
.catalog-table-component {
  .search-container {
    margin-bottom: 10px;
  }
}
</style>
