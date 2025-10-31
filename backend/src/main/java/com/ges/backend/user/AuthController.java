package com.ges.backend.user;

import com.ges.backend.security.JwtService;
import com.ges.backend.user.dto.AuthDtos;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api")
@Tag(name = "Auth", description = "Registration, login and user management")
public class AuthController {

    private final AuthenticationManager authManager;
    private final UserService userService;
    private final JwtService jwtService;

    public AuthController(AuthenticationManager authManager, UserService userService, JwtService jwtService) {
        this.authManager = authManager;
        this.userService = userService;
        this.jwtService = jwtService;
    }

    @PostMapping("/auth/register")
    @Operation(summary = "Register a user")
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "User created",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = AuthDtos.UserDto.class),
                examples = @ExampleObject(value = "{ \"id\": \"uuid\", \"name\": \"Alice\", \"email\": \"alice@example.com\", \"role\": \"STAFF\" }")))
    })
    public ResponseEntity<AuthDtos.UserDto> register(@RequestBody AuthDtos.RegisterRequest req) {
        var u = userService.register(req.name(), req.email(), req.password(), req.role());
        return ResponseEntity.status(201).body(new AuthDtos.UserDto(u.getId().toString(), u.getName(), u.getEmail(), u.getRole()));
    }

    @PostMapping("/auth/login")
    @Operation(summary = "Login", description = "Authenticate with email and password to receive a JWT token")
    public AuthDtos.AuthResponse login(@RequestBody AuthDtos.LoginRequest req) {
        Authentication authentication = authManager.authenticate(new UsernamePasswordAuthenticationToken(req.email(), req.password()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        var principal = (UserPrincipal) authentication.getPrincipal();
        String token = jwtService.generateToken(principal);
        var u = principal.getUser();
        return new AuthDtos.AuthResponse(token, new AuthDtos.UserDto(u.getId().toString(), u.getName(), u.getEmail(), u.getRole()));
    }

    @PatchMapping("/users/{id}/role")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update user role")
    public User updateRole(@PathVariable UUID id, @RequestParam Role role) {
        var u = userService.get(id);
        u.setRole(role);
        return userService.save(u);
    }

    @PatchMapping("/users/{id}/active")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Activate/deactivate user")
    public User updateActive(@PathVariable UUID id, @RequestParam boolean active) {
        var u = userService.get(id);
        u.setActive(active);
        return userService.save(u);
    }
}
