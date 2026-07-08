
- **Category**: [[Structural Patterns]].
- **Intent**: Dynamically attaches new responsibilities, features, or combined behaviors to an object at runtime by utilizing object aggregation as a highly flexible alternative to traditional class subclassing.

##  The Core Concept

In standard object-oriented design, when you want to modify or extend the capabilities of a baseline class, the default approach is to rely on standard class inheritance. However, class inheritance is static and bound strictly to compile time. This structural rigidity introduces two significant architectural flaws when dealing with features that can change or combine dynamically:

1. **Static Explosive Subclassing**: If a base component has several distinct optional enhancements, creating a separate dedicated subclass for every single mathematical combination results in a massive explosion of static class configurations. For example, if you have a base system that requires optional compression, optional encryption, and optional caching, you are forced to compile distinct classes like `CompressedEncryptedComponent`, `CompressedCachedComponent`, and `EncryptedCachedComponent`.
2. **Lack of Runtime Flexibility**: Once an object is instantiated via a compile-time subclass, its structural capabilities are locked in place. You cannot dynamically strip away an enhancement or stack a new behavior onto that specific object instance while the program is running.

![[Pasted image 20260707162158.png]]

The **Decorator Pattern** addresses this problem by abandoning deep, rigid inheritance hierarchies in favor of object composition and runtime aggregation. Instead of cramming all behavioral combinations into specialized subclasses, you wrap the core component inside independent decorator objects. Each decorator object implements the same interface as the component, allowing them to wrap around the instance and intercept calls to add their own custom behavior.

## The Aggregation Stack Topology

The relationship between decorators inside this pattern is strictly one-to-one, establishing a single linear chain or stack of object references rather than a branching tree structure. This design creates a transparent shell around the core implementation:


```
  [ Client Call ]
         │
         ▼
  ┌────────────────────────────────────────────────────────┐
  │ Concrete Decorator C (e.g., AuthenticatedWebPage)       │
  │  - Performs local check / adds behavior                │
  │  - Holds pointer to next layer down                    │
  └──────┬─────────────────────────────────────────────────┘
         │ (Delegates)
         ▼
  ┌────────────────────────────────────────────────────────┐
  │ Concrete Decorator B (e.g., AuthorizedWebPage)          │
  │  - Performs local check / adds behavior                │
  │  - Holds pointer to next layer down                    │
  └──────┬─────────────────────────────────────────────────┘
         │ (Delegates)
         ▼
  ┌────────────────────────────────────────────────────────┐
  │ Base Concrete Component (e.g., BasicWebPage)           │
  │  - Final structural building block                      │
  │  - Executes core terminal operation                     │
  └────────────────────────────────────────────────────────┘
```


### Recursive Traversal Mechanics

When a client invokes a target method on the outermost decorator, the execution flow operates recursively:

1. The outermost decorator intercepts the invocation message.
2. It can optionally execute a "pre-processing" step before forwarding the message.
3. It delegates the execution call down to the next wrapped object in its internal pointer reference.
4. This delegation cascades down through the sequential layers until it hits the final base concrete component at the bottom of the stack.
5. The base component executes its core logic, and the call chain begins to bubble back up through the decorators.
6. As the execution passes back up, each decorator can perform a "post-processing" step to modify or augment the result before passing it back to the client.

## Core Participant Roles

The pattern relies on four standard participants to maintain full transparency and polymorphism:

- **Component Interface**: Declares the uniform operational signatures and actions that client code expects to use. This interface serves as the common type that allows decorators and concrete components to be swapped interchangeably.
- **Concrete Component**: Defines the basic, underlying operational object that provides the fundamental behavior. It serves as the terminal core building block at the bottom of the decoration stack.
- **Abstract Decorator Class**: Implements the Component Interface while explicitly holding an internal, protected instance variable referencing a `Component` object. It passes all requests directly along to its wrapped component reference without modifying the data.
- **Concrete Decorator Subclasses**: Inherit from the abstract decorator class and override its methods to add specialized custom code and extended behaviors. They introduce new features either before or after delegating the call down the object chain.
![[Pasted image 20260707162325.png]]

## Step-by-Step Code Implementation Walkthrough

This concrete implementation outlines a web presentation system where a standard web page layout can be dynamically augmented with security layers like authentication and authorization checks at runtime.
![[Pasted image 20260707162455.png]]
### Step 1: Define the Component Interface

This interface establishes the baseline contract for all web pages within the layout architecture.

```java
public interface WebPage {
    public void display();
}
```

