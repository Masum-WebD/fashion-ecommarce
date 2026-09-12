export interface ErrorLogPayload {
  type: 'image' | 'api' | 'js' | 'react' | 'server';
  status_code?: number;
  message: string;
  url?: string;
  method?: string;
  file?: string;
  line?: number;
  stack_trace?: string;
  user_id?: number;
  ip?: string;
  browser?: string;
  device?: string;
  os?: string;
  request_body?: unknown;
  response_body?: unknown;
}

/**
 * No-op in the static/fashion demo build.
 * When connecting a real backend, replace this with an actual API call.
 */
export async function logErrorToBackend(_payload: ErrorLogPayload): Promise<void> {
  // Silently drop — backend not connected in fashion static demo
}
