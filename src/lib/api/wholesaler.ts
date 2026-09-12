import { API_BASE_URL } from "./config";

export interface WholesalerOrder {
  id: number;
  order_no: string;
  order_type: string;
  date: string;
  status: string;
  total_amount: number;
  advance_amount: number;
  due_amount: number;
  customer?: {
    id: number;
    name: string;
    phone: string;
  };
  office?: {
    id: number;
    name: string;
  };
}

export const fetchWholesalerOrders = async (token: string, params?: { page?: number, per_page?: number, status?: string, search?: string }) => {
  const query = new URLSearchParams();
  if (params?.page) query.append('page', params.page.toString());
  if (params?.per_page) query.append('per_page', params.per_page.toString());
  if (params?.status) query.append('status', params.status);
  if (params?.search) query.append('search', params.search);

  const res = await fetch(`${API_BASE_URL}/api/v1/dashboard/wholesaler/orders?${query.toString()}`, {
    headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch wholesaler orders");
  return res.json();
}

export async function fetchWholesalerOrderDetails(token: string, orderId: string | number) {
  const res = await fetch(`${API_BASE_URL}/api/v1/dashboard/wholesaler/orders/${orderId}`, {
    headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch order details");
  return data;
}

export async function searchCustomerByPhone(token: string, q: string) {
  const res = await fetch(`${API_BASE_URL}/api/v1/dashboard/wholesaler/customers/search?q=${encodeURIComponent(q)}`, {
    headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to search customer");
  return data;
}

export async function createWholesalerOrder(token: string, orderData: any) {
  const res = await fetch(`${API_BASE_URL}/api/v1/dashboard/wholesaler/orders`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      Accept: "application/json", 
      Authorization: `Bearer ${token}` 
    },
    body: JSON.stringify(orderData),
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || "Failed to create order");
  return data;
}

export async function fetchWholesalerProducts(token: string) {
  const res = await fetch(`${API_BASE_URL}/api/v1/dashboard/wholesaler/products`, {
    headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

