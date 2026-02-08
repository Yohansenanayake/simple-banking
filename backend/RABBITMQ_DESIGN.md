# 🐰 RabbitMQ Notification System Design

## 🎯 Objective
Implement an asynchronous notification system for the Simple Banking Application using RabbitMQ. The goal is to decouple the core transaction logic from the notification service, ensuring high performance and reliability.

## 💡 Use Case
When a user performs a financial transaction (Deposit, Withdraw, or Transfer), the system should automatically send a notification (simulated email/SMS) to the user.

**Why RabbitMQ?**
- **Decoupling**: The banking service doesn't need to wait for the email to be sent.
- **Reliability**: If the email service is down, messages are queued and processed later.
- **Scalability**: We can add multiple notification workers to handle high loads.

---

## 🏗️ Architecture

### 1. Producer (Transaction Service) 📤
- **Trigger**: A transaction is successfully saved to the database.
- **Action**: Creates a `TransactionEvent` object containing transaction details.
- **Output**: Publishes a message to RabbitMQ Exchange.

### 2. Message Broker (RabbitMQ) 📨
- **Exchange**: `banking_exchange` (Direct/Topic exchange)
- **Routing Key**: `transaction.created`
- **Queue**: `notification_queue`
- **Role**: Receives the message from the producer and routes it to the consumer queue.

### 3. Consumer (Notification Service) 📥
- **Trigger**: Listens to `notification_queue`.
- **Action**: 
  1. De-serializes the message back to `TransactionEvent`.
  2. Simulates sending an email (logs to console).
- **Output**: Console log: *"[RabbitMQ-Listener] Sending email to User 1: Deposit of $500.00 successful."*

---

## 🛠️ Implementation Plan

### Step 1: Configuration
- Add `spring-boot-starter-amqp` dependency. (✅ Done)
- Configure RabbitMQ connection in `application.properties`.
- Create `RabbitMQConfig` class to define Exchange, Queue, and Binding.

### Step 2: Event Model
- Create a `TransactionEvent` DTO class to transfer data.
  - Fields: `transactionId`, `userId`, `amount`, `type`, `timestamp`.

### Step 3: Producer Implementation
- Update `TransactionService` to inject `RabbitTemplate`.
- Publish an event after every successful transaction (Deposit/Withdraw/Transfer).

### Step 4: Consumer Implementation
- Create `NotificationService` with `@RabbitListener`.
- Implement logic to receive the event and log the notification.

---

## 🚀 Running RabbitMQ (Docker)
We use Docker to run the RabbitMQ server locally.

```bash
docker run -d --name simple-banking-rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management
```

- **App Connection Port**: `5672`
- **Management UI**: `http://localhost:15672` (User/Pass: `guest`/`guest`)
