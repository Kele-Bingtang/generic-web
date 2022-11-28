<template>
  <div class="projects-container">
    <el-tabs type="border-card" class="projects-tabs">
      <el-tab-pane label="我的项目">
        <el-row :gutter="10">
          <el-col :xs="12" :sm="12" :md="6" :lg="6" :xl="4">
            <project-card @header-click="handleHeaderClick('GenericService 项目')">
              <template #header>
                <span>GenericService 项目</span>
              </template>
              <div class="base-url">/api</div>
              <div class="description">通用后台管理系统</div>
            </project-card>
          </el-col>
          <el-col :xs="12" :sm="12" :md="6" :lg="6" :xl="4">
            <project-card :only-body="true" class="plus-project">
              <i class="el-icon-plus action"></i>
            </project-card>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="我加入的">我加入的</el-tab-pane>
      <el-tab-pane label="我创建的">我创建的</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ProjectCard from "./components/projectCard.vue";

@Component({
  components: { ProjectCard },
})
export default class Projects extends Vue {
  public handleHeaderClick(projectName: string) {
    if (projectName) {
      this.$router.push({ path: `/project/details/${projectName}/b0b097a64a352d83027145556890c3c2` });
    }
  }
}
</script>

<style lang="scss" scoped>
.projects-container {
  padding: 20px;
  width: 100%;
  height: 100%;
  .projects-tabs {
    width: 100%;
    height: 100%;

    .plus-project {
      text-align: center;
      line-height: 220px;
      color: #999;
      cursor: pointer;
      .el-icon-plus.action {
        font-size: 60px;
      }
    }

    .base-url {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-bottom: 10px;
      font-size: 16px;
      margin-top: 0;
      color: rgba(0, 0, 0, 0.85);
      font-weight: 500;
    }
    .description {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      overflow: hidden;
      color: #999;
    }
  }
}
</style>

<style lang="scss">
.projects-container {
  .action {
    display: inline-block;
    color: inherit;
    font-style: normal;
    text-align: center;
    text-transform: none;
    text-rendering: optimizelegibility;
    -webkit-font-smoothing: antialiased;
  }
}
</style>
