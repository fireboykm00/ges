

## 👑 **1. Admin Features (System Owner / Superuser)**

> The **Admin** oversees the entire system — manages users, configurations, and full financial reports.

### 🔧 Permissions:

✅ **Full CRUD access** to every module:

* Add, edit, delete stock items
* Add, edit, delete purchases, suppliers, and usage records
* Add and manage all expenses
* Access and export all reports (stock, usage, expenses, profit/loss)

✅ **User & Role Management:**

* Create and manage user accounts (assign `STAFF` or `MANAGER` roles)
* Activate/deactivate users
* Reset passwords
* Change permissions dynamically

✅ **System Settings:**

* Configure expense categories (e.g. Rent, Salaries, Transport)
* Define low-stock alert thresholds
* Set company profile (name, logo, currency, etc.)

✅ **Reports & Insights:**

* Access all reports, including:

  * Monthly profit/loss summary
  * Expense distribution graphs
  * Stock usage analytics
* Export reports as PDF or Excel

✅ **Audit & Monitoring:**

* View logs of all actions (who added/deleted/updated records)
* Track login history and suspicious activities

---

## 👔 **2. Manager Features (Operations / Supervisor)**

> The **Manager** oversees restaurant operations — focuses on **daily activities**, **stock control**, and **financial reporting**, but does **not** have system-level control.

### 🔧 Permissions:

✅ **Stock & Purchase Management:**

* Add, edit, and delete stock items
* Record purchases and supplier info
* Update stock quantities
* Mark items as “out of stock” or “restocked”

✅ **Usage Tracking:**

* Record daily usage from the kitchen or sales
* Approve or reject usage entries from staff

✅ **Expense Management:**

* Add daily or monthly expenses
* Review and edit existing expenses

✅ **Reporting:**

* View:

  * Daily usage summaries
  * Low stock alerts
  * Monthly profit/loss overview
* Export basic reports (PDF/Excel)

🚫 **Restricted From:**

* Managing user accounts
* Modifying system configurations
* Viewing audit logs

---

## 👨‍🍳 **3. Staff Features (Cashier / Kitchen / Inventory Clerk)**

> The **Staff** role performs **day-to-day data entry** and assists the manager in maintaining accurate records. Their access is limited to operations relevant to their tasks.

### 🔧 Permissions:

✅ **Stock Usage & Updates:**

* View stock items and quantities
* Record daily usage (kitchen consumption, sold items)
* Request restocking (notify manager when items are low)

✅ **Purchase Input:**

* Enter new purchases (pending manager approval)
* Attach supplier and receipt details

✅ **Reports (Limited View):**

* View low stock and daily usage summaries only
* Cannot edit or delete reports

🚫 **Restricted From:**

* Deleting or editing other users’ records
* Managing users or expenses
* Accessing financial profit/loss reports
* Changing system settings

---

## 🧩 Summary Table — Role Permissions Overview

| Feature               | Admin   | Manager     | Staff                 |
| --------------------- | ------- | ----------- | --------------------- |
| Manage Users          | ✅       | ❌           | ❌                     |
| Add/Edit/Delete Stock | ✅       | ✅           | ⚠️ (limited)          |
| Record Purchases      | ✅       | ✅           | ⚠️ (pending approval) |
| Manage Suppliers      | ✅       | ✅           | ❌                     |
| Record Usage          | ✅       | ✅           | ✅                     |
| Manage Expenses       | ✅       | ✅           | ❌                     |
| Generate Reports      | ✅ (All) | ✅ (Partial) | ⚠️ (View only)        |
| View Profit/Loss      | ✅       | ✅           | ❌                     |
| System Settings       | ✅       | ❌           | ❌                     |
| Approve Staff Entries | ✅       | ✅           | ❌                     |
| View Audit Logs       | ✅       | ❌           | ❌                     |

---

## 🏗️ Implementation Notes (Spring Boot)

You’ll handle this via **Spring Security Role-Based Access**:

* Each user has a role:

  ```java
  @Entity
  public class User {
      @Id
      private Long id;
      private String username;
      private String password;
      @Enumerated(EnumType.STRING)
      private Role role; // ADMIN, MANAGER, STAFF
  }
  ```
* Use method-level security:

  ```java
  @PreAuthorize("hasRole('ADMIN')")
  public void createUser(UserDto userDto) { ... }

  @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
  public void addStock(StockDto stockDto) { ... }

  @PreAuthorize("hasAnyRole('ADMIN','MANAGER','STAFF')")
  public void recordUsage(UsageDto usageDto) { ... }
  ```

---

## 🧠 Frontend (React) Role-based UI

You’ll conditionally render features based on the logged-in user’s role:

```js
if (user.role === "ADMIN") showAdminDashboard();
if (user.role === "MANAGER") showManagerView();
if (user.role === "STAFF") showStaffPanel();
```

Each dashboard will show:

* **Admin Dashboard:** global overview + user management + analytics
* **Manager Dashboard:** stock & expense summaries
* **Staff Dashboard:** simple forms for purchases and usage

