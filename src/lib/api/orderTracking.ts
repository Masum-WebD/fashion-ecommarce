import { API_BASE_URL } from "./config";

export interface TrackOrderRequest {
  query: string;
}

export interface TrackOrderResponse {
  success: boolean;
  message: string;
  data?: any; // The full order details
}

export const trackOrder = async (payload: TrackOrderRequest): Promise<TrackOrderResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/v1/order-status`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(payload)
  });
  
  return response.json();
};
