package com.peracom.simple_banking.services;

import com.peracom.simple_banking.dtos.DepositRequest;
import com.peracom.simple_banking.dtos.TransferRequest;
import com.peracom.simple_banking.dtos.WithdrawRequest;
import com.peracom.simple_banking.model.Transaction;
import java.util.List;

/**
 * Service interface for transaction-related operations.
 */
public interface ITransactionService {

    /**
     * Processes a deposit transaction.
     * 
     * @param request the deposit request containing account ID and amount
     * @return the created transaction
     */
    Transaction deposit(DepositRequest request);

    /**
     * Processes a withdrawal transaction.
     * 
     * @param request the withdrawal request containing account ID and amount
     * @return the created transaction
     */
    Transaction withdraw(WithdrawRequest request);

    /**
     * Processes a transfer transaction between two accounts.
     * 
     * @param request the transfer request containing source, destination accounts
     *                and amount
     * @return the created transaction
     */
    Transaction transfer(TransferRequest request);

    /**
     * Retrieves all transactions for a specific account.
     * 
     * @param accountId the account ID
     * @return list of transactions involving the account
     */
    List<Transaction> getTransactionsForAccount(Long accountId);
}
