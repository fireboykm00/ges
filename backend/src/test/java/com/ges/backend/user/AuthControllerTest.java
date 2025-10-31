package com.ges.backend.user;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthControllerTest {

    @Autowired MockMvc mvc;
    @Autowired ObjectMapper om;

    @Test
    void registerAndLoginReturnsToken() throws Exception {
        var registerJson = "{\n  \"name\": \"Test User\",\n  \"email\": \"user1@example.com\",\n  \"password\": \"pass1234\",\n  \"role\": \"STAFF\"\n}";
        mvc.perform(post("/api/auth/register").contentType(MediaType.APPLICATION_JSON).content(registerJson))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.email").value("user1@example.com"));

        var loginJson = "{\n  \"email\": \"user1@example.com\",\n  \"password\": \"pass1234\"\n}";
        var res = mvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON).content(loginJson))
                .andExpect(status().isOk())
                .andReturn();
        JsonNode node = om.readTree(res.getResponse().getContentAsString());
        assertThat(node.get("token").asText()).isNotBlank();
        assertThat(node.get("user").get("email").asText()).isEqualTo("user1@example.com");
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void adminCanListUsers() throws Exception {
        mvc.perform(get("/api/users")).andExpect(status().isOk());
    }
}
