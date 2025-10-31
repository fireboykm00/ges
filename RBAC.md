
## 🧩 **RBAC Permissions Matrix**

| **Module / Feature**    | **Action**                   | **Admin** | **Manager** | **Staff** | **Description**                             |
| ----------------------- | ---------------------------- | --------- | ----------- | --------- | ------------------------------------------- |
| **Authentication**      | Login                        | ✅         | ✅           | ✅         | All users can log in                        |
|                         | Logout                       | ✅         | ✅           | ✅         | All users can log out                       |
| **Dashboard**           | View statistics and summary  | ✅         | ✅           | ✅         | Overview of stock, alerts, etc.             |
| **User Management**     | View users                   | ✅         | ❌           | ❌         | Admin can view all system users             |
|                         | Create user                  | ✅         | ❌           | ❌         | Admin can register new users                |
|                         | Update user                  | ✅         | ❌           | ❌         | Admin can change roles or info              |
|                         | Delete user                  | ✅         | ❌           | ❌         | Admin can remove users                      |
| **Items (Stock)**       | View items                   | ✅         | ✅           | ✅         | View stock list and item details            |
|                         | Create new item              | ✅         | ❌           | ❌         | Only admin can add new stock items          |
|                         | Update item details          | ✅         | ✅           | ❌         | Managers can update quantities or metadata  |
|                         | Delete item                  | ✅         | ❌           | ❌         | Only admin can remove an item               |
| **Categories**          | View categories              | ✅         | ✅           | ✅         | All can view                                |
|                         | Manage categories (CRUD)     | ✅         | ❌           | ❌         | Only admin can manage item categories       |
| **Suppliers**           | View suppliers               | ✅         | ✅           | ✅         | All can view supplier list                  |
|                         | Create / Update supplier     | ✅         | ✅           | ❌         | Admin and manager can add or edit suppliers |
|                         | Delete supplier              | ✅         | ❌           | ❌         | Only admin can remove suppliers             |
| **Purchases**           | View purchase records        | ✅         | ✅           | ✅         | All can see purchase logs                   |
|                         | Create purchase record       | ✅         | ✅           | ❌         | Manager/Admin can record purchases          |
|                         | Update purchase record       | ✅         | ✅           | ❌         | Manager/Admin can correct details           |
|                         | Delete purchase record       | ✅         | ❌           | ❌         | Admin only                                  |
| **Usage Records**       | View usage records           | ✅         | ✅           | ✅         | All can see usage logs                      |
|                         | Create usage record          | ✅         | ✅           | ✅         | Staff and managers can record usage         |
|                         | Update usage record          | ✅         | ✅           | ❌         | Admin/Manager can correct entries           |
|                         | Delete usage record          | ✅         | ❌           | ❌         | Admin only                                  |
| **Reports & Analytics** | View stock reports           | ✅         | ✅           | ❌         | Admin/Manager can analyze stock trends      |
|                         | Export reports               | ✅         | ✅           | ❌         | Admin/Manager can export PDF/CSV            |
| **System Settings**     | Configure alerts, thresholds | ✅         | ✅           | ❌         | Admin/Manager can tune alert levels         |
| **Low Stock Alerts**    | Receive notifications        | ✅         | ✅           | ✅         | All roles can see alerts in dashboard       |

---

### 🧠 **Role Summary**

| Role        | Description                     | Primary Responsibilities                                 |
| ----------- | ------------------------------- | -------------------------------------------------------- |
| **Admin**   | Superuser — manages all modules | User control, stock setup, system configuration, reports |
| **Manager** | Oversees daily operations       | Approves purchases, monitors stock, updates quantities   |
| **Staff**   | Regular restaurant staff        | Records usage, views stock and alerts                    |

---
