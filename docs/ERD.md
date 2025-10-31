# Entity Relationship Diagram (ERD)

## GES Restaurant Stock Management System - Database Schema

### Entity Descriptions

#### 1. User
Stores user authentication and authorization information.
- **id** (UUID, PK): Unique identifier
- **name** (String): Full name
- **email** (String, Unique): Login email
- **passwordHash** (String): Bcrypt hashed password
- **role** (Enum): ADMIN, MANAGER, or STAFF
- **createdAt** (DateTime): Registration timestamp

#### 2. Supplier
Stores supplier/vendor information.
- **id** (UUID, PK): Unique identifier
- **name** (String): Supplier name
- **phone** (String): Contact number
- **email** (String): Contact email
- **address** (String): Physical address
- **createdAt**, **updatedAt** (DateTime): Timestamps

#### 3. StockItem
Main inventory items table.
- **id** (UUID, PK): Unique identifier
- **name** (String): Item name
- **category** (Enum): INGREDIENTS, BEVERAGES, PACKAGING, CLEANING, OTHER
- **unit** (String): Measurement unit (kg, L, pcs, etc.)
- **unitPrice** (Decimal): Price per unit
- **quantity** (Decimal): Current stock quantity
- **reorderLevel** (Decimal): Minimum stock threshold
- **createdAt**, **updatedAt** (DateTime): Timestamps

#### 4. Purchase
Records purchase orders from suppliers.
- **id** (UUID, PK): Unique identifier
- **supplierId** (UUID, FK): Reference to Supplier (optional)
- **date** (Date): Purchase date
- **totalAmount** (Decimal): Total purchase cost
- **createdAt** (DateTime): Record creation time

#### 5. PurchaseItem
Line items for each purchase (one-to-many with Purchase).
- **id** (UUID, PK): Unique identifier
- **purchaseId** (UUID, FK): Reference to Purchase
- **stockItemId** (UUID, FK): Reference to StockItem
- **quantity** (Decimal): Quantity purchased
- **unitPrice** (Decimal): Price per unit at purchase time

#### 6. Usage
Records stock consumption/usage.
- **id** (UUID, PK): Unique identifier
- **stockItemId** (UUID, FK): Reference to StockItem
- **quantity** (Decimal): Quantity used
- **date** (Date): Usage date
- **notes** (String): Purpose/reason for usage
- **createdBy** (UUID, FK): Reference to User
- **createdAt** (DateTime): Record creation time

#### 7. Expense
Tracks operational expenses.
- **id** (UUID, PK): Unique identifier
- **category** (String): Expense category
- **description** (String): Expense details
- **amount** (Decimal): Expense amount
- **date** (Date): Expense date
- **createdAt** (DateTime): Record creation time

---

## Visual ERD (Text Representation)

```
┌─────────────────┐         ┌──────────────────┐
│      User       │         │    Supplier      │
├─────────────────┤         ├──────────────────┤
│ id (PK)         │         │ id (PK)          │
│ name            │         │ name             │
│ email (UNIQUE)  │         │ phone            │
│ passwordHash    │         │ email            │
│ role            │         │ address          │
│ createdAt       │         │ createdAt        │
└────────┬────────┘         │ updatedAt        │
         │                  └────────┬─────────┘
         │ createdBy (FK)            │
         │                           │ supplierId (FK)
         │                           │
         │                  ┌────────▼─────────┐
         │                  │    Purchase      │
         │                  ├──────────────────┤
         │                  │ id (PK)          │
         │                  │ supplierId (FK)  │◄───┐
         │                  │ date             │    │
         │                  │ totalAmount      │    │
         │                  │ createdAt        │    │
         │                  └────────┬─────────┘    │
         │                           │              │
         │                           │ purchaseId   │
         │                           │              │
         │                  ┌────────▼─────────┐    │
         │                  │  PurchaseItem    │    │
         │                  ├──────────────────┤    │
         │                  │ id (PK)          │    │
         │                  │ purchaseId (FK)  │────┘
         │                  │ stockItemId (FK) │───┐
         │                  │ quantity         │   │
         │                  │ unitPrice        │   │
         │                  └──────────────────┘   │
         │                                         │
         │                  ┌──────────────────┐   │
         │                  │   StockItem      │◄──┘
         │                  ├──────────────────┤
         │                  │ id (PK)          │◄───┐
         │                  │ name             │    │
         │                  │ category         │    │
         │                  │ unit             │    │
         │                  │ unitPrice        │    │
         │                  │ quantity         │    │
         │                  │ reorderLevel     │    │
         │                  │ createdAt        │    │
         │                  │ updatedAt        │    │
         │                  └──────────────────┘    │
         │                                          │
         │                  ┌──────────────────┐    │
         └─────────────────►│     Usage        │    │
                            ├──────────────────┤    │
                            │ id (PK)          │    │
                            │ stockItemId (FK) │────┘
                            │ quantity         │
                            │ date             │
                            │ notes            │
                            │ createdBy (FK)   │
                            │ createdAt        │
                            └──────────────────┘

                            ┌──────────────────┐
                            │    Expense       │
                            ├──────────────────┤
                            │ id (PK)          │
                            │ category         │
                            │ description      │
                            │ amount           │
                            │ date             │
                            │ createdAt        │
                            └──────────────────┘
```

