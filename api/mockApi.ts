import { createClient } from '@supabase/supabase-js';
import { User, Product, Order, CustomRequest, CartItem, AdminUser, ProductVariant, Collection, Notification, HeroSlide, Log, StoreSettings, DeliverySettings, Customer } from '../types';
import { MOCK_ORDERS } from '../constants';

// --- CONFIGURATION ---
// Since .env files are not automatically loaded in this browser environment,
// we provide the values directly here with a fallback.

// 1. Check for environment variables (in case a build tool injects them)
const envUrl = (typeof process !== 'undefined' && process.env?.SUPABASE_URL);
const envKey = (typeof process !== 'undefined' && process.env?.SUPABASE_KEY);

// 2. Use defaults if env vars are missing. 
// IMPORTANT: Replace 'YOUR_ANON_KEY_HERE' with your actual Supabase Anon Key.
const supabaseUrl = envUrl || 'https://avjlmkpzefwfjyyshkip.supabase.co';
const supabaseKey = envKey || 'YOUR_ANON_KEY_HERE'; 

if (!supabaseUrl || !supabaseKey || supabaseKey === 'YOUR_ANON_KEY_HERE') {
  console.warn("Supabase credentials missing or invalid. The app will load but backend calls will fail.");
}

// Initialize Supabase Client with fallbacks to prevent 'URL is required' crash
export const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co', 
    supabaseKey || 'placeholder-key'
);

// --- Mock Auth State for Data Bridge ---
// We still use this to key the 'mock' database (cart, orders) to the logged-in user ID
let currentUserId: string | null = localStorage.getItem('mock_user_id');

export const setAuthUserId = (id: string | null) => {
    currentUserId = id;
    if (id) {
        localStorage.setItem('mock_user_id', id);
    } else {
        localStorage.removeItem('mock_user_id');
    }
}

// Helper for mock storage to enable demo functionality without complex backend migration
const getLocalData = <T>(key: string, defaultValue: T): T => {
    if (!currentUserId) return defaultValue;
    const stored = localStorage.getItem(`mock_${currentUserId}_${key}`);
    return stored ? JSON.parse(stored) : defaultValue;
}
const setLocalData = (key: string, data: any) => {
    if (currentUserId) {
        localStorage.setItem(`mock_${currentUserId}_${key}`, JSON.stringify(data));
    }
}


// --- Helpers ---
const mapProduct = (dbProduct: any): Product => ({
    id: dbProduct.id,
    name: dbProduct.name,
    description: dbProduct.description,
    basePrice: Number(dbProduct.base_price),
    salePrice: dbProduct.sale_price ? Number(dbProduct.sale_price) : undefined,
    category: dbProduct.category,
    collections: [], 
    status: dbProduct.status,
    isNew: dbProduct.is_new,
    isBestSeller: dbProduct.is_best_seller,
    images: dbProduct.images ? dbProduct.images.map((img: any) => ({ id: img.id, imageUrl: img.image_url, sortOrder: img.sort_order })).sort((a: any, b: any) => a.sortOrder - b.sortOrder) : [],
    variants: dbProduct.variants ? dbProduct.variants.map((v: any) => ({ id: v.id, size: v.size, color: v.color, stock: v.stock })) : []
});

// Helper to log admin actions
export const logAdminAction = async (action: string, details: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        await supabase.from('admin_logs').insert({
            admin_id: user.id,
            action,
            details
        });
    }
};

export const uploadFile = async (file: File, bucket: string = 'images') => {
    // For demo purposes, just return a fake URL to avoid bucket permissions issues if keys are stale
    // In a real app, you would use the supabase storage upload logic
    return URL.createObjectURL(file);
};

// --- Auth & Profile ---

export const signup = async (name: string, email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name, role: 'customer' } }
    });
    if (error) throw error;
    
    if (data.user) {
        // Bridge to mock data
        setAuthUserId(data.user.id);
        
        // Attempt to create profile in public table if trigger didn't fire
        // Ignoring error if it already exists
        await supabase.from('profiles').insert({
            id: data.user.id,
            full_name: name,
            email: email,
            role: 'customer'
        });
    }

    return { success: true, data: { id: data.user?.id || 'temp', name, email } as User };
};

