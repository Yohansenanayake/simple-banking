package com.peracom.simple_banking.services;

import com.peracom.simple_banking.dtos.DepositRequest;
import com.peracom.simple_banking.dtos.TransferRequest;
import com.peracom.simple_banking.dtos.WithdrawRequest;
import com.peracom.simple_banking.model.Account;
import com.peracom.simple_banking.model.Transaction;
import com.peracom.simple_banking.model.TransactionType;
import com.peracom.simple_banking.repository.AccountRepository;
import com.peracom.simple_banking.repository.TransactionRepository;
import java.math.BigDecimal;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class TransactionService implements ITransactionService {

    private final TransactionRepository transactionRepository;
    private final AccountRepository accountRepository;

    @Transactional
    public Transaction deposit(DepositRequest request) {
        // Validate request
        if (request == null || request.getAccountId() == null || request.getAmount() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Account ID and amount are required.");
        }

        if (request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Deposit amount must be positive.");
        }

        // Get account
        Account account = accountRepository
                .findById(request.getAccountId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Account not found."));

        // Update account balance
        account.setBalance(account.getBalance().add(request.getAmount()));
        accountRepository.save(account);

        // Create transaction record
        Transaction transaction = new Transaction();
        transaction.setType(TransactionType.DEPOSIT);
        transaction.setAmount(request.getAmount());
        transaction.setToAccount(account);
        transaction.setDescription(request.getDescription() != null ? request.getDescription() : "Deposit");

        return transactionRepository.save(transaction);
    }

    @Transactional
    public Transaction withdraw(WithdrawRequest request) {
        // Validate request
        if (request == null || request.getAccountId() == null || request.getAmount() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Account ID and amount are required.");
        }

        if (request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Withdrawal amount must be positive.");
        }

        // Get account
        Account account = accountRepository
                .findById(request.getAccountId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Account not found."));

        // Check sufficient balance
        if (account.getBalance().compareTo(request.getAmount()) < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Insufficient balance.");
        }

        // Update account balance
        account.setBalance(account.getBalance().subtract(request.getAmount()));
        accountRepository.save(account);

        // Create transaction record
        Transaction transaction = new Transaction();
        transaction.setType(TransactionType.WITHDRAW);
        transaction.setAmount(request.getAmount());
        transaction.setFromAccount(account);
        transaction.setDescription(request.getDescription() != null ? request.getDescription() : "Withdrawal");

        return transactionRepository.save(transaction);
    }

    @Transactional
    public Transaction transfer(TransferRequest request) {
        // Validate request
        if (request == null || request.getFromAccountId() == null || request.getToAccountId() == null
                || request.getAmount() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "From account, to account, and amount are required.");
        }

        if (request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Transfer amount must be positive.");
        }

        if (request.getFromAccountId().equals(request.getToAccountId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot transfer to the same account.");
        }

        // Get accounts
        Account fromAccount = accountRepository
                .findById(request.getFromAccountId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Source account not found."));

        Account toAccount = accountRepository
                .findById(request.getToAccountId())
                .orElseThrow(
                        () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Destination account not found."));

        // Check sufficient balance
        if (fromAccount.getBalance().compareTo(request.getAmount()) < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Insufficient balance in source account.");
        }

        // Update account balances
        fromAccount.setBalance(fromAccount.getBalance().subtract(request.getAmount()));
        toAccount.setBalance(toAccount.getBalance().add(request.getAmount()));

        accountRepository.save(fromAccount);
        accountRepository.save(toAccount);

        // Create transaction record
        Transaction transaction = new Transaction();
        transaction.setType(TransactionType.TRANSFER);
        transaction.setAmount(request.getAmount());
        transaction.setFromAccount(fromAccount);
        transaction.setToAccount(toAccount);
        transaction.setDescription(request.getDescription() != null ? request.getDescription() : "Transfer");

        return transactionRepository.save(transaction);
    }

    public List<Transaction> getTransactionsForAccount(Long accountId) {
        return transactionRepository.findByFromAccountIdOrToAccountId(accountId, accountId);
    }
}
