package com.peracom.simple_banking.controllers;

import com.peracom.simple_banking.dtos.DepositRequest;
import com.peracom.simple_banking.dtos.TransferRequest;
import com.peracom.simple_banking.dtos.WithdrawRequest;
import com.peracom.simple_banking.model.Transaction;
import com.peracom.simple_banking.services.ITransactionService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final ITransactionService transactionService;

    @PostMapping("/deposit")
    public ResponseEntity<Transaction> deposit(@RequestBody DepositRequest request) {
        return ResponseEntity.ok(transactionService.deposit(request));
    }

    @PostMapping("/withdraw")
    public ResponseEntity<Transaction> withdraw(@RequestBody WithdrawRequest request) {
        return ResponseEntity.ok(transactionService.withdraw(request));
    }

    @PostMapping("/transfer")
    public ResponseEntity<Transaction> transfer(@RequestBody TransferRequest request) {
        return ResponseEntity.ok(transactionService.transfer(request));
    }

    @GetMapping("/account/{accountId}")
    public ResponseEntity<List<Transaction>> getByAccount(@PathVariable Long accountId) {
        return ResponseEntity.ok(transactionService.getTransactionsForAccount(accountId));
    }
}
