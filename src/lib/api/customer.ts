import { API_BASE_URL } from "./config";

// ─── Types ────────────────────────────────────────────────────────────

export interface CustomerDashboardStats {
  total_orders: number;
  active_orders: number;
  completed_orders: number;
  cancelled_orders: number;
  total_spent: number;
  this_month_orders: number;
}

export interface MonthlyChartPoint {
  name: string;   // "Jan", "Feb", …
  value: number;  // total amount spent that month
}

export interface RecentOrder {
  id: number;
  order_no: string;
  date: string;
  status: string;
  payment_type: string;
  total_amount: number;
  courier_charge: number;
  discount_amount: number;
  items_count: number;
  items_summary: string;
}

export interface CustomerDashboardData {
  stats: CustomerDashboardStats;
  monthly_chart: MonthlyChartPoint[];
  recent_orders: RecentOrder[];
}

export interface CustomerDashboardResponse {
  success: boolean;
  message: string;
  data: CustomerDashboardData;
}

// ─── API Call ─────────────────────────────────────────────────────────

/**
 * GET /api/v1/dashboard/customer/overview
 * Requires Sanctum Bearer token.
 */
export async function fetchCustomerDashboard(
  token: string
): Promise<CustomerDashboardResponse> {
  const res = await fetch(
    `${API_BASE_URL}/api/v1/dashboard/customer/overview`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const json: CustomerDashboardResponse = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to fetch customer dashboard data");
  }
  return json;
}

// ─── Password ────────────────────────────────────────────────────────

export async function changeCustomerPassword(
  data: any,
  token: string
): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${API_BASE_URL}/api/v1/dashboard/account/change-password`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to change password");
  }
  return json;
}

export interface OrderPagination {
  current_page: number;
  data: RecentOrder[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: any[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface CustomerOrdersResponse {
  success: boolean;
  message: string;
  data: OrderPagination;
}

export async function fetchCustomerOrders(
  token: string,
  page: number = 1
): Promise<CustomerOrdersResponse> {
  const res = await fetch(
    `${API_BASE_URL}/api/v1/dashboard/customer/orders?page=${page}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const json: CustomerOrdersResponse = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to fetch orders");
  }
  return json;
}

export interface OrderDetail {
  id: number;
  order_no: string;
  date: string;
  status: string;
  payment_type: string;
  payment_status: string;
  shipping_address: {
    name: string;
    phone: string;
    address: string;
    city?: string;
    postalCode?: string;
  };
  items: {
    id: number;
    name: string;
    quantity: number;
    price: number;
    total: number;
    image: string | null;
  }[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  tracking: {
    courier: string | null;
    tracking_no: string | null;
    estimatedDelivery?: string;
  };
  timeline: {
    status: string;
    date: string;
    completed: boolean;
  }[];
}

export interface CustomerOrderDetailResponse {
  success: boolean;
  message: string;
  data: OrderDetail;
}

export async function fetchCustomerOrder(
  token: string,
  orderId: string
): Promise<CustomerOrderDetailResponse> {
  const res = await fetch(
    `${API_BASE_URL}/api/v1/dashboard/customer/orders/${orderId}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const json: CustomerOrderDetailResponse = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to fetch order details");
  }
  return json;
}

// ── Profile Update ──────────────────────────────────────────────────
export async function updateCustomerProfile(
  data: FormData,
  token: string
): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/api/v1/dashboard/account/update`, {
    method: "POST", // The route is POST in laravel, might need _method=PUT if it was put, but it's POST
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      // Do not set Content-Type for FormData, browser sets it automatically with boundary
    },
    body: data,
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to update profile");
  }
  return json;
}
