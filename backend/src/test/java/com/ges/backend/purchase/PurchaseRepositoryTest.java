package com.ges.backend.purchase;

import com.ges.backend.stock.Category;
import com.ges.backend.stock.StockItem;
import com.ges.backend.stock.StockItemRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@org.springframework.test.context.ActiveProfiles("test")
class PurchaseRepositoryTest {

    @Autowired PurchaseRepository purchaseRepo;
    @Autowired StockItemRepository stockRepo;

    @Test
    void saveAndLoadPurchaseWithItems() {
        var stock = new StockItem();
        stock.setName("Oil");
        stock.setCategory(Category.INGREDIENTS);
        stock.setQuantity(new BigDecimal("0"));
        stock.setUnit("l");
        stock.setUnitPrice(new BigDecimal("3.00"));
        var savedStock = stockRepo.save(stock);

        var p = new Purchase();
        p.setSupplierId(java.util.UUID.randomUUID());
        p.setDate(LocalDate.now());
        p.setTotalCost(new BigDecimal("6.00"));

        var item = new PurchaseItem();
        item.setPurchase(p);
        item.setStockItemId(savedStock.getId());
        item.setQuantity(new BigDecimal("2"));
        item.setPrice(new BigDecimal("3.00"));
        p.setItems(List.of(item));

        var saved = purchaseRepo.save(p);
        var loaded = purchaseRepo.findById(saved.getId()).orElseThrow();
        assertThat(loaded.getItems()).hasSize(1);
        assertThat(loaded.getItems().get(0).getPrice()).isEqualByComparingTo("3.00");
    }
}
