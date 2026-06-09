package com.abhinav.relay.service;

import com.abhinav.relay.model.Tenant;
import com.abhinav.relay.model.TenantUser;
import com.abhinav.relay.model.User;
import com.abhinav.relay.repository.TenantUserRepository;
import com.abhinav.relay.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthenticationService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TenantUserRepository tenantUserRepository;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    public Map<String, Object> login(String email, String password) throws Exception {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (!passwordEncoder.matches(password, user.getPassword())) {
                throw new Exception("Incorrect password");
            }
            Long tenantId = 0L;
            String token = jwtService.generateToken(user.getEmail(), tenantId);
            Map<String, Object> map = new HashMap<>();
            map.put("auth_token", token);
            return map;
        } else {
            throw new Exception("Email not registered.");
        }
    }

    public Map<String, Object> register(String email, String password, String name) throws Exception {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isPresent()) {
            throw new Exception("Email already in use.");
        }

        User user = new User();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setName(name);
        user.setActive(true);
        user.setCreatedAt(Instant.now());
        userRepository.save(user);

        Map<String, Object> map = new HashMap<>();
        map.put("auth_token", jwtService.generateToken(user.getEmail(), 0L));
        return map;
    }

    public User getCurrentUser() throws Exception {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();
        Optional<User> user = userRepository.findByEmail(userEmail);
        if(user.isPresent()) {
            return user.get();
        } else {
            throw new Exception("Logged in user not found");
        }
    }

}
