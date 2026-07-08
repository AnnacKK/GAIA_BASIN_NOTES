
* **Category**: [[Structural Patterns]].
* **Intent**: Used to compose nested, hierarchical structures of objects (tree structures) and allow client applications to treat individual objects and compositions of objects completely uniformly.
---

## The Core Concept

The Composite pattern resolves situations where your code needs to handle components that can contain other components, which in turn contain more sub-components (like a folder containing files and other folders, or a building containing floors and rooms).
A composite design pattern is meant to achieve two goals: 
* To compose nested structures of objects 
* To deal with the classes for these objects uniformly 

![[Pasted image 20260707160147.png]]

**An abstract superclass can also be used in place of an interface, as both allow for polymorphism.**

Instead of writing complex conditional statements (`if-else` type-checking blocks) to determine if you are dealing with a single object or a group of objects, the Composite pattern unifies them under a single common interface. This enables **recursive composition**, meaning a composite object can hold other composite objects or base leaf nodes interchangeably.

### Metaphor

Think of the Composite pattern like a **Tree**.

* The **Root** and **Branches** are composites—they hold other branches or leaves.
* The **Leaves** are primitive nodes—they represent individual, terminal items that cannot hold anything else.
* Whether you look at a leaf or a branch, they are both considered parts of the *Tree structure*.
![[Pasted image 20260707160250.png]]


## When to Use It

You should implement the Composite pattern whenever:

1. You need to represent whole-part hierarchies of objects
2. You want client code to be able to ignore the difference between compositions of objects and individual objects, managing them all uniformly through a single code path.

## Step-by-Step Implementation Architecture

To implement the pattern, you establish a component interface that defines the baseline behaviors, then implement it across both composite tracking classes and leaf classes.

Using a housing structure as an example (where a complete building or a single floor can hold multiple nested structures, while a physical room acts as a terminal leaf), the pattern breaks down into three core steps:

### Step 1: Design the Component Interface

Create the base interface (or abstract class) that defines the overall type. This enforces polymorphism, guaranteeing that both single items and structural collections expose the exact same method signatures to the client.

```java
public interface IStructure {
    public void enter();
    public void exit();
    public void location();
    public String getName();
}

```

### Step 2: Implement the Composite Class

The composite class represents any structural object that can be composed of other child structures. It requires an internal collection field (e.g., an `ArrayList`) to manage its children, alongside administrative methods to dynamically add or retrieve sub-structures.

When a component method is called on a composite class, it typically iterates or "traverses through" its child collection to delegate operations.

```java
import java.util.ArrayList;

public class Housing implements IStructure {
    private ArrayList<IStructure> structures; // Collection holding other sub-components
    private String address;

    public Housing(String address) {
        this.structures = new ArrayList<IStructure>();
        this.address = address;
    }

    public String getName() {
        return this.address;
    }

    // Management method to dynamically expand the tree hierarchy
    public int addStructure(IStructure component) {
        this.structures.add(component);
        return this.structures.size() - 1;
    }

    public IStructure getStructure(int componentNumber) {
        return this.structures.get(componentNumber);
    }

    @Override
    public void location() {
        System.out.println("You are currently in " + this.getName() + ". It has:");
        for (IStructure struct : this.structures) {
            System.out.println(struct.getName()); // Traverses through children uniformly
        }
    }

    @Override
    public void enter() {
        System.out.println("You have entered the " + this.getName());
    }

    @Override
    public void exit() {
        System.out.println("You have left the " + this.getName());
    }
}

```

### Step 3: Implement the Leaf Class

The leaf class represents a non-composite type. It stands as a baseline element that contains zero child components and does not need any collections or management methods. It simply implements the direct operational logic defined by the component interface.

```java
public class Room implements IStructure {
    public String name;

    public Room(String name) {
        this.name = name;
    }

    @Override
    public void enter() {
        System.out.println("You have entered the " + this.getName());
    }

    @Override
    public void exit() {
        System.out.println("You have left the " + this.getName());
    }

    @Override
    public void location() {
        System.out.println("You are currently in the " + this.getName());
    }

    @Override
    public String getName() {
        return this.name;
    }
}

```

### Direct Usage: Executing operations uniformly

With your composite structure defined, you can build complex, multi-tiered structural hierarchies quickly. The client application interacts with any component node seamlessly without having to handle type-checking operations.

```java
public class Main {
    public static void main(String[] args) {
        // Create the top-level main composite root
        Housing building = new Housing("123 Street");
        
        // Create a nested sub-composite branch
        Housing floor1 = new Housing("123 Street - First Floor");
        int firstFloorId = building.addStructure(floor1); // Nested inside building
        
        // Create base terminal Leaf objects
        Room washroom1m = new Room("1F Men's Washroom");
        Room washroom1w = new Room("1F Women's Washroom");
        Room common1 = new Room("1F Common Area");
        
        // Populate the sub-composite branch with leaf nodes
        floor1.addStructure(washroom1m);
        floor1.addStructure(washroom1w);
        floor1.addStructure(common1);
        
        // Client interacts with the hierarchy uniformly through IStructure behaviors
        building.enter(); 
        
        Housing currentFloor = (Housing) building.getStructure(firstFloor);
        currentFloor.enter(); // Walk into the first floor Room currentRoom = (Room)
        Room currentRoom = (Room) currentFloor.getStructure(firstMens);
        currentRoom.enter(); // Walk into the men's room 
        currentFloor.getStructure(firstCommon); currentRoom.enter(); // Walk into the common area
        building.exit()
        
    }
}

```

## Architectural Summary

* **Decomposition & Generalization**: Breaks large structures down into isolated parts, while forcing both the whole and its parts to conform strictly to a common type.
* **Uniformity over Type-Checking**: Eliminates error-prone conditional type checks. The client treats a single `Room` object and a heavily nested `Housing` complex completely identically.
* **Extensibility**: Making new leaf types or structural layers requires only implementing the component interface, keeping existing client logic pristine.

Tags: [[Design Patterns]] | [[Structural Patterns]]
