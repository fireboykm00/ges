package com.ges.backend.purchase;

import com.ges.backend.purchase.dto.PurchaseDtos;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/purchases")
@Tag(name = "Purchases", description = "Manage purchases and update stock quantities")
public class PurchaseController {
    private final PurchaseService service;
    public PurchaseController(PurchaseService service) { this.service = service; }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER','STAFF')")
    @Operation(summary = "List purchases")
    @ApiResponses({ @ApiResponse(responseCode = "200", description = "Page of purchases",
        content = @Content(schema = @Schema(implementation = org.springframework.data.domain.Page.class))) })
    public Page<Purchase> list(@RequestParam(defaultValue = "1") int page,
                               @RequestParam(defaultValue = "20") int size) { return service.list(page, size); }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER','STAFF')")
    @Operation(summary = "Get purchase")
    public Purchase get(@PathVariable UUID id) { return service.get(id); }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @Operation(summary = "Create purchase", description = "Creates a purchase and increments stock quantities accordingly")
    public Purchase create(@RequestBody @Valid PurchaseDtos.Create body) { return service.create(body); }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @Operation(summary = "Update purchase", description = "Updates a purchase and adjusts stock quantities accordingly")
    public Purchase update(@PathVariable UUID id, @RequestBody @Valid PurchaseDtos.Create body) { return service.update(id, body); }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete purchase")
    @ApiResponses({ @ApiResponse(responseCode = "204", description = "Deleted") })
    public void delete(@PathVariable UUID id) { service.delete(id); }
}