---

## Relationships

### One-to-Many Relationships

1. **Supplier → Purchase** (1:N)
   - One supplier can have many purchases
   - `Purchase.supplierId` references `Supplier.id`
   - Optional relationship (purchases can exist without supplier)

2. **Purchase → PurchaseItem** (1:N)
   - One purchase contains many purchase items
   - `PurchaseItem.purchaseId` references `Purchase.id`
   - Cascade delete: deleting purchase removes its items

3. **StockItem → PurchaseItem** (1:N)
   - One stock item can appear in many purchase items
   - `PurchaseItem.stockItemId` references `StockItem.id`

4. **StockItem → Usage** (1:N)
   - One stock item can have many usage records
   - `Usage.stockItemId` references `StockItem.id`

5. **User → Usage** (1:N)
   - One user can create many usage records
   - `Usage.createdBy` references `User.id`

---

## Business Rules & Constraints

### Stock Management Rules

1. **Purchase Creation**:
   - When a purchase is created with items
   - For each PurchaseItem: `StockItem.quantity += PurchaseItem.quantity`
   - Automatically updates inventory levels

2. **Usage Creation**:
   - When usage is recorded
   - `StockItem.quantity -= Usage.quantity`
   - Decrements inventory levels

3. **Low Stock Alert**:
   - Triggered when: `StockItem.quantity <= StockItem.reorderLevel`
   - Visual indicator shown in UI

4. **Category Validation**:
   - Stock categories: INGREDIENTS, BEVERAGES, PACKAGING, CLEANING, OTHER
   - Enforced at application level

5. **User Roles**:
   - ADMIN: Full system access
   - MANAGER: All operations except user management
   - STAFF: Limited to view and record operations

### Data Integrity

- All IDs are UUIDs for security and distribution
- Email addresses must be unique for users
- Quantities are stored as decimals to support fractional units
- Timestamps are automatically managed by JPA
- Soft deletes can be implemented for audit trail

---

## Database Platform Support

The system supports two database configurations:

### H2 In-Memory (Development/Testing)
```properties
spring.datasource.url=jdbc:h2:mem:gesdb
spring.datasource.driver-class-name=org.h2.Driver
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.H2Dialect
```

### MySQL (Production)
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/ges
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
```

---

## Indexes for Performance

Recommended indexes for optimal query performance:

- `User.email` (Unique Index) - for login queries
- `StockItem.category` - for category filtering
- `Purchase.date` - for date-range reports
- `Usage.date` - for usage history queries
- `Expense.date` - for monthly expense reports
- `StockItem.quantity` - for low stock queries

---

## Sample Data

### Users
- Admin user with ADMIN role
- Manager users with MANAGER role
- Staff users with STAFF role

### Stock Categories
- INGREDIENTS: Flour, Sugar, Salt, etc.
- BEVERAGES: Water, Juice, Soda, etc.
- PACKAGING: Boxes, Bags, Containers
- CLEANING: Detergent, Sanitizer, etc.
- OTHER: Miscellaneous items

---

This ERD design ensures:
✅ Data normalization and integrity
✅ Efficient querying and reporting
✅ Scalability for future features
✅ Clear relationships between entities
✅ Support for business logic automation
