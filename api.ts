/**
 * @file This file documents the complete API contract for the Merch & Custom T-shirt Website.
 * @version 1.0.0
 *
 * Backend: Supabase (Postgres + Storage + RPC + RLS)
 * Auth: Email/Password
 * Consumers: Customer Website + Admin Dashboard
 * Format: REST + RPC
 * Response: JSON only
 */

// =================================================================
// 0. GLOBAL API RULES
// =================================================================

/**
 * The base URL for all customer-facing API endpoints.
 * @example /api/products
 */
const CUSTOMER_API_BASE = '/api';

/**
 * The base URL for all admin-facing API endpoints.
 * @example /api/admin/dashboard
 */
const ADMIN_API_BASE = '/api/admin';

// --- 0.2 Authentication ---

/**
 * All authenticated customer requests must include this header.
 * @example Authorization: Bearer <customer_token>
 */
type CustomerAuthHeader = { 'Authorization': `Bearer ${string}` };

/**
 * All authenticated admin requests must include this header.
 * The token will contain role information.
 * @example Authorization: Bearer <admin_token>
 */
type AdminAuthHeader = { 'Authorization': `Bearer ${string}` };

// --- 0.3 Response Shape ---

interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

interface ApiPaginatedResponse<T> extends ApiSuccessResponse<T[]> {
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}

interface ApiErrorResponse {
  success: false;
  error: {
    code: 'UNAUTHORIZED' | 'FORBIDDEN' | 'NOT_FOUND' | 'INVALID_INPUT' | 'CONFLICT' | 'INTERNAL_ERROR';
    message: string;
  };
}

type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
type PaginatedApiResponse<T> = ApiPaginatedResponse<T> | ApiErrorResponse;


// =================================================================
// 1. AUTH & PROFILE APIs
// =================================================================

// --- 1.1 Customer Signup ---
/**
 * POST /auth/signup
 * Creates a new customer account.
 */
interface SignupRequest {
  name: string;
  email: string;
  password: string; // Min 8 characters
}
type SignupResponse = ApiResponse<{
  user: import('./types').User;
  token: string;
}>;


// --- 1.2 Customer Login ---
/**
 * POST /auth/login
 * Logs in an existing customer.
 */
interface LoginRequest {
  email: string;
  password: string;
}
type LoginResponse = ApiResponse<{
  user: import('./types').User;
  token: string;
}>;


// --- 1.3 Get Current Customer ---
/**
 * GET /auth/me
 * Retrieves the profile of the currently logged-in customer.
 * Requires: Customer Authentication
 */
type GetMeResponse = ApiResponse<import('./types').User>;


// --- 1.4 Update Profile ---
/**
 * PUT /me
 * Updates the profile of the currently logged-in customer.
 * Requires: Customer Authentication
 */
interface UpdateProfileRequest {
  name?: string;
  address?: string;
  city?: string;
  postal_code?: string;
}
type UpdateProfileResponse = ApiResponse<import('./types').User>;


// --- 1.5 Admin Login ---
/**
 * POST /admin/auth/login
 * Logs in an admin user.
 */
// LoginRequest can be reused here.
type AdminLoginResponse = ApiResponse<{
  admin: import('./types').AdminUser;
  token: string;
}>;


// --- 1.6 Get Current Admin ---
/**
 * GET /admin/auth/me
 * Retrieves the profile of the currently logged-in admin.
 * Requires: Admin Authentication
 */
type GetCurrentAdminResponse = ApiResponse<import('./types').AdminUser>;


// =================================================================
// 2. PRODUCT & CONTENT APIs (PUBLIC)
// =================================================================

// --- 2.1 List Products ---
/**
 * GET /products
 * Retrieves a paginated list of products.
 */
interface ListProductsQueryParams {
  category?: string;
  collection?: string;
  search?: string;
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'best_seller';
  page?: number;
  limit?: number;
}
type ListProductsResponse = PaginatedApiResponse<import('./types').Product>;


