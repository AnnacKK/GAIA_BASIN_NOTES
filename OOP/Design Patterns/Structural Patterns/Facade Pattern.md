
- **Category**: [[Structural Patterns]].
- **Intent**: Resolves complexity in large systems by providing a single, simplified interface for client classes to interact with a complex subsystem.

## The Core Concept

As systems or parts of systems grow over time, they naturally become more complex. While a large problem scope justifies a complex internal solution, client classes function much better when they have a simpler, cleaner way to interact with that solution.

A **Façade** is essentially a wrapper class that encapsulates an entire subsystem to hide its internal complexities. It functions strictly as a unified point of entry into that subsystem without introducing any additional functional behaviors of its own.

### Metaphor

Think of a façade like a **waiter** or a **salesperson**. They hide all the heavy backend coordination, logistics, and extra work required to fulfill your purchase of a good or service, letting you interact with a single person instead.

## When to Use It

You should implement the Façade pattern whenever:

1. There is an explicit need to simplify how client classes interact with a multi-layered or complex subsystem.
2. There is a need for a dedicated class to safely instantiate other internal classes within your system and provide those ready-to-use instances to another class.

## Step-by-Step Implementation Architecture

In practice, the Façade pattern typically combines interface implementation by one or more classes, which then get cleanly wrapped by the primary façade class.

Using a banking subsystem as an example (where clients need to manage accounts without manually tracking the individual classes for Chequing, Saving, or Investments), the pattern is broken down into four structural steps:

### Step 1: Design the Subsystem Interface

First, create the general interface that will be implemented by the different low-level subsystem classes. This interface will remain completely unknown to the client class (e.g., the `Customer` class).

```java
import java.math.BigDecimal;

public interface IAccount {
    public void deposit(BigDecimal amount);
    public void withdraw(BigDecimal amount);
    public void transfer(IAccount toAccount, BigDecimal amount);
    public int getAccountNumber();
}
```

### Step 2: Implement the Interface with Subsystem Classes

Implement this interface across the targeted subsystem classes that will eventually be wrapped by the façade.

(Note: While only one interface is hidden in this simple example, in production environments a façade class can wrap multiple distinct interfaces and classes across an entire subsystem. Because interfaces allow us to create subtypes, our concrete classes will all conform to the common account type.)

```java
public class Chequing implements IAccount {
    // Concrete implementation of IAccount rules...
}

public class Saving implements IAccount {
    // Concrete implementation of IAccount rules...
}

public class Investment implements IAccount {
    // Concrete implementation of IAccount rules...
}
```

### Step 3: Create the Façade Class

The `BankService` class functions directly as our **Façade**. Its public methods are designed to be extremely straightforward and provide zero indication of the underlying interfaces or complex implementing classes beneath it.

This steps leverages the **Information Hiding Principle** to completely block client classes from "seeing" internal account objects or how they execute behaviors. Notice that the access modifiers for the internal components are strictly marked as `private`:

```java
import java.util.Hashtable;
import java.math.BigDecimal;

public class BankService {
    private Hashtable<Integer, IAccount> bankAccounts;

    public BankService() {
        this.bankAccounts = new Hashtable<Integer, IAccount>();
    }

    public int createNewAccount(String type, BigDecimal initAmount) {
        IAccount newAccount = null;

        // The façade handles low-level concrete instantiations internally
        switch (type) {
            case "chequing":
                newAccount = new Chequing(initAmount);
                break;
            case "saving":
                newAccount = new Saving(initAmount);
                break;
            case "investment":
                newAccount = new Investment(initAmount);
                break;
            default:
                System.out.println("Invalid account type");
                break;
        }

        if (newAccount != null) {
            this.bankAccounts.put(newAccount.getAccountNumber(), newAccount);
            return newAccount.getAccountNumber();
        }
        return -1;
    }

    public void transferMoney(int to, int from, BigDecimal amount) {
        IAccount toAccount = this.bankAccounts.get(to);
        IAccount fromAccount = this.bankAccounts.get(from);
        fromAccount.transfer(toAccount, amount);
    }
}
```

### Step 4: Access the Subsystem via the Façade

With your façade class established, client classes can seamlessly execute backend actions entirely through the streamlined methods of the `BankService` class. The client remains completely uncoupled from the individual internal account subtypes.

```java
public class ClientApplication {
    public static void main(String[] args) {
        // The client only interacts with the wrapper façade
        BankService bankService = new BankService();
        
        int savingsId = bankService.createNewAccount("saving", new BigDecimal("500.00"));
        int chequingId = bankService.createNewAccount("chequing", new BigDecimal("100.00"));
        
        // Complex structural coordination happens entirely behind the scenes
        bankService.transferMoney(chequingId, savingsId, new BigDecimal("50.00"));
    }
}
```

## Architectural Summary

- **Encapsulation**: The façade wraps the subsystem components securely, limiting unnecessary client visibility.
- **Loose Coupling**: By channeling operations through a singular interface wrapper, changes inside the subsystem classes won't break the client's direct compilation path.
- **Zero Behavior Addition**: It functions as a clean router and coordinator; it does not add features to what the subsystem is already capable of executing on its own.

Tags: [[Design Patterns]] | [[Structural Patterns]]
