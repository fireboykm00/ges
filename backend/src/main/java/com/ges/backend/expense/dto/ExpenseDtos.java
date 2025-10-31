package com.ges.backend.expense.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

public class ExpenseDtos {
    public record Create(
            @NotBlank String category,
            String description,
            @NotNull BigDecimal amount,
            @NotNull LocalDate date
    ) {}
}