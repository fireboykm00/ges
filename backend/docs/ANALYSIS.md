# Backend Analysis: GES Restaurant Stock Management

This document summarizes the current backend architecture, API surface, security model, and recommended improvements to support a performant restaurant management system and a shadcn-based frontend.

## Tech stack
- Spring Boot 3.5.x (Java 21)
- Spring Web, Spring Data JPA, Spring Security (JWT)
- springdoc-openapi (Swagger UI)
- MySQL (H2 for tests)

## Modules and endpoints (base `/api`)
- Auth
  - POST `/auth/register` — create user (Admin bootstrap via DB)
  - POST `/auth/login` — returns `{ token, user }`
  - GET `/users` (ADMIN)
  - PATCH `/users/{id}/role` (ADMIN)
  - PATCH `/users/{id}/active` (ADMIN)
- Stocks
  - GET `/stocks?page=&size=&q=` — paginated list with optional name search
  - GET `/stocks/{id}`
  - POST `/stocks` (ADMIN, MANAGER)
  - PUT `/stocks/{id}` (ADMIN, MANAGER)
  - DELETE `/stocks/{id}` (ADMIN)
- Suppliers
  - CRUD at `/suppliers`
- Purchases
  - GET `/purchases?page=&size=`
  - GET `/purchases/{id}` (loads items)
  - POST `/purchases` — creates purchase and increments stock quantities
  - DELETE `/purchases/{id}`
- Usage
  - GET `/usages?page=&size=` (ADMIN, MANAGER)
  - GET `/usages/{id}`
  - POST `/usages` — decrements stock for referenced item (STAFF+)
- Expenses
  - CRUD at `/expenses` (ADMIN, MANAGER)
- Reports
  - GET `/reports/monthly?month=YYYY-MM`
- Health
  - GET `/health` — liveness

OpenAPI/Swagger:
- Swagger UI `/swagger-ui`
- OpenAPI JSON `/api/openapi.json`

## Domain model (selected)
- User: id (UUID), name, email (unique), passwordHash, role (ADMIN/MANAGER/STAFF), active
- StockItem: id, name, category (enum), quantity (BigDecimal), unit, unitPrice, reorderLevel, createdAt/updatedAt
- Supplier: id, name, phone, email, address
- Purchase: id, supplierId (UUID), date, totalCost, items[]
- PurchaseItem: id, purchase (ManyToOne), stockItemId, quantity, price
- Usage: id, stockItemId, quantityUsed, date, purpose, createdBy
- Expense: id, category, description, amount, date

Notes:
- Some relations are modeled as UUID references (`supplierId`, `stockItemId`) rather than JPA associations. This simplifies write paths but for richer queries consider `@ManyToOne` with FK constraints.

## Repositories
- Standard `JpaRepository` usage; custom queries include `StockItemRepository.findByNameContainingIgnoreCase` and `@EntityGraph` for `Purchase.items`.

## Services and business rules (inferred)
- PurchaseService: create increments stock quantities; delete likely rolls back quantities (verify logic)
- UsageService: create decrements stock quantities
- ExpenseService: CRUD with pagination
- ReportService: aggregates by month

## Security
- JWT-based stateless auth: `JwtAuthFilter` + `SecurityFilterChain`
- Public endpoints: `/api/auth/**`, `/api/health`, OpenAPI/Swagger
- Role-based method security via `@PreAuthorize`
- Password hashing: BCrypt

CORS:
- Allowed origins: `http://localhost:3000` for `/api/**` with common methods/headers; adjust for production domains.

## Configuration
- application.properties uses env-var backed defaults for DB URL, user, password, JWT secret and expiration.
- Tests use in-memory H2 with `ddl-auto=create-drop`.

Important: Do not commit real credentials. Use environment variables or secret managers for DB and JWT. Rotate JWT secret regularly.

## Observability & DX
- Swagger/OpenAPI available; consider exposing `/actuator` for health/metrics (Micrometer + Prometheus if needed)
- Logging: `com.ges.backend=DEBUG` in dev; consider INFO in prod.

## Performance & reliability recommendations
- Pagination already implemented on list endpoints; keep `size` caps (e.g., max 100) to avoid abuse.
- Add DB indexes:
  - `users.email` UNIQUE (already via JPA)
  - `stock_item.name` (if search heavy)
  - `usage.stock_item_id`, `purchase.date`, `expense.date`
- Transactions:
  - Ensure `PurchaseService.create` and `UsageService.create` are transactional and validate stock levels (prevent negative quantities).
- Data integrity:
  - Consider JPA relationships + FK constraints for `supplierId` and `stockItemId` to enforce referential integrity.
- Validation:
  - DTOs already use `jakarta.validation`; ensure boundaries (e.g., positive quantities, non-negative prices).
- Error handling:
  - Central `GlobalExceptionHandler` exists; make sure to map `EntityNotFound`, `MethodArgumentNotValidException`, and business errors to clear JSON.
- Security hardening:
  - Rate limit auth endpoints.
  - Shorter JWT expiry + refresh flow if needed.
  - CORS: restrict origins per environment.

## API contract for frontend
- Base URL: `/api`
- Auth: Bearer token in `Authorization` header
- Standard pagination: `?page=1&size=20`
- Entities: UUID identifiers in path or payloads
- OpenAPI: generate TS client/types from `/api/openapi.json`

## Suggested backend additions (optional)
- Add `/api/me` endpoint to fetch current user profile/role
- Low-stock alerts endpoint: `/api/stocks/low?threshold=`
- Soft delete flags for critical entities
- Audit fields: `createdBy/updatedBy` via `AuditingEntityListener`
- Actuator: `/actuator/health`, `/actuator/metrics`

## Readiness for frontend
- Endpoints cover core features (auth, stocks, suppliers, purchases, usage, expenses, reports)
- OpenAPI available for codegen
- CORS configured for local Next.js

This backend is suitable for building a shadcn/Next.js frontend with dashboards, CRUD screens, and reporting.
