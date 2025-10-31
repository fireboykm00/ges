package com.ges.backend.usage;

import com.ges.backend.usage.dto.UsageDtos;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/usages")
@Tag(name = "Usage", description = "Track usage of stock items and auto-decrement quantities")
public class UsageController {
    private final UsageService service;
    public UsageController(UsageService service) { this.service = service; }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER','STAFF')")
    @Operation(summary = "List usages")
    public Page<Usage> list(@RequestParam(defaultValue = "1") int page,
                            @RequestParam(defaultValue = "20") int size) { return service.list(page, size); }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER','STAFF')")
    @Operation(summary = "Get usage")
    public Usage get(@PathVariable UUID id) { return service.get(id); }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER','STAFF')")
    @Operation(summary = "Create usage", description = "Decrements the stock quantity for the referenced stock item")
    public Usage create(@RequestBody @Valid UsageDtos.Create body) { return service.create(body, "system"); }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @Operation(summary = "Update usage")
    public Usage update(@PathVariable UUID id, @RequestBody @Valid UsageDtos.Create body) { return service.update(id, body); }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete usage")
    public void delete(@PathVariable UUID id) { service.delete(id); }
}
