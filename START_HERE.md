# 🚀 START HERE - GES Restaurant Stock Management System

## ✨ Everything You Need to Know

### Quick Start (30 Seconds)

```bash
# 1. Run the application
./run.sh

# 2. Select option 1 (H2 - recommended)

# 3. Open browser: http://localhost:3000

# 4. Login with:
Email:    admin@ges.com
Password: admin123
```

**That's it! You're ready to go! 🎉**

---

## 📖 What You Get

### ✅ Complete Application
- **Backend**: Spring Boot 3.5.6 + H2/MySQL
- **Frontend**: Next.js 15 + React 19 + TypeScript
- **Database**: H2 in-memory (no setup) or MySQL
- **Security**: JWT authentication with roles
- **UI**: Modern responsive design with shadcn/ui

### ✅ Pre-Populated Demo Data (H2 Mode)
- **3 Test Users**: Admin, Manager, Staff
- **12 Stock Items**: Ingredients, drinks, supplies
- **3 Suppliers**: Ready to use
- **3 Expenses**: Sample data

### ✅ All Features Working
- Dashboard with real-time stats
- Stock management with low stock alerts
- Supplier management
- Purchase recording (auto-updates stock)
- Expense tracking
- Usage recording (auto-decrements stock)
- Monthly reports
- User authentication & authorization

---

## 📁 Important Files

### 🎯 Quick Reference
- **START_HERE.md** (this file) - Start here!
- **QUICK_START.md** - 5-minute setup guide
- **WHATS_NEW.md** - Latest features added
- **DATA_SEEDING_INFO.md** - Demo data details

### 📚 Documentation
- **README.md** - Complete project documentation
- **PROJECT_REPORT.md** - Full academic report (MSIT format)
- **ERD.md** - Database schema
- **INTEGRATION_SUMMARY.md** - Technical integration details

### 🛠️ Scripts
- **run.sh** (Linux/Mac) - Main startup script
- **run.bat** (Windows) - Windows startup script
- **run-backend.sh** - Backend only
- **run-frontend.sh** - Frontend only

---

## 🔐 Test Credentials (H2 Database)

| Role | Email | Password | Access Level |
|------|-------|----------|--------------|
| **Admin** | admin@ges.com | admin123 | Full access |
| **Manager** | manager@ges.com | manager123 | Operational access |
| **Staff** | staff@ges.com | staff123 | Limited access |

---

## 🌐 Access URLs

After starting the application:

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend** | http://localhost:3000 | Main web interface |
| **Backend API** | http://localhost:8080/api | REST API endpoints |
| **Swagger UI** | http://localhost:8080/swagger-ui | API documentation |
| **H2 Console** | http://localhost:8080/h2-console | Database browser (H2 only) |

**H2 Console Login:**
- JDBC URL: `jdbc:h2:mem:gesdb`
- Username: `sa`
- Password: (leave empty)

---

## 🎯 Usage Scenarios

### Scenario 1: Quick Demo/Testing
```bash
./run.sh
# Select: 1 (H2)
# Login: admin@ges.com / admin123
# Explore all features with pre-loaded data
```

### Scenario 2: Development
```bash
# Use H2 for fast iteration
./run-backend.sh  # Select H2
./run-frontend.sh # In separate terminal
```

### Scenario 3: Production-like
```bash
# Setup MySQL first
mysql -u root -p
CREATE DATABASE ges;
exit;

./run.sh
# Select: 2 (MySQL)
# Register your admin account
```

---

## 📊 What You Can Do

### As Admin (admin@ges.com)
1. **Dashboard**
   - View total stock value
   - See low stock alerts (2 items currently low)
   - Monitor monthly expenses ($3,130)
   - Track purchases

2. **Stock Management**
   - View 12 pre-loaded items
   - Add new inventory items
   - Set reorder levels
   - Update quantities
   - Delete items

3. **Supplier Management**
   - View 3 existing suppliers
   - Add new suppliers
   - Update contact information
   - Manage relationships

4. **Purchase Recording**
   - Create new purchases
   - Select supplier
   - Add multiple items
   - Watch stock levels increase automatically

5. **Expense Tracking**
   - View 3 sample expenses
   - Add new expenses
   - Categorize spending
   - Track by date

6. **Usage Monitoring**
   - Record stock consumption
   - Add usage notes
   - Watch stock levels decrease automatically
   - View usage history

7. **Reports**
   - Generate monthly reports
   - View aggregated statistics
   - Track expenses vs purchases
   - Monitor trends

---

## 🎓 For Academic Evaluation

