import { API_BASE_URL } from "./config";

// ─── Types ────────────────────────────────────────────────────────────

export interface Customer {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  address: string | null;
  profile_pic: string | null;
  profile_pic_url?: string | null;
  user_type_id: number | null;
  user_type?: string;
  wholesaler_panel_access?: boolean;
  created_at: string;
  updated_at: string;
  is_affiliate: boolean;
  affiliate_code: string | null;
  referred_by: string | null;
  total_referrals: number;
  total_earnings: string;
  available_balance: string;
  status: string;
  username?: string | null;
  affiliate_approved?: boolean;
  affiliate_approved_at?: string | null;
  affiliate_link?: string | null;
  affiliate?: {
    username?: string | null;
    affiliate_code: string;
    rank_label?: string | null;
    commission_percentage?: string;
    approved: boolean;
    approved_at: string | null;
    total_clicks: number;
    total_sales: number;
    total_earnings: string;
    available_balance: string;
    pending_balance: string;
    withdrawn_balance: string;
    affiliate_link?: string;
  } | null;
  tracking_user_data?: any;
}

export interface AuthResponse<T = null> {
  errors?: Record<string, string[]>;
  success: boolean;
  message: string;
  data: T;
}

export interface RegisterResponseData {
  user: Customer;
  token: string;
  // backward-compat alias
  customer?: Customer;
}

export interface LoginResponseData {
  user: Customer;
  token: string;
  // backward-compat alias
  customer?: Customer;
}

export interface VerifyOtpResponseData {
  verify_token: string;
}

// ─── Endpoints (Customer Auth - Original JSON-based) ──────────────────

/** Step 1 of registration – request OTP on the given phone number. */
export async function sendRegistrationOtp(
  phone: string
): Promise<AuthResponse> {
  const res = await fetch(
    `${API_BASE_URL}/api/v1/auth/registration-otp`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ phone }),
    }
  );
  const json: AuthResponse = await res.json();
  if (!res.ok || !json.success) throw new Error(json.errors ? Object.values(json.errors)[0][0] : (json.message || "Failed to send OTP"));
  return json;
}

/** Step 2 of registration – verify the OTP sent to the phone. */
export async function verifyOtp(
  phone: string,
  otp: string
): Promise<AuthResponse<VerifyOtpResponseData>> {
  const res = await fetch(
    `${API_BASE_URL}/api/v1/auth/verify-otp`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ phone, otp }),
    }
  );
  const json: AuthResponse<VerifyOtpResponseData> = await res.json();
  if (!res.ok || !json.success) throw new Error(json.errors ? Object.values(json.errors)[0][0] : (json.message || "OTP verification failed"));
  return json;
}

/** Step 3 of registration – create the customer account. */
export async function registerCustomer(
  name: string,
  phone: string,
  password: string,
  verifyToken: string
): Promise<AuthResponse<RegisterResponseData>> {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("phone", phone);
  formData.append("password", password);
  formData.append("verify_token", verifyToken);
  formData.append("is_affiliate", "0");

  const res = await fetch(
    `${API_BASE_URL}/api/v1/auth/register`,
    {
      method: "POST",
      headers: { 
        Accept: "application/json",
        Authorization: `Bearer ${verifyToken}`
      },
      body: formData,
    }
  );
  const json: AuthResponse<RegisterResponseData> = await res.json();
  if (!res.ok || !json.success) throw new Error(json.errors ? Object.values(json.errors)[0][0] : (json.message || "Registration failed"));
  return json;
}

/** Login with phone & password. */
export async function loginCustomer(
  phone: string,
  password: string
): Promise<AuthResponse<LoginResponseData>> {
  const res = await fetch(
    `${API_BASE_URL}/api/v1/auth/login`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ phone, password }),
    }
  );
  const json: AuthResponse<LoginResponseData> = await res.json();
  if (!res.ok || !json.success) throw new Error(json.errors ? Object.values(json.errors)[0][0] : (json.message || "Login failed"));
  return json;
}

/** Forgot password – send OTP to the phone. The API expects name + phone. */
export async function forgotPasswordOtp(
  name: string,
  phone: string
): Promise<AuthResponse> {
  const res = await fetch(
    `${API_BASE_URL}/api/v1/auth/forgot-password`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ name, phone }),
    }
  );
  const json: AuthResponse = await res.json();
  if (!res.ok || !json.success) throw new Error(json.errors ? Object.values(json.errors)[0][0] : (json.message || "Failed to send reset OTP"));
  return json;
}

/** Reset password with phone + new password (after OTP was verified via forgot-password). */
export async function resetPassword(
  phone: string,
  password: string
): Promise<AuthResponse> {
  const formData = new FormData();
  formData.append("phone", phone);
  formData.append("password", password);

  const res = await fetch(
    `${API_BASE_URL}/api/v1/auth/reset-password`,
    {
      method: "POST",
      body: formData,
      headers: { Accept: "application/json" },
    }
  );
  const json: AuthResponse = await res.json();
  if (!res.ok || !json.success) throw new Error(json.errors ? Object.values(json.errors)[0][0] : (json.message || "Password reset failed"));
  return json;
}

