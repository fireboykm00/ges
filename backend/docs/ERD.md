# ERD (Simplified)

```
User (id, name, email, passwordHash, role)

Supplier (id, name, phone, email, address)

StockItem (id, name, category, unit, unitPrice, quantity, reorderLevel, createdAt, updatedAt)

Purchase (id, supplierId, date, totalCost)
PurchaseItem (id, purchaseId, stockItemId, quantity, price)

Usage (id, stockItemId, quantityUsed, date, purpose, createdBy)

Expense (id, category, description, amount, date)
```

# Notes
- quantity and quantityUsed are decimals (support kg, liters, etc.)
- On Purchase creation, StockItem.quantity += PurchaseItem.quantity
- On Usage creation, StockItem.quantity -= quantityUsed
- Low stock alert when quantity <= reorderLevel
