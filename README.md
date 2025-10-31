# GES Restaurant Stock Management System

A comprehensive full-stack web application for managing restaurant inventory, tracking stock levels, recording purchases and expenses, and generating monthly reports.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [Database Configuration](#database-configuration)
- [API Documentation](#api-documentation)
- [User Guide](#user-guide)
- [Project Structure](#project-structure)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

GES (Gourmet Enterprise System) is a modern restaurant stock management system designed to help restaurant owners and managers efficiently track inventory, monitor expenses, record usage, and generate comprehensive reports. The system provides real-time insights into stock levels, low stock alerts, and monthly financial summaries.

### Key Objectives

- **Inventory Management**: Track stock items with categories, quantities, and pricing
- **Supplier Management**: Maintain supplier information and relationships
- **Purchase Tracking**: Record purchases and automatically update stock levels
- **Expense Management**: Track restaurant expenses by category
- **Usage Recording**: Monitor stock consumption and depletion
- **Reporting**: Generate monthly reports with key financial metrics
- **Role-Based Access**: Secure system with admin, manager, and staff roles

## ✨ Features

### Dashboard
- Real-time total stock value calculation
- Low stock item alerts
- Monthly expenses and purchases summary
- Quick action buttons for common tasks

### Stock Management
- CRUD operations for stock items
- Category-based organization (Ingredients, Beverages, Packaging, Cleaning, Other)
- Reorder level tracking with visual indicators
- Unit-based quantity management
- Search and filter capabilities

### Supplier Management
- Maintain supplier database
- Contact information tracking
- Purchase history by supplier

### Purchase Tracking
- Record purchases with multiple items
- Automatic stock quantity increment
- Supplier linkage
- Date-based tracking

### Expense Management
- Category-based expense tracking
- Date-based filtering
- Amount and description fields
- Full CRUD capabilities

### Usage Recording
- Track stock consumption
- Notes for usage context
- Date-based recording
- Automatic stock quantity decrement

### Reports
- Monthly aggregated reports
- Total purchases and expenses
- Usage statistics
- Low stock item count

### Security
- JWT-based authentication
- Role-based access control (ADMIN, MANAGER, STAFF)
- Secure password hashing
- HTTP-only cookies for token storage

## 🛠 Technology Stack

### Backend
- **Framework**: Spring Boot 3.5.6
- **Language**: Java 21
- **Database**: H2 (in-memory) / MySQL 8.0
- **ORM**: Spring Data JPA + Hibernate
- **Security**: Spring Security + JWT
- **API Documentation**: Springdoc OpenAPI (Swagger)
- **Build Tool**: Maven 3.9+

### Frontend
- **Framework**: Next.js 15.1.3
- **Library**: React 19
- **Language**: TypeScript
- **UI Components**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Notifications**: Sonner (toast notifications)
- **Icons**: Lucide React
- **Package Manager**: pnpm

## 🏗 System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Browser (Client)                      │
│                  Next.js 15 + React 19                   │
│            TypeScript + Tailwind + shadcn/ui             │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP/HTTPS
                       │ JWT Token
                       ▼
┌─────────────────────────────────────────────────────────┐
│              Next.js API Routes (Proxy)                  │
│                    (:3000/api/*)                         │
└──────────────────────┬──────────────────────────────────┘
                       │ REST API
                       │ JSON
                       ▼
┌─────────────────────────────────────────────────────────┐
│              Spring Boot Backend                         │
│           Controllers + Services + Repositories          │
│                     (:8080/api/*)                        │
└──────────────────────┬──────────────────────────────────┘
                       │ JPA/Hibernate
                       ▼
┌─────────────────────────────────────────────────────────┐
│                  Database Layer                          │
│           H2 (In-Memory) or MySQL 8.0                    │
└─────────────────────────────────────────────────────────┘
```

## 📦 Prerequisites

Before running the application, ensure you have the following installed:

- **Java Development Kit (JDK)** 21 or higher
- **Maven** 3.9 or higher
- **Node.js** 18+ and **pnpm** 8+
- **MySQL 8.0** (optional, only if not using H2)
- **Git** for cloning the repository

### Installing pnpm

```bash
npm install -g pnpm
```

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd GES
```

### 2. Backend Setup

```bash
cd backend

# The application will use H2 in-memory database by default
# No additional database setup required

# For MySQL (optional):
# 1. Ensure MySQL is running
# 2. Create database:
mysql -u root -p
CREATE DATABASE ges;
exit;

# 3. Update credentials in:
#    src/main/resources/application.properties
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
pnpm install
```

## 🎮 Running the Application

### Option 1: Quick Start (Recommended)

#### Linux/Mac:
```bash
# Make scripts executable (first time only)
chmod +x run.sh

# Run with interactive database selection
./run.sh
```

#### Windows:
```batch
run.bat
```

This script will:
- Ask you to choose between H2 (in-memory) or MySQL
- Install frontend dependencies if needed
- Start both backend and frontend in separate terminal windows

### Option 2: Run Services Separately

#### Backend Only:

```bash
# Linux/Mac - H2 (recommended)
cd backend
./run-h2.sh

# Linux/Mac - MySQL
./run-backend.sh

# Windows - H2 (recommended)
cd backend
run-h2.bat

# Windows - MySQL
cd backend
mvn spring-boot:run
```

#### Frontend Only:

```bash
# Linux/Mac
./run-frontend.sh

# Windows
cd frontend
pnpm dev
```

### Option 3: Manual Startup

#### Backend:
```bash
cd backend

# With H2 (in-memory)
mvn spring-boot:run -Dspring-boot.run.profiles=h2

# With MySQL
mvn spring-boot:run
```

#### Frontend:
```bash
cd frontend
pnpm install  # First time only
pnpm dev
```

## 🗄 Database Configuration

### H2 In-Memory Database (Default - Recommended for Testing)

**Pros:**
- No installation required
- No configuration needed
- Fast startup
- Perfect for development and testing

**Access H2 Console:**
- URL: http://localhost:8080/h2-console
- JDBC URL: `jdbc:h2:mem:gesdb`
- Username: `sa`
- Password: (leave empty)

**Configuration:** `application-h2.properties`

### MySQL Database (Optional - For Production)

**Configuration:** `application.properties`

Update the following properties:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/ges
spring.datasource.username=root
spring.datasource.password=your_password
```

## 📚 API Documentation

### Swagger UI

Access comprehensive API documentation at:
- **URL**: http://localhost:8080/swagger-ui

### Main Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token

#### Stocks
- `GET /api/stocks` - List all stock items (paginated)
- `GET /api/stocks/{id}` - Get stock item by ID
- `POST /api/stocks` - Create new stock item
- `PUT /api/stocks/{id}` - Update stock item
- `DELETE /api/stocks/{id}` - Delete stock item

#### Suppliers
- `GET /api/suppliers` - List suppliers (paginated)
- `GET /api/suppliers/{id}` - Get supplier by ID
- `POST /api/suppliers` - Create supplier
- `PUT /api/suppliers/{id}` - Update supplier
- `DELETE /api/suppliers/{id}` - Delete supplier

#### Purchases
- `GET /api/purchases` - List purchases (paginated)
- `GET /api/purchases/{id}` - Get purchase by ID
- `POST /api/purchases` - Create purchase (increments stock)
- `DELETE /api/purchases/{id}` - Delete purchase

#### Expenses
- `GET /api/expenses` - List expenses (paginated)
- `GET /api/expenses/{id}` - Get expense by ID
- `POST /api/expenses` - Create expense
- `PUT /api/expenses/{id}` - Update expense
- `DELETE /api/expenses/{id}` - Delete expense

#### Usage
- `GET /api/usages` - List usage records (paginated)
- `GET /api/usages/{id}` - Get usage by ID
- `POST /api/usages` - Record usage (decrements stock)

#### Reports
- `GET /api/reports/monthly?month=YYYY-MM` - Get monthly report

## 👤 User Guide

### Access the Application

1. **Backend**: http://localhost:8080
2. **Frontend**: http://localhost:3000
3. **API Docs**: http://localhost:8080/swagger-ui
4. **H2 Console**: http://localhost:8080/h2-console (if using H2)

### Default Credentials

When running with **H2 database** (recommended for testing), test users are **automatically seeded**:

**Test Users:**
- **Admin**: admin@ges.com / admin123
- **Manager**: manager@ges.com / manager123
- **Staff**: staff@ges.com / staff123

**New User Registration:**
You can also register new users through the UI:
- Navigate to http://localhost:3000/register
- Fill in the registration form
- Select role (ADMIN, MANAGER, or STAFF)
- Click "Create account"

**Note:** Test users are only created when using H2 database and the database is empty.

### Using the System

1. **Dashboard**: View overview of stock, expenses, and purchases
2. **Stocks**: Add items, set reorder levels, track quantities
3. **Suppliers**: Maintain supplier database
4. **Purchases**: Record new purchases (auto-updates stock)
5. **Expenses**: Track operational expenses
6. **Usage**: Record stock consumption (auto-decrements stock)
7. **Reports**: View monthly summaries

### User Roles

- **ADMIN**: Full access to all features
- **MANAGER**: Access to all features except user management
- **STAFF**: Limited access to view and record operations

## 📁 Project Structure

```
GES/
├── backend/                    # Spring Boot Backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/ges/backend/
│   │   │   │   ├── config/        # Security, CORS, JWT config
│   │   │   │   ├── controller/    # REST Controllers
│   │   │   │   ├── model/         # JPA Entities
│   │   │   │   ├── repository/    # Data Repositories
│   │   │   │   ├── security/      # Security components
│   │   │   │   └── service/       # Business logic
│   │   │   └── resources/
│   │   │       ├── application.properties          # MySQL config
│   │   │       └── application-h2.properties       # H2 config
│   │   └── test/
│   └── pom.xml                # Maven dependencies
│
├── frontend/                  # Next.js Frontend
│   ├── app/
│   │   ├── (protected)/      # Protected routes (require auth)
│   │   │   ├── dashboard/
│   │   │   ├── stocks/
│   │   │   ├── suppliers/
│   │   │   ├── purchases/
│   │   │   ├── expenses/
│   │   │   ├── usage/
│   │   │   └── reports/
│   │   ├── api/              # Next.js API routes (proxy)
│   │   ├── login/
│   │   ├── register/
│   │   └── layout.tsx
│   ├── components/           # React components
│   │   └── ui/              # shadcn/ui components
│   ├── lib/
│   │   ├── api.ts           # Backend API client
│   │   └── apiClient.ts     # Next.js API client
│   ├── middleware.ts        # Route protection
│   └── package.json
│
├── docs/                     # Documentation
│   ├── ERD.md
│   ├── API.md
│   └── ARCHITECTURE.md
│
├── scripts/                  # Utility scripts
│   ├── backend/
│   ├── frontend/
│   └── docs/
│
├── run.sh                    # Main run script (Linux/Mac)
├── run.bat                   # Main run script (Windows)
├── run-backend.sh           # Backend only (Linux/Mac)
├── run-frontend.sh          # Frontend only (Linux/Mac)
├── README.md                # This file
└── INTEGRATION_SUMMARY.md   # Integration documentation
```

## 📸 Screenshots

Screenshots will be added in the `docs/screenshots/` directory:

- Dashboard view
- Stock management
- Purchase recording
- Expense tracking
- Usage recording
- Monthly reports
- Login page
- Swagger API documentation

## 🤝 Contributing

This is an educational project for MSIT coursework. Contributions are welcome for:

- Bug fixes
- Documentation improvements
- Feature enhancements
- UI/UX improvements

## 📄 License

This project is developed for educational purposes as part of MSIT coursework.

## 📞 Support

For issues or questions:
1. Check the [API Documentation](http://localhost:8080/swagger-ui) when running
2. Review the [Integration Summary](INTEGRATION_SUMMARY.md)
3. Check the console logs for error messages

## 🎓 Project Information

- **Project Type**: Full-Stack Web Application
- **Purpose**: Educational/Academic (MSIT Project)
- **Development Period**: 2025
- **Technologies**: Spring Boot 3 + Next.js 15 + React 19

---

**Built with ❤️ for Restaurant Management**
