package com.ges.backend.user.dto;

import com.ges.backend.user.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class UserDtos {
    public record Update(
            @NotBlank String name,
            @Email @NotBlank String email,
            @NotNull Role role,
            Boolean active
    ) {}
}
