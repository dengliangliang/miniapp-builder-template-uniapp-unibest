export type RequestQuery = Record<
  string,
  string | number | boolean | undefined
>;

export type CustomRequestOptions = UniApp.RequestOptions & {
  query?: RequestQuery;
  hideErrorToast?: boolean;
};

export type HttpResponseEnvelope<T> = {
  code?: number;
  data?: T;
  message?: string;
  msg?: string;
};
