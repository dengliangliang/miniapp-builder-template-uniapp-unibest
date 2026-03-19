<template>
  <view class="page-shell flex flex-col gap-4">
    <view class="hero surface-card">
      <view class="hero-badge">
        <AppIcon name="sparkles" size="lg" tone="brand" />
        <text class="eyebrow">unibest-core</text>
      </view>
      <text class="title">Miniapp Builder uni-app baseline</text>
      <text class="subtitle">
        This starter keeps the stable unibest skeleton while trimming demos,
        side effects, and theme literals. Tokens remain the only source of
        truth.
      </text>
      <WdButton type="primary" size="large"
        >Create first business page</WdButton
      >
    </view>

    <view class="grid-list flex flex-col gap-3">
      <view class="card surface-card">
        <view class="card-heading">
          <AppIcon name="layout-grid" tone="brand" />
          <text class="card-title">Default stack</text>
        </view>
        <text class="card-body"
          >uni-app + Vue 3 + TypeScript + UnoCSS + Wot + Pinia + Style
          Dictionary</text
        >
      </view>
      <view class="card surface-card">
        <view class="card-heading">
          <AppIcon name="package-search" />
          <text class="card-title">Builder-ready</text>
        </view>
        <text class="card-body"
          >Page registration, request wrappers, Pinia entry, token mapping, and
          Iconify are already wired for builder flows.</text
        >
      </view>
    </view>

    <HelloMiniapp />
  </view>
</template>

<script setup lang="ts">
import AppIcon from "../../components/AppIcon.vue";
import HelloMiniapp from "../../components/HelloMiniapp.vue";
import WdButton from "wot-design-uni/components/wd-button/wd-button.vue";
</script>

<style scoped lang="scss">
.hero {
  background: linear-gradient(
    135deg,
    var(--global-color-palette-brand-50),
    var(--global-color-palette-brand-100)
  );
  border-radius: $global-radius-card;
  box-shadow: $global-shadow-card;
  padding: $global-space-hero-padding-vertical
    $global-space-hero-padding-horizontal;
  display: flex;
  flex-direction: column;
  gap: $global-space-hero-gap;
}

.page-shell {
  min-height: 100vh;
}

.hero-badge,
.card-heading {
  display: flex;
  align-items: center;
  gap: $global-space-card-gap;
}

.eyebrow {
  font-family: var(--global-typography-family-sans);
  font-size: var(--global-typography-size-eyebrow);
  line-height: var(--global-typography-line-height-tight);
  color: var(--global-color-palette-brand-600);
  font-weight: var(--global-typography-weight-semibold);
  letter-spacing: var(--global-typography-letter-spacing-wide);
}

.title {
  font-family: var(--global-typography-family-sans);
  font-size: var(--global-typography-size-title);
  line-height: var(--global-typography-line-height-tight);
  color: var(--theme-light-color-text-primary);
  font-weight: var(--global-typography-weight-bold);
  letter-spacing: var(--global-typography-letter-spacing-tight);
}

.subtitle {
  font-family: var(--global-typography-family-sans);
  font-size: var(--global-typography-size-body);
  line-height: var(--global-typography-line-height-body);
  color: var(--theme-light-color-text-secondary);
}

.card {
  padding: $global-space-card-padding-vertical
    $global-space-card-padding-horizontal;
  display: flex;
  flex-direction: column;
  gap: $global-space-card-gap;
}

.grid-list {
  gap: $global-space-card-list-gap;
}

.card-title {
  font-family: var(--global-typography-family-sans);
  font-size: var(--global-typography-size-heading);
  line-height: var(--global-typography-line-height-tight);
  color: var(--theme-light-color-text-primary);
  font-weight: var(--global-typography-weight-semibold);
}

.card-body {
  font-family: var(--global-typography-family-sans);
  font-size: var(--global-typography-size-body-sm);
  line-height: var(--global-typography-line-height-body);
  color: var(--theme-light-color-text-secondary);
}
</style>
