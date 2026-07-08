
- **Category**: [[Behavioural Patterns]].
- **Intent**: Defines a one-to-many dependency between objects so that when one object changes state, all its dependents are notified and updated automatically. It allows a subject to maintain a list of observers and easily distribute and handle notifications of changes across systems in a manageable and controlled way.

## The Core Concept

In interactive applications, multiple objects frequently need to stay synchronized with the state of a central data-providing component. For example, if you have a core business model (such as an active blog platform or a database feed), various user interface components, automated email dispatchers, and logging services need to immediately reflect updates whenever a new post is published or data changes.

Without a dedicated pattern, developers often resolve this by making the data provider hold direct references to every single reporting or display class. This causes severe architectural issues:

1. **Tight Structural Coupling**: The central component must explicitly know the specific type and API of every tracking class. If a new display type is added or an old one is removed, the core engine class must be modified and recompiled.
2. **Inefficient Polling Overhead**: Alternatively, if tracking classes repeatedly call the central data object to check for changes (polling), a significant amount of CPU cycles and network resources are wasted on redundant queries when no updates have occurred.
3. **Violation of Separation of Concerns**: Managing the communication details and presentation rules for every interested party clutters the core object, preventing it from focusing purely on its primary business logic.

The **Observer Pattern** resolves these vulnerabilities by establishing a subscription model. The central component (the Subject) remains completely decoupled from the receiving objects (the Observers). Instead of hardcoding direct links, observers dynamically subscribe to or unsubscribe from the subject, which simply broadcasts updates to everyone on its list whenever a change occurs.

## Architectural Mechanics: The Broadcast Notification Pipeline

The relationship between the publishing entity and its tracking entities follows a dynamic subscription lifecycle. Rather than managing objects individually, the subject handles them through a uniform interface abstractly:

1. **The Subscription Registry**: Observers register themselves with the subject using a standard entry method. The subject stores these references in a standard collection (such as an `ArrayList`).
2. **The Notification Broadcast**: When a internal state change happens within the subject, it loops through its collection of subscribers and invokes a uniform `update()` method on each one.
3. **Dynamic Decoupling**: Because the subject interacts with its subscribers exclusively through a generic `Observer` interface, it does not know or care about the concrete implementations of those subscribers.

## Core Participant Roles

- **Subject (Base Class)**: Maintains a private registry of active observers and provides public methods to attach (`registerObserver`) or detach (`unregisterObserver`) them dynamically. It contains the core broadcast logic (`notify`) to signal changes.
- **Concrete Subject (e.g., Blog)**: Extends the base Subject class to manage specific domain state and execution paths. It triggers the `notify()` broadcast whenever its state updates.
- **Observer (Interface)**: Defines the standard contract (typically a single `update()` method) that all tracking components must implement to receive broadcasts from a subject.
- **Concrete Observer (e.g., Subscriber)**: Implements the Observer interface, defining exactly how to respond when notified of a state change.

## Step-by-Step Code Implementation Walkthrough

The following implementation models a real-time subscription system where user accounts (`Subscriber`) track and react to content publications on a centralized publishing dashboard (`Blog`).

![[Pasted image 20260707170125.png]]

Class diagram:
![[Pasted image 20260707170152.png]]
### Step 1: Create the Subject Base Class

This management class hosts the primary subscriber list and provides secure controls for registering, unregistering, and broadcasting notifications.

```java
import java.util.ArrayList;

public class Subject {
    // The collection storing all dynamically registered tracking instances
    private ArrayList<Observer> observers = new ArrayList<Observer>();

    public void registerObserver(Observer observer) {
        observers.add(observer);
    }

    public void unregisterObserver(Observer observer) {
        observers.remove(observer);
    }

    // Loops through the registry to broadcast updates to all active subscribers
    public void notifyObservers() {
        for (Observer o : observers) {
            o.update();
        }
    }
}
```

### Step 2: Create the Observer Interface

This standard contract forces all interested parties to expose an identical interaction method, enabling the subject to communicate with them polmorphicly.

```java
public interface Observer {
    // Standard execution routine called by the subject during a state broadcast
    public void update();
}
```

### Step 3: Implement the Concrete Subject

The concrete subject inherits the registration and broadcast capabilities, allowing it to focus on managing core state and business logic.

```java
public class Blog extends Subject {
    private String latestPostTitle;
    private String latestPostContent;

    public void uploadPost(String title, String content) {
        this.latestPostTitle = title;
        this.latestPostContent = content;
        System.out.println("[BLOG ENGINE] New article published: " + title);
        
        // Broadcast the change to all registered subscribers immediately
        notifyObservers();
    }

    public String getLatestPostTitle() {
        return this.latestPostTitle;
    }

    public String getLatestPostContent() {
        return this.latestPostContent;
    }
}
```

### Step 4: Implement the Concrete Observer Class

Each concrete observer defines its own custom reaction to an update without affecting the subject or other subscribers.


```java
public class Subscriber implements Observer {
    private String subscriberName;
    private Blog targetedBlog; // Reference to the subject to query state if needed

    public Subscriber(String name, Blog blog) {
        this.subscriberName = name;
        this.targetedBlog = blog;
    }

    @Override
    public void update() {
        // Query the subject's updated state upon receiving the broadcast trigger
        String title = targetedBlog.getLatestPostTitle();
        System.out.println("[" + subscriberName + " NOTIFICATION] New feed entry detected!");
        System.out.println(" -> Synchronized Content Title: " + title);
    }
}
```

## Execution and Subscription Verification

The client application connects the entities by instantiating the components, linking observers to the subject's tracking list, and running operations.

```java
public class PlatformApplication {
    public static void main(String[] args) {
        // 1. Instantiate the Concrete Subject
        Blog techBlog = new Blog();

        // 2. Instantiate Concrete Observers, parameterizing their targeted subject
        Subscriber userAlice = new Subscriber("Alice", techBlog);
        Subscriber userBob = new Subscriber("Bob", techBlog);

        System.out.println("--- Scenario 1: Active Multi-User Subscription ---");
        // Register observers to receive updates
        techBlog.registerObserver(userAlice);
        techBlog.registerObserver(userBob);

        // Uploading a post automatically notifies both subscribers
        techBlog.uploadPost("Understanding Design Patterns", "An introductory guide...");
        System.out.println();

        System.out.println("--- Scenario 2: Dynamic Unregistration ---");
        // Unregister an observer dynamically at runtime
        techBlog.unregisterObserver(userBob);

        // A new post will now only notify the remaining subscriber
        techBlog.uploadPost("Deep Dive into Architecture", "Exploring system structures...");
    }
}
```

## Architectural Evaluation and Design Principles Mapping

- **Minimizes Class Coupling**: The subject does not need to know anything about the underlying implementation details of its observers. It only interacts with them through a simple interface, making it easy to change or substitute subscriber logic without altering the subject.
- **Supports Clean Open/Closed Extension (OCP)**: You can introduce entirely new types of observers (e.g., analytics trackers, email dispatchers, or archival systems) into the notification pipeline at any time. You just implement the `Observer` interface on the new class and register it—the existing subject code remains completely untouched.
- **Centralized Dependency Management**: Instead of requiring multiple disparate systems to independently monitor a central state object, the subject centralizes tracking by managing its own subscriber collection, ensuring notifications are sent reliably and predictably.

Tags: [[Design Patterns]] | [[Behavioural Patterns]]
