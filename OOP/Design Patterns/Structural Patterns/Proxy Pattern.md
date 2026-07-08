
- **Category**: [[Structural Patterns]].
- **Intent**: Allows a proxy class to represent a real "subject" class by acting as a simplified or lightweight version of the original object. It can perform the same tasks but will often delegate substantive requests to the original object.
## The Core Concept

A **Proxy** is an object that stands in for another object to control access to it, reduce resource usage, or manage remote locations. The proxy class wraps the real subject class and offers the exact same methods. Having both classes implement a common subject interface allows for polymorphism, meaning a client class can interact with the proxy just as it would with the real subject.

The proxy doesn't handle heavy execution itself; it takes care of lighter responsibilities (such as role-based access validation or stock-checking) and forwards the substantive execution to the real subject object.

### Primary Varieties & Use Cases

1. **Virtual Proxy**: This is when a proxy class is used in place of a real subject class that is resource-intensive to instantiate. This is commonly used on images in web pages or graphic editors, as a high-definition image may be extremely large to load.
2. **Protection Proxy**: This is when a proxy class is used to control access to the real subject class.  For example, a system that is used by both students and instructors might limit access based on roles.
3. **Remote Proxy**: This is when a proxy class is local, and the real subject class exists remotely. Google docs make use of this, where web browsers have all the objects it needs locally, which also exist on a Google server somewhere else.
## UML
![[Pasted image 20260707161414.png]]

## Step-by-Step Implementation Architecture

This implementation highlights an online retail store with global distribution and warehousing. The proxy layer acts as an `OrderFulfillment` class that intercepts orders, validating stock presence before passing delivery duties to a concrete `Warehouse`.
![[Pasted image 20260707161443.png]]

### Step 1: Design the Subject Interface

Create the base interface that defines the operations that client software will expect from both the proxy and the real subject

```java
public interface IOrder {
    public void fulfillOrder(Order order);
}
```

### Step 2: Implement the Real Subject Class

Implement the underlying heavy component class. In this context, the `Warehouse` class knows how to process an order for shipment and report inventory levels. It expects validation to occur before it receives an order.


```java
import java.util.Hashtable;

public class Warehouse implements IOrder {
    private Hashtable<String, Integer> stock;
    private String address;

    /* Constructors and other attributes would go here */
    // ...

    @Override
    public void fulfillOrder(Order order) {
        for (Item item : order.itemList) {
            this.stock.replace(item.sku, stock.get(item.sku) - 1);
        }
        /* Process the order for shipment and delivery */
        // ...
    }

    public int currentInventory(Item item) {
        if (stock.containsKey(item.sku)) {
            return stock.get(item.sku).intValue();
        }
        return 0;
    }
}
```

### Step 3: Implement the Proxy Class

Implement the proxy wrapper class (`OrderFulfillment`), which manages an internal collection of real subject instances (`Warehouse`). The proxy isolates the order validation process away from fulfillment processing to optimize performance and prevent warehouse re-routing overhead.


```java
import java.util.List;

public class OrderFulfillment implements IOrder {
    private List<Warehouse> warehouses;

    /* Constructors and other attributes would go here */

    @Override
    public void fulfillOrder(Order order) {
        /* For each item in a customer order, check each warehouse to see if it is in stock.
           If it is then create a new Order for that warehouse. Else check the next warehouse.
           Send all the Orders to the warehouse(s) after you finish iterating over all the items in the original Order.
        */
        for (Item item : order.itemList) {
            for (Warehouse warehouse : warehouses) {
                // ...
            }
        }
        return;
    }
}
```

## Architectural Summary

- **Access Control & Protection**: The proxy guards the real subject from unnecessary or bad requests by acting as a gateway.
- **Polymorphic Indirection**: Because the proxy and real subject implement the same `IOrder` interface, clients remain decoupled from structural details.
- **Performance Gains**: Separates high-level validation routines from resource-intensive tracking computations, keeping backend nodes specialized and highly stable.

Tags: [[Design Patterns]] | [[Structural Patterns]]
