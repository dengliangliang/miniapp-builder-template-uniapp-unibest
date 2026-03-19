import type { CustomRequestOptions } from "@/http/types";
import { useSessionStore } from "@/store";
import { getEnvBaseUrl } from "@/utils/env";
import { stringifyQuery } from "./tools/queryString";

const baseUrl = getEnvBaseUrl();

const httpInterceptor = {
  invoke(options: CustomRequestOptions) {
    if (options.query) {
      const queryString = stringifyQuery(options.query);
      if (queryString) {
        options.url += options.url.includes("?")
          ? `&${queryString}`
          : `?${queryString}`;
      }
    }

    if (!options.url.startsWith("http") && baseUrl) {
      options.url = `${baseUrl}${options.url}`;
    }

    options.timeout = 60_000;
    options.header = {
      ...options.header,
    };

    const sessionStore = useSessionStore();
    if (sessionStore.accessToken) {
      options.header.Authorization = `Bearer ${sessionStore.accessToken}`;
    }

    return options;
  },
};

export const requestInterceptor = {
  install() {
    uni.addInterceptor("request", httpInterceptor);
    uni.addInterceptor("uploadFile", httpInterceptor);
  },
};