// ─── Endpoints (Affiliate Auth - FormData and verify_token-based) ──────

/** Step 1 of affiliate registration – send OTP to the given phone. */
export async function sendAffiliateRegistrationOtp(
  phone: string
): Promise<AuthResponse> {
  const formData = new FormData();
  formData.append("phone", phone);
  const res = await fetch(
    `${API_BASE_URL}/api/v1/auth/registration-otp`,
    {
      method: "POST",
      headers: { Accept: "application/json" },
      body: formData,
    }
  );
  const json: AuthResponse = await res.json();
  if (!res.ok || !json.success) throw new Error(json.errors ? Object.values(json.errors)[0][0] : (json.message || "Failed to send OTP"));
  return json;
}

/** Step 2 of affiliate registration – verify the OTP and get verify_token. */
export async function verifyAffiliateOtp(
  phone: string,
  otp: string
): Promise<AuthResponse<VerifyOtpResponseData>> {
  const formData = new FormData();
  formData.append("phone", phone);
  formData.append("otp", otp);
  const res = await fetch(
    `${API_BASE_URL}/api/v1/auth/verify-otp`,
    {
      method: "POST",
      headers: { Accept: "application/json" },
      body: formData,
    }
  );
  const json: AuthResponse<VerifyOtpResponseData> = await res.json();
  if (!res.ok || !json.success) throw new Error(json.errors ? Object.values(json.errors)[0][0] : (json.message || "OTP verification failed"));
  return json;
}

/** Step 3 of affiliate registration – register with verify_token. */
export async function registerAffiliate(
  name: string,
  phone: string,
  password: string,
  verifyToken: string,
  username: string
): Promise<AuthResponse<RegisterResponseData>> {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("phone", phone);
  formData.append("password", password);
  formData.append("verify_token", verifyToken);
  formData.append("is_affiliate", "true");
  formData.append("username", username);

  const res = await fetch(
    `${API_BASE_URL}/api/v1/auth/register`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${verifyToken}`
      },
      body: formData,
    }
  );
  const json: AuthResponse<RegisterResponseData> = await res.json();
  if (!res.ok || !json.success) throw new Error(json.errors ? Object.values(json.errors)[0][0] : (json.message || "Registration failed"));
  if (json.data?.user && !json.data?.customer) {
    json.data.customer = json.data.user;
  }
  return json;
}

/** Affiliate Login. */
export async function loginAffiliate(
  phone: string,
  password: string
): Promise<AuthResponse<LoginResponseData>> {
  const formData = new FormData();
  formData.append("phone", phone);
  formData.append("password", password);

  const res = await fetch(
    `${API_BASE_URL}/api/v1/auth/login`,
    {
      method: "POST",
      headers: { Accept: "application/json" },
      body: formData,
    }
  );
  const json: AuthResponse<LoginResponseData> = await res.json();
  if (!res.ok || !json.success) throw new Error(json.errors ? Object.values(json.errors)[0][0] : (json.message || "Login failed"));
  if (json.data?.user && !json.data?.customer) {
    json.data.customer = json.data.user;
  }
  return json;
}

/** Affiliate Forgot password - send OTP. */
export async function forgotAffiliatePasswordOtp(
  phone: string
): Promise<AuthResponse> {
  const formData = new FormData();
  formData.append("phone", phone);
  const res = await fetch(
    `${API_BASE_URL}/api/v1/auth/forgot-password`,
    {
      method: "POST",
      headers: { Accept: "application/json" },
      body: formData,
    }
  );
  const json: AuthResponse = await res.json();
  if (!res.ok || !json.success) throw new Error(json.errors ? Object.values(json.errors)[0][0] : (json.message || "Failed to send reset OTP"));
  return json;
}

/** Reset affiliate password. */
export async function resetAffiliatePassword(
  phone: string,
  password: string
): Promise<AuthResponse> {
  const formData = new FormData();
  formData.append("phone", phone);
  formData.append("password", password);

  const res = await fetch(
    `${API_BASE_URL}/api/v1/auth/reset-password`,
    {
      method: "POST",
      body: formData,
      headers: { Accept: "application/json" },
    }
  );
  const json: AuthResponse = await res.json();
  if (!res.ok || !json.success) throw new Error(json.errors ? Object.values(json.errors)[0][0] : (json.message || "Password reset failed"));
  return json;
}

/** Logout – invalidate server-side token. */
export async function logoutUser(token: string): Promise<AuthResponse> {
  const res = await fetch(
    `${API_BASE_URL}/api/v1/auth/logout`,
    {
      method: "POST",
      headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
    }
  );
  const json: AuthResponse = await res.json();
  return json;
}
