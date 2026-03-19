import type { CustomRequestOptions, HttpResponseEnvelope } from "@/http/types";

function normalizeResponse<T>(data: unknown): T {
  const payload = data as HttpResponseEnvelope<T>;
  if (typeof payload === "object" && payload !== null && "data" in payload) {
    return payload.data as T;
  }
  return data as T;
}

export function http<T>(options: CustomRequestOptions) {
  return new Promise<T>((resolve, reject) => {
    uni.request({
      ...options,
      dataType: "json",
      success(res) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(normalizeResponse<T>(res.data));
          return;
        }

        if (!options.hideErrorToast) {
          uni.showToast({
            icon: "none",
            title: ((res.data as { message?: string; msg?: string })?.message ??
              (res.data as { message?: string; msg?: string })?.msg ??
              "Request failed") as string,
          });
        }
        reject(res);
      },
      fail(error) {
        if (!options.hideErrorToast) {
          uni.showToast({
            icon: "none",
            title: "Network error, please try again later",
          });
        }
        reject(error);
      },
    });
  });
}

http.get = function httpGet<T>(
  url: string,
  query?: Record<string, string | number | boolean | undefined>,
  header?: Record<string, string>,
) {
  return http<T>({
    url,
    query,
    method: "GET",
    header,
  });
};

http.post = function httpPost<T>(
  url: string,
  data?: Record<string, unknown>,
  query?: Record<string, string | number | boolean | undefined>,
  header?: Record<string, string>,
) {
  return http<T>({
    url,
    data,
    query,
    method: "POST",
    header,
  });
};
