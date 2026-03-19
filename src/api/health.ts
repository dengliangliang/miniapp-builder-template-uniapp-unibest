import { http } from "@/http/http";

export interface HealthCheckResponse {
  status: string;
}

export function getHealthCheck() {
  return http.get<HealthCheckResponse>("/health", undefined, {
    Accept: "application/json",
  });
}
