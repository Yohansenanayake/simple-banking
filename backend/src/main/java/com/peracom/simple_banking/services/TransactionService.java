package com.peracom.simple_banking.services;

import com.peracom.simple_banking.dtos.DepositRequest;
import com.peracom.simple_banking.dtos.TransferRequest;
import com.peracom.simple_banking.dtos.WithdrawRequest;
import com.peracom.simple_banking.model.Transaction;
import com.peracom.simple_banking.repository.TransactionRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TransactionService implements ITransactionService {

    private final TransactionRepository transactionRepository;

    public Transaction deposit(DepositRequest request) {
        throw new UnsupportedOperationException("Deposit not implemented yet.");
    }

    public Transaction withdraw(WithdrawRequest request) {
        throw new UnsupportedOperationException("Withdraw not implemented yet.");
    }

    public Transaction transfer(TransferRequest request) {
        throw new UnsupportedOperationException("Transfer not implemented yet.");
    }

    public List<Transaction> getTransactionsForAccount(Long accountId) {
        return transactionRepository.findByFromAccountIdOrToAccountId(accountId, accountId);
    }
}
