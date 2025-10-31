package com.ges.backend.purchase;

import com.ges.backend.purchase.dto.PurchaseDtos;
import com.ges.backend.stock.StockItem;
import com.ges.backend.stock.StockItemRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.UUID;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
public class PurchaseService {
    private final PurchaseRepository repo;
    private final StockItemRepository stockRepo;

    public PurchaseService(PurchaseRepository repo, StockItemRepository stockRepo) {
        this.repo = repo;
        this.stockRepo = stockRepo;
    }

    public Page<Purchase> list(int page, int size) { return repo.findAll(PageRequest.of(Math.max(page-1,0), size)); }

    public Purchase get(UUID id) { return repo.findById(id).orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Purchase not found")); }

    @Transactional
    public Purchase create(PurchaseDtos.Create dto) {
        var p = new Purchase();
        p.setSupplierId(dto.supplierId());
        p.setDate(dto.date());

        BigDecimal total = BigDecimal.ZERO;
        for (var itemDto : dto.items()) {
            var pi = new PurchaseItem();
            pi.setPurchase(p);
            pi.setStockItemId(itemDto.stockItemId());
            pi.setQuantity(itemDto.quantity());
            pi.setPrice(itemDto.price());
            p.getItems().add(pi);

            StockItem si = stockRepo.findById(itemDto.stockItemId())
                    .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Stock item not found"));
            si.setQuantity(si.getQuantity().add(itemDto.quantity()));
            stockRepo.save(si);

            total = total.add(itemDto.price().multiply(itemDto.quantity()));
        }
        p.setTotalCost(total);
        return repo.save(p);
    }

    @Transactional
    public Purchase update(UUID id, PurchaseDtos.Create dto) {
        Purchase p = get(id);
        
        // Revert previous stock changes
        for (var item : p.getItems()) {
            StockItem si = stockRepo.findById(item.getStockItemId())
                    .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Stock item not found"));
            si.setQuantity(si.getQuantity().subtract(item.getQuantity()));
            stockRepo.save(si);
        }
        
        // Clear and rebuild items
        p.getItems().clear();
        p.setSupplierId(dto.supplierId());
        p.setDate(dto.date());
        
        BigDecimal total = BigDecimal.ZERO;
        for (var itemDto : dto.items()) {
            var pi = new PurchaseItem();
            pi.setPurchase(p);
            pi.setStockItemId(itemDto.stockItemId());
            pi.setQuantity(itemDto.quantity());
            pi.setPrice(itemDto.price());
            p.getItems().add(pi);
            
            StockItem si = stockRepo.findById(itemDto.stockItemId())
                    .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Stock item not found"));
            si.setQuantity(si.getQuantity().add(itemDto.quantity()));
            stockRepo.save(si);
            
            total = total.add(itemDto.price().multiply(itemDto.quantity()));
        }
        p.setTotalCost(total);
        return repo.save(p);
    }

    public void delete(UUID id) { repo.deleteById(id); }
}