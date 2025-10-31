---

## 🏷️ Project Title

**GES Restaurant Stock Management System**

---

## 🎯 Project Goal

To manage restaurant inventory efficiently — including **food items, drinks, ingredients, and supplies** — by tracking **stock levels**, **purchases**, and **daily usage**. The system will also help monitor **expenses** and calculate **monthly profits**.

---

## 🧠 Extended Translation (from the Kinyarwanda part)

The goal is to create a system that allows the restaurant owner to:

* Know the **total value of stock items** purchased and sold (cash flow).
* Track **stock quantities** to calculate how much is used in meals.
* See **daily usage reports** showing whether the restaurant made a **profit or loss**.
* Include **expense management** (transport, salaries, utilities, rent, etc.) to determine **monthly income and profit**.

The system should show, at any time:

* Current stock levels and value.
* Daily or monthly profit based on stock usage and expenses.
* Notifications for low stock.

---

## ⚙️ Technologies

* **Backend:** Spring Boot (Java 17+)
* **Database:** MySQL with JPA/Hibernate ORM
* **Frontend:** React (Vite or CRA) + Axios + Tailwind or MUI
* **Build Tools:** Maven or Gradle
* **API Docs:** Swagger/OpenAPI
* **Authentication:** JWT-based auth (Spring Security)
* **Testing:** JUnit + Postman for API validation

---

## 🏗️ System Architecture

**Architecture:**

* 3-tier structure (Presentation → Service → Data)
* RESTful API with clean DTOs and layered separation
* Entities managed via JPA Repositories
* Role-based access (Admin, Manager, Staff)

---

## 📦 Core Modules

### 1. **Authentication & User Management**

* Register, login, logout with JWT tokens
* Roles: `ADMIN`, `STAFF`, `MANAGER`
* Profile management (name, email, position)

---

### 2. **Stock Management**

**Features:**

* Add, edit, delete stock items
* View all items with current quantity and cost
* Alert for low stock items
* Categorize stock (e.g., Drinks, Food, Ingredients, Supplies)

**Entity Example (StockItem):**

```java
id, name, category, quantity, unit, unitPrice, totalCost, reorderLevel, createdAt, updatedAt
```

---

### 3. **Purchases & Suppliers**

**Features:**

* Add purchase orders
* Link suppliers to stock items
* Auto-update stock when a purchase is recorded
* Supplier management (name, contact, address, history)

**Entities:**

* `Supplier(id, name, phone, email, address)`
* `Purchase(id, supplierId, date, totalCost)`
* `PurchaseItem(purchaseId, stockItemId, quantity, price)`

---

### 4. **Usage Tracking (Sales / Kitchen Consumption)**

**Features:**

* Record daily usage of stock (based on sales or kitchen use)
* Auto-reduce quantities from stock
* Keep usage history

**Entities:**

* `Usage(id, stockItemId, quantityUsed, date, purpose, createdBy)`

---

### 5. **Expenses & Income**

**Features:**

* Record monthly expenses (transport, salaries, utilities, rent, etc.)
* Calculate monthly profit/loss based on:

  * Stock sold or used
  * Purchases and expenses

**Entities:**

* `Expense(id, category, description, amount, date)`

---

### 6. **Reports Module**

**Features:**

* Generate:

  * Stock summary report
  * Low stock report
  * Daily usage report
  * Monthly expense and profit report
* Export reports to PDF/Excel

**Example Report Calculations:**

```
MonthlyProfit = TotalSalesValue - (Purchases + Expenses)
```

---

### 7. **Dashboard (Frontend Visualization)**

**Features:**

* Overview cards:

  * Total stock value
  * Total expenses this month
  * Monthly profit
  * Low stock alerts
* Graphs (e.g., monthly expense trends, profit vs expense)

---

## 🧩 Database Schema (Simplified ERD)

```
User ───< StockUsage
StockItem ───< PurchaseItem >─── Purchase ─── Supplier
Expense
```

---

## 🚀 Development Phases

### **Phase 1: Setup**

* Initialize Spring Boot + MySQL backend
* Setup JPA entities, repositories, and controllers
* Configure Swagger and JWT security

### **Phase 2: Core CRUD Modules**

* Implement Stock, Purchase, Supplier, and Usage modules
* Setup REST endpoints with DTOs and validation

### **Phase 3: Expenses and Reports**

* Add expense management
* Implement report generation (monthly summaries)

### **Phase 4: Frontend Integration**

* Build React dashboard
* Connect via Axios to Spring Boot APIs
* Implement charts (Recharts or Chart.js)

### **Phase 5: Testing & Deployment**

* Unit and integration testing
* Deploy backend (Render, Railway, or EC2)
* Deploy frontend (Vercel or Netlify)

---

## 🧾 Example API Endpoints

| Method | Endpoint               | Description                       |
| ------ | ---------------------- | --------------------------------- |
| POST   | `/api/auth/register`   | Register new user                 |
| POST   | `/api/auth/login`      | Login and get JWT                 |
| GET    | `/api/stocks`          | Get all stock items               |
| POST   | `/api/stocks`          | Add new stock item                |
| PUT    | `/api/stocks/{id}`     | Update stock item                 |
| DELETE | `/api/stocks/{id}`     | Delete stock item                 |
| POST   | `/api/purchases`       | Record new purchase               |
| GET    | `/api/reports/monthly` | Get monthly profit/expense report |

---

## 📊 Sample Dashboard Metrics

* **Total stock value:** ₣ 3,500,000
* **Low stock items:** 8
* **Expenses this month:** ₣ 1,200,000
* **Estimated Profit:** ₣ 2,300,000


