package com.ges.backend.expense;

import com.ges.backend.expense.dto.ExpenseDtos;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
class ExpenseServiceTest {

    @Autowired ExpenseService service;

    @Test
    void createAndUpdateExpense() {
        var created = service.create(new ExpenseDtos.Create("Utilities", "Water bill", new BigDecimal("50.00"), LocalDate.now()));
        assertThat(created.getId()).isNotNull();
        assertThat(created.getCategory()).isEqualTo("Utilities");

        var updated = service.update(created.getId(), new ExpenseDtos.Create("Utilities", "Water + sewer", new BigDecimal("60.00"), created.getDate()));
        assertThat(updated.getAmount()).isEqualByComparingTo("60.00");
        assertThat(updated.getDescription()).contains("sewer");
    }
}
