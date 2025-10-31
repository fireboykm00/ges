package com.ges.backend.user;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@org.springframework.test.context.ActiveProfiles("test")
class UserRepositoryTest {

    @Autowired UserRepository repo;

    @Test
    void findByEmail_returnsUser() {
        var u = new User();
        u.setName("Jane");
        u.setEmail("jane@example.com");
        u.setPasswordHash("x");
        repo.save(u);

        var found = repo.findByEmail("jane@example.com").orElseThrow();
        assertThat(found.getName()).isEqualTo("Jane");
    }
}
