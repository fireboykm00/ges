package com.ges.backend.user;

import com.ges.backend.user.dto.UserDtos;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
public class UserService implements UserDetailsService {
    private final UserRepository repo;
    private final PasswordEncoder encoder;

    public UserService(UserRepository repo, PasswordEncoder encoder) {
        this.repo = repo;
        this.encoder = encoder;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = repo.findByEmail(username).orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return new UserPrincipal(user);
    }

    @Transactional
    public User register(String name, String email, String password, Role role) {
        User u = new User();
        u.setName(name);
        u.setEmail(email);
        u.setPasswordHash(encoder.encode(password));
        if (role != null) u.setRole(role);
        return repo.save(u);
    }

    public List<User> list() { return repo.findAll(); }
    
    public Page<User> list(int page, int size) {
        return repo.findAll(PageRequest.of(Math.max(page - 1, 0), size));
    }
    
    public User get(UUID id) { return repo.findById(id).orElseThrow(); }
    
    public User getById(UUID id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "User not found"));
    }
    
    public User save(User u) { return repo.save(u); }
    
    @Transactional
    public User update(UUID id, UserDtos.Update dto) {
        User u = getById(id);
        u.setName(dto.name());
        u.setEmail(dto.email());
        u.setRole(dto.role());
        if (dto.active() != null) {
            u.setActive(dto.active());
        }
        return repo.save(u);
    }
    
    @Transactional
    public void delete(UUID id) {
        if (!repo.existsById(id)) {
            throw new ResponseStatusException(NOT_FOUND, "User not found");
        }
        repo.deleteById(id);
    }
}
