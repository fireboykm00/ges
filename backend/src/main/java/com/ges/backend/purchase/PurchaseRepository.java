package com.ges.backend.purchase;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface PurchaseRepository extends JpaRepository<Purchase, UUID> {
    @Override
    @EntityGraph(attributePaths = {"items"})
    java.util.Optional<Purchase> findById(UUID id);
}