import { API_BASE_URL } from "./config";

export interface AffiliateHelpResponse {
  success: boolean;
  message: string;
  data: {
    help_content: string;
  };
}

export interface PayoutDetails {
  id: number;
  customer_id?: number;
  method_name: string;
  account_details: string;
  created_at?: string;
  updated_at?: string;
}

export interface PayoutDetailsResponse {
  success: boolean;
  message: string;
  data: PayoutDetails | null;
}

export interface EarningsOverview {
  date: string;
  earnings: number;
}

export interface ThisMonth {
  total_referrals: number;
  total_earnings: number;
  unverified_referrals: number;
  clicks: number;
  conversion_rate: number;
}

export interface AffiliateDashboardData {
  total_referrals: number;
  paid_referrals: number;
  unpaid_referrals: number;
  total_payout_transactions: number;
  withdrawn_earnings: number;
  current_balance: number;
  total_earnings: number;
  total_clicks: number;
  earnings_overview: EarningsOverview[];
  this_month: ThisMonth;
}

export interface AffiliateDashboardResponse {
  success: boolean;
  message: string;
  data: AffiliateDashboardData;
}

/**
 * Fetch affiliate help/guide content
 */
export async function fetchAffiliateHelp(token: string): Promise<AffiliateHelpResponse> {
  const res = await fetch(`${API_BASE_URL}/api/v1/affiliate/help`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const json: AffiliateHelpResponse = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to fetch help content");
  }
  return json;
}

/**
 * Fetch affiliate dashboard stats and activity metrics.
 */
export async function fetchAffiliateDashboard(token: string): Promise<AffiliateDashboardResponse> {
  const res = await fetch(`${API_BASE_URL}/api/v1/dashboard/affiliate/dashboard`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const json: AffiliateDashboardResponse = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to fetch affiliate dashboard data");
  }
  return json;
}

/**
 * Update account profile info (name, email, address, profile_pic)
 */
export async function updateAccountProfile(token: string, formData: FormData): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/api/v1/dashboard/account/update`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to update profile");
  }
  return json;
}

/**
 * Fetch payout details
 */
export async function fetchPayoutDetails(token: string): Promise<PayoutDetailsResponse> {
  const res = await fetch(`${API_BASE_URL}/api/v1/dashboard/affiliate/payout-details`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const json: PayoutDetailsResponse = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to fetch payout details");
  }
  return json;
}

/**
 * Update payout details
 */
export async function updatePayoutDetails(token: string, formData: FormData): Promise<PayoutDetailsResponse> {
  const res = await fetch(`${API_BASE_URL}/api/v1/dashboard/affiliate/payout-details`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const json: PayoutDetailsResponse = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to update payout details");
  }
  return json;
}

/**
 * Change account password
 */
export async function changeAccountPassword(token: string, formData: FormData): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/api/v1/dashboard/account/change-password`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to change password");
  }
  return json;
}

export interface CommissionDetails {
  source: string;
  type: string;
  commission_percent: number | null;
  commission_flat: number | null;
}

export interface CategoryLite {
  id: number;
  name: string;
  slug?: string;
}

export interface SubCategoryLite {
  id: number;
  name: string;
}

export interface ProductCommission {
  id: number;
  name: string;
  slug: string;
  sku: string | null;
  thumbnail_url: string;
  category: CategoryLite;
  sub_category: SubCategoryLite | null;
  commission: CommissionDetails;
  affiliate_link: string;
}

