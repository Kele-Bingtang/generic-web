<template>
  <div class="drag-drawer-component">
    <el-drawer
      :title="title"
      :visible="visible"
      :size="width"
      :direction="direction"
      :before-close="handleBeforeClose"
      :class-name="outerClasses"
      ref="drawerWrapper"
      v-bind="$attrs"
      v-on="$listeners"
      :modal-append-to-body="!inner"
      :class="{ 'drag-drawer-inner': inner }"
    >
      <template #title>
        <slot name="header"></slot>
      </template>
      <slot></slot>
      <div
        v-if="draggable"
        :style="triggerStyle"
        class="drag-drawer-trigger-wrapper"
        @mousedown="handleTriggerMousedown"
      >
        <slot name="trigger">
          <drag-drawer-trigger></drag-drawer-trigger>
        </slot>
      </div>
      <div v-if="$slots.footer" class="drag-drawer-footer">
        <slot name="footer"></slot>
      </div>
    </el-drawer>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import DragDrawerTrigger from "./DragDrawerTrigger.vue";

@Component({
  components: { DragDrawerTrigger },
})
export default class DragDrawer extends Vue {
  @Prop({ default: false })
  public visible!: boolean;
  @Prop({ default: 200 })
  public width!: string | number;
  @Prop({ default: "right" })
  public placement!: string;
  @Prop({ default: false })
  public draggable!: boolean;
  @Prop({ default: 200 })
  public minWidth!: string | number;
  @Prop({ default: false })
  public inner!: boolean;
  @Prop({ default: "" })
  public title!: string;

  public canMove = false;
  public wrapperWidth = 0;
  public wrapperLeft = 0;

  get outerClasses() {
    const classesArray = [`drag-drawer-wrapper`, this.canMove ? "no-select pointer-events-none" : ""];
    return classesArray.join(" ");
  }

  get direction() {
    if (this.placement == "right") {
      return "rtl";
    } else if (this.placement == "left") {
      return "ltr";
    } else if (this.placement == "top") {
      return "ttb";
    } else if (this.placement == "bottom") {
      return "btt";
    }
    return this.$attrs.direction;
  }

  get innerWidth() {
    const width = this.width as number;
    return width <= 100 ? (this.wrapperWidth * width) / 100 : width;
  }
  get triggerStyle(): any {
    let direction = "right";
    if (this.direction === "rtl") {
      direction = "right";
    } else if (this.direction === "ltr") {
      direction = "left";
    }
    // TODO????????? top ??? bottom ??????
    // else if (this.direction === "ttb") {
    //   direction = "top";
    // } else if (this.direction === "btt") {
    //   direction = "bottom";
    // }
    return {
      [direction]: `${this.innerWidth}px`,
      position: this.inner ? "absolute" : "fixed",
    };
  }
  mounted() {
    document.addEventListener("mousemove", this.handleMousemove);
    document.addEventListener("mouseup", this.handleMouseup);
    this.setWrapperWidth();
  }
  beforeDestroy() {
    document.removeEventListener("mousemove", this.handleMousemove);
    document.removeEventListener("mouseup", this.handleMouseup);
  }
  public handleBeforeClose(done: Function) {
    this.$emit("update:visible", false);
  }
  public handleTriggerMousedown(event: Event) {
    event.preventDefault();
    this.canMove = true;
    this.$emit("on-resize-start");
    // ???????????????????????????????????????????????? trigger ?????????????????????????????????
    (window as any).getSelection().removeAllRanges();
  }
  public handleMousemove(event: any) {
    if (!this.canMove) return;
    // ????????????????????????????????????????????????????????? window ????????????????????? 0
    this.setWrapperWidth();
    const left = event.pageX - this.wrapperLeft;
    // ?????????????????????????????????????????????????????????????????? left
    let width = this.direction === "rtl" ? this.wrapperWidth - left : left;
    // ??????????????????
    width = Math.max(width, parseFloat(this.minWidth as string));
    event.atMin = width === parseFloat(this.minWidth as string);
    // ???????????? width ????????? 100??????????????????
    if (width <= 100) width = (width / this.wrapperWidth) * 100;
    this.$emit("update:width", width);
    this.$emit("on-resize", event);
  }
  public handleMouseup(event: Event) {
    this.canMove = false;
    this.$emit("on-resize-end");
  }
  public setWrapperWidth() {
    const { width, left } = (this.$refs.drawerWrapper as any).$el.getBoundingClientRect();
    this.wrapperWidth = width;
    this.wrapperLeft = left;
  }
}
</script>

<style lang="scss" scoped>
.drag-drawer-component {
  &.no-select {
    user-select: none;
  }
  &.pointer-events-none {
    pointer-events: none;
    & .drag-drawer-trigger-wrapper {
      pointer-events: all;
    }
  }
  .drag-drawer-body-wrapper {
    width: 100%;
    height: 100%;
    padding: 16px;
    overflow: auto;
  }
  .drag-drawer-trigger-wrapper {
    top: 0;
    height: 100%;
    width: 0;
  }
  .drag-drawer-footer {
    flex-grow: 1;
    width: 100%;
    bottom: 0;
    left: 0;
    border-top: 1px solid #e8e8e8;
    padding: 10px 16px;
    background: #fff;
  }
}
</style>
<style lang="scss">
.drag-drawer-component {
  .drag-drawer-inner {
    position: absolute;
    & + .v-modal {
      position: absolute;
    }
    .el-drawer {
      overflow: visible;
    }
  }
}
</style>