### Project Highlights
✅ **Full-Stack Development**: Backend + Frontend + Database
✅ **Modern Tech Stack**: Spring Boot 3 + Next.js 15 + React 19
✅ **Security Implementation**: JWT + Role-based access
✅ **Database Design**: 7 entities with proper relationships
✅ **RESTful API**: 30+ endpoints with Swagger documentation
✅ **Responsive UI**: Works on desktop, tablet, mobile
✅ **Data Seeding**: Instant demo data for testing
✅ **Documentation**: 2,500+ lines across 10+ documents
✅ **Best Practices**: Clean code, separation of concerns
✅ **Production Ready**: Flexible database, error handling

### Documentation Coverage
- ✅ Project report (MSIT format)
- ✅ System architecture
- ✅ Entity relationship diagram
- ✅ API documentation (Swagger)
- ✅ User guide
- ✅ Installation instructions
- ✅ Troubleshooting guide
- ✅ Future enhancements

---

## 🐛 Troubleshooting

### Backend Won't Start
```bash
# Check Java version
java -version  # Should be 21+

# Rebuild
cd backend
mvn clean install
```

### Frontend Won't Start
```bash
# Check Node version
node -v  # Should be 18+

# Reinstall dependencies
cd frontend
rm -rf node_modules
pnpm install
```

### Can't Login
- Verify you selected H2 database
- Check test credentials (admin@ges.com / admin123)
- Look for DataSeeder logs in backend console
- Restart backend if needed

### Port Already in Use
```bash
# Stop running processes
pkill -f spring-boot:run
pkill -f vite

# Or change ports in configuration files
```

---

## 📞 Quick Help

### Common Commands
```bash
# Stop all servers
pkill -f spring-boot:run && pkill -f vite

# Restart everything
./run.sh

# View backend logs
# Check the terminal where backend is running

# View frontend logs
# Check the terminal where frontend is running

# Rebuild backend
cd backend && mvn clean install

# Reinstall frontend
cd frontend && pnpm install
```

### File Locations
```
Backend code:    backend/src/main/java/com/ges/backend/
Frontend code:   frontend/app/
Configuration:   backend/src/main/resources/
Documentation:   *.md files in root
```

---

## 🎨 Feature Tour

### Step-by-Step Walkthrough

1. **Start Application**
   ```bash
   ./run.sh  # Select H2
   ```

2. **Login**
   - Go to http://localhost:3000
   - Use admin@ges.com / admin123

3. **Explore Dashboard**
   - See 12 stock items worth $1,430
   - Notice 2 low stock items (detergent, sanitizer)
   - View $3,130 in monthly expenses

4. **Check Stock**
   - Go to Stocks menu
   - See items with low stock highlighted
   - Click "Add item" to create new stock

5. **Record Purchase**
   - Go to Purchases → New Purchase
   - Select a supplier
   - Add items with quantities
   - Submit and watch stock increase!

6. **Record Usage**
   - Go to Usage
   - Select a stock item
   - Enter quantity used
   - Watch stock decrease automatically!

7. **View Reports**
   - Go to Reports → Monthly
   - See aggregated data
   - Change month to view trends

---

## 🚀 Next Steps

### Immediate
1. ✅ Start application with `./run.sh`
2. ✅ Login with test credentials
3. ✅ Explore all features

### For Testing
1. Try different user roles
2. Test CRUD operations
3. Verify stock updates
4. Generate reports

### For Development
1. Read PROJECT_REPORT.md
2. Review ERD.md for database schema
3. Check Swagger UI for API details
4. Explore codebase structure

### For Deployment
1. Switch to MySQL database
2. Configure environment variables
3. Set up SSL/TLS
4. Configure backup strategy

---

## 💡 Pro Tips

1. **Use H2 for Demo**: Instant data, no setup
2. **Check Console**: Backend logs show DataSeeder output
3. **Test All Roles**: Login as admin, manager, staff
4. **Explore Swagger**: Interactive API testing at /swagger-ui
5. **Use H2 Console**: Browse database at /h2-console

---

## ✅ Ready Checklist

Before presenting/submitting:

- [ ] Application starts successfully
- [ ] Can login with test credentials
- [ ] All menu items accessible
- [ ] Dashboard shows correct data
- [ ] Can create stock items
- [ ] Can record purchases (stock increments)
- [ ] Can record usage (stock decrements)
- [ ] Can add expenses
- [ ] Can generate reports
- [ ] Swagger UI loads properly
- [ ] Documentation is complete

---

## 🎉 You're All Set!

**Everything is configured and ready to use!**

**Just run:**
```bash
./run.sh
```

**And start exploring! 🚀**

---

**Questions? Check the documentation files or review console logs for details.**

**Good luck with your project! 💪**
