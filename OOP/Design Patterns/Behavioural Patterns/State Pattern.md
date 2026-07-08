
* **Category**: [[Behavioural Patterns]].
* **Intent**: Allows an object to alter its behavior when its internal state changes, making the object appear to change its class dynamically at runtime.



---

## The Core Concept

In object-oriented applications, many objects are naturally state-dependent—meaning their behavior changes based on their current operational circumstances. For example, a vending machine behaves differently if it is completely empty compared to when it holds items and contains a user's deposited money.
When implementing state-dependent workflows without a dedicated pattern, developers usually rely on massive conditional structures (`if-else` or `switch` statements) inside every state-dependent method. This approach introduces several architectural flaws:

1. **Monolithic Complexity**: A single class must manage the rules, data, and edge-case behaviors for *every possible state* simultaneously, violating the **Single Responsibility Principle**.
2. **Brittle Maintainability**: Adding a new state or modifying a transition rule requires manually tracking down and modifying every complex conditional block scattered across the class methods.
3. **State Corruption**: Because state management logic is interleaved with core business routines, it becomes highly susceptible to bugs where an object gets stuck in an undefined or invalid state.


The **State Pattern** addresses this problem by encapsulating each distinct state into its own separate, specialized class. Instead of maintaining hardcoded conditional blocks, the main context object maintains a polymorphic reference to a "State" object and delegates all state-dependent requests directly to it.

---

## Architectural Mechanics: State-Driven Behavior Delegation

The pattern replaces scattered conditionals with a clean polymorphic setup:

1. **The Context Class**: This is the primary interface exposed to client subsystems. It maintains a reference pointer to an instance of a concrete state class representing its current phase.
2. **The State Interface**: Establishes a uniform set of methods corresponding to all actions that can be performed on the context.
3. **The Concrete State Classes**: Each class encapsulates the precise business logic and behavioral rules for a single specific state, along with the logic for transitioning the context to its next appropriate state.
![[Pasted image 20260707164421.png]]


## Core Participant Roles

The pattern relies on three primary components to coordinate runtime changes smoothly:

* **Context (The Master Entity)**: Defines the external interface for clients and hosts the internal reference to the current `State` instance. It provides helper routines that allow state objects to change its active state pointer during execution.
* **State (The Behavioral Blueprint)**: An interface or abstract class that outlines all actions available across the object's various life cycle stages.
* **Concrete States (State Encapsulations)**: Individual classes that implement the `State` interface. Each class represents a single state and dictates how the context responds to actions while in that state.



---

## Step-by-Step Code Implementation Walkthrough

The following implementation models a simplified **Vending Machine** workflow. The machine moves through three primary states: `IdleState` (waiting for a dollar), `HasDollarState` (waiting for a selection or refund), and `SoldState` (dispensing a product).
![[Pasted image 20260707164514.png]]

Classes:
![[Pasted image 20260707164641.png]]
### Step 1: Create the State Interface

This common contract outlines every physical interaction available on the machine.

```java
public interface VendingMachineState {
    void insertDollar(VendingMachineContext machine);
    void ejectDollar(VendingMachineContext machine);
    void selectProduct(VendingMachineContext machine);
    void dispense(VendingMachineContext machine);
}

```

### Step 2: Create the Context Class

The context maintains the current active state reference and exposes the controls needed to perform transitions.

```java
public class VendingMachineContext {
    private VendingMachineState currentState;
    private int productCount;

    public VendingMachineContext(int initialProducts) {
        this.productCount = initialProducts;
        [cite_start]// The machine starts out in the idle state [cite: 268]
        this.currentState = new IdleState();
    }

    public void setState(VendingMachineState newState) {
        this.currentState = newState;
    }

    public int getProductCount() {
        return this.productCount;
    }

    public void decreaseProductCount() {
        if (this.productCount > 0) {
            this.productCount--;
        }
    }

    [cite_start]// Client-facing methods delegate directly to the current state [cite: 261]
    public void insertDollar() {
        currentState.insertDollar(this);
    }

    public void ejectDollar() {
        currentState.ejectDollar(this);
    }

    public void selectProduct() {
        currentState.selectProduct(this);
        // Automatically trigger dispensing if selection succeeds
        currentState.dispense(this);
    }
}

```

### Step 3: Implement Concrete State Classes

Each state class isolates the unique rules for its particular phase, shielding other classes from its logic.

