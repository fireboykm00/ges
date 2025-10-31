package com.ges.backend.stock;

import com.ges.backend.stock.dto.StockDtos;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
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
@RequestMapping("/api/stocks")
@Tag(name = "Stocks", description = "Manage stock items including CRUD and search")
public class StockItemController {
    private final StockItemService service;
    public StockItemController(StockItemService service) { this.service = service; }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER','STAFF')")
    @Operation(summary = "List stock items", description = "Paged list of stock items. Supports optional case-insensitive search by name via 'q'.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Page of stock items",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = org.springframework.data.domain.Page.class),
                examples = @ExampleObject(name = "Stock page", value = "{\n  \"content\": [{ \"id\": \"uuid\", \"name\": \"Sugar\", \"category\": \"INGREDIENTS\", \"quantity\": 10.5, \"unit\": \"kg\", \"unitPrice\": 2.0, \"reorderLevel\": 5 }],\n  \"pageable\": { }, \"totalElements\": 1, \"totalPages\": 1, \"size\": 20, \"number\": 0 }"))
        )
    })
    public Page<StockItem> list(@RequestParam(defaultValue = "1") int page,
                                @RequestParam(defaultValue = "20") int size,
                                @RequestParam(required = false) String q) {
        return service.list(page, size, q);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get stock item", description = "Fetch a stock item by its ID")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Stock item found",
            content = @Content(schema = @Schema(implementation = StockItem.class),
                examples = @ExampleObject(value = "{ \"id\": \"uuid\", \"name\": \"Sugar\", \"category\": \"INGREDIENTS\", \"quantity\": 10.5, \"unit\": \"kg\", \"unitPrice\": 2.0, \"reorderLevel\": 5 }"))),
        @ApiResponse(responseCode = "404", description = "Not found")
    })
    public StockItem get(@PathVariable UUID id) { return service.get(id); }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create stock item")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Created",
            content = @Content(schema = @Schema(implementation = StockItem.class)))
    })
    public StockItem create(@RequestBody @Valid StockDtos.Create body) { return service.create(body); }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @Operation(summary = "Update stock item")
    public StockItem update(@PathVariable UUID id, @RequestBody @Valid StockDtos.Create body) { return service.update(id, body); }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete stock item")
    @ApiResponses({ @ApiResponse(responseCode = "204", description = "Deleted") })
    public void delete(@PathVariable UUID id) { service.delete(id); }
}
