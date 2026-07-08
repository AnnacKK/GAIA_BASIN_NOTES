

* **Category**: [[Creational Patterns]]. 
* **Intent**: Restricts a class to **one and only one** instance while ensuring it remains globally accessible throughout the program.

## Ideal Use Cases
Useful for global resources where multiple instances create conflicting outputs or data synchronization bugs [cite: 1]:
* Application preferences configurations[cite: 1].
* Printer queues[cite: 1].
* Software device drivers[cite: 1].

## ⚖️ Trade-offs and Considerations

- **Lazy Creation**: The object is not allocated memory until it is explicitly requested, maximizing system efficiency[cite: 1].
    
- **Concurrency Warning**: Multi-threaded applications can encounter race conditions if multiple computing threads attempt to access or instantiate the shared object simultaneously[cite: 1].
    

Back to: [[Design Patterns]]

---

## 🛠️ Implementation Architecture

To codify this constraint securely, the gatekeeping mechanism must be built directly into the class itself[cite: 1]:
1. **Private Constructor**: Prevents external classes from utilizing the `new` operator arbitrarily[cite: 1].
2. **Private Static Field**: Houses the single, unique instance reference[cite: 1].
3. **Public Static Method**: Acts as the global point of entry (`getInstance()`)[cite: 1].

### Lazy Construction Example (Java)
```java
public class ExampleSingleton {
    // Hidden class variable, initially null
    private static ExampleSingleton uniqueInstance = null;

    // Private constructor blocks external creation
    private ExampleSingleton() {}[cite: 1]

    // Global entrance method 
    public static ExampleSingleton getInstance() {
        if (uniqueInstance == null) {
            uniqueInstance = new ExampleSingleton(); // Created only when needed[cite: 1]
        }
        return uniqueInstance;
    }
}
```

Advantage of this version of a Singleton class is lazy creation . Lazy creation means that the object is not created until it is truly needed. This is helpful, especially if the object is large. As the object is not created until the “ getInstance ” method is called, the program is more efficient.

Tags: [[Design Patterns]] | [[Creational Patterns]]