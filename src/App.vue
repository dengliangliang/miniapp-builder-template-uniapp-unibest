<template>
  <slot />
</template>

<script setup lang="ts">
import { onHide, onLaunch, onShow } from "@dcloudio/uni-app";

onLaunch(() => {
  console.log("unibest-core launch");
});

onShow(() => {
  console.log("unibest-core show");
});

onHide(() => {
  console.log("unibest-core hide");
});
</script>

<style lang="scss">
@import "@/uni.scss";
@import "@/theme/tokens.css";
@import "@/theme/themes/light.css";
@import "@/theme/themes/dark.css";
@import "@/theme/themes/brand-default.css";
@import "@/theme/wot-theme.scss";

page {
  background: var(--theme-light-color-surface-page);
  color: var(--theme-light-color-text-primary);
  font-family:
    -apple-system, BlinkMacSystemFont, "PingFang SC", "Helvetica Neue",
    sans-serif;
}
</style>
