package com.ges.backend.config;

import com.ges.backend.user.User;
import com.ges.backend.user.UserRepository;
import com.ges.backend.user.Role;
import com.ges.backend.supplier.Supplier;
import com.ges.backend.supplier.SupplierRepository;
import com.ges.backend.stock.StockItem;
import com.ges.backend.stock.StockItemRepository;
import com.ges.backend.stock.Category;
import com.ges.backend.expense.Expense;
import com.ges.backend.expense.ExpenseRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class DataSeeder {

    private final PasswordEncoder passwordEncoder;

    @Bean
    @Profile({"h2", "dev", "default"}) // Run in dev environments (not production)
    public CommandLineRunner seedData(
            UserRepository userRepository,
            SupplierRepository supplierRepository,
            StockItemRepository stockItemRepository,
            ExpenseRepository expenseRepository
    ) {
        return args -> {
            // Check if data already exists
            if (userRepository.count() > 0) {
                log.info("Database already contains data. Skipping seeding.");
                return;
            }

            log.info("Starting database seeding...");

            // 1. Create Users
            User admin = new User();
            admin.setName("Admin User");
            admin.setEmail("admin@ges.com");
            admin.setPasswordHash(passwordEncoder.encode("admin123"));
            admin.setRole(Role.ADMIN);
            userRepository.save(admin);

            User manager = new User();
            manager.setName("Manager User");
            manager.setEmail("manager@ges.com");
            manager.setPasswordHash(passwordEncoder.encode("manager123"));
            manager.setRole(Role.MANAGER);
            userRepository.save(manager);

            User staff = new User();
            staff.setName("Staff User");
            staff.setEmail("staff@ges.com");
            staff.setPasswordHash(passwordEncoder.encode("staff123"));
            staff.setRole(Role.STAFF);
            userRepository.save(staff);

            log.info("Created {} users", userRepository.count());

            // 2. Create Suppliers
            Supplier supplier1 = new Supplier();
            supplier1.setName("Fresh Foods Wholesale");
            supplier1.setPhone("+1-555-0101");
            supplier1.setEmail("sales@freshfoods.com");
            supplier1.setAddress("123 Market Street, Food District");
            supplierRepository.save(supplier1);

            Supplier supplier2 = new Supplier();
            supplier2.setName("Beverage Distributors Inc");
            supplier2.setPhone("+1-555-0202");
            supplier2.setEmail("orders@bevdist.com");
            supplier2.setAddress("456 Drink Avenue, Commerce Park");
            supplierRepository.save(supplier2);

            Supplier supplier3 = new Supplier();
            supplier3.setName("Kitchen Supplies Co");
            supplier3.setPhone("+1-555-0303");
            supplier3.setEmail("info@kitchensupply.com");
            supplier3.setAddress("789 Equipment Road, Industrial Zone");
            supplierRepository.save(supplier3);

            log.info("Created {} suppliers", supplierRepository.count());

            // 3. Create Stock Items
            // Ingredients
            StockItem flour = createStockItem("All-Purpose Flour", Category.INGREDIENTS, 
                new BigDecimal("50"), "kg", new BigDecimal("2.50"), new BigDecimal("10"));
            StockItem sugar = createStockItem("White Sugar", Category.INGREDIENTS, 
                new BigDecimal("30"), "kg", new BigDecimal("1.80"), new BigDecimal("5"));
            StockItem salt = createStockItem("Table Salt", Category.INGREDIENTS, 
                new BigDecimal("20"), "kg", new BigDecimal("0.80"), new BigDecimal("5"));
            StockItem oil = createStockItem("Vegetable Oil", Category.INGREDIENTS, 
                new BigDecimal("15"), "L", new BigDecimal("5.00"), new BigDecimal("5"));
            StockItem rice = createStockItem("Basmati Rice", Category.INGREDIENTS, 
                new BigDecimal("100"), "kg", new BigDecimal("3.20"), new BigDecimal("20"));

            // Beverages
            StockItem water = createStockItem("Bottled Water", Category.DRINKS, 
                new BigDecimal("200"), "pcs", new BigDecimal("0.50"), new BigDecimal("50"));
            StockItem soda = createStockItem("Assorted Sodas", Category.DRINKS, 
                new BigDecimal("150"), "pcs", new BigDecimal("1.20"), new BigDecimal("30"));
            StockItem juice = createStockItem("Orange Juice", Category.DRINKS, 
                new BigDecimal("50"), "L", new BigDecimal("4.00"), new BigDecimal("10"));

            // Packaging
            StockItem boxes = createStockItem("Takeout Boxes", Category.SUPPLIES, 
                new BigDecimal("500"), "pcs", new BigDecimal("0.30"), new BigDecimal("100"));
            StockItem bags = createStockItem("Paper Bags", Category.SUPPLIES, 
                new BigDecimal("1000"), "pcs", new BigDecimal("0.10"), new BigDecimal("200"));

            // Cleaning
            StockItem detergent = createStockItem("Dish Detergent", Category.SUPPLIES, 
                new BigDecimal("10"), "L", new BigDecimal("8.00"), new BigDecimal("3"));
            StockItem sanitizer = createStockItem("Hand Sanitizer", Category.SUPPLIES, 
                new BigDecimal("5"), "L", new BigDecimal("12.00"), new BigDecimal("2"));

            List<StockItem> stockItems = List.of(flour, sugar, salt, oil, rice, 
                water, soda, juice, boxes, bags, detergent, sanitizer);
            stockItemRepository.saveAll(stockItems);

            log.info("Created {} stock items", stockItemRepository.count());

            // 4. Create Sample Expenses
            Expense expense1 = new Expense();
            expense1.setCategory("Utilities");
            expense1.setDescription("Monthly electricity bill");
            expense1.setAmount(new BigDecimal("450.00"));
            expense1.setDate(LocalDate.now().minusDays(5));
            expenseRepository.save(expense1);

            Expense expense2 = new Expense();
            expense2.setCategory("Rent");
            expense2.setDescription("Restaurant rent for " + LocalDate.now().getMonth());
            expense2.setAmount(new BigDecimal("2500.00"));
            expense2.setDate(LocalDate.now().minusDays(10));
            expenseRepository.save(expense2);

            Expense expense3 = new Expense();
            expense3.setCategory("Maintenance");
            expense3.setDescription("Kitchen equipment repair");
            expense3.setAmount(new BigDecimal("180.00"));
            expense3.setDate(LocalDate.now().minusDays(3));
            expenseRepository.save(expense3);

            log.info("Created {} expenses", expenseRepository.count());

            log.info("=".repeat(50));
            log.info("Database seeding completed successfully!");
            log.info("=".repeat(50));
            log.info("Test Users Created:");
            log.info("  Admin:   admin@ges.com / admin123");
            log.info("  Manager: manager@ges.com / manager123");
            log.info("  Staff:   staff@ges.com / staff123");
            log.info("=".repeat(50));
        };
    }

    private StockItem createStockItem(String name, Category category, 
                                     BigDecimal quantity, String unit, 
                                     BigDecimal unitPrice, BigDecimal reorderLevel) {
        StockItem item = new StockItem();
        item.setName(name);
        item.setCategory(category);
        item.setQuantity(quantity);
        item.setUnit(unit);
        item.setUnitPrice(unitPrice);
        item.setReorderLevel(reorderLevel);
        return item;
    }
}
