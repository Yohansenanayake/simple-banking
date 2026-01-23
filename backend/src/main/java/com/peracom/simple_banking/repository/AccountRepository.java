package com.peracom.simple_banking.repository;

import com.peracom.simple_banking.model.Account;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccountRepository extends JpaRepository<Account, Long> {
    List<Account> findByUserId(Long userId);
    boolean existsByAccountNumber(String accountNumber);
}
