package com.ges.backend.user.dto;

import com.ges.backend.user.Role;

public class AuthDtos {
    public record LoginRequest(String email, String password) {}
    public record RegisterRequest(String name, String email, String password, Role role) {}
    public record UserDto(String id, String name, String email, Role role) {}
    public record AuthResponse(String token, UserDto user) {}
}