export const login = async (email: string, password?: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: password! });
    if (error) throw error;

    if (data.user) {
        setAuthUserId(data.user.id);
        
        // Fetch profile name
        const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', data.user.id).single();
        const name = profile?.full_name || email.split('@')[0];
        
        return { success: true, data: { id: data.user.id, email, name } as User };
    }
    throw new Error('Login failed');
};

export const adminLogin = async (email: string, password?: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: password! });
    if (error) throw error;
    if (!data.session) throw new Error("Login failed: No session created.");

    const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user!.id).single();
    
    if (profile?.role !== 'owner' && profile?.role !== 'staff') {
        await supabase.auth.signOut();
        throw new Error('Unauthorized access. Admin role required.');
    }

    const admin: AdminUser = { id: data.user!.id, name: profile.full_name, email: data.user!.email!, role: profile.role, status: 'active' };
    localStorage.setItem('adminAuthToken', data.session.access_token);
    return { success: true, data: { admin, token: data.session.access_token } };
};

export const getMe = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        setAuthUserId(user.id);
        const { data: profile } = await supabase.from('profiles').select('full_name, address, city, postal_code').eq('id', user.id).single();
        
        const userData: User = { 
            id: user.id, 
            email: user.email!, 
            name: profile?.full_name || user.email!.split('@')[0],
            address: profile?.address,
            city: profile?.city,
            postalCode: profile?.postal_code
        };
        return { success: true, data: userData };
    }
    throw new Error('Not authenticated');
};

export const updateProfile = async (updates: Partial<User>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const dbUpdates: any = {};
    if (updates.name) dbUpdates.full_name = updates.name;
    if (updates.address) dbUpdates.address = updates.address;
    if (updates.city) dbUpdates.city = updates.city;
    if (updates.postalCode) dbUpdates.postal_code = updates.postalCode;

    const { error } = await supabase.from('profiles').update(dbUpdates).eq('id', user.id);
    if (error) throw error;

    return { success: true, data: { ...updates, id: user.id, email: user.email! } as User };
};

export const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
    return { success: true };
};

export const updateUserPassword = async (password: string) => {
    const { error } = await supabase.auth.updateUser({ password: password });
    if (error) throw error;
    return { success: true };
};

export const getAdminMe = async () => {
     const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
     const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
     if (profile?.role !== 'owner' && profile?.role !== 'staff') throw new Error('Not authorized');
     
     const admin: AdminUser = { id: user.id, name: profile?.full_name || 'Admin', email: user.email!, role: profile?.role || 'staff', status: 'active' };
     return { success: true, data: admin };
};

export const logout = async () => {
    await supabase.auth.signOut();
    setAuthUserId(null);
    return { success: true };
};

export const adminLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('adminAuthToken');
    return { success: true };
};

// --- Products ---

export const getProducts = async (filters?: any) => {
    let query = supabase.from('products').select(`
        *,
        images:product_images(*),
        variants:product_variants(*)
    `);
    
    if (filters?.category) {
        const cat = filters.category.charAt(0).toUpperCase() + filters.category.slice(1).toLowerCase();
        query = query.eq('category', cat);
    }
    
    const { data, error } = await query;
    if (error) {
        console.error("Error fetching products:", error);
        return { success: false, data: [] };
    }
    return { success: true, data: data.map(mapProduct) };
};

export const getProductById = async (id: string) => {
    const { data, error } = await supabase.from('products').select(`
        *,
        images:product_images(*),
        variants:product_variants(*)
    `).eq('id', id).single();
    
    if (error) return { success: false, data: null };
    return { success: true, data: mapProduct(data) };
};