// --- 2.2 Get Product ---
/**
 * GET /products/{id}
 * Retrieves a single product by its ID.
 */
type GetProductResponse = ApiResponse<import('./types').Product>;


// --- 2.3 Related Products ---
/**
 * GET /products/{id}/related
 * Retrieves a list of products related to the given product ID.
 */
type GetRelatedProductsResponse = ApiResponse<import('./types').Product[]>;


// --- 2.4 Collections ---
/**
 * GET /collections
 * Retrieves a list of all product collections.
 */
type GetCollectionsResponse = ApiResponse<import('./types').Collection[]>;


// --- 2.5 Home Content ---
/**
 * GET /content/home
 * Retrieves content needed for the homepage.
 */
interface HomeContent {
    announcementBarText: string;
    heroSlides: import('./types').HeroSlide[];
    // Info for the "Create Your Own" split card
    customCta: {
        title: string;
        subtitle: string;
        imageUrl: string;
    };
}
type GetHomeContentResponse = ApiResponse<HomeContent>;


// --- 2.6 FAQ ---
/**
 * GET /faq
 * Retrieves a list of frequently asked questions.
 */
interface FaqItem {
    id: string;
    question: string;
    answer: string;
}
type GetFaqResponse = ApiResponse<FaqItem[]>;


// --- 2.7 Size Guide ---
/**
 * GET /size-guide
 * Retrieves the size guide information.
 */
interface SizeGuide {
    // Structure can be defined based on how it's stored, e.g., HTML content or structured data
    htmlContent: string;
}
type GetSizeGuideResponse = ApiResponse<SizeGuide>;


// =================================================================
// 3. CART & CHECKOUT (AUTH REQUIRED)
// =================================================================

// --- 3.1 Get Cart ---
/**
 * GET /cart
 * Retrieves the current user's shopping cart.
 * Requires: Customer Authentication
 */
type GetCartResponse = ApiResponse<import('./types').CartItem[]>;


// --- 3.2 Add to Cart ---
/**
 * POST /cart/items
 * Adds an item to the shopping cart.
 * Requires: Customer Authentication
 */
interface AddToCartRequest {
  product_id: string;
  size: string;
  color: string;
  quantity: number;
}
type AddToCartResponse = ApiResponse<import('./types').CartItem>;


// --- 3.3 Update Cart Item ---
/**
 * PUT /cart/items/{id}
 * Updates the quantity of an item in the cart.
 * Requires: Customer Authentication
 */
interface UpdateCartItemRequest {
  quantity: number;
}
type UpdateCartItemResponse = ApiResponse<import('./types').CartItem>;


// --- 3.4 Remove Cart Item ---
/**
 * DELETE /cart/items/{id}
 * Removes an item from the cart.
 * Requires: Customer Authentication
 */
type RemoveCartItemResponse = ApiResponse<{ success: true }>;


// --- 3.5 Checkout / Create Order ---
/**
 * POST /checkout
 * Creates a new order from the current cart.
 * Requires: Customer Authentication
 */
interface CheckoutRequest {
  shipping: {
    name: string;
    address: string;
    city: string;
    postal_code: string;
    phone: string; 
  };
  payment_method: 'COD';
}
type CheckoutResponse = ApiResponse<{ orderId: string }>;


// =================================================================
// 4. ORDERS (AUTH REQUIRED)
// =================================================================

// --- 4.1 List My Orders ---
/**
 * GET /orders
 * Retrieves a paginated list of the current user's orders.
 * Requires: Customer Authentication
 */
type GetMyOrdersResponse = PaginatedApiResponse<import('./types').Order>;


// --- 4.2 Get Order Details ---
/**
 * GET /orders/{id}
 * Retrieves details for a specific order.
 * Requires: Customer Authentication
 */
type GetOrderDetailsResponse = ApiResponse<import('./types').Order>;


