package com.peracom.simple_banking.services;

import com.peracom.simple_banking.dtos.LoginRequest;
import com.peracom.simple_banking.dtos.RegisterRequest;
import com.peracom.simple_banking.model.User;
import com.peracom.simple_banking.repository.UserRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public User register(RegisterRequest request) {
        throw new UnsupportedOperationException("User registration not implemented yet.");
    }

    public User login(LoginRequest request) {
        throw new UnsupportedOperationException("User login not implemented yet.");
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public void deleteUser(Long id) {
        throw new UnsupportedOperationException("User deletion not implemented yet.");
    }
}