export const createProduct = async (product: Partial<Product>) => {
    // 1. Insert Product
    const { data: prodData, error: prodError } = await supabase.from('products').insert({
        name: product.name,
        description: product.description,
        base_price: product.basePrice,
        sale_price: product.salePrice,
        category: product.category,
        status: product.status,
    }).select().single();

    if (prodError) throw prodError;

    // 2. Insert Variants
    if (product.variants && product.variants.length > 0) {
        const variants = product.variants.map(v => ({
            product_id: prodData.id,
            size: v.size,
            color: v.color,
            stock: v.stock
        }));
        await supabase.from('product_variants').insert(variants);
    }

    // 3. Insert Images (Expects valid URLs, upload must happen in UI)
    if (product.images && product.images.length > 0) {
        const images = product.images.map((img, idx) => ({
            product_id: prodData.id,
            image_url: img.imageUrl,
            sort_order: idx
        }));
        await supabase.from('product_images').insert(images);
    }

    await logAdminAction('Created Product', `Product ${prodData.name} created`);
    return { success: true, data: prodData };
};

export const updateProduct = async (id: string, product: Partial<Product>) => {
    // 1. Update Product
    const { error: prodError } = await supabase.from('products').update({
        name: product.name,
        description: product.description,
        base_price: product.basePrice,
        sale_price: product.salePrice,
        category: product.category,
        status: product.status,
    }).eq('id', id);

    if (prodError) throw prodError;

    // 2. Update Variants (Simplistic: Delete all and re-insert for this demo)
    if (product.variants) {
        await supabase.from('product_variants').delete().eq('product_id', id);
        const variants = product.variants.map(v => ({
            product_id: id,
            size: v.size,
            color: v.color,
            stock: v.stock
        }));
        await supabase.from('product_variants').insert(variants);
    }

     // 3. Update Images (Simplistic: Delete all and re-insert)
     if (product.images) {
        await supabase.from('product_images').delete().eq('product_id', id);
        const images = product.images.map((img, idx) => ({
            product_id: id,
            image_url: img.imageUrl,
            sort_order: idx
        }));
        await supabase.from('product_images').insert(images);
    }

    await logAdminAction('Updated Product', `Product ${product.name} updated`);
    return { success: true };
};

export const deleteProduct = async (id: string) => {
    await supabase.from('products').delete().eq('id', id);
    await logAdminAction('Deleted Product', `Product ID ${id} deleted`);
    return { success: true };
};

export const getRelatedProducts = async (id: string) => {
    const { data: current } = await supabase.from('products').select('category').eq('id', id).single();
    if (!current) return { success: true, data: [] };
    
    const { data } = await supabase.from('products')
        .select('*, images:product_images(*), variants:product_variants(*)')
        .eq('category', current.category)
        .neq('id', id)
        .limit(4);
        
    return { success: true, data: (data || []).map(mapProduct) };
};

export const getBestSellers = async () => {
    const { data } = await supabase.from('products')
        .select('*, images:product_images(*), variants:product_variants(*)')
        .eq('is_best_seller', true)
        .limit(8);
    return { success: true, data: (data || []).map(mapProduct) };
};

// --- Collections ---

export const getCollections = async () => {
    const { data } = await supabase.from('collections').select('*').order('created_at', { ascending: false });
    const collections: Collection[] = (data || []).map((c: any) => ({
        id: c.id,
        name: c.name,
        description: c.description,
        imageUrl: c.image_url,
        showOnHome: c.show_on_home
    }));
    return { success: true, data: collections };
};

export const createCollection = async (collection: Partial<Collection>) => {
    const { data, error } = await supabase.from('collections').insert({
        name: collection.name,
        description: collection.description,
        image_url: collection.imageUrl,
        show_on_home: collection.showOnHome
    }).select().single();
    
    if(error) throw error;
    await logAdminAction('Created Collection', `Collection ${collection.name} created`);
    return { success: true, data };
};

export const updateCollection = async (id: string, collection: Partial<Collection>) => {
     const { error } = await supabase.from('collections').update({
        name: collection.name,
        description: collection.description,
        image_url: collection.imageUrl,
        show_on_home: collection.showOnHome
    }).eq('id', id);

    if(error) throw error;
    await logAdminAction('Updated Collection', `Collection ${collection.name} updated`);
    return { success: true };
};