// --- 4.3 Buy Again ---
/**
 * POST /orders/{id}/reorder
 * Adds all items from a previous order to the current cart.
 * Requires: Customer Authentication
 */
type ReorderResponse = ApiResponse<{ message: 'Items added to cart.' }>;


// =================================================================
// 5. CUSTOM T-SHIRT REQUESTS (AUTH REQUIRED)
// =================================================================

// --- 5.1 Create Custom Request ---
/**
 * POST /custom-requests
 * Submits a new custom t-shirt design request.
 * Requires: Customer Authentication
 */
interface CreateCustomRequest {
  color: string;
  size: string;
  placement: 'front' | 'back' | 'both';
  description: string;
  image_url?: string; // URL from Supabase Storage after upload
}
type CreateCustomRequestResponse = ApiResponse<import('./types').CustomRequest>;


// --- 5.2 List My Requests ---
/**
 * GET /custom-requests
 * Retrieves a paginated list of the user's custom requests.
 * Requires: Customer Authentication
 */
type GetMyRequestsResponse = PaginatedApiResponse<import('./types').CustomRequest>;


// --- 5.3 Get Request ---
/**
 * GET /custom-requests/{id}
 * Retrieves details for a specific custom request.
 * Requires: Customer Authentication
 */
type GetRequestResponse = ApiResponse<import('./types').CustomRequest>;


// --- 5.4 Approve Preview ---
/**
 * POST /custom-requests/{id}/approve
 * Marks the admin-sent preview as approved by the customer.
 * Requires: Customer Authentication
 */
type ApprovePreviewResponse = ApiResponse<{ success: true }>;


// --- 5.5 Request Changes ---
/**
 * POST /custom-requests/{id}/request-changes
 * Submits notes for changes to the design preview.
 * Requires: Customer Authentication
 */
interface RequestChangesRequest {
  notes: string;
}
type RequestChangesResponse = ApiResponse<{ success: true }>;


// =================================================================
// 6. WISHLIST (AUTH REQUIRED)
// =================================================================

// --- 6.1 Get Wishlist ---
/**
 * GET /wishlist
 * Retrieves the user's wishlist.
 * Requires: Customer Authentication
 */
type GetWishlistResponse = ApiResponse<import('./types').Product[]>;


// --- 6.2 Add to Wishlist ---
/**
 * POST /wishlist
 * Adds a product to the user's wishlist.
 * Requires: Customer Authentication
 */
interface AddToWishlistRequest {
  product_id: string;
}
type AddToWishlistResponse = ApiResponse<{ success: true }>;


// --- 6.3 Remove from Wishlist ---
/**
 * DELETE /wishlist/{product_id}
 * Removes a product from the user's wishlist.
 * Requires: Customer Authentication
 */
type RemoveFromWishlistResponse = ApiResponse<{ success: true }>;


// =================================================================
// 7. RECENTLY VIEWED (AUTH REQUIRED)
// =================================================================

// --- 7.1 Add Recently Viewed ---
/**
 * POST /recently-viewed
 * Logs that a user has viewed a product.
 * Requires: Customer Authentication
 */
interface AddRecentlyViewedRequest {
  product_id: string;
}
type AddRecentlyViewedResponse = ApiResponse<{ success: true }>;


// --- 7.2 Get Recently Viewed ---
/**
 * GET /recently-viewed
 * Retrieves a list of the user's recently viewed products.
 * Requires: Customer Authentication
 */
type GetRecentlyViewedResponse = ApiResponse<import('./types').Product[]>;


// =================================================================
// 8. NOTIFICATIONS (AUTH REQUIRED)
// =================================================================

// --- 8.1 Get Notifications ---
/**
 * GET /notifications
 * Retrieves a paginated list of user's notifications.
 * Requires: Customer Authentication
 */
type GetNotificationsResponse = PaginatedApiResponse<import('./types').Notification>;


