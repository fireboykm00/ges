package com.ges.backend.supplier;

import com.ges.backend.supplier.dto.SupplierDtos;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
class SupplierServiceTest {

    @Autowired SupplierService service;

    @Test
    void createAndFetchSupplier() {
        var s = service.create(new SupplierDtos.Create("ABC Ltd", "0123456789", "abc@suppliers.com", "Main Street"));
        assertThat(s.getId()).isNotNull();

        var got = service.get(s.getId());
        assertThat(got.getName()).isEqualTo("ABC Ltd");
    }
}
