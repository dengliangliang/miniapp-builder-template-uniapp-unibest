<template>
  <image
    class="app-icon"
    :src="iconAsset.src"
    :style="imageStyle"
    mode="aspectFit"
  />
</template>

<script setup lang="ts">
import { computed } from "vue";
import {
  iconManifest,
  type AppIconName,
  type AppIconTone,
} from "@/theme/icons/manifest";

const props = withDefaults(
  defineProps<{
    name: AppIconName;
    size?: "sm" | "md" | "lg";
    tone?: AppIconTone;
  }>(),
  {
    size: "md",
    tone: "default",
  },
);

const iconAsset = computed(() => iconManifest[props.name][props.tone]);

const imageStyle = computed(() => {
  const sizeMap = {
    sm: "var(--global-icon-size-sm)",
    md: "var(--global-icon-size-md)",
    lg: "var(--global-icon-size-lg)",
  } as const;

  const size = sizeMap[props.size];
  return `width:${size};height:${size};`;
});
</script>

<style scoped>
.app-icon {
  display: inline-flex;
  flex-shrink: 0;
}
</style>
