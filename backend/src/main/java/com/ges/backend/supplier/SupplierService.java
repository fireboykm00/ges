package com.ges.backend.supplier;

import com.ges.backend.supplier.dto.SupplierDtos;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
public class SupplierService {
    private final SupplierRepository repo;
    public SupplierService(SupplierRepository repo) { this.repo = repo; }

    public Page<Supplier> list(int page, int size) {
        return repo.findAll(PageRequest.of(Math.max(page-1,0), size));
    }

    public Supplier get(UUID id) {
        return repo.findById(id).orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Supplier not found"));
    }

    public Supplier create(SupplierDtos.Create dto) {
        var s = new Supplier();
        s.setName(dto.name());
        s.setPhone(dto.phone());
        s.setEmail(dto.email());
        s.setAddress(dto.address());
        return repo.save(s);
    }

    public Supplier update(UUID id, SupplierDtos.Create dto) {
        var s = get(id);
        s.setName(dto.name());
        s.setPhone(dto.phone());
        s.setEmail(dto.email());
        s.setAddress(dto.address());
        return repo.save(s);
    }

    public void delete(UUID id) { repo.deleteById(id); }
}