import { computed, ref } from "vue";
import { defineStore } from "pinia";

export const useSessionStore = defineStore("session", () => {
  const accessToken = ref("");
  const apiBaseUrl = ref("");

  const hasSession = computed(() => Boolean(accessToken.value));

  function setAccessToken(token: string) {
    accessToken.value = token;
  }

  function setApiBaseUrl(url: string) {
    apiBaseUrl.value = url;
  }

  return {
    accessToken,
    apiBaseUrl,
    hasSession,
    setAccessToken,
    setApiBaseUrl,
  };
});
