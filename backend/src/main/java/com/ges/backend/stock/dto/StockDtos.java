package com.ges.backend.stock.dto;

import com.ges.backend.stock.Category;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.util.UUID;

public class StockDtos {
    public record Create(
            @NotBlank String name,
            @NotNull Category category,
            @NotNull @DecimalMin("0.0") BigDecimal quantity,
            @NotBlank String unit,
            @NotNull @DecimalMin("0.0") BigDecimal unitPrice,
            @DecimalMin("0.0") BigDecimal reorderLevel
    ) {}

    public record Response(
            UUID id,
            String name,
            Category category,
            BigDecimal quantity,
            String unit,
            BigDecimal unitPrice,
            BigDecimal reorderLevel
    ) {}
}