<template>
  <div class="project-card-component">
    <div class="header" v-if="!onlyBody" @click="handleClick">
      <slot name="header">projectName</slot>
      <el-icon class="action">
        <Right />
      </el-icon>
    </div>
    <div class="body" :class="{ 'only-body': onlyBody }">
      <slot></slot>
    </div>
    <div class="footer" v-if="!onlyBody">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts" name="ProjectCard">
interface ProjectCardProps {
  onlyBody?: boolean;
  projectName?: string;
  footer?: string;
}
interface ProjectCardEmits {
  (e: "header-click", projectName?: string): void;
}

const props = withDefaults(defineProps<ProjectCardProps>(), {
  onlyBody: false,
  projectName: "",
  footer: "",
});

const emits = defineEmits<ProjectCardEmits>();

const handleClick = () => {
  if (props.projectName) {
    emits("header-click", props.projectName);
  } else {
    emits("header-click");
  }
};
</script>

<style lang="scss" scoped>
.project-card-component {
  width: 100%;
  height: 220px;
  background: #ffffff;
  border: 1px solid #fafafa;
  border-radius: 4px;
  box-shadow: 0 0 10px 0 hsl(0deg 0% 82% / 43%);

  .header {
    position: relative;
    height: 40px;
    padding: 0 30px 0 20px;
    margin: 0;
    overflow: hidden;
    font-size: 16px;
    font-weight: 500;
    line-height: 40px;
    color: #333333;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;

    &:hover {
      background-color: #f2f2f2;
    }

    .action {
      position: absolute;
      top: 12px;
      right: 15px;
      font-size: 20px;
      transform: scale(0.8);
    }
  }

  .body {
    height: 140px;
    padding: 15px 30px;
    font-size: 14px;
    color: #666666;

    &.only-body {
      width: 100%;
      height: 100%;
    }
  }

  .footer {
    display: flex;
    height: 40px;
    line-height: 40px;

    & > :deep(*) {
      display: inline-block;
      flex: 1 1;
      height: 40px;
      text-align: center;
      cursor: pointer;

      &:hover {
        background-color: #f2f2f2;
      }
    }
  }
}
</style>
