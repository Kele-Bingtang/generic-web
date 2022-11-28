<template>
  <div class="project-detail-container">
    {{ $route.params && $route.params.id }}
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({})
export default class ProjectDetail extends Vue {
  mounted() {
    // console.log(this.$route.params);
  }
}
</script>

<style lang="scss" scoped>
.project-detail-container {
  padding: 20px;
}
</style>
