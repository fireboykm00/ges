package com.ges.backend.expense;

import com.ges.backend.expense.dto.ExpenseDtos;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
public class ExpenseService {
    private final ExpenseRepository repo;
    public ExpenseService(ExpenseRepository repo) { this.repo = repo; }

    public Page<Expense> list(int page, int size) { return repo.findAll(PageRequest.of(Math.max(page-1,0), size)); }

    public Expense get(UUID id) { return repo.findById(id).orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Expense not found")); }

    public Expense create(ExpenseDtos.Create dto) {
        var e = new Expense();
        e.setCategory(dto.category());
        e.setDescription(dto.description());
        e.setAmount(dto.amount());
        e.setDate(dto.date());
        return repo.save(e);
    }

    public Expense update(UUID id, ExpenseDtos.Create dto) {
        var e = get(id);
        e.setCategory(dto.category());
        e.setDescription(dto.description());
        e.setAmount(dto.amount());
        e.setDate(dto.date());
        return repo.save(e);
    }

    public void delete(UUID id) { repo.deleteById(id); }
}