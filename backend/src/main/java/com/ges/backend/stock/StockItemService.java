package com.ges.backend.stock;

import com.ges.backend.stock.dto.StockDtos;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
public class StockItemService {
    private final StockItemRepository repo;
    public StockItemService(StockItemRepository repo) { this.repo = repo; }

    public Page<StockItem> list(int page, int size, String q) {
        var pageable = PageRequest.of(Math.max(page-1,0), size);
        if (q != null && !q.isBlank()) return repo.findByNameContainingIgnoreCase(q, pageable);
        return repo.findAll(pageable);
    }

    public StockItem get(UUID id) {
        return repo.findById(id).orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Stock item not found"));
    }

    public StockItem create(StockDtos.Create dto) {
        var s = new StockItem();
        s.setName(dto.name());
        s.setCategory(dto.category());
        s.setQuantity(dto.quantity());
        s.setUnit(dto.unit());
        s.setUnitPrice(dto.unitPrice());
        s.setReorderLevel(dto.reorderLevel());
        return repo.save(s);
    }

    public StockItem update(UUID id, StockDtos.Create dto) {
        var s = get(id);
        s.setName(dto.name());
        s.setCategory(dto.category());
        s.setQuantity(dto.quantity());
        s.setUnit(dto.unit());
        s.setUnitPrice(dto.unitPrice());
        s.setReorderLevel(dto.reorderLevel());
        return repo.save(s);
    }

    public void delete(UUID id) { repo.deleteById(id); }
}