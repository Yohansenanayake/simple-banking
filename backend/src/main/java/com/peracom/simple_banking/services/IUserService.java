package com.peracom.simple_banking.services;

import com.peracom.simple_banking.dtos.LoginRequest;
import com.peracom.simple_banking.dtos.RegisterRequest;
import com.peracom.simple_banking.model.User;
import java.util.List;

/**
 * Service interface for user-related operations.
 */
public interface IUserService {

    /**
     * Registers a new user in the system.
     * 
     * @param request the registration request containing user details
     * @return the registered user
     * @throws org.springframework.web.server.ResponseStatusException if validation
     *                                                                fails or email
     *                                                                already exists
     */
    User register(RegisterRequest request);

    /**
     * Authenticates a user with email and password.
     * 
     * @param request the login request containing credentials
     * @return the authenticated user
     * @throws org.springframework.web.server.ResponseStatusException if credentials
     *                                                                are invalid
     */
    User login(LoginRequest request);

    /**
     * Retrieves all users in the system.
     * 
     * @return list of all users
     */
    List<User> getAllUsers();

    /**
     * Deletes a user by ID.
     * 
     * @param id the user ID
     * @throws org.springframework.web.server.ResponseStatusException if user not
     *                                                                found
     */
    void deleteUser(Long id);
}
