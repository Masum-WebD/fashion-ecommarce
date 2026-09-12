import { API_BASE_URL } from "./config";
import { ErrorLogPayload } from "../error-logger";

export const postErrorLog = async (payload: ErrorLogPayload): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/api/v1/log-error`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(payload),
    keepalive: true,
  });

  if (!response.ok) {
    throw new Error(`Failed to log error to backend. Status: ${response.status}`);
  }
};
