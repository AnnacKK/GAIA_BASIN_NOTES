* **Category**:[[Behavioural Patterns]].
* **Intent**: Encapsulates a request or an action as a standalone object of its own, thereby allowing you to parameterize clients with different requests, queue or log requests, and support undoable operations.

## The Core Concept

In standard object-oriented development, when one object (the sender) requires another object (the receiver) to execute an action, it directly calls a specific method on that receiver. While this direct communication is straightforward, it introduces severe architectural coupling:

1. **Direct Sender-Receiver Coupling**: The sender must explicitly know the concrete identity of the receiver and the precise signature of its methods. If the receiver changes or if you want to swap it out for a different class, the sender's code must be modified.
2. **Inability to Manipulate Requests**: Because a basic method call is ephemeral, it executes immediately and vanishes from memory. You cannot easily store the request, schedule it for later execution, pass it as a parameter, or put it into a queue.
3. **UI and Business Logic Interleaving**: User interface components (such as buttons or menu items) frequently end up crammed with deep application logic. This prevents the same operational logic from being reused by other triggers, such as CLI commands, macros, or automated scripts.

![[Pasted image 20260707165122.png]]

The **Command Pattern** addresses this problem by turning the request itself into a first-class object. By placing a dedicated command object between the sender and the receiver, the sender no longer needs to know anything about the receiver or its methods.

## Architectural Mechanics: Deconstruction of the Command Lifecycle

The pattern structures operations by decoupling the request lifecycle into discrete participants:

1. **The Command Interface**: Specifies the core contract for execution. At minimum, it exposes an `execute()` method. For advanced setups, it includes `unexecute()` (for undo behavior) and `isReversible()`.
2. **The Concrete Command**: Binds a specific set of actions to a designated Receiver. It encapsulates the necessary state and parameters required to perform the action when triggered.
3. **The Receiver**: The destination object that actually contains the core business logic and knows exactly how to perform the work.
4. **The Invoker / Command Manager**: The component that holds the command object and triggers it by calling its execution routine. It can track command history stacks to provide global undo/redo functionality.

![[Pasted image 20260707165226.png]]

## Core Participant Roles

* **Command (Abstract Layer)**: Establishes the uniform method signatures required to execute and undo operations safely across the application.
* **Concrete Command (The Request Wrapper)**: Implements the command contract, storing a reference to a specific receiver and invoking its methods when `execute()` is called.
* **Receiver (The Worker)**: Performs the actual operations (e.g., a text document engine modifying a data matrix).
* **Invoker / Command Manager (The Trigger)**: Asks the command object to carry out the request without knowing what specific receiver or action is bound inside it.
![[Pasted image 20260707165323.png]]
In this diagram, there is a command superclass, and all commands are instances of subclasses of this command superclass. The superclass defines the common behaviors of your commands.
Each command will have the methods **execute() , unexecute() , and isReversible()** . 
* The execute() method will do the work the command is supposed to do. 
* The unexecute() method will do the work of undoing the command. 
* The isReversible() method will determine if the command is reversible, returning true if the command can be undone.
## Step-by-Step Code Implementation 

The following implementation models a text editor application supporting undoable operations, using a document text engine as the receiver.

### Step 1: Create the Abstract Command Blueprint

This class defines the structural contract for all operational requests, outlining execute, undo, and safety hooks.

```java
public abstract class Command {
    public abstract void execute();
    public abstract void unexecute();
    public abstract boolean isReversible();
}

```

### Step 2: Implement the Receiver Class

The receiver contains the actual underlying functionality and state manipulation logic.

```java
public class Document {
    private StringBuilder content = new StringBuilder();

    public void insertText(int position, String text) {
        content.insert(position, text);
        System.out.println("[DOCUMENT STATE] Content: " + content.toString());
    }

    public void deleteText(int position, int length) {
        content.delete(position, position + length);
        System.out.println("[DOCUMENT STATE] Content: " + content.toString());
    }
}

```

### Step 3: Implement the Concrete Command

The concrete command captures the parameters and receiver reference upon instantiation and delegates to the receiver on execution.

```java
public class PasteCommand extends Command {
    private Document document; // Receiver reference
    private int position;       // Execution context state
    private String text;        // Execution context state

    public PasteCommand(Document document, int position, String text) {
        this.document = document;
        this.position = position;
        this.text = text;
    }

    @Override
    public void execute() {
        // Delegates operation to receiver
        document.insertText(position, text);
    }

    @Override
    public void unexecute() {
        // Leverages receiver capabilities to undo the operation precisely
        document.deleteText(position, text.length());
    }

    @Override
    public boolean isReversible() {
        return true; // This text operation can be fully reversed
    }
}

```

### Step 4: Implement the Invoker / Command Manager

The manager tracks command execution histories to coordinate multi-level undo sequences smoothly.

```java
import java.util.Stack;

public class CommandManager {
    private static CommandManager instance = null;
    private Stack<Command> historyStack = new Stack<>();

    private CommandManager() {}

    public static CommandManager getInstance() {
        if (instance == null) {
            instance = new CommandManager();
        }
        return instance;
    }

    public void invokeCommand(Command command) {
        command.execute();
        if (command.isReversible()) {
            historyStack.push(command); // Record to historical trace
        }
    }

    public void undoLastCommand() {
        if (!historyStack.isEmpty()) {
            Command command = historyStack.pop();
            System.out.println("[UNDO ENGINE] Reversing last executed command...");
            command.unexecute();
        } else {
            System.out.println("[UNDO ENGINE] No commands left in history stack.");
        }
    }
}

```

---

## Execution and Workflow Verification

The client application ties everything together, creating commands with relevant context data and feeding them to the invoker.

```java
public class ClientApplication {
    public static void main(String[] args) {
        // 1. Initialize the receiver and invoker manager
        Document targetDocument = new Document();
        CommandManager manager = CommandManager.getInstance();

        System.out.println("--- Executing Text Editing Workflow ---");
        
        // 2. Create commands parameterizing execution target states
        Command pasteHello = new PasteCommand(targetDocument, 0, "Hello ");
        Command pasteWorld = new PasteCommand(targetDocument, 6, "World!");

        // 3. Request invoker execution
        manager.invokeCommand(pasteHello);
        manager.invokeCommand(pasteWorld);

        System.out.println("\n--- Triggering Undo Action Sequences ---");
        manager.undoLastCommand(); // Removes "World!"
        manager.undoLastCommand(); // Removes "Hello "
    }
}

```

---

## Architectural Evaluation and Design Principles Mapping

* **Decouples Request Senders from Receivers**: Senders pass command wrappers to the execution pipeline without needing to know which class executes the command or what methods are targeted behind the scenes.
* **Enables Advanced Request Life Cycle Manipulation**: Because commands are distinct standalone objects, they can be grouped into lists, re-ordered, scheduled on a time queue, or saved to disc logs for unexpected system recovery.
* **Pulls Logic Out of User Interfaces**: It isolates core business logic away from direct UI interaction elements (like clickable screen components), ensuring your application workflows remain modular, distinct, and highly reusable.

Tags: [[Design Patterns]] | [[Behavioural Patterns]]

- type: article
	title: "test" 
	url: "test.com"

- type: article
	title: "test4"
	url: "test4.com"
	author: "AnnacKK"