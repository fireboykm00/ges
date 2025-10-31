# Frontend App Sitemap (Next.js "app" router)

- /
  - Premium landing (hero, value props, CTA to dashboard)
- /dashboard
  - KPI cards: Total stock value, Low stock count, This month expenses, Estimated profit
  - Charts: Expenses vs Profit (monthly), Purchases vs Usage
- /stocks
  - Table: name, category, quantity (unit), unitPrice, totalCost, reorderLevel, actions
  - Create/Edit drawer/form
- /suppliers
  - Table + CRUD
- /purchases
  - List of purchases
  - New Purchase wizard: select supplier, add items (autocomplete StockItems), qty, price
- /usage
  - Record usage form: pick item, quantity, purpose
  - History table
- /expenses
  - Table + CRUD
- /reports/monthly
  - Month picker + metrics + charts
- /settings
  - Company profile, thresholds, categories
- /admin/users
  - Users & roles (Admin only)

UI per docs/UI_GUIDE.md: neutral layout, soft cards, clean tables, uppercase labels, black accent actions.
