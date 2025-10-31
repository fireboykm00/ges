package com.ges.backend.usage;

import com.ges.backend.stock.Category;
import com.ges.backend.stock.StockItem;
import com.ges.backend.stock.StockItemRepository;
import com.ges.backend.usage.dto.UsageDtos;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

@SpringBootTest
@ActiveProfiles("test")
class UsageServiceTest {

    @Autowired UsageService service;
    @Autowired StockItemRepository stockRepo;

    @Test
    void createUsageDecrementsStock_andFailsOnInsufficient() {
        var item = new StockItem();
        item.setName("Flour");
        item.setCategory(Category.INGREDIENTS);
        item.setQuantity(new BigDecimal("10"));
        item.setUnit("kg");
        item.setUnitPrice(new BigDecimal("1.00"));
        var saved = stockRepo.save(item);

        var ok = new UsageDtos.Create(saved.getId(), new BigDecimal("3"), LocalDate.now(), "Baking");
        var usage = service.create(ok, "tester");
        assertThat(usage.getQuantityUsed()).isEqualByComparingTo("3");
        assertThat(stockRepo.findById(saved.getId()).orElseThrow().getQuantity()).isEqualByComparingTo("7");

        var bad = new UsageDtos.Create(saved.getId(), new BigDecimal("20"), LocalDate.now(), "Too much");
        assertThrows(ResponseStatusException.class, () -> service.create(bad, "tester"));
    }
}