export const deleteCollection = async (id: string) => {
    await supabase.from('collections').delete().eq('id', id);
    await logAdminAction('Deleted Collection', `Collection ID ${id} deleted`);
    return { success: true };
};

// --- Cart ---

export const getCart = async () => {
    if (currentUserId) {
        return { success: true, data: getLocalData<CartItem[]>('cart', []) };
    }
    return { success: true, data: [] };
};

export const addToCart = async (item: Omit<CartItem, 'id'>) => {
    if (currentUserId) {
        const cart = getLocalData<CartItem[]>('cart', []);
        const existing = cart.find(i => i.productId === item.productId && i.variant.id === item.variant.id);
        if (existing) {
            existing.quantity += item.quantity;
        } else {
            cart.push({ ...item, id: Math.random().toString(36).substr(2, 9) });
        }
        setLocalData('cart', cart);
        return { success: true };
    }
    return { success: false };
};

export const updateCartItem = async (itemId: string, quantity: number) => {
    if (currentUserId) {
        const cart = getLocalData<CartItem[]>('cart', []);
        const item = cart.find(i => i.id === itemId);
        if (item) item.quantity = quantity;
        setLocalData('cart', cart);
        return { success: true };
    }
    return { success: false };
};

export const removeCartItem = async (itemId: string) => {
    if (currentUserId) {
        const cart = getLocalData<CartItem[]>('cart', []);
        const newCart = cart.filter(i => i.id !== itemId);
        setLocalData('cart', newCart);
        return { success: true };
    }
    return { success: false };
};

export const clearCart = async () => {
     if (currentUserId) {
         setLocalData('cart', []);
         return { success: true };
     }
     return { success: true };
};

// --- Orders ---

export const placeOrder = async (details: any) => {
    if (currentUserId) {
        const cart = getLocalData<CartItem[]>('cart', []);
        const orders = getLocalData<Order[]>('orders', []);
        const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0) + 5;
        
        const newOrder: Order = {
            id: `ORD-${Date.now()}`,
            userId: currentUserId,
            totalAmount: total,
            deliveryFee: 5,
            paymentMethod: 'COD',
            paymentStatus: 'unpaid',
            orderStatus: 'received',
            name: details.name,
            address: details.address,
            city: details.city,
            postalCode: details.postalCode,
            phone: details.phone,
            customerEmail: 'user@example.com', 
            createdAt: new Date().toLocaleDateString(),
            items: cart.map(i => ({ ...i, id: Math.random().toString(), size: i.variant.size, color: i.variant.color, price: i.price })),
            history: [{ id: '1', status: 'received', timestamp: new Date().toISOString() }]
        };
        
        orders.unshift(newOrder);
        setLocalData('orders', orders);
        setLocalData('cart', []); // Clear cart
        return { success: true, data: { orderId: newOrder.id } };
    }
    throw new Error('Must be logged in');
};

export const getMyOrders = async () => {
    if (currentUserId) {
        const orders = getLocalData<Order[]>('orders', []);
        // Add mock orders if empty for demo
        if (orders.length === 0) return { success: true, data: MOCK_ORDERS };
        return { success: true, data: orders };
    }
    return { success: true, data: [] };
};

// For Admin: List All Orders
export const getAllOrders = async () => {
    const { data } = await supabase.from('orders')
        .select('*, profile:profiles(email)')
        .order('created_at', { ascending: false });
    
    const orders: Order[] = (data || []).map((o: any) => ({
        id: o.id,
        userId: o.user_id,
        totalAmount: Number(o.total_amount),
        deliveryFee: Number(o.delivery_fee || 5),
        paymentMethod: o.payment_method || 'COD',
        paymentStatus: o.payment_status || 'unpaid',
        orderStatus: o.status || 'received',
        name: o.shipping_address?.name || 'Unknown',
        phone: o.shipping_address?.phone || '',
        customerEmail: o.profile?.email || 'Unknown',
        address: o.shipping_address?.address || '',
        city: o.shipping_address?.city || '',
        postalCode: o.shipping_address?.postal_code || '',
        createdAt: new Date(o.created_at).toLocaleDateString(),
        items: [], 
        history: []
    }));
    return { success: true, data: orders };
};

