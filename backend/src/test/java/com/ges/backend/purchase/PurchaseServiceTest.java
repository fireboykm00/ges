package com.ges.backend.purchase;

import com.ges.backend.stock.Category;
import com.ges.backend.stock.StockItem;
import com.ges.backend.stock.StockItemRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
class PurchaseServiceTest {

    @Autowired PurchaseService service;
    @Autowired StockItemRepository stockRepo;

    @Test
    void increasesStockOnPurchase() {
        var item = new StockItem();
        item.setName("Rice");
        item.setCategory(Category.FOOD);
        item.setQuantity(new BigDecimal("0"));
        item.setUnit("kg");
        item.setUnitPrice(new BigDecimal("1.50"));
        var saved = stockRepo.save(item);

        var dto = new com.ges.backend.purchase.dto.PurchaseDtos.Create(
                java.util.UUID.randomUUID(),
                LocalDate.now(),
                java.util.List.of(new com.ges.backend.purchase.dto.PurchaseDtos.Item(
                        saved.getId(), new BigDecimal("25"), new BigDecimal("1.20")
                ))
        );

        var purchase = service.create(dto);
        assertThat(purchase.getTotalCost()).isEqualByComparingTo(new BigDecimal("30.00"));

        var updated = stockRepo.findById(saved.getId()).orElseThrow();
        assertThat(updated.getQuantity()).isEqualByComparingTo(new BigDecimal("25"));
    }
}
