# 🧱 **Frontend Build Plan — GES Restaurant Stock Management System**

## 🪶 **Tech Stack**

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** TailwindCSS
- **UI Components:** shadcn/ui (Buttons, Dialogs, Tables, etc.)
- **State Management:** Zustand or Context API
- **HTTP Client:** Axios
- **Auth:** JWT stored in HTTP-only cookies
- **Charts:** Recharts (for dashboard visualizations)
- **Form Handling:** React Hook Form + Zod validation
- **Notifications:** Sonner (for toast messages)

---

## 🧭 **Frontend Architecture Overview**

```
ges-restaurant-frontend/
│
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── dashboard/
│   │   ├── page.tsx               # Dashboard overview
│   │   ├── stock/
│   │   │   ├── page.tsx           # Stock listing
│   │   │   ├── [id]/edit.tsx      # Edit stock item
│   │   │   └── new.tsx            # Add new stock item
│   │   ├── purchases/
│   │   │   ├── page.tsx
│   │   │   ├── [id]/edit.tsx
│   │   │   └── new.tsx
│   │   ├── usage/
│   │   │   ├── page.tsx
│   │   │   ├── [id]/edit.tsx
│   │   │   └── new.tsx
│   │   ├── expenses/
│   │   │   ├── page.tsx
│   │   │   ├── [id]/edit.tsx
│   │   │   └── new.tsx
│   │   ├── reports/
│   │   │   ├── page.tsx           # Summary reports
│   │   │   └── monthly.tsx        # Monthly profit/loss
│   │   ├── users/
│   │   │   ├── page.tsx           # Admin user management
│   │   │   └── new.tsx
│   │   └── settings/
│   │       └── page.tsx
│   ├── layout.tsx
│   ├── page.tsx                   # Landing page(optional)
│   └── not-found.tsx
│
├── components/
│   ├── ui/                        # shadcn/ui components
│   ├── forms/                     # Reusable form inputs
│   ├── tables/                    # DataTable components
│   ├── modals/                    # Dialogs for CRUD actions
│   ├── charts/                    # Recharts-based components
│   ├── navigation/                # Sidebar, Navbar, Role menus
│   └── shared/                    # Reusable widgets
│
├── lib/
│   ├── api.ts                     # Axios setup + interceptors
│   ├── auth.ts                    # Token handling + session
│   ├── helpers.ts                 # Utility functions
│   └── constants.ts
│
├── store/                         # Zustand stores
│   ├── userStore.ts
│   ├── stockStore.ts
│   ├── expenseStore.ts
│   └── reportStore.ts
│
├── types/                         # TypeScript interfaces
│   ├── index.ts
│   ├── stock.ts
│   ├── user.ts
│   ├── expense.ts
│   ├── purchase.ts
│   ├── usage.ts
│   └── report.ts
│
├── public/
│   ├── logo.svg
│   └── favicon.ico
│
└── tailwind.config.ts
```

---

## 🔐 **Authentication Pages**

### `/login`

- UI built with shadcn/ui `Card`, `Input`, `Button`
- POST to `/api/auth/login`
- Store JWT in cookie
- Redirect based on role:

  - Admin → `/dashboard/users`
  - Manager → `/dashboard/stock`
  - Staff → `/dashboard/usage`

### `/register` (Admin only)

- Simple form for creating new users with role selection

---

## 🖥️ **Dashboard Overview**

**Path:** `/dashboard`
Displays:

- Summary cards (Total Stock Value, Expenses, Profit, Low Stock)
- Recharts line graph for monthly profit/loss
- Pie chart for expense distribution

---

## 🧾 **Modules (Pages & UI Actions)**

### 1. **Stock Module**

**Path:** `/dashboard/stock`

- Table: name, quantity, unit price, category, low stock status
- Actions:

  - ➕ Add new (dialog form)
  - ✏️ Edit existing
  - 🗑️ Delete

- Filters:

  - Category filter
  - Search by item name

- Low-stock alert badge (red highlight)

---

### 2. **Purchases Module**

**Path:** `/dashboard/purchases`

