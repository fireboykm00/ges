package com.ges.backend.report;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.math.BigDecimal;

public record MonthlyReport(
        String month,
        BigDecimal totalStockValue,
        @JsonProperty("totalPurchases") BigDecimal purchases,
        @JsonProperty("totalExpenses") BigDecimal expenses,
        @JsonProperty("totalUsage") int usageCount,
        @JsonProperty("lowStockItems") int lowStockCount,
        BigDecimal estimatedSalesValue,
        BigDecimal profit
) {}