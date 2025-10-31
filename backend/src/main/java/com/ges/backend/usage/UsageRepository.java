package com.ges.backend.usage;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface UsageRepository extends JpaRepository<Usage, UUID> {}