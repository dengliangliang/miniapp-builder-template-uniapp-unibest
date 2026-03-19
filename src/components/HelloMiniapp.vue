<template>
  <view class="hello-card">
    <view class="hello-heading">
      <AppIcon name="arrow-right" tone="brand" />
      <text class="hello-title">Next suggested prompts</text>
    </view>
    <text class="hello-item"
      >Create a product list page and register it in src/pages.json.</text
    >
    <text class="hello-item"
      >Add an order status store and connect it to Pinia.</text
    >
    <text class="hello-item"
      >Create a business API module and reuse src/http wrappers.</text
    >
  </view>
</template>

<script setup lang="ts">
import AppIcon from "./AppIcon.vue";
</script>

<style scoped lang="scss">
.hello-card {
  background: var(--theme-light-color-surface-card);
  border-radius: $global-radius-card;
  box-shadow: $global-shadow-card;
  padding: $global-space-card-padding-vertical
    $global-space-card-padding-horizontal;
  display: flex;
  flex-direction: column;
  gap: $global-space-card-gap;
}

.hello-heading {
  display: flex;
  align-items: center;
  gap: $global-space-card-gap;
}

.hello-title {
  font-family: var(--global-typography-family-sans);
  font-size: var(--global-typography-size-heading);
  line-height: var(--global-typography-line-height-tight);
  font-weight: var(--global-typography-weight-semibold);
  color: var(--theme-light-color-text-primary);
}

.hello-item {
  font-family: var(--global-typography-family-sans);
  font-size: var(--global-typography-size-body-sm);
  color: var(--theme-light-color-text-secondary);
  line-height: var(--global-typography-line-height-body);
}
</style>
