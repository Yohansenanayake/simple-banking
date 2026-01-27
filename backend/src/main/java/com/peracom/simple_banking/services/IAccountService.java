package com.peracom.simple_banking.services;

import com.peracom.simple_banking.model.Account;
import java.util.List;

/**
 * Service interface for account-related operations.
 */
public interface IAccountService {

    /**
     * Creates a new account for a user.
     * 
     * @param account the account to create
     * @return the created account with generated account number
     */
    Account createAccount(Account account);

    /**
     * Retrieves an account by its ID.
     * 
     * @param id the account ID
     * @return the account
     * @throws org.springframework.web.server.ResponseStatusException if account not
     *                                                                found
     */
    Account getAccount(Long id);

    /**
     * Retrieves all accounts belonging to a specific user.
     * 
     * @param userId the user ID
     * @return list of accounts for the user
     */
    List<Account> getAccountsByUser(Long userId);

    /**
     * Retrieves all accounts in the system.
     * 
     * @return list of all accounts
     */
    List<Account> getAllAccounts();
}