### Step 2: Create the Concrete Component

The base component represents a simple, unadorned web page layout with no extra security validation or structural extensions applied to it.

```java
public class BasicWebPage implements WebPage {
    private String htmlContent;
    private String styleSheet;

    public BasicWebPage() {
        this.htmlContent = "<html><body><h1>Standard Web Page Content</h1></body></html>";
        this.styleSheet = "default.css";
    }

    @Override
    public void display() {
        System.out.println("Rendering HTML Content using style: " + this.styleSheet);
        System.out.println("Content Output: " + this.htmlContent);
    }
}
```

### Step 3: Create the Abstract Decorator Class

This class acts as a transparent pipeline. It implements `WebPage` to ensure it matches the required component type, while maintaining a protected pointer to another wrapped `WebPage` instance.


```java
public abstract class WebPageDecorator implements WebPage {
    protected WebPage page; // Reference to the nested component layer

    public WebPageDecorator(WebPage pageToWrap) {
        this.page = pageToWrap;
    }

    @Override
    public void display() {
        // Transparent delegation down the stack
        this.page.display();
    }
}
```

### Step 4: Implement the Concrete Decorator Subclasses

These classes inherit the transparent delegation behavior from the abstract decorator and add localized code to handle specific security tasks.


```java
public class AuthorizedWebPage extends WebPageDecorator {

    public AuthorizedWebPage(WebPage pageToWrap) {
        super(pageToWrap);
    }

    private void checkUserAuthorization() {
        System.out.println("[SECURITY CHECK] Verifying user access permissions for this resource...");
    }

    @Override
    public void display() {
        // Pre-processing step added by this decorator layer
        this.checkUserAuthorization();
        
        // Cascade down to the next nested layer in the stack
        super.display();
    }
}
```


```java
public class AuthenticatedWebPage extends WebPageDecorator {

    public AuthenticatedWebPage(WebPage pageToWrap) {
        super(pageToWrap);
    }

    private boolean loginCredentialsValid() {
        System.out.println("[SECURITY CHECK] Validating user session token and login state...");
        return true; 
    }

    @Override
    public void display() {
        // Pre-processing step added by this decorator layer
        if (this.loginCredentialsValid()) {
            // Cascade down to the next nested layer in the stack
            super.display();
        } else {
            System.out.println("[ACCESS DENIED] User session is invalid. Redirecting to login portal.");
        }
    }
}
```

## Execution and Runtime Assembly

Because all participants conform to the shared `WebPage` interface type, you can dynamically stack these decorators onto a base instance at runtime based on environment constraints, configurations, or user permissions.

```java
public class WebServerApplication {
    public static void main(String[] args) {
        // 1. Create the terminal base concrete object building block
        WebPage standardPage = new BasicWebPage();
        
        System.out.println("--- Scenario A: Requesting Unprotected Resource ---");
        standardPage.display();
        System.out.println();

        System.out.println("--- Scenario B: Constructing Secured Resource Chain ---");
        // 2. Wrap the basic page inside the Authorization layer
        WebPage securedPage = new AuthorizedWebPage(standardPage);
        
        // 3. Wrap the Authorization chain inside the Authentication layer
        securedPage = new AuthenticatedWebPage(securedPage);
        
        // 4. Invoke the outer wrapper method
        // This triggers a cascade down through Authenticated -> Authorized -> BasicWebPage
        securedPage.display();
    }
}
```
![[Pasted image 20260707162542.png]]
Any decorator could be added to the basic web page to create a different combined behavior. The basic web page’s behavior can be dynamically built up in this way.

## Architectural Evaluation and Design Principles Mapping

- **Preserves the Open/Closed Principle (OCP)**: The system remains open to extension but closed to modification. If you need to introduce a new optional feature (such as `CompressedWebPage` or `CachedWebPage`), you do not have to touch or modify any existing class files. You simply create a new subclass of `WebPageDecorator` and plug it into your runtime stack.
- **Favors Composition Over Inheritance**: By prioritizing object aggregation and delegation over rigid subclass hierarchies, you eliminate tight structural coupling. Objects maintain an "arms-length" relationship where behaviors can be mixed and matched freely without worrying about compile-time limitations.
- **Granular Single Responsibility**: Instead of loading down a single class with multiple responsibilities, you break features out into distinct, highly cohesive decorator classes. One class focuses entirely on rendering content, another focuses entirely on authentication, and a third handles authorization.

Tags: [[Design Patterns]] | [[Structural Patterns]]

