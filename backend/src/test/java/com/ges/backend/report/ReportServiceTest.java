package com.ges.backend.report;

import com.ges.backend.expense.Expense;
import com.ges.backend.expense.ExpenseRepository;
import com.ges.backend.stock.Category;
import com.ges.backend.stock.StockItem;
import com.ges.backend.stock.StockItemRepository;
import com.ges.backend.usage.Usage;
import com.ges.backend.usage.UsageRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
class ReportServiceTest {

    @Autowired ReportService reportService;
    @Autowired StockItemRepository stockRepo;
    @Autowired ExpenseRepository expenseRepo;
    @Autowired UsageRepository usageRepo;

    @Test
    void monthlyReportAggregatesValues() {
        var month = YearMonth.now();
        var before = reportService.monthly(month.toString());

        var stock = new StockItem();
        stock.setName("Sugar");
        stock.setCategory(Category.INGREDIENTS);
        stock.setQuantity(new BigDecimal("5"));
        stock.setUnit("kg");
        stock.setUnitPrice(new BigDecimal("2.00"));
        var savedStock = stockRepo.save(stock);

        var exp = new Expense();
        exp.setCategory("Misc");
        exp.setAmount(new BigDecimal("10"));
        exp.setDate(LocalDate.now());
        expenseRepo.save(exp);

        var usage = new Usage();
        usage.setStockItemId(savedStock.getId());
        usage.setQuantityUsed(new BigDecimal("2"));
        usage.setDate(LocalDate.now());
        usageRepo.save(usage);
        
        // Perform inserts
        var report = reportService.monthly(month.toString());
        assertThat(report).isNotNull();
        assertThat(report.totalStockValue().subtract(before.totalStockValue())).isEqualByComparingTo("10.00");
        assertThat(report.expenses().subtract(before.expenses())).isEqualByComparingTo("10.00");
        assertThat(report.estimatedSalesValue().subtract(before.estimatedSalesValue())).isEqualByComparingTo("4.00");
    }
}
