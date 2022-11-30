<template>
  <div class="project-card-component">
    <div class="header" v-if="!onlyBody" @click="handleClick">
      <slot name="header">projectName</slot>
      <i class="el-icon-right action"></i>
    </div>
    <div class="body" :class="{ 'only-body': onlyBody }">
      <slot></slot>
    </div>
    <div class="footer" v-if="!onlyBody">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({})
export default class ProjectsCard extends Vue {
  @Prop({ default: false })
  public onlyBody!: boolean;
  @Prop({ default: "" })
  public projectName!: string;
  @Prop({ default: "" })
  public footer!: string;

  public handleClick() {
    let projectName = this.projectName;
    if (projectName) {
      this.$emit("header-click", projectName);
    } else {
      this.$emit("header-click");
    }
  }
}
</script>

<style lang="scss" scoped>
.project-card-component {
  width: 100%;
  height: 220px;
  background: #fff;
  box-shadow: 0 0 10px 0 hsl(0deg 0% 82% / 43%);
  border-radius: 4px;
  border: 1px solid #fafafa;
  .header {
    height: 40px;
    line-height: 40px;
    margin: 0;
    padding: 0 30px 0 20px;
    position: relative;
    cursor: pointer;
    color: #333;
    font-size: 16px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: 500;
    &:hover {
      background-color: #f2f2f2;
    }
    .action {
      position: absolute;
      right: 15px;
      top: 12px;
      transform: scale(0.8);
      font-size: 20px;
    }
  }
  .body {
    height: 140px;
    padding: 15px 30px;
    color: #666;
    font-size: 14px;
    &.only-body {
      width: 100%;
      height: 100%;
    }
  }
  .footer {
    height: 40px;
    display: flex;
    line-height: 40px;
    & > * {
      flex: 1 1;
      text-align: center;
      display: inline-block;
      height: 40px;
      cursor: pointer;
      &:hover {
        background-color: #f2f2f2;
      }
    }
  }
}
</style>
