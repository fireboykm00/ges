package com.ges.backend.report;

import com.ges.backend.expense.ExpenseRepository;
import com.ges.backend.purchase.PurchaseRepository;
import com.ges.backend.stock.StockItemRepository;
import com.ges.backend.usage.UsageRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.YearMonth;
import java.util.stream.StreamSupport;

@Service
public class ReportService {
    private final StockItemRepository stockRepo;
    private final PurchaseRepository purchaseRepo;
    private final ExpenseRepository expenseRepo;
    private final UsageRepository usageRepo;

    public ReportService(StockItemRepository stockRepo, PurchaseRepository purchaseRepo, ExpenseRepository expenseRepo, UsageRepository usageRepo) {
        this.stockRepo = stockRepo;
        this.purchaseRepo = purchaseRepo;
        this.expenseRepo = expenseRepo;
        this.usageRepo = usageRepo;
    }

    public MonthlyReport monthly(String monthStr) {
        YearMonth ym = monthStr != null ? YearMonth.parse(monthStr) : YearMonth.now();

        var totalStockValue = StreamSupport.stream(stockRepo.findAll().spliterator(), false)
                .map(si -> si.getUnitPrice().multiply(si.getQuantity()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        var purchases = StreamSupport.stream(purchaseRepo.findAll().spliterator(), false)
                .filter(p -> YearMonth.from(p.getDate()).equals(ym))
                .map(p -> p.getTotalCost() != null ? p.getTotalCost() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        var expenses = StreamSupport.stream(expenseRepo.findAll().spliterator(), false)
                .filter(e -> YearMonth.from(e.getDate()).equals(ym))
                .map(e -> e.getAmount() != null ? e.getAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Count usage records for the month
        int usageCount = (int) StreamSupport.stream(usageRepo.findAll().spliterator(), false)
                .filter(u -> YearMonth.from(u.getDate()).equals(ym))
                .count();

        var estimatedSalesValue = StreamSupport.stream(usageRepo.findAll().spliterator(), false)
                .filter(u -> YearMonth.from(u.getDate()).equals(ym))
                .map(u -> stockRepo.findById(u.getStockItemId())
                        .map(si -> si.getUnitPrice().multiply(u.getQuantityUsed()))
                        .orElse(BigDecimal.ZERO))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Count low stock items
        int lowStockCount = (int) StreamSupport.stream(stockRepo.findAll().spliterator(), false)
                .filter(si -> si.getQuantity().compareTo(si.getReorderLevel()) <= 0)
                .count();

        var profit = estimatedSalesValue.subtract(purchases.add(expenses));

        return new MonthlyReport(
                ym.toString(), 
                totalStockValue, 
                purchases, 
                expenses, 
                usageCount,
                lowStockCount,
                estimatedSalesValue, 
                profit
        );
    }
}