export const getOrderById = async (id: string) => {
    if (currentUserId) {
        const orders = getLocalData<Order[]>('orders', []);
        const order = orders.find(o => o.id === id) || MOCK_ORDERS.find(o => o.id === id);
        if (order) return { success: true, data: order };
    }

     const { data: orderData, error } = await supabase.from('orders')
        .select('*, profile:profiles(email)')
        .eq('id', id)
        .single();

     if (error || !orderData) return { success: false };

     const { data: itemsData } = await supabase.from('order_items').select(`
        id, quantity, price_at_purchase, product_id,
        product:products(name, images:product_images(image_url)),
        variant:product_variants(size, color)
     `).eq('order_id', id);
     
     const { data: historyData } = await supabase.from('order_status_history').select('*').eq('order_id', id).order('created_at', { ascending: false });

     const order: Order = {
         id: orderData.id,
         userId: orderData.user_id,
         totalAmount: Number(orderData.total_amount),
         deliveryFee: Number(orderData.delivery_fee || 5),
         paymentMethod: orderData.payment_method || 'COD',
         paymentStatus: orderData.payment_status || 'unpaid',
         orderStatus: orderData.status,
         name: orderData.shipping_address?.name,
         address: orderData.shipping_address?.address,
         city: orderData.shipping_address?.city,
         postalCode: orderData.shipping_address?.postal_code,
         phone: orderData.shipping_address?.phone,
         customerEmail: orderData.profile?.email || '', 
         createdAt: new Date(orderData.created_at).toLocaleDateString(),
         items: itemsData?.map((item: any) => ({
             id: item.id,
             productId: item.product_id || 'N/A',
             productName: item.product?.name || 'Unknown',
             productImage: item.product?.images?.[0]?.image_url || '',
             size: item.variant?.size || '',
             color: item.variant?.color || '',
             price: Number(item.price_at_purchase),
             quantity: item.quantity
         })) || [],
         history: historyData?.map((h: any) => ({
             id: h.id,
             status: h.status,
             timestamp: h.created_at
         })) || []
     }
     
     return { success: true, data: order }; 
};

export const updateOrderStatus = async (orderId: string, status: Order['orderStatus']) => {
    const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);
    if (error) throw error;

    await supabase.from('order_status_history').insert({
        order_id: orderId,
        status: status
    });
    
    await logAdminAction('Updated Order Status', `Order ${orderId} changed to ${status}`);
    return { success: true };
};

// --- Custom Requests ---

export const createCustomRequest = async (req: Omit<CustomRequest, 'id' | 'status' | 'createdAt' | 'history' | 'customerName' | 'userId'>) => {
    if (currentUserId) {
        const requests = getLocalData<CustomRequest[]>('requests', []);
        const newReq: CustomRequest = {
            id: `REQ-${Date.now()}`,
            userId: currentUserId,
            customerName: 'Me',
            status: 'new',
            createdAt: new Date().toLocaleDateString(),
            history: [{id: '1', status: 'new', timestamp: new Date().toISOString()}],
            ...req
        };
        requests.unshift(newReq);
        setLocalData('requests', requests);
        return { success: true, data: newReq };
    }
    return { success: false };
}

export const getMyRequests = async () => {
    if (currentUserId) {
         return { success: true, data: getLocalData<CustomRequest[]>('requests', []) };
    }
    return { success: true, data: [] };
};

// For Admin
export const getAllRequests = async () => {
    const { data } = await supabase.from('custom_requests')
        .select('*, profile:profiles(full_name)')
        .order('created_at', { ascending: false });

    const requests: CustomRequest[] = (data || []).map((r: any) => ({
        id: r.id,
        userId: r.user_id,
        customerName: r.profile?.full_name || 'User',
        color: r.color,
        size: r.size,
        placement: r.placement,
        description: r.description,
        status: r.status,
        createdAt: new Date(r.created_at).toLocaleDateString(),
        history: [] 
    }));

    return { success: true, data: requests };
};

