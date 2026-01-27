package com.peracom.simple_banking.services;

import com.peracom.simple_banking.dtos.LoginRequest;
import com.peracom.simple_banking.dtos.RegisterRequest;
import com.peracom.simple_banking.model.User;
import com.peracom.simple_banking.repository.UserRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class UserService implements IUserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User register(RegisterRequest request) {
        if (request == null
                || isBlank(request.getName())
                || isBlank(request.getEmail())
                || isBlank(request.getPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Name, email, and password are required.");
        }

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered.");
        }

        User user = new User();
        user.setName(request.getName().trim());
        user.setEmail(request.getEmail().trim().toLowerCase());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        return userRepository.save(user);
    }

    public User login(LoginRequest request) {
        if (request == null || isBlank(request.getEmail()) || isBlank(request.getPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email and password are required.");
        }

        User user = userRepository
                .findByEmail(request.getEmail().trim().toLowerCase())
                .orElseThrow(
                        () -> new ResponseStatusException(
                                HttpStatus.UNAUTHORIZED, "Invalid email or password."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password.");
        }

        return user;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found.");
        }
        userRepository.deleteById(id);
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