export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface ProductCommissionData {
  current_page: number;
  data: ProductCommission[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: PaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface ProductCommissionResponse {
  success: boolean;
  message: string;
  data: ProductCommissionData;
}

export interface FetchProductCommissionsParams {
  search?: string;
  category_id?: string;
  sub_category_id?: string;
  sort_by?: string;
  per_page?: string;
  page?: string;
}

/**
 * Fetch affiliate product commissions with filters
 */
export async function fetchProductCommissions(
  token: string,
  params?: FetchProductCommissionsParams
): Promise<ProductCommissionResponse> {
  const queryParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });
  }

  const queryString = queryParams.toString();
  const url = `${API_BASE_URL}/api/v1/dashboard/affiliate/product-commissions${queryString ? `?${queryString}` : ""}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const json: ProductCommissionResponse = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to fetch product commissions");
  }
  return json;
}

export interface AffiliateTrackingResponse {
  success: boolean;
  message: string;
  data: {
    affiliate_id: number;
    campaign_id: number | null;
    campaign: string | null;
    status: string;
    cookie_days: number;
    tracked: boolean;
  };
}

/**
 * Track an affiliate click
 */
export async function trackAffiliateClick(
  code: string,
  cmp?: string | null
): Promise<AffiliateTrackingResponse> {
  const url = new URL(`${API_BASE_URL}/api/v1/affiliate-tracking`);
  url.searchParams.append("code", code);
  if (cmp) {
    url.searchParams.append("cmp", cmp);
  }

  const res = await fetch(url.toString(), {
    method: "GET",
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    return {
      success: false,
      message: json.message || "Failed to track affiliate",
      data: null as any,
    };
  }
  return json;
}



// ─── Referrals ────────────────────────────────────────────────────────

export interface Referral {
  id: number;
  affiliate_id: number;
  customer_id: number | null;
  campaign_id: number | null;
  ip_address: string;
  landing_url: string;
  status: string;
  converted_at: string | null;
  created_at: string;
  updated_at: string;
  customer: any;
  campaign: any;
}

export interface ReferralStats {
  total: number;
  visited: number;
  registered: number;
  converted: number;
}

export interface ReferralsPaginated {
  current_page: number;
  data: Referral[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: PaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface ReferralsResponse {
  success: boolean;
  message: string;
  data: {
    referrals: ReferralsPaginated;
    stats: ReferralStats;
  };
}

export interface ReferralDetailsResponse {
  success: boolean;
  message: string;
  data: Referral;
}

export interface FetchReferralsParams {
  page?: number;
  per_page?: number;
  status?: string;
  campaign_id?: string | number;
  start_date?: string;
  end_date?: string;
  order_by?: "asc" | "desc";
}

export async function fetchReferrals(
  token: string,
  params?: FetchReferralsParams
): Promise<ReferralsResponse> {
  const url = new URL(`${API_BASE_URL}/api/v1/dashboard/affiliate/referrals`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.append(key, String(value));
      }
    });
  }

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to fetch referrals");
  }
  return json;
}

export async function fetchReferralDetails(
  token: string,
  id: number | string
): Promise<ReferralDetailsResponse> {
  const res = await fetch(`${API_BASE_URL}/api/v1/dashboard/affiliate/referrals/${id}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to fetch referral details");
  }
  return json;
}

// ─── Campaigns ────────────────────────────────────────────────────────

export interface Campaign {
  id: number;
  affiliate_id: number;
  name: string;
  slug: string;
  destination_url: string;
  description: string | null;
  status: boolean;
  total_clicks: number;
  registrations: number;
  conversions: number;
  affiliate_link: string;
  created_at: string;
  updated_at: string;
}

export interface CampaignsResponse {
  success: boolean;
  message: string;
  data: Campaign[];
}

export interface CreateCampaignPayload {
  name: string;
  destination_url: string;
  description?: string;
}

export async function fetchCampaigns(token: string): Promise<CampaignsResponse> {
  const res = await fetch(`${API_BASE_URL}/api/v1/dashboard/affiliate/campaigns`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to fetch campaigns");
  }
  return json;
}

export async function createCampaign(
  token: string,
  payload: CreateCampaignPayload
): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/api/v1/dashboard/affiliate/campaigns`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    if (json.errors) {
      const errorMessages = Object.values(json.errors)
        .flat()
        .join("\n");
      throw new Error(errorMessages || json.message || "Failed to create campaign");
    }
    throw new Error(json.message || "Failed to create campaign");
  }
  return json;
}

// ─── Creatives ────────────────────────────────────────────────────────

export interface Creative {
  id: number;
  name: string;
  description: string | null;
  banner_size: string;
  banner_image: string;
  link: string;
  status: number;
  created_at: string;
  updated_at: string;
  affiliate_link: string;
  html_code: string;
}

export interface CreativesResponse {
  success: boolean;
  message: string;
  data: Creative[];
}

export async function fetchCreatives(token: string): Promise<CreativesResponse> {
  const res = await fetch(`${API_BASE_URL}/api/v1/dashboard/affiliate/creatives`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to fetch creatives");
  }
  return json;
}

// ─── Withdrawals ────────────────────────────────────────────────────────

export interface WithdrawalStat {
  total_withdrawals: number;
  pending_amount: number;
  paid_amount: number;
  rejected_amount: number;
  available_balance: number;
}

export interface WithdrawalCommission {
  id: number;
  order_id: number | null;
  amount: number;
  type: string;
  order_amount: number | null;
  created_at: string;
  order: {
    id: number;
    order_no?: string;
    invoice_no?: string;
    total_amount?: number;
    total?: number;
  } | null;
}

export interface Withdrawal {
  id: number;
  affiliate_id: number;
  amount: number;
  status: "pending" | "paid" | "rejected";
  created_at: string;
  updated_at: string;
  commissions?: WithdrawalCommission[];
}

export interface PendingCommissionsData {
  commissions: WithdrawalCommission[];
  total_amount: number;
  commissions_count: number;
}

export interface PendingCommissionsResponse {
  success: boolean;
  message: string;
  data: PendingCommissionsData;
}

export interface WithdrawalsPaginated {
  current_page: number;
  data: Withdrawal[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: PaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface WithdrawalsResponse {
  success: boolean;
  message: string;
  data: {
    stats: WithdrawalStat;
    withdrawals: WithdrawalsPaginated;
  };
}

export interface FetchWithdrawalsParams {
  status?: string;
  start_date?: string;
  end_date?: string;
  per_page?: string | number;
  order_by?: "asc" | "desc";
  page?: string | number;
}

export async function fetchWithdrawals(
  token: string,
  params?: FetchWithdrawalsParams
): Promise<WithdrawalsResponse> {
  const url = new URL(`${API_BASE_URL}/api/v1/dashboard/affiliate/withdrawals`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.append(key, String(value));
      }
    });
  }

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to fetch withdrawals");
  }
  return json;
}

export async function fetchWithdrawal(token: string, id: string | number): Promise<{ success: boolean; message: string; data: any }> {
  const res = await fetch(`${API_BASE_URL}/api/v1/dashboard/affiliate/withdrawals/${id}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to fetch withdrawal details");
  }
  return json;
}

