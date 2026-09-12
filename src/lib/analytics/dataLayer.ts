import Cookies from "js-cookie";

/**
 * Generate or retrieve a persistent cookie-based browser ID (retained for 365 days).
 */
export function getOrCreateBrowserId(): string {
  if (typeof window === "undefined") return "";
  let browserId = Cookies.get("sirajtech_browser_id");
  if (!browserId) {
    browserId = "b_" + Math.random().toString(36).substring(2, 15) + "_" + Date.now();
    Cookies.set("sirajtech_browser_id", browserId, { expires: 365, path: "/" });
  }
  return browserId;
}

/**
 * Standardize and hash strings using SHA-256 (Web Crypto API client-side, dynamic crypto import server-side).
 */
export async function hashSHA256(value: string): Promise<string> {
  const normalized = value.trim().toLowerCase();
  if (!normalized) return "";

  if (typeof window === "undefined" || !window.crypto || !window.crypto.subtle) {
    try {
      const crypto = await import("crypto");
      return crypto.createHash("sha256").update(normalized).digest("hex");
    } catch {
      return "";
    }
  }

  const msgUint8 = new TextEncoder().encode(normalized);
  const hashBuffer = await window.crypto.subtle.digest("SHA-256", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Safe client-side wrapper to push events and variables to GTM dataLayer.
 */
export function pushToDataLayer(data: Record<string, any>) {
  if (typeof window !== "undefined") {
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push(data);
  }
}

/**
 * Formats a phone number to E.164 standard (removes non-digits, ensures + prefix).
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/[^\d+]/g, "");
  if (cleaned.startsWith("0")) {
    return "+88" + cleaned; // default Bangladesh country code prefix
  }
  if (cleaned && !cleaned.startsWith("+")) {
    return "+" + cleaned;
  }
  return cleaned;
}

/**
 * Standardizes and compiles a SHA-256 hashed and raw customer user profile block for GTM Enhanced Conversions.
 */
export async function buildEnhancedUserData(rawUser: {
  first_name?: string;
  last_name?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  phone_number?: string;
  email?: string;
  external_id?: string;
  ip_address?: string;
}) {
  const email = rawUser.email || "";
  const phone = formatPhoneNumber(rawUser.phone_number || "");
  const firstName = rawUser.first_name || "";
  const lastName = rawUser.last_name || "";
  const city = rawUser.city || "";
  const state = rawUser.state || "";
  const zip = rawUser.zip_code || "";
  const country = "BD"; // Default to Bangladesh

  const browserId = getOrCreateBrowserId();
  const userAgent = typeof navigator !== "undefined" ? navigator.userAgent : "";
  const ipAddress = rawUser.ip_address || "127.0.0.1";

  // Generate SHA-256 hashes matching Google guidelines
  const hashedEmail = await hashSHA256(email);
  const hashedPhone = await hashSHA256(phone);
  const hashedFirstName = await hashSHA256(firstName);
  const hashedLastName = await hashSHA256(lastName);
  const hashedCity = await hashSHA256(city);
  const hashedState = await hashSHA256(state);
  const hashedZip = await hashSHA256(zip);
  const hashedCountry = await hashSHA256(country);

  return {
    external_id: rawUser.external_id || "",
    browser_id: browserId,
    user_agent: userAgent,
    ip_address: ipAddress,

    // Google Enhanced Conversions compliant payload (strictly hashed values)
    enhanced_user_data: {
      email: hashedEmail || undefined,
      phone_number: hashedPhone || undefined,
      address: {
        first_name: hashedFirstName || undefined,
        last_name: hashedLastName || undefined,
        city: hashedCity || undefined,
        state: hashedState || undefined,
        postal_code: hashedZip || undefined,
        country: hashedCountry || undefined,
      },
    },

    // Raw payload for Tag Manager custom code blocks and pixels that manage hashing automatically
    raw_user_data: {
      email: email || undefined,
      phone_number: phone || undefined,
      address: {
        first_name: firstName || undefined,
        last_name: lastName || undefined,
        city: city || undefined,
        state: state || undefined,
        postal_code: zip || undefined,
        country: country || undefined,
      },
    },
  };
}

/**
 * Pushes login & registration events to GTM.
 */
export async function trackUserLogin(rawUser: any) {
  try {
    const trackingData = rawUser.tracking_user_data || rawUser;
    const userData = await buildEnhancedUserData(trackingData);

    pushToDataLayer({
      event: "user_login",
      userId: userData.external_id,
      browserId: userData.browser_id,
      user_data: userData.enhanced_user_data,
      raw_user_data: userData.raw_user_data,
    });
  } catch (error) {
    console.error("trackUserLogin error:", error);
  }
}

/**
 * Pushes product addition events to GTM.
 */
export function trackAddToCart(item: any, quantity: number = 1) {
  try {
    pushToDataLayer({
      event: "add_to_cart",
      ecommerce: {
        currency: "BDT",
        value: Number(item.price) * quantity,
        items: [
          {
            item_id: String(item.id),
            item_name: item.name,
            price: Number(item.price),
            quantity: quantity,
            item_category: item.size || undefined,
          },
        ],
      },
    });
  } catch (error) {
    console.error("trackAddToCart error:", error);
  }
}

/**
 * Pushes product removal events to GTM.
 */
export function trackRemoveFromCart(item: any, quantity: number = 1) {
  try {
    pushToDataLayer({
      event: "remove_from_cart",
      ecommerce: {
        currency: "BDT",
        value: Number(item.price) * quantity,
        items: [
          {
            item_id: String(item.id),
            item_name: item.name,
            price: Number(item.price),
            quantity: quantity,
          },
        ],
      },
    });
  } catch (error) {
    console.error("trackRemoveFromCart error:", error);
  }
}

/**
 * Pushes successful purchase transactions to GTM for Conversions.
 */
export async function trackPurchase(orderState: any) {
  try {
    const trackingUser = orderState.tracking_user_data || {
      first_name: orderState.customerName?.split(" ")[0] || "",
      last_name: orderState.customerName?.split(" ").slice(1).join(" ") || "",
      city: orderState.district || "Dhaka",
      state: orderState.district || "Dhaka",
      zip_code: "1200",
      phone_number: orderState.phone,
      email: orderState.email,
      external_id: orderState.customerId || "",
      ip_address: orderState.ipAddress || "",
    };

    const userData = await buildEnhancedUserData(trackingUser);

    pushToDataLayer({
      event: "purchase",
      ecommerce: {
        transaction_id: String(orderState.orderId),
        value: Number(orderState.total),
        tax: 0,
        shipping: Number(orderState.shipping),
        currency: "BDT",
        coupon: orderState.appliedCoupon || undefined,
        items: orderState.items.map((item: any) => ({
          item_id: String(item.id),
          item_name: item.name,
          price: Number(item.price),
          quantity: Number(item.quantity),
        })),
      },
      user_data: userData.enhanced_user_data,
      browser_id: userData.browser_id,
      user_agent: userData.user_agent,
      ip_address: userData.ip_address,
      raw_user_data: userData.raw_user_data,
    });
  } catch (error) {
    console.error("trackPurchase error:", error);
  }
}

/**
 * Pushes product detail view events to GTM (GA4 view_item).
 */
export function trackViewItem(product: any) {
  try {
    const price = Number(product.sale_price || product.regular_price || 0);
    pushToDataLayer({
      event: "view_item",
      ecommerce: {
        currency: "BDT",
        value: price,
        items: [
          {
            item_id: String(product.id),
            item_name: product.name,
            price: price,
            item_category: product.category?.name || undefined,
          },
        ],
      },
    });
  } catch (error) {
    console.error("trackViewItem error:", error);
  }
}

/**
 * Pushes beginning of checkout events to GTM (GA4 begin_checkout).
 */
export function trackBeginCheckout(items: any[], subtotal: number) {
  try {
    pushToDataLayer({
      event: "begin_checkout",
      ecommerce: {
        currency: "BDT",
        value: Number(subtotal),
        items: items.map((item) => ({
          item_id: String(item.id),
          item_name: item.name,
          price: Number(item.price),
          quantity: Number(item.quantity),
          item_category: item.size || undefined,
        })),
      },
    });
  } catch (error) {
    console.error("trackBeginCheckout error:", error);
  }
}

/**
 * Pushes cart item quantity update events to GTM.
 */
export function trackQuantityUpdate(item: any, quantity: number, previousQuantity: number) {
  try {
    pushToDataLayer({
      event: "quantity_update",
      ecommerce: {
        currency: "BDT",
        value: Number(item.price) * quantity,
        previous_quantity: previousQuantity,
        new_quantity: quantity,
        items: [
          {
            item_id: String(item.id),
            item_name: item.name,
            price: Number(item.price),
            quantity: quantity,
            item_category: item.size || undefined,
          },
        ],
      },
    });
  } catch (error) {
    console.error("trackQuantityUpdate error:", error);
  }
}

