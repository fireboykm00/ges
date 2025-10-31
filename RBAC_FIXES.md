# RBAC and Authentication Fixes

## Summary
Fixed RBAC implementation and authentication issues in both frontend and backend based on RBAC.md specifications.

---

## Backend Changes

### 1. **StockItemController.java**
- **Fixed**: Create stock items - changed from `ADMIN + MANAGER` to `ADMIN` only
- **Reason**: Per RBAC.md, only ADMIN can add new stock items

### 2. **SupplierController.java**
- **Fixed**: View suppliers - changed from `ADMIN + MANAGER` to `ADMIN + MANAGER + STAFF`
- **Reason**: Per RBAC.md, all roles can view supplier list

### 3. **UsageController.java**
- **Fixed**: View usage records - changed from `ADMIN + MANAGER` to `ADMIN + MANAGER + STAFF`
- **Reason**: Per RBAC.md, all roles can see usage logs

### 4. **PurchaseController.java & PurchaseService.java**
- **Added**: PUT endpoint for updating purchase records
- **Permissions**: `ADMIN + MANAGER` can update
- **Reason**: Per RBAC.md, Manager/Admin can correct purchase details

### 5. **JwtAuthFilter.java**
- **Improved**: Error handling for invalid tokens
- **Added**: Try-catch blocks to properly handle authentication failures
- **Reason**: Ensures proper 401 responses for invalid tokens instead of silently continuing

---

## Frontend Changes

### 1. **lib/api.ts**
- **Added**: Response interceptor for 401/403 errors
- **Functionality**: 
  - Clears localStorage token on auth errors
  - Redirects to login with return URL
  - Prevents redirect loops on login page
- **Reason**: Frontend wasn't handling authentication errors properly

### 2. **app/(protected)/layout.tsx**
- **Added**: Role-based navigation rendering
- **Added**: Fetch and store user role from session
- **Modified**: Logout to clear localStorage token
- **Functionality**:
  - Only ADMIN sees Users management
  - Only ADMIN + MANAGER see Expenses and Reports
  - All roles see Dashboard, Stocks, Suppliers, Purchases, and Usage
- **Reason**: All users were seeing all menu items regardless of role

### 3. **lib/api.ts - Additional CRUD fixes**
- **Added**: Missing `update` method to PurchasesAPI
- **Added**: Missing `update` method to UsageAPI  
- **Added**: Missing `remove` method to UsageAPI
- **Reason**: Frontend was missing methods that exist in backend

### 4. **app/api/auth/logout/route.ts**
- **Note**: Already properly clears cookie, frontend now also clears localStorage

---

## RBAC Matrix Implementation Status

| Module / Feature    | Action                   | Backend Fixed | Frontend Fixed |
| ------------------- | ------------------------ | ------------- | -------------- |
| **Stock Items**     | Create                   | ✅ ADMIN only | ✅             |
| **Stock Items**     | Update                   | ✅ A+M        | ✅             |
| **Stock Items**     | Delete                   | ✅ ADMIN only | ✅             |
| **Suppliers**       | View                     | ✅ A+M+S      | ✅             |
| **Suppliers**       | Create/Update            | ✅ A+M        | ✅             |
| **Suppliers**       | Delete                   | ✅ ADMIN only | ✅             |
| **Purchases**       | View                     | ✅ A+M+S      | ✅             |
| **Purchases**       | Create                   | ✅ A+M        | ✅             |
| **Purchases**       | Update                   | ✅ A+M        | ✅             |
| **Purchases**       | Delete                   | ✅ ADMIN only | ✅             |
| **Usage**           | View                     | ✅ A+M+S      | ✅             |
| **Usage**           | Create                   | ✅ A+M+S      | ✅             |
| **Usage**           | Update                   | ✅ A+M        | ✅             |
| **Usage**           | Delete                   | ✅ ADMIN only | ✅             |
| **Reports**         | View                     | ✅ A+M        | ✅             |
| **Expenses**        | All operations           | ✅ A+M        | ✅             |
| **Users**           | All operations           | ✅ ADMIN only | ✅             |

*Legend: A = ADMIN, M = MANAGER, S = STAFF*

---

## Authentication Fixes

### Issues Fixed:
1. ✅ Frontend not handling 401 errors
2. ✅ Frontend not handling 403 errors  
3. ✅ Tokens not being cleared on logout
4. ✅ Invalid tokens not redirecting to login
5. ✅ Backend not properly rejecting invalid tokens

---

## Known Limitations

### Categories
- **Not Implemented**: Category CRUD endpoints
- **Status**: Categories are hardcoded in the `Category` enum
- **Reason**: Per RBAC.md, only ADMIN can manage categories, but no controller exists yet
- **Recommendation**: Create `CategoryController` if dynamic category management is needed

---

## Testing Recommendations

1. **Backend RBAC Testing**:
   - Test each endpoint with different role tokens
   - Verify 403 responses for unauthorized actions
   - Verify 401 responses for invalid/expired tokens

2. **Frontend Auth Testing**:
   - Test with expired tokens
   - Test with invalid tokens
   - Verify redirect to login with return URL
   - Verify localStorage token is cleared on logout
   - Test role-based navigation visibility for each role

3. **Integration Testing**:
   - Login as each role (ADMIN, MANAGER, STAFF)
   - Verify visible menu items match RBAC.md
   - Verify blocked actions show appropriate error messages
   - Verify successful logout clears all auth state

---

## Files Modified

### Backend (5 files)
1. `backend/src/main/java/com/ges/backend/stock/StockItemController.java`
2. `backend/src/main/java/com/ges/backend/supplier/SupplierController.java`
3. `backend/src/main/java/com/ges/backend/usage/UsageController.java`
4. `backend/src/main/java/com/ges/backend/purchase/PurchaseController.java`
5. `backend/src/main/java/com/ges/backend/purchase/PurchaseService.java`
6. `backend/src/main/java/com/ges/backend/security/JwtAuthFilter.java`

### Frontend (2 files)
1. `frontend/lib/api.ts` (Added 401/403 error handling + missing CRUD methods)
2. `frontend/app/(protected)/layout.tsx` (Role-based navigation)

---

## How to Test

### Backend
```bash
cd backend
mvn clean install -DskipTests
mvn spring-boot:run
```

### Frontend
```bash
cd frontend
pnpm install
pnpm dev
```

### Test Scenarios

#### Test 1: Role-based Navigation
1. Login as STAFF user
2. Verify you only see: Dashboard, Stocks, Suppliers, Purchases, Usage
3. Verify you don't see: Expenses, Reports, Users

#### Test 2: Authentication Error Handling
1. Login successfully
2. Manually clear backend session/token
3. Make any API request
4. Verify automatic redirect to login page
5. Verify localStorage token is cleared

#### Test 3: Logout
1. Login successfully
2. Click Logout button
3. Verify redirect to login page
4. Verify localStorage token is cleared
5. Verify cookie is cleared

#### Test 4: Permission Enforcement
1. Login as STAFF user
2. Try to create a stock item (should fail with 403)
3. Try to create usage record (should succeed)
4. Try to access /users page (backend should return 403)
