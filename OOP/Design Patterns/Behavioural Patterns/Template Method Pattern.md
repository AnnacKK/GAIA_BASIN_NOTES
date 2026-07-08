
* **Category**:[[Behavioural Patterns]].
* **Intent**: Defines the step-by-step structural skeleton of an algorithm within a superclass method, while deferring the specific implementations of individual steps to its subclasses without altering the overall sequence of the algorithm.

---

## The Core Concept

In software engineering, you frequently encounter scenarios where multiple classes execute workflows that share an identical high-level order of operations. For example, whether an application is processing a local text file or an encrypted remote database stream, the master sequence remains the same: open connection, validate access rights, read data streams, parse contents, and close connection.

If you attempt to implement these workflows independently across separate subclasses, you introduce several structural flaws:

1. **Code Duplication**: The boilerplate sequence control logic is repeated across multiple distinct files, violating the **D.R.Y. (Don't Repeat Yourself)** principle.
2. **Brittle Workflow Enforcement**: If a developer creates a new subclass, there is no structural guarantee that they will execute the necessary lifecycle routines in the correct, safe sequence.
3. **High Maintenance Overhead**: If the master sequence ever needs to be modified (e.g., adding a logging step to the lifecycle), every single class containing that workflow must be manually tracked down and altered.

The **Template Method Pattern** solves this issue by using class inheritance to split an algorithm into two components: what is stable and invariant (the structural workflow sequence) and what is variant (the localized technical details). The invariant sequence is locked inside a final superclass method, while the variant steps are exposed as abstract hooks for subclasses to fill in.

---

## Architectural Mechanics: Hook Methods vs. Abstract Steps

The pattern controls execution by breaking a workflow down into three distinct types of methods inside the abstract superclass:

1. **The Template Method**: This is the master method that defines the absolute sequence of operations. It is traditionally marked with the `final` keyword in languages like Java to strictly prevent subclasses from overriding or altering the algorithmic layout.
2. **Abstract Primitive Operations**: These are specific steps within the algorithm that have no default implementation in the superclass. Subclasses *must* override these methods to provide the localized logic required for the algorithm to function.
3. **Hook Methods**: These are concrete methods inside the superclass that provide a default, often empty implementation. Subclasses *can optionally* override them to inject custom code at strategic points in the algorithm, but they are not forced to do so.

## Core Participant Roles

The pattern relies on two primary roles to maintain structural alignment:

* **Abstract Class (The Template Superclass)**: Defines the overarching template method alongside the primitive abstract methods and hook operations that map out the steps of the algorithm.
* **Concrete Class (The Implementer Subclass)**: Inherits from the abstract superclass and overrides the primitive abstract steps to implement subclass-specific behavior without manipulating or knowing the structural layout of the master template method.



## Step-by-Step Code Implementation Walkthrough

The following implementation demonstrates an automated data processing layout. Whether the system processes a raw CSV file or an XML file, the high-level operational sequence remains identical.
![[Pasted image 20260707163112.png]]

### Step 1: Create the Abstract Template Superclass

This class establishes the master algorithm execution path. Notice that the template method `processData()` is marked as `final` so that subclasses cannot alter the mandatory operational order.

```java
public abstract class DataProcessor {

    // The Template Method: Finalized to lock the order of execution
    public final void processData() {
        openConnection();
        readSourceData();
        
        // Optional Hook check point
        if (isValidationRequired()) {
            validateDataStructure();
        }
        
        parseDataContent();
        closeConnection();
    }

    // Invariant step: Common to all subclasses, implemented directly
    private void openConnection() {
        System.out.println("[WORKFLOW] Opening generic source stream connection...");
    }

    // Invariant step: Common to all subclasses, implemented directly
    private void closeConnection() {
        System.out.println("[WORKFLOW] Closing active stream connection safely.");
    }

    // Variant Primitive Step: Left entirely to subclasses to implement
    protected abstract void readSourceData();

    // Variant Primitive Step: Left entirely to subclasses to implement
    protected abstract void parseDataContent();

    // Hook Method: Default implementation that subclasses can optionally override
    protected boolean isValidationRequired() {
        return true; 
    }

    // Hook Method: Provides a default empty or basic action
    protected void validateDataStructure() {
        System.out.println("[VALIDATION] Performing baseline structural integrity validation...");
    }
}

```

### Step 2: Implement Concrete Subclasses

The subclasses inherit the workflow structure automatically. They focus exclusively on completing the missing primitive abstract methods unique to their respective file formats.

```java
public class CsvDataProcessor extends DataProcessor {

    @Override
    protected void readSourceData() {
        System.out.println("[CSV PROCESS] Streaming raw text strings from local .csv file path...");
    }

    @Override
    protected void parseDataContent() {
        System.out.println("[CSV PROCESS] Splitting rows using comma-separated value logic into memory matrices.");
    }

    // This subclass chooses to override a hook to alter default validation behavior
    @Override
    protected boolean isValidationRequired() {
        return false; // CSV format skips structural validation checks in this system
    }
}

```

```java
public class XmlDataProcessor extends DataProcessor {

    @Override
    protected void readSourceData() {
        System.out.println("[XML PROCESS] Loading file stream buffers into a specialized DOM parser engine...");
    }

    @Override
    protected void parseDataContent() {
        System.out.println("[XML PROCESS] Traversing nested element tree tags and attributes into typed objects.");
    }
    
    // This subclass inherits the default validation hook behavior automatically
}

```


## Execution and Workflow Verification

The client application initiates the operations by calling the public template method on the polymorphic instances. The superclass handles all routing, forcing the custom steps to execute in the exact order required.

```java
public class ApplicationLauncher {
    public static void main(String[] args) {
        System.out.println("--- Executing CSV Processing Workflow ---");
        DataProcessor csvProcessor = new CsvDataProcessor();
        // Triggers invariant open -> unique CSV read -> skipped hook -> unique CSV parse -> invariant close
        csvProcessor.processData();
        
        System.out.println("\n--- Executing XML Processing Workflow ---");
        DataProcessor xmlProcessor = new XmlDataProcessor();
        // Triggers invariant open -> unique XML read -> active hook validation -> unique XML parse -> invariant close
        xmlProcessor.processData();
    }
}

```


## Architectural Evaluation and Design Principles Mapping

* **Centralizes Control Structure**: By locking the primary step-by-step logic within a single superclass method, maintenance issues are minimized. If an overarching change is required, it is modified in exactly one place.
* **Inversion of Control ("The Hollywood Principle")**: Instead of subclasses actively calling parent routines, the control structure is inverted. The superclass acts as the coordinator, calling the subclass methods only when they are needed ("Don't call us, we'll call you").
* **Preserves Structural Integrity**: Subclasses remain open to extending specialized operational details but are completely closed from altering or breaking the core workflow rules governing how those steps must interact.

Tags: [[Design Patterns]] | [[Behavioural Patterns]]