- Table: supplier, date, total cost
- View items in each purchase (expandable row)
- Actions:

  - Add new purchase (supplier + list of items)
  - Edit, delete purchase

- Auto-update stock quantities after successful purchase

---

### 3. **Usage Module**

**Path:** `/dashboard/usage`

- Record daily usage (stock items used in kitchen or sold)
- Actions:

  - Add usage
  - Edit usage record
  - Filter by date or staff

- Table shows: item name, quantity used, date, entered by

---

### 4. **Expenses Module**

**Path:** `/dashboard/expenses`

- Add new expense (category, amount, description)
- View monthly expense summary
- Editable table with filtering and export

---

### 5. **Reports Module**

**Path:** `/dashboard/reports`

- Subpages:

  - `/dashboard/reports/summary`
  - `/dashboard/reports/monthly`

- Displays:

  - Total stock value
  - Monthly profit/loss
  - Expense breakdown chart
  - Export to PDF/Excel (button triggers backend endpoint)

---

### 6. **User Management Module**

**Path:** `/dashboard/users` (Admin only)

- Table: name, email, role, status
- Actions:

  - Create new user
  - Edit user role
  - Deactivate user

- Filters:

  - By role
  - By status (active/inactive)

---

### 7. **Settings Module**

**Path:** `/dashboard/settings`

- Configure:

  - Company info
  - Expense categories
  - Alert thresholds
  - Currency symbol

---

## 🎨 **UI/UX Guidelines**

- **Theme:** Light with neutral grays and emerald or amber accents
- **Layout:**

  - Persistent Sidebar (navigation + role-aware links)
  - Top Navbar (user info + notifications)
  - Content area with responsive grids

- **Buttons:** Rounded-lg, subtle hover transitions
- **Cards:** Use `shadcn/ui Card` for dashboard metrics
- **Tables:** Paginated, sortable, filterable
- **Dialogs:** For add/edit forms
- **Toasts:** For success/error feedback

---

## 🔄 **State Management Strategy**

- **Zustand store per module:**

  - Fetch data once and cache
  - Optimistic UI updates for CRUD actions

- Example:

  ```ts
  const useStockStore = create((set) => ({
    stocks: [],
    fetchStocks: async () => {
      const res = await api.get("/stocks");
      set({ stocks: res.data });
    },
  }));
  ```

---

## 🔌 **API Integration Pattern**

All API calls handled through `lib/api.ts`:

```ts
import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);
```

---

## 🧩 **Role-Based Routing & UI**

- Protect all `/dashboard/*` routes via middleware:

  - Redirect to `/login` if no JWT
  - Restrict access based on role (stored in userStore)

Example:

```ts
if (user.role === "STAFF" && path.startsWith("/dashboard/users")) {
  redirect("/dashboard/usage");
}
```

---

## 🧠 **Dashboard UX per Role**

| Role    | Default Landing    | Access                                     |
| ------- | ------------------ | ------------------------------------------ |
| Admin   | `/dashboard/users` | All modules                                |
| Manager | `/dashboard/stock` | Stock, Purchases, Usage, Expenses, Reports |
| Staff   | `/dashboard/usage` | Usage, Limited Purchases, Read-only stock  |

---

## 🚀 **Build Phases**

### Phase 1 — Setup & Core UI

- Initialize Next.js with Tailwind & shadcn/ui
- Build layout (Sidebar + Navbar + Dashboard shell)
- Configure Axios + Zustand + Auth handling

### Phase 2 — Authentication

- Login & Register pages
- JWT storage and middleware protection

### Phase 3 — Modules Implementation

1. Stock Management
2. Purchases
3. Usage Tracking
4. Expenses
5. Reports
6. User Management
7. Settings

### Phase 4 — Polish & Deployment

- Add loading skeletons
- Handle error states
- Test responsiveness
- Deploy (Vercel + connected API)

---

## ✅ **Deliverables**

- Fully working Next.js + TypeScript app
- Authenticated dashboard with 3 user roles
- CRUD forms with validation
- API integration with Spring Boot backend
- Charts and analytics dashboard
- Beautiful responsive UI using shadcn/ui components
