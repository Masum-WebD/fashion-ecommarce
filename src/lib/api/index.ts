export { API_BASE_URL } from "./config";

export { fetchSettings, type Settings, type SettingsResponse } from "./settings";

export { getImageUrl, getCategoryImageUrl } from "./images";

export {
  type Blog,
  type BlogAuthor,
  type BlogCategory,
  type BlogDetail,
  type BlogFaq,
  type BlogYoutubeVideo,
  type BlogsPaginatedData,
  type CategoryBlog,
  type CategorySectionItem,
  type FetchBlogsParams,
  isCategoryBlogEntry,
  getValidCategoryBlogs,
  findCategoryBlogBySlug,
  blogExcerpt,
  formatBlogDate,
  getBlogImageUrl,
  mapBlogsToSectionItems,
  fetchBlogCategories,
  fetchBlogs,
  fetchBlogBySlug,
} from "./blog";

export {
  type Slider,
  type Category,
  type HomePageData,
  type HomePageResponse,
  getHomeCategories,
  fetchHomePageData,
} from "./home";

export {
  type AboutPage,
  type AboutSection,
  type AboutUsData,
  type AboutUsResponse,
  getAboutSectionImageUrl,
  getActiveAboutSections,
  fetchAboutUs,
} from "./about";

export {
  type ShopCategoryChild,
  type ShopCategory,
  type ShopCategoryItem,
  type CategoriesListResponse,
  type ShopCategoryView,
  getShopCategoryImageUrl,
  fetchShopCategories,
  isShopRootCategory,
  findShopCategoryBySlug,
  getShopCategoryView,
} from "./categories";

export {
  type ProductImage,
  type AttributeCombination,
  type BranchInventory,
  type Variant,
  type NestedCategory,
  type NestedBrand,
  type Product,
  type ProductDetail,
  type PaginationInfo,
  type ProductsListResponse,
  type ProductDetailResponse,
  fetchProducts,
  getProductImages,
  fetchProductBySlug,
  formatProductPrice,
  formatOriginalPrice,
} from "./products";

export {
  type ContactData,
  type ContactResponse,
  type ContactFormPayload,
  type ContactFormResponse,
  fetchContacts,
  submitContactForm,
  extractMapEmbedSrc,
} from "./contacts";

export {
  type Customer,
  type AuthResponse,
  type RegisterResponseData,
  type LoginResponseData,
  sendRegistrationOtp,
  verifyOtp,
  registerCustomer,
  loginCustomer,
  forgotPasswordOtp,
  resetPassword,
} from "./auth";

export {
  type CustomPageListItem,
  type CustomPageProduct,
  type CustomPageDetail,
  fetchCustomPages,
  fetchCustomPageBySlug,
} from "./customPages";

export {
  type EarningsOverview,
  type ThisMonth,
  type AffiliateDashboardData,
  type AffiliateDashboardResponse,
  fetchAffiliateDashboard,
  updateAccountProfile,
  changeAccountPassword,
} from "./affiliate";



export {
  type ShippingReturnSection,
  type ShippingReturnData,
  type ShippingReturnResponse,
  fetchShippingReturns,
} from "./shippingReturns";

export { postErrorLog } from "./errorLogger";
