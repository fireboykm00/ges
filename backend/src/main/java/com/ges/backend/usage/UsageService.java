package com.ges.backend.usage;

import com.ges.backend.stock.StockItem;
import com.ges.backend.stock.StockItemRepository;
import com.ges.backend.usage.dto.UsageDtos;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.UUID;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
public class UsageService {
    private final UsageRepository repo;
    private final StockItemRepository stockRepo;

    public UsageService(UsageRepository repo, StockItemRepository stockRepo) {
        this.repo = repo;
        this.stockRepo = stockRepo;
    }

    public Page<Usage> list(int page, int size) { return repo.findAll(PageRequest.of(Math.max(page-1,0), size)); }

    public Usage get(UUID id) { return repo.findById(id).orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Usage not found")); }

    @Transactional
    public Usage create(UsageDtos.Create dto, String createdBy) {
        StockItem item = stockRepo.findById(dto.stockItemId())
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Stock item not found"));
        BigDecimal newQty = item.getQuantity().subtract(dto.quantityUsed());
        if (newQty.signum() < 0) throw new ResponseStatusException(BAD_REQUEST, "Insufficient stock");
        item.setQuantity(newQty);
        stockRepo.save(item);

        var u = new Usage();
        u.setStockItemId(dto.stockItemId());
        u.setQuantityUsed(dto.quantityUsed());
        u.setDate(dto.date());
        u.setPurpose(dto.purpose());
        u.setCreatedBy(createdBy);
        return repo.save(u);
    }

    @Transactional
    public Usage update(UUID id, UsageDtos.Create dto) {
        Usage u = get(id);
        
        // Restore the old quantity to stock
        StockItem item = stockRepo.findById(u.getStockItemId())
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Stock item not found"));
        item.setQuantity(item.getQuantity().add(u.getQuantityUsed()));
        
        // Apply the new quantity
        BigDecimal newQty = item.getQuantity().subtract(dto.quantityUsed());
        if (newQty.signum() < 0) throw new ResponseStatusException(BAD_REQUEST, "Insufficient stock");
        item.setQuantity(newQty);
        stockRepo.save(item);
        
        // Update usage record
        u.setStockItemId(dto.stockItemId());
        u.setQuantityUsed(dto.quantityUsed());
        u.setDate(dto.date());
        u.setPurpose(dto.purpose());
        return repo.save(u);
    }

    @Transactional
    public void delete(UUID id) {
        Usage u = get(id);
        
        // Restore quantity to stock when deleting usage
        StockItem item = stockRepo.findById(u.getStockItemId())
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Stock item not found"));
        item.setQuantity(item.getQuantity().add(u.getQuantityUsed()));
        stockRepo.save(item);
        
        repo.deleteById(id);
    }
}