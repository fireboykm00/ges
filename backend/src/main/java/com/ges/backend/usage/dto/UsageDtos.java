package com.ges.backend.usage.dto;

import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public class UsageDtos {
    public record Create(
            @NotNull UUID stockItemId,
            @NotNull BigDecimal quantityUsed,
            @NotNull LocalDate date,
            String purpose
    ) {}
}