package com.peracom.simple_banking.services;

import com.peracom.simple_banking.model.Account;
import com.peracom.simple_banking.repository.AccountRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final AccountRepository accountRepository;

    public Account createAccount(Account account) {
        throw new UnsupportedOperationException("Account creation not implemented yet.");
    }

    public Account getAccount(Long id) {
        return accountRepository.findById(id).orElseThrow();
    }

    public List<Account> getAccountsByUser(Long userId) {
        return accountRepository.findByUserId(userId);
    }
}
