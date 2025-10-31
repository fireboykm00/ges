package com.ges.backend.stock;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@org.springframework.test.context.ActiveProfiles("test")
class StockItemRepositoryTest {

    @Autowired StockItemRepository repo;

    @Test
    void findByNameContainingIgnoreCase_returnsMatches() {
        var a = new StockItem();
        a.setName("Sugar");
        a.setCategory(Category.INGREDIENTS);
        a.setQuantity(new BigDecimal("1"));
        a.setUnit("kg");
        a.setUnitPrice(new BigDecimal("2"));
        repo.save(a);

        var b = new StockItem();
        b.setName("Brown sugar");
        b.setCategory(Category.INGREDIENTS);
        b.setQuantity(new BigDecimal("1"));
        b.setUnit("kg");
        b.setUnitPrice(new BigDecimal("2"));
        repo.save(b);

        Page<StockItem> page = repo.findByNameContainingIgnoreCase("sugar", PageRequest.of(0, 10));
        assertThat(page.getTotalElements()).isEqualTo(2);
    }
}
