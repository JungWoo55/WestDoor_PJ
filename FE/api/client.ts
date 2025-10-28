import type { ApiResponse } from "lib/types/database"
import AsyncStorage from "@react-native-async-storage/async-storage"

type UpdateProfileJson = {
  nickname?: string
}

let refreshPromise: Promise<Response> | null = null

const RETRYABLE = new Set([429, 503, 504])
const DEFAULT_TIMEOUT_MS = 15_000

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

class ApiClient {
  private baseUrl: string
  constructor(baseUrl = process.env.EXPO_PUBLIC_API_URL) {
    this.baseUrl = (baseUrl || "/_be").replace(/\/$/, "")
  }

  private buildUrl(endpoint: string) {
    const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`
    return `${this.baseUrl}${path}`
  }

  /** 공통 요청 래퍼 */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    _retrying = false,
    _fromRefresh = false,
  ): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint)

    // --- Headers
    const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData
    const headers: HeadersInit = { ...(options.headers || {}) }
    const method = (options.method || "GET").toUpperCase()

    if (!isFormData) {
      if (method !== "GET" && !("Content-Type" in headers)) {
        ;(headers as Record<string, string>)["Content-Type"] = "application/json"
      }
      if (!("Accept" in headers)) {
        ;(headers as Record<string, string>)["Accept"] = "application/json"
      }
    }

    // Authorization 헤더: localStorage -> AsyncStorage (비동기 처리)
    const token = await AsyncStorage.getItem("accessToken")
    if (token && !("Authorization" in headers)) {
      ;(headers as Record<string, string>)["Authorization"] = `Bearer ${token}`
    }

    // Timeout
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS)

    try {
      const res = await fetch(url, {
        cache: "no-store",
        ...options,
        headers,
        signal: controller.signal,
      })

      // 401 → refresh 1회 (AsyncStorage + body 사용)
      if (res.status === 401 && !_retrying && !_fromRefresh) {
        if (!refreshPromise) {
          // 비동기 IIFE로 refreshPromise를 생성
          refreshPromise = (async () => {
            const refreshToken = await AsyncStorage.getItem("refreshToken")
            if (!refreshToken) {
              throw new Error("AUTH_EXPIRED: No refresh token")
            }

            const rr = await fetch(this.buildUrl("/auth/refresh"), {
              method: "POST",
              cache: "no-store",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
              // 리프레시 토큰을 body에 담아 전송
              body: JSON.stringify({ refreshToken }),
            })

            if (!rr.ok) {
              throw new Error("AUTH_EXPIRED: Refresh failed")
            }

            const resJson = await rr.json()
            // 서버의 새 토큰 응답 형식 (login과 동일하게 맞춤)
            const newTokens = resJson.data?.tokens

            if (!newTokens?.access || !newTokens?.refresh) {
              throw new Error("AUTH_EXPIRED: Invalid new tokens")
            }

            //  새 토큰을 AsyncStorage에 저장
            await AsyncStorage.setItem("accessToken", newTokens.access)
            await AsyncStorage.setItem("refreshToken", newTokens.refresh)

            return rr
          })().finally(() => {
            refreshPromise = null
          })
        }

        try {
          await refreshPromise // 리프레시가 성공할 때까지 대기
          return this.request<T>(endpoint, options, true, true) // 원래 요청 재시도
        } catch (refreshError: any) {
          console.error("Refresh failed:", refreshError.message);
          //  리프레시 실패 시, 스토리지 비우기
          await AsyncStorage.removeItem("accessToken")
          await AsyncStorage.removeItem("refreshToken")
          await AsyncStorage.removeItem("userId")

          // alert, window.location 대신 에러 반환 (UI는 호출 측에서 처리)
          return { success: false, error: "AUTH_EXPIRED" } as ApiResponse<T>
        }
      }

      // 재시도 가능한 상태코드
      if (!res.ok) {
        if (RETRYABLE.has(res.status) && !_retrying) {
          await sleep(800)
          return this.request<T>(endpoint, options, true)
        }

        const bodyText = await res.text().catch(() => "")
        let message = res.statusText || `HTTP ${res.status}`
        try {
          const j = bodyText ? JSON.parse(bodyText) : {}
          // BE 응답 형식에 맞게 에러 메시지 파싱
          message = (j as any)?.error?.reason || (j as any)?.message || (j as any)?.error || message
          console.error("[API 4xx/5xx]", res.status, j)
        } catch {
          console.error("[API 4xx/5xx]", res.status, bodyText)
        }
        return { success: false, error: `HTTP ${res.status}: ${message}` } as ApiResponse<T>
      }

      const text = await res.text()
      let data: any = {}
      try {
        data = text ? JSON.parse(text) : {}
      } catch {
        data = { success: true, data: text }
      }

      // BE → FE 표준 정규화 (이 부분은 서버 응답 형식이므로 동일함)
      if (data && typeof data === "object" && "resultType" in data) {
        const { resultType, error } = data
        if (String(resultType).toUpperCase() === "SUCCESS") {
          // BE 응답 형식에 맞게 데이터 추출 
          return { success: true, data: (data.data ?? null) as T }
        }
        const reason = error?.reason || error?.message || "요청이 실패했어요."
        return { success: false, error: reason } as ApiResponse<T>
      }

      if (typeof data?.success === "boolean") return data as ApiResponse<T>
      return { success: true, data } as ApiResponse<T>
    } catch (error: any) {
      const msg = error?.name === "AbortError" ? "요청이 시간 초과되었습니다." : (error instanceof Error ? error.message : "Unknown error occurred")
      console.error("[API request failed]", msg)
      return { success: false, error: msg } as ApiResponse<T>
    } finally {
      clearTimeout(timeout)
    }
  }

  // ───────── Auth
  async login(email: string, password: string) {
    return this.request("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) })
  }

  // logout: refreshToken을 body에 담아 전송 + 스토리지 비우기
  async logout() {
    const refreshToken = await AsyncStorage.getItem("refreshToken")
    const res = await this.request(
      "/auth/logout",
      {
        method: "POST",
        body: JSON.stringify({ refreshToken }),
      },
      false, // _retrying = false
      true, // _fromRefresh = true (401 루프 방지)
    )

    // 로그아웃 성공 시 스토리지 정리
    if (res.success) {
      await AsyncStorage.removeItem("accessToken")
      await AsyncStorage.removeItem("refreshToken")
      await AsyncStorage.removeItem("userId")
    }
    return res
  }

  async signup(email: string, password: string) {
    return this.request("/auth/signup", { method: "POST", body: JSON.stringify({ email, password }) })
  }

  // refresh: refreshToken을 body에 담아 전송 (401 루프 방지)
  async refresh() {
    const refreshToken = await AsyncStorage.getItem("refreshToken")
    return this.request(
      "/auth/refresh",
      {
        method: "POST",
        body: JSON.stringify({ refreshToken }),
      },
      false, // _retrying = false
      true, // _fromRefresh = true (401 루프 방지)
    )
  }

  async updateProfile(payload: FormData | UpdateProfileJson) {
    if (payload instanceof FormData) {
      return this.request("/auth/profile", { method: "POST", body: payload })
    }
    const body: UpdateProfileJson = {}
    if (typeof payload.nickname === "string" && payload.nickname.trim()) body.nickname = payload.nickname.trim()
    return this.request("/auth/profile", { method: "POST", body: JSON.stringify(body) })
  }
  async updateProfileMultipart(form: FormData) {
    return this.request("/auth/profile", { method: "POST", body: form })
  }
}

// 싱글턴 인스턴스 export
export const apiClient = new ApiClient()