// --- 8.2 Unread Count ---
/**
 * GET /notifications/unread-count
 * Retrieves the count of unread notifications.
 * Requires: Customer Authentication
 */
type GetUnreadCountResponse = ApiResponse<{ count: number }>;


// --- 8.3 Mark as Read ---
/**
 * POST /notifications/{id}/read
 * Marks a specific notification as read.
 * Requires: Customer Authentication
 */
type MarkAsReadResponse = ApiResponse<{ success: true }>;


// --- 8.4 Mark All Read ---
/**
 * POST /notifications/read-all
 * Marks all of the user's notifications as read.
 * Requires: Customer Authentication
 */
type MarkAllReadResponse = ApiResponse<{ success: true }>;


// =================================================================
// 9. CONTACT PAGE (PUBLIC)
// =================================================================

// --- 9.1 Customer Contact ---
/**
 * POST /contact
 * Submits the contact form.
 */
interface ContactRequest {
  name: string;
  email: string;
  message: string;
}
type ContactResponse = ApiResponse<{ message: 'Message sent successfully.' }>;


// =================================================================
// 10. ADMIN APIs (ADMIN AUTH REQUIRED + ROLE CONTROL)
// =================================================================

// --- 10.1 Dashboard ---
/**
 * GET /admin/dashboard
 * Retrieves data for the admin dashboard.
 * Requires: Admin Authentication (staff, owner)
 */
interface DashboardData {
    todaySales: number;
    ordersToday: number;
    pendingCustomRequests: number;
    chartData: { name: string; sales: number }[];
    recentOrders: import('./types').Order[];
    recentCustomRequests: import('./types').CustomRequest[];
}
type GetDashboardResponse = ApiResponse<DashboardData>;


// --- 10.2 Admin Products ---
// All endpoints require Admin Authentication.

/** GET /admin/products - List products (staff, owner) */
type AdminListProductsResponse = PaginatedApiResponse<import('./types').Product>;

/** POST /admin/products - Create a new product (staff, owner) */
// Request body would be a subset of the Product type
type AdminCreateProductRequest = Omit<import('./types').Product, 'id'>;
type AdminCreateProductResponse = ApiResponse<import('./types').Product>;

/** PUT /admin/products/{id} - Update a product (staff, owner) */
type AdminUpdateProductRequest = Partial<AdminCreateProductRequest>;
type AdminUpdateProductResponse = ApiResponse<import('./types').Product>;

/** DELETE /admin/products/{id} - Delete a product (owner only) */
type AdminDeleteProductResponse = ApiResponse<{ success: true }>;


// --- 10.3 Admin Orders ---
// All endpoints require Admin Authentication.

/** GET /admin/orders - List all orders (staff, owner) */
type AdminListOrdersResponse = PaginatedApiResponse<import('./types').Order>;

/** GET /admin/orders/{id} - Get order details (staff, owner) */
type AdminGetOrderDetailsResponse = ApiResponse<import('./types').Order>;

/** PUT /admin/orders/{id}/status - Update order status (staff, owner) */
interface AdminUpdateOrderStatusRequest {
  status: import('./types').Order['orderStatus'];
}
type AdminUpdateOrderStatusResponse = ApiResponse<{ success: true }>;

/** POST /admin/orders/{id}/notes - Add an internal note (staff, owner) */
interface AdminAddOrderNoteRequest {
  note: string;
}
type AdminAddOrderNoteResponse = ApiResponse<{ success: true }>;


// --- 10.4 Admin Custom Requests ---
// All endpoints require Admin Authentication.

/** GET /admin/custom-requests - List requests (designer, staff, owner) */
type AdminListCustomRequestsResponse = PaginatedApiResponse<import('./types').CustomRequest>;

/** GET /admin/custom-requests/{id} - Get request details (designer, staff, owner) */
type AdminGetCustomRequestResponse = ApiResponse<import('./types').CustomRequest>;

