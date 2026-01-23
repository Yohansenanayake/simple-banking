package com.peracom.simple_banking.services;

import com.peracom.simple_banking.model.Account;
import com.peracom.simple_banking.model.AccountStatus;
import com.peracom.simple_banking.model.User;
import com.peracom.simple_banking.repository.AccountRepository;
import com.peracom.simple_banking.repository.UserRepository;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final AccountRepository accountRepository;
    private final UserRepository userRepository;

    public Account createAccount(Account account) {
        if (account == null || account.getUser() == null || account.getUser().getId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User id is required to create an account.");
        }

        User user =
                userRepository
                        .findById(account.getUser().getId())
                        .orElseThrow(
                                () ->
                                        new ResponseStatusException(
                                                HttpStatus.NOT_FOUND, "User not found."));

        account.setUser(user);
        account.setAccountNumber(generateAccountNumber());

        if (account.getBalance() == null) {
            account.setBalance(BigDecimal.ZERO);
        }
        if (account.getBalance().compareTo(BigDecimal.ZERO) < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Initial balance cannot be negative.");
        }

        if (account.getStatus() == null) {
            account.setStatus(AccountStatus.ACTIVE);
        }

        return accountRepository.save(account);
    }

    public Account getAccount(Long id) {
        return accountRepository
                .findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Account not found."));
    }

    public List<Account> getAccountsByUser(Long userId) {
        return accountRepository.findByUserId(userId);
    }

    private String generateAccountNumber() {
        String accountNumber;
        do {
            accountNumber = "ACCT-" + UUID.randomUUID().toString().replace("-", "").substring(0, 12);
        } while (accountRepository.existsByAccountNumber(accountNumber));
        return accountNumber;
    }
}
