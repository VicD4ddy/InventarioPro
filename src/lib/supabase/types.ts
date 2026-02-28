// Tipos TypeScript generados manualmente para la base de datos Loyafu
// Sincronizados con el schema SQL ejecutado en Supabase

export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];

export type MovementType =
    | "purchase"
    | "sale"
    | "adjustment"
    | "return"
    | "transfer";

export type ProductStatus = "En Stock" | "Stock Bajo" | "Sin Stock";

export interface Category {
    id: string;
    user_id: string;
    name: string;
    color_class: string;
    created_at: string;
}

export interface Supplier {
    id: string;
    user_id: string;
    name: string;
    email: string | null;
    phone: string | null;
    country: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface Product {
    id: string;
    user_id: string;
    name: string;
    subtitle: string | null;
    sku: string;
    category_id: string | null;
    supplier_id: string | null;
    price: number;
    wholesale_price: number;
    cost: number | null;
    stock: number;
    max_stock: number;
    reorder_point: number;
    image_url: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    // Joins
    categories?: Category | null;
    suppliers?: Supplier | null;
}

export interface StockMovement {
    id: string;
    user_id: string;
    product_id: string;
    type: MovementType;
    quantity: number;
    stock_before: number;
    stock_after: number;
    unit_cost: number | null;
    reference: string | null;
    notes: string | null;
    created_by: string | null;
    created_at: string;
    exchange_rate: number;
    products?: Pick<Product, "id" | "name" | "sku"> | null;
}

export interface KpiSnapshot {
    id: string;
    snapshot_date: string;
    total_inventory_value: number;
    total_products: number;
    low_stock_count: number;
    created_at: string;
}

export interface Notification {
    id: string;
    user_id: string;
    title: string;
    message: string | null;
    type: "info" | "warning" | "error" | "success";
    is_read: boolean;
    product_id: string | null;
    created_at: string;
}

export interface KpiSummary {
    total_value: number;
    total_products: number;
    low_stock_count: number;
    out_of_stock: number;
}

// Helper para calcular el estado del producto
export function getProductStatus(
    stock: number,
    reorderPoint: number
): ProductStatus {
    if (stock === 0) return "Sin Stock";
    if (stock <= reorderPoint) return "Stock Bajo";
    return "En Stock";
}

// Database type para Supabase generics
export type Database = {
    public: {
        Tables: {
            products: {
                Row: Product;
                Insert: Omit<Product, "id" | "created_at" | "updated_at" | "categories" | "suppliers">;
                Update: Partial<Omit<Product, "id" | "created_at" | "updated_at" | "categories" | "suppliers">>;
            };
            categories: {
                Row: Category;
                Insert: Omit<Category, "id" | "created_at">;
                Update: Partial<Omit<Category, "id" | "created_at">>;
            };
            suppliers: {
                Row: Supplier;
                Insert: Omit<Supplier, "id" | "created_at" | "updated_at">;
                Update: Partial<Omit<Supplier, "id" | "created_at" | "updated_at">>;
            };
            stock_movements: {
                Row: StockMovement;
                Insert: Omit<StockMovement, "id" | "created_at" | "products">;
                Update: Partial<Omit<StockMovement, "id" | "created_at" | "products">>;
            };
            kpi_snapshots: {
                Row: KpiSnapshot;
                Insert: Omit<KpiSnapshot, "id" | "created_at">;
                Update: Partial<Omit<KpiSnapshot, "id" | "created_at">>;
            };
            notifications: {
                Row: Notification;
                Insert: Omit<Notification, "id" | "created_at">;
                Update: Partial<Omit<Notification, "id" | "created_at">>;
            };
            profiles: {
                Row: {
                    id: string;
                    full_name: string | null;
                    company_name: string | null;
                    avatar_url: string | null;
                    plan: string;
                    bcv_rate: number;
                    created_at: string;
                };
                Insert: {
                    id: string;
                    full_name?: string | null;
                    company_name?: string | null;
                    avatar_url?: string | null;
                    plan?: string;
                    bcv_rate?: number;
                };
                Update: {
                    full_name?: string | null;
                    company_name?: string | null;
                    avatar_url?: string | null;
                    plan?: string;
                    bcv_rate?: number;
                };
            };
        };
        Functions: {
            get_kpi_summary: {
                Args: Record<string, never>;
                Returns: KpiSummary;
            };
            search_products: {
                Args: { query: string };
                Returns: Product[];
            };
        };
    };
};
