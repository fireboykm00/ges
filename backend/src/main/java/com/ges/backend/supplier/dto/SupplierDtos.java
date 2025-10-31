package com.ges.backend.supplier.dto;

import jakarta.validation.constraints.NotBlank;

public class SupplierDtos {
    public record Create(
            @NotBlank String name,
            String phone,
            String email,
            String address
    ) {}
}