```java
[cite_start]// State when the machine has no money inserted [cite: 268]
public class IdleState implements VendingMachineState {
    @Override
    public void insertDollar(VendingMachineContext machine) {
        System.out.println("[IDLE] Dollar accepted. Transitioning to Has-Dollar phase...");
        machine.setState(new HasDollarState()); [cite_start]// Transition state [cite: 269]
    }

    @Override
    public void ejectDollar(VendingMachineContext machine) {
        System.out.println("[IDLE ERROR] No money to return. Insert a dollar first.");
    }

    @Override
    public void selectProduct(VendingMachineContext machine) {
        System.out.println("[IDLE ERROR] Cannot select a product. Deposit money first.");
    }

    @Override
    public void dispense(VendingMachineContext machine) {
        System.out.println("[IDLE ERROR] Operation denied. No payment processed.");
    }
}

[cite_start]// State when money has been deposited [cite: 269]
public class HasDollarState implements VendingMachineState {
    @Override
    public void insertDollar(VendingMachineContext machine) {
        System.out.println("[HAS-DOLLAR] Dollar already present. Returning extra coin.");
    }

    @Override
    public void ejectDollar(VendingMachineContext machine) {
        System.out.println("[HAS-DOLLAR] Refunding your dollar. Returning to Idle phase...");
        machine.setState(new IdleState()); [cite_start]// Transition state [cite: 266, 269]
    }

    @Override
    public void selectProduct(VendingMachineContext machine) {
        if (machine.getProductCount() > 0) {
            System.out.println("[HAS-DOLLAR] Product selected successfully.");
            machine.setState(new SoldState());
        } else {
            System.out.println("[HAS-DOLLAR] Out of stock! Refunding dollar...");
            machine.setState(new IdleState());
        }
    }

    @Override
    public void dispense(VendingMachineContext machine) {
        System.out.println("[HAS-DOLLAR ERROR] Must select a product before dispensing.");
    }
}

[cite_start]// State when a product is being dispensed [cite: 265]
public class SoldState implements VendingMachineState {
    @Override
    public void insertDollar(VendingMachineContext machine) {
        System.out.println("[SOLD ERROR] Please wait, processing previous transaction.");
    }

    @Override
    public void ejectDollar(VendingMachineContext machine) {
        System.out.println("[SOLD ERROR] Cannot eject. Product is already being dispensed.");
    }

    @Override
    public void selectProduct(VendingMachineContext machine) {
        System.out.println("[SOLD ERROR] Already dispensing a selected product.");
    }

    @Override
    public void dispense(VendingMachineContext machine) {
        machine.decreaseProductCount();
        [cite_start]System.out.println("[SOLD] Dispensing product... Collect your item below! [cite: 265]");
        
        if (machine.getProductCount() > 0) {
            machine.setState(new IdleState());
        } else {
            System.out.println("[SOLD] System is now completely empty of inventory.");
            // In a full application, an out-of-stock state could be set here
            machine.setState(new IdleState());
        }
    }
}

```


## Execution and State Transition Verification

The client interacts solely with the top-level context class. As actions are taken, the context alters its internal state reference automatically behind the scenes.

```java
public class VendingMachineApplication {
    public static void main(String[] args) {
        // Instantiate the context with a stock of 2 products
        VendingMachineContext machine = new VendingMachineContext(2);

        System.out.println("--- Scenario 1: Successful Purchase ---");
        machine.insertDollar();   // Triggers IdleState -> moves to HasDollarState
        machine.selectProduct();  // Triggers HasDollarState -> moves to SoldState -> dispenses -> IdleState
        System.out.println();

        System.out.println("--- Scenario 2: Canceled Transaction ---");
        machine.insertDollar();   // Triggers IdleState -> moves to HasDollarState
        machine.ejectDollar();    // Triggers HasDollarState -> cancels and returns to IdleState
        System.out.println();

        System.out.println("--- Scenario 3: Attempting Illegal Actions ---");
        machine.selectProduct();  // Fails cleanly because machine is currently in IdleState
    }
}

```


## Architectural Evaluation and Design Principles Mapping

* **Eliminates Scattered Conditional Logic**: It eliminates long, error-prone `if-else` or `switch` structures by mapping state behaviors directly to dedicated, cohesive classes.
* **Enforces the Open/Closed Principle (OCP)**: Adding a completely new state to the application lifecycle requires writing a new class that implements the state interface. The existing context code and other state classes remain unchanged.
* **Encapsulates State Transitions**: Transition rules are explicitly managed inside the individual states or context methods rather than being exposed globally, ensuring state boundaries are strictly maintained.

Tags: [[Design Patterns]] | [[Behavioural Patterns]]