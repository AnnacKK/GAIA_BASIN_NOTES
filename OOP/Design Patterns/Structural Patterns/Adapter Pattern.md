
- **Category**: [[Structural Patterns]].
- **Intent**: Facilitates seamless communication between two existing systems that have incompatible software interfaces by acting as a compatible translation layer.
## The Core Concept

Physically, an adapter is a device used to connect pieces of equipment that cannot be plugged into each other directly. In software engineering, you face the exact same problem: you frequently need to integrate a third-party library, an external system, or a legacy component whose output format or interface does not conform to what your application expects.

Instead of modifying the source code of your application or rewriting the external system (which may be impossible or highly impractical), you insert an **Adapter class**. The adapter acts as a wrapper class that sits between your code and the incompatible component. It catches your application's standardized requests, translates them into a format the external service understands, and passes them along safely.

## The Four Architectural Components

An Adapter pattern architecture relies on four fundamental parts to achieve loose coupling:

1. **Client Class**: The internal subsystem or component of your application that needs to utilize a third-party library or external functionality.
2. **Adaptee Class**: The incompatible third-party library, legacy system, or external web service that contains the features you want to use.
3. **Target Interface**: The clean, standardized interface specification that the Client class expects to see and interact with.
4. **Adapter Class**: The middleman wrapper that implements the Target Interface while holding an internal reference to the incompatible Adaptee class. It encapsulates the translation logic.
## 📐 UML Diagram
![[Pasted image 20260707155454.png]]

## Step-by-Step Implementation Architecture

The structural implementation of an Adapter design pattern is broken down into three logical steps:

### Step 1: Design the Target Interface

First, create the explicit interface that your client application expects to use. The client will remain completely oblivious to the fact that an adapter is working underneath it.

For example, imagine a client system that wants to send generic request objects across the web. It expects a clean `WebRequester` interface:

```java
public interface WebRequester {
    public int request(Object requestData);
}
```

### Step 2: Implement the Target Interface with the Adapter Class

The adapter class implements the target interface, giving it polymorphism. Inside its overridden methods, it converts the client's parameters into a payload compatible with the third-party tool. It then invokes the adaptee's native methods and passes the translated data forward.

In this example, our third-party web service (`WebService`, which is our **Adaptee**) strictly requires data to arrive formatted as a custom `Json` object. The adapter handles this conversion seamlessly behind the scenes:

```java
public class WebAdapter implements WebRequester {
    private WebService service; // Reference to the incompatible Adaptee

    public void connect(WebService currentService) {
        this.service = currentService;
    }

    @Override
    public int request(Object requestData) {
        // Step A: Translate the generic client Object into a JSON object
        Json jsonResult = this.toJson(requestData); [cite: 90]
        
        // Step B: Route the translated request directly to the Adaptee service
        Json response = service.request(jsonResult); [cite: 91]
        
        // Step C: Evaluate response and return standard integer code back to client
        if (response != null) {
            return 200; // Success code expected by client
        }
        return 500; // Failure code
    }

    private Json toJson(Object input) {
        // High-level conversion details mapping Object fields into JSON formatting
        return new Json(input);
    }
}
```

### Step 3: Send Requests from the Client to the Adapter

With the architecture set up, the client class can execute operations polymorphically through the `WebRequester` target interface. The client code does not need to know anything about `WebService` or how data is being parsed.

```java
public class ClientApplication {
    public static void main(String[] args) {
        // 1. Instantiate the incompatible external service (Adaptee)
        WebService externalService = new WebService();
        
        // 2. Instantiate our wrapper (Adapter) and hook up the service
        WebAdapter adapter = new WebAdapter();
        adapter.connect(externalService);
        
        // 3. The Client handles everything through the clean Target Interface
        WebRequester requester = adapter;
        
        Object myData = new CustomerRecord("Jane Doe", "ID-9921");
        
        // The request is effortlessly translated and dispatched under the hood
        int statusCode = requester.request(myData);
        System.out.println("Server responded with code: " + statusCode);
    }
}
```

## Architectural Benefits

- **Encapsulation of Complexity**: All ugly mapping, formatting, and translation code is isolated inside the Adapter class instead of polluting your core business workflows.
- **Preserves Open/Closed Principle**: You can introduce new external vendors or third-party libraries into your system anytime. You only need to create a new Adapter class implementing the `Target Interface` without editing or risking breakage in your existing Client application code.
- **Polymorphic Indirection**: Because the client code is strictly programmed to expect an interface reference, you can seamlessly switch adapters at runtime depending on environment configurations or deployment requirements.

Tags: [[Design Patterns]] | [[Structural Patterns]]