export async function createWithdrawal(
  token: string,
  amount: number
): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/api/v1/dashboard/affiliate/withdrawals`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ amount }),
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to create withdrawal request");
  }
  return json;
}

export async function fetchPendingCommissions(
  token: string
): Promise<PendingCommissionsResponse> {
  const res = await fetch(`${API_BASE_URL}/api/v1/dashboard/affiliate/withdrawals/pending-commissions`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to fetch pending commissions");
  }
  return json;
}

// ─── Settings ────────────────────────────────────────────────────────

export interface AffiliateSettingsContent {
  terms_and_conditions: string | null;
  help_content: string | null;
  commission_policy: string | null;
  withdraw_policy: string | null;
  minimum_withdraw_amount: number;
}

export interface AffiliateSettingsResponse {
  success: boolean;
  message: string;
  data: AffiliateSettingsContent;
}

export async function fetchAffiliateSettings(token: string): Promise<AffiliateSettingsResponse> {
  const res = await fetch(`${API_BASE_URL}/api/v1/dashboard/affiliate/settings/content`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to fetch settings");
  }
  return json;
}

// --- Reports --------------------------------------------------------

export interface ReportSummary {
  total_earnings: number;
  available_balance: number;
  pending_balance: number;
  withdrawn_balance: number;
  total_referrals: number;
  total_clicks: number;
  total_conversions: number;
  verified_commissions: number;
  this_month_earnings: number;
  this_month_referrals: number;
  conversion_rate: number;
}

export interface ReportSummaryResponse {
  success: boolean;
  message: string;
  data: ReportSummary;
}

export async function fetchReportSummary(token: string): Promise<ReportSummaryResponse> {
  const res = await fetch(`${API_BASE_URL}/api/v1/dashboard/affiliate/reports/summary`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to fetch report summary");
  }
  return json;
}

export interface ReportCampaign {
  id: number;
  affiliate_id: number;
  name: string;
  slug: string;
  destination_url: string;
  description: string;
  status: boolean;
  created_at: string;
  updated_at: string;
  total_clicks: number;
  registrations: number;
  conversions: number;
  conversion_rate: number;
}

export interface ReportCampaignsResponse {
  success: boolean;
  message: string;
  data: ReportCampaign[];
}

export async function fetchReportCampaigns(token: string): Promise<ReportCampaignsResponse> {
  const res = await fetch(`${API_BASE_URL}/api/v1/dashboard/affiliate/reports/campaigns`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to fetch campaign reports");
  }
  return json;
}

// --- Referred Orders --------------------------------------------------

export interface ReferredOrderItem {
  product_name: string;
  quantity: number;
  price: number;
  total: number;
}

export interface ReferredOrder {
  id: number;
  order_no: string;
  date: string;
  status: string;
  payment_type: string;
  sale_amount: number;
  courier_charge: number;
  total_amount: number;
  advance_amount: number;
  due_amount: number;
  is_paid: boolean;
  commission_amount: number;
  commission_status: string;
  items: ReferredOrderItem[];
  created_at: string;
}

export interface ReferredOrdersData {
  current_page: number;
  data: ReferredOrder[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: PaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface ReferredOrdersSummary {
  total_orders: number;
  total_revenue: number;
}

export interface ReferredOrdersResponse {
  success: boolean;
  message: string;
  data: {
    orders: ReferredOrdersData;
    total_referred_customers: number;
    summary: ReferredOrdersSummary;
  };
}

export interface FetchReferredOrdersParams {
  page?: string | number;
  status?: string;
  date_from?: string;
  date_to?: string;
  order_id?: string | number;
}

export async function fetchReferredOrders(
  token: string,
  params?: FetchReferredOrdersParams
): Promise<ReferredOrdersResponse> {
  const queryParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value) queryParams.append(key, String(value));
    });
  }

  const queryString = queryParams.toString();
  const url = `${API_BASE_URL}/api/v1/dashboard/affiliate/orders${queryString ? `?${queryString}` : ""}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to fetch referred orders");
  }
  return json;
}

