import axios, { AxiosError, AxiosRequestConfig } from "axios";

export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api";

// Create axios instance for backend API calls
export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle authentication errors
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Clear invalid token
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        // Redirect to login page with return URL
        if (!window.location.pathname.startsWith("/login")) {
          const returnUrl = encodeURIComponent(window.location.pathname);
          window.location.href = `/login?next=${returnUrl}`;
        }
      }
    }
    
    const message = error.response?.data || error.message;
    throw new Error(
      typeof message === "string" ? message : JSON.stringify(message)
    );
  }
);

export async function apiFetch<T>(
  path: string,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await api.request<T>({ url: path, ...config });
  return response.data;
}

// ===== Types =====
export type User = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "MANAGER" | "STAFF";
};
export type AuthResponse = { token: string; user: User };

export type Category =
  | "INGREDIENTS"
  | "BEVERAGES"
  | "PACKAGING"
  | "CLEANING"
  | "OTHER";

export type StockItem = {
  id: string;
  name: string;
  category: Category;
  quantity: number;
  unit: string;
  unitPrice: number;
  reorderLevel: number;
  createdAt?: string;
  updatedAt?: string;
};

export type Supplier = {
  id: string;
  name: string;
  contact?: string;
  phone?: string;
  email?: string;
  address?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type PurchaseItem = {
  stockItemId: string;
  quantity: number;
  unitPrice: number;
};

export type Purchase = {
  id: string;
  supplierId?: string;
  date: string;
  totalAmount: number;
  items: PurchaseItem[];
  createdAt?: string;
};

export type Expense = {
  id: string;
  category: string;
  description?: string;
  amount: number;
  date: string;
  createdAt?: string;
};

export type Usage = {
  id: string;
  stockItemId: string;
  quantity: number;
  date: string;
  notes?: string;
  createdBy?: string;
  createdAt?: string;
};

export type MonthlyReport = {
  month: string;
  totalPurchases: number;
  totalExpenses: number;
  totalUsage: number;
  lowStockItems: number;
};

// Spring Boot Pageable response format
export type Page<T> = {
  content: T[];
  pageable: any;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
};

// ===== Auth API =====
export async function login(email: string, password: string) {
  const data = await apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    data: { email, password },
  });
  if (typeof window !== "undefined") localStorage.setItem("token", data.token);
  return data;
}

// ===== Stocks API =====
export const StocksAPI = {
  list: (page = 1, size = 20, q?: string) =>
    apiFetch<Page<StockItem>>(
      `/stocks?page=${page}&size=${size}${
        q ? `&q=${encodeURIComponent(q)}` : ""
      }`
    ),
  get: (id: string) => apiFetch<StockItem>(`/stocks/${id}`),
  create: (data: Omit<StockItem, "id" | "createdAt" | "updatedAt">) =>
    apiFetch<StockItem>("/stocks", { method: "POST", data }),
  update: (
    id: string,
    data: Omit<StockItem, "id" | "createdAt" | "updatedAt">
  ) => apiFetch<StockItem>(`/stocks/${id}`, { method: "PUT", data }),
  remove: (id: string) => apiFetch<void>(`/stocks/${id}`, { method: "DELETE" }),
};

// ===== Suppliers API =====
export const SuppliersAPI = {
  list: (page = 1, size = 20) =>
    apiFetch<Page<Supplier>>(`/suppliers?page=${page}&size=${size}`),
  get: (id: string) => apiFetch<Supplier>(`/suppliers/${id}`),
  create: (data: Omit<Supplier, "id" | "createdAt" | "updatedAt">) =>
    apiFetch<Supplier>("/suppliers", { method: "POST", data }),
  update: (
    id: string,
    data: Omit<Supplier, "id" | "createdAt" | "updatedAt">
  ) => apiFetch<Supplier>(`/suppliers/${id}`, { method: "PUT", data }),
  remove: (id: string) =>
    apiFetch<void>(`/suppliers/${id}`, { method: "DELETE" }),
};

// ===== Purchases API =====
export const PurchasesAPI = {
  list: (page = 1, size = 20) =>
    apiFetch<Page<Purchase>>(`/purchases?page=${page}&size=${size}`),
  get: (id: string) => apiFetch<Purchase>(`/purchases/${id}`),
  create: (data: {
    supplierId?: string;
    date: string;
    items: PurchaseItem[];
  }) => apiFetch<Purchase>("/purchases", { method: "POST", data }),
  update: (id: string, data: {
    supplierId?: string;
    date: string;
    items: PurchaseItem[];
  }) => apiFetch<Purchase>(`/purchases/${id}`, { method: "PUT", data }),
  remove: (id: string) =>
    apiFetch<void>(`/purchases/${id}`, { method: "DELETE" }),
};

// ===== Expenses API =====
export const ExpensesAPI = {
  list: (page = 1, size = 20) =>
    apiFetch<Page<Expense>>(`/expenses?page=${page}&size=${size}`),
  get: (id: string) => apiFetch<Expense>(`/expenses/${id}`),
  create: (data: Omit<Expense, "id" | "createdAt">) =>
    apiFetch<Expense>("/expenses", { method: "POST", data }),
  update: (id: string, data: Omit<Expense, "id" | "createdAt">) =>
    apiFetch<Expense>(`/expenses/${id}`, { method: "PUT", data }),
  remove: (id: string) =>
    apiFetch<void>(`/expenses/${id}`, { method: "DELETE" }),
};

// ===== Usage API =====
export const UsageAPI = {
  list: (page = 1, size = 20) =>
    apiFetch<Page<Usage>>(`/usages?page=${page}&size=${size}`),
  get: (id: string) => apiFetch<Usage>(`/usages/${id}`),
  create: (data: Omit<Usage, "id" | "createdAt" | "createdBy">) =>
    apiFetch<Usage>("/usages", { method: "POST", data }),
  update: (id: string, data: Omit<Usage, "id" | "createdAt" | "createdBy">) =>
    apiFetch<Usage>(`/usages/${id}`, { method: "PUT", data }),
  remove: (id: string) =>
    apiFetch<void>(`/usages/${id}`, { method: "DELETE" }),
};

// ===== Reports API =====
export const ReportsAPI = {
  monthly: (month?: string) =>
    apiFetch<MonthlyReport>(
      `/reports/monthly${month ? `?month=${month}` : ""}`
    ),
};