export const getRequestById = async (id: string) => {
    const { data: req, error } = await supabase.from('custom_requests')
        .select('*, profile:profiles(full_name)')
        .eq('id', id)
        .single();

    if (error) return { success: false };

    const { data: history } = await supabase.from('custom_request_history').select('*').eq('request_id', id).order('created_at', { ascending: false });

    const request: CustomRequest = {
        id: req.id,
        userId: req.user_id,
        customerName: req.profile?.full_name || 'User', 
        color: req.color,
        size: req.size,
        placement: req.placement,
        description: req.description,
        status: req.status,
        previewImageUrl: req.preview_image_url,
        createdAt: new Date(req.created_at).toLocaleDateString(),
        history: history?.map((h: any) => ({
            id: h.id,
            status: h.status,
            timestamp: h.created_at
        })) || []
    };

    return { success: true, data: request };
};

export const updateRequestStatus = async (requestId: string, status: CustomRequest['status']) => {
    const { error } = await supabase.from('custom_requests').update({ status }).eq('id', requestId);
    if (error) throw error;

    await supabase.from('custom_request_history').insert({
        request_id: requestId,
        status: status
    });
    
    await logAdminAction('Updated Request Status', `Request ${requestId} changed to ${status}`);
    return { success: true };
};

// --- Wishlist ---

export const getWishlist = async () => {
    if (currentUserId) return { success: true, data: getLocalData<Product[]>('wishlist', []) };
    return { success: true, data: [] };
};

export const addToWishlist = async (productId: string) => {
     // Simplified mock implementation since getting product details requires an extra call in this mock setup
    return { success: true };
};

export const removeFromWishlist = async (productId: string) => {
     // Simplified mock implementation
    return { success: true };
};

// --- Content & Notifications ---

export const getHomeContent = async () => {
    const { data: slidesData } = await supabase.from('hero_slides').select('*').eq('is_active', true).order('sort_order', { ascending: true });
    const { data: settingsData } = await supabase.from('store_settings').select('announcement_text').single();
    
    const slides: HeroSlide[] = (slidesData || []).map((s: any) => ({
        id: s.id,
        imageUrl: s.image_url,
        title: s.title,
        subtitle: s.subtitle,
        link: s.link,
        isActive: s.is_active
    }));

    return { 
        success: true, 
        data: { 
            announcementBarText: settingsData?.announcement_text || "✨ FREE SHIPPING ON ORDERS OVER $50 ✨", 
            heroSlides: slides.length > 0 ? slides : [] 
        }
    };
};

export const getNotifications = async () => {
    if (currentUserId) {
        return { success: true, data: [] }; // Mock notifications
    }
    return { success: true, data: [] };
};

// --- Admin ---

export const getAdminDashboard = async () => {
    const today = new Date().toISOString().split('T')[0];
    
    // Parallel fetching for performance
    const [
        { count: ordersToday },
        { count: pendingReqs },
        { data: recentOrders },
        { data: recentReqs }
    ] = await Promise.all([
        supabase.from('orders').select('*', { count: 'exact', head: true }).gte('created_at', today),
        supabase.from('custom_requests').select('*', { count: 'exact', head: true }).eq('status', 'new'),
        supabase.from('orders').select('*, profile:profiles(full_name)').order('created_at', { ascending: false }).limit(5),
        supabase.from('custom_requests').select('*, profile:profiles(full_name)').order('created_at', { ascending: false }).limit(5)
    ]);

    const formattedOrders: Order[] = (recentOrders || []).map((o: any) => ({
        id: o.id,
        userId: o.user_id,
        totalAmount: Number(o.total_amount),
        deliveryFee: 0, paymentMethod: 'COD', paymentStatus: 'unpaid',
        orderStatus: o.status,
        name: o.shipping_address?.name || 'Unknown',
        phone: '', customerEmail: '', address: '', city: '', postalCode: '',
        createdAt: '', items: [], history: []
    }));

    const formattedReqs: CustomRequest[] = (recentReqs || []).map((r: any) => ({
         id: r.id,
         userId: r.user_id,
         customerName: r.profile?.full_name || 'Unknown',
         color: '', size: '', placement: 'front', description: '',
         status: r.status,
         createdAt: '', history: []
    }));

    return {
        success: true, 
        data: {
            todaySales: 1250, // Calculation would typically be server-side sum
            ordersToday: ordersToday || 0,
            pendingCustomRequests: pendingReqs || 0,
            chartData: [ { name: 'Mon', sales: 4000 }, { name: 'Tue', sales: 3000 } ], 
            recentOrders: formattedOrders, 
            recentCustomRequests: formattedReqs, 
        }
    };
};

