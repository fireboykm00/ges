package com.ges.backend.purchase.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public class PurchaseDtos {
    public record Item(@NotNull UUID stockItemId, @NotNull BigDecimal quantity, @NotNull BigDecimal price) {}

    public record Create(
            @NotNull UUID supplierId,
            @NotNull LocalDate date,
            @NotEmpty List<@Valid Item> items
    ) {}
}