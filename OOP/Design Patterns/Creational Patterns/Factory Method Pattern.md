* **Category**: [[Creational Patterns]]. 
* **Intent**: Defines an interface or abstract template for creating objects, but leaves it up to the subclasses to decide which concrete class to instantiate[cite: 1].
## Factory Objects vs. Factory Method Pattern 
Factory Objects (Simple Factory Idiom) 
* A separate, dedicated object whose sole role is to instantiate concrete products[cite: 1].
* Isolates concrete instantiations (the `new` keyword) away from client methods[cite: 1]. 
* Client code can code to a generalization/interface instead of tracking evolving concrete subclasses[cite: 1].
### Factory Method Pattern 
* Does not use an external factory object[cite: 1]. 
* Instead, it places an abstract method (`factoryMethod()`) inside a Creator superclass[cite: 1]. 
* Subclasses inherit the workflow behavior but override the creation method to return their specialized products[cite: 1].
## 📐 UML Diagram

![[Pasted image 20260707154309.png]]
* **Creator**: Contains general operational workflows that operate exclusively on product generalizations[cite: 1].
* **Concrete Creator**: Handles the low-level object creation logic[cite: 1]. 
* ## Key Value By isolating object creation away from application behavior, client code becomes cleaner, highly extensible, and incredibly easy to maintain[cite: 1]. 

Tags: [[Design Patterns]] | [[Creational Patterns]]

- type: article
	title: "test3"
	url: "test3.com"
	author: "AnnacKK"