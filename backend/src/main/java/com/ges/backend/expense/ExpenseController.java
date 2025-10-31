package com.ges.backend.expense;

import com.ges.backend.expense.dto.ExpenseDtos;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/expenses")
@Tag(name = "Expenses", description = "Record and manage expenses")
public class ExpenseController {
    private final ExpenseService service;
    public ExpenseController(ExpenseService service) { this.service = service; }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @Operation(summary = "List expenses")
    public Page<Expense> list(@RequestParam(defaultValue = "1") int page,
                              @RequestParam(defaultValue = "20") int size) { return service.list(page, size); }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @Operation(summary = "Get expense")
    public Expense get(@PathVariable UUID id) { return service.get(id); }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @Operation(summary = "Create expense")
    public Expense create(@RequestBody @Valid ExpenseDtos.Create body) { return service.create(body); }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @Operation(summary = "Update expense")
    public Expense update(@PathVariable UUID id, @RequestBody @Valid ExpenseDtos.Create body) { return service.update(id, body); }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete expense")
    public void delete(@PathVariable UUID id) { service.delete(id); }
}
