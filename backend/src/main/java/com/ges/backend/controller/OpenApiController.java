package com.ges.backend.controller;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class OpenApiController {

    @GetMapping(value = "/api/openapi.json", produces = MediaType.APPLICATION_JSON_VALUE)
    public String openapi() {
        // Forward to springdoc's generator endpoint
        return "forward:/v3/api-docs";
    }
}