export const getLogs = async () => {
    const { data, error } = await supabase.from('admin_logs').select(`
        *,
        admin:profiles(full_name)
    `).order('created_at', { ascending: false }).limit(50);

    if (error) return { success: false, data: [] };

    const logs: Log[] = data.map((log: any) => ({
        id: log.id,
        adminId: log.admin_id,
        adminName: log.admin?.full_name || 'Unknown Admin',
        action: log.action,
        details: log.details,
        createdAt: new Date(log.created_at).toLocaleString()
    }));
    return { success: true, data: logs };
};

export const getAdminCustomers = async () => {
    const { data, error } = await supabase.from('profiles')
        .select('*, orders:orders(count)')
        .eq('role', 'customer');
        
    if(error) return { success: false, data: [] };
    
    // Calculate totals in JS for now (easier than complex SQL join/sum in Supabase JS client without RPC)
    const customers: Customer[] = data.map((p: any) => ({
        id: p.id,
        name: p.full_name,
        email: p.email,
        ordersCount: p.orders?.[0]?.count || 0,
        totalSpent: 0, // Would need another query to sum
        lastOrderDate: 'N/A'
    }));
    
    return { success: true, data: customers };
}

export const getSettings = async () => {
    const { data, error } = await supabase.from('store_settings').select('*').single();
    
    // Default settings if not found
    if (error || !data) {
        return { 
            success: true, 
            data: { 
                storeSettings: { storeName: 'My Store', logoUrl: '', contactPhone: '', address: '', currency: 'USD', announcementBarText: 'Welcome!' },
                deliverySettings: { baseFee: 5, freeAbove: 50, deliveryText: '' }
            }
        };
    }

    const storeSettings: StoreSettings = {
        storeName: data.store_name,
        logoUrl: data.logo_url || '',
        contactPhone: data.contact_phone,
        address: data.address,
        currency: data.currency,
        announcementBarText: data.announcement_text
    };

    const deliverySettings: DeliverySettings = {
        baseFee: Number(data.base_delivery_fee),
        freeAbove: Number(data.free_delivery_above),
        deliveryText: data.delivery_text || ''
    };

    return { success: true, data: { storeSettings, deliverySettings } };
};

export const updateSettings = async (settings: Partial<StoreSettings & DeliverySettings>) => {
    const updateData: any = {};
    if (settings.storeName) updateData.store_name = settings.storeName;
    if (settings.contactPhone) updateData.contact_phone = settings.contactPhone;
    if (settings.address) updateData.address = settings.address;
    if (settings.currency) updateData.currency = settings.currency;
    if (settings.announcementBarText) updateData.announcement_text = settings.announcementBarText;
    if (settings.baseFee !== undefined) updateData.base_delivery_fee = settings.baseFee;
    if (settings.freeAbove !== undefined) updateData.free_delivery_above = settings.freeAbove;
    if (settings.deliveryText) updateData.delivery_text = settings.deliveryText;

    const { error } = await supabase.from('store_settings').update(updateData).eq('id', 1);
    // If update fails because row doesn't exist, we insert
    if (error) {
         await supabase.from('store_settings').insert({ id: 1, ...updateData });
    }

    await logAdminAction('Updated Settings', 'Store configuration updated');
    return { success: true };
};