/** POST /admin/custom-requests/{id}/preview - Upload a design preview (designer, staff, owner) */
interface AdminUploadPreviewRequest {
  preview_image_url: string;
}
type AdminUploadPreviewResponse = ApiResponse<{ success: true }>;

/** PUT /admin/custom-requests/{id}/status - Update request status (designer, staff, owner) */
interface AdminUpdateCustomRequestStatusRequest {
  status: import('./types').CustomRequest['status'];
}
type AdminUpdateCustomRequestStatusResponse = ApiResponse<{ success: true }>;


// --- 10.5 Admin Collections & Marketing ---
// All endpoints require Admin Authentication (staff, owner).

/** GET /admin/collections */
/** POST /admin/collections */
/** PUT /admin/collections/{id} */
/** DELETE /admin/collections/{id} */

/** POST /admin/announcement */
interface AdminUpdateAnnouncementRequest {
    text: string;
    is_active: boolean;
}

/** GET /admin/hero-slides */
/** POST /admin/hero-slides */
/** PUT /admin/hero-slides/{id} */
/** DELETE /admin/hero-slides/{id} */


// --- 10.6 Admin Customers ---
// All endpoints require Admin Authentication (staff, owner).

/** GET /admin/customers */
type AdminListCustomersResponse = PaginatedApiResponse<import('./types').Customer>;

/** GET /admin/customers/{id} */
type AdminGetCustomerDetailsResponse = ApiResponse<import('./types').Customer & { orders: import('./types').Order[] }>;

/** POST /admin/customers/{id}/notes */
interface AdminAddCustomerNoteRequest {
  note: string;
}


// --- 10.7 Admin Settings ---
// All endpoints require Admin Authentication (owner only).

/** GET /admin/settings/store */
/** POST /admin/settings/store */
type StoreSettingsRequest = import('./types').StoreSettings;

/** GET /admin/settings/delivery */
/** POST /admin/settings/delivery */
type DeliverySettingsRequest = import('./types').DeliverySettings;

/** GET /admin/settings/theme */
/** POST /admin/settings/theme */
interface ThemeSettings {
    primaryColor: string;
    fontFamily: string;
}


// --- 10.8 Admin Users ---
// All endpoints require Admin Authentication (owner only).

/** GET /admin/admin-users */
/** POST /admin/admin-users */
/** PUT /admin/admin-users/{id} */


// --- 10.9 Admin Logs ---
/**
 * GET /admin/logs
 * Retrieves a paginated list of admin activity logs.
 * Requires: Admin Authentication (owner only)
 */
type AdminGetLogsResponse = PaginatedApiResponse<import('./types').Log>;


// =================================================================
// 11. SUPABASE RPC FUNCTIONS
// =================================================================

/**
 * These are server-side functions called for complex, transactional, or secure operations.
 * The client-side code will typically call these via the Supabase client library, not standard REST endpoints.
 */
const SupabaseRPC = {
  /**
   * Performs the entire checkout process in a single transaction.
   * - Validates cart
   * - Calculates totals
   * - Creates order & order_items
   * - Adds initial timeline entry
   * - Clears the user's cart
   * - Creates a notification
   */
  checkout: () => {},

  /**
   * Submits a custom t-shirt request.
   * - Inserts the request
   * - Creates the initial timeline entry
   */
  submit_custom_request: () => {},

  /**
   * Updates an order's status and handles side effects.
   * - Updates status in the orders table
   * - Adds a new entry to the order_status_history
   * - Creates a notification for the customer
   * - Logs the action in the admin_logs table
   */
  admin_update_order_status: () => {},

  /**
   * Uploads a design preview for a custom request.
   * - Updates the preview_image_url on the request
   * - Updates the request status to 'preview_sent'
   * - Creates a notification for the customer
   */
  admin_upload_preview: () => {},
};
