# Simple TypeScript Design Guidance

Use this reference for ordinary application and library work where readability, stable APIs, and maintainable TypeScript matter more than type-level cleverness.

## Default Practices

- Prefer explicit, small interfaces for public boundaries and concrete classes for runtime behavior with lifecycle, dependency injection, or decorators.
- Use `type` for unions, mapped shapes, conditional aliases, and composition. Use `interface` for object contracts intended to be implemented or extended.
- Keep primitive aliases meaningful. A `UserId` alias can clarify intent, but it does not add runtime safety unless paired with validation or branding.
- Model data with plain objects when behavior is absent. Add classes when construction, methods, inheritance hooks, decorators, or framework reflection are required.
- Keep DTOs, entities, requests, and responses separate when they have different validation, persistence, or transport concerns.
- Avoid `any` at public boundaries. Use `unknown` for untrusted data, then narrow or validate it.
- Prefer narrow generic constraints such as `T extends Entity` over unconstrained `T` when the implementation depends on object semantics.

## Classes, Interfaces, and OOP

- Use abstract classes for shared runtime behavior, protected hooks, and constructor-injected dependencies.
- Use interfaces for contracts that should not carry runtime behavior.
- Prefer composition over inheritance when variants differ by collaborator rather than lifecycle.
- Keep protected hooks purposeful: `afterInit`, `transform`, `validate`, and `map` are good when subclasses are expected to customize one stable step.
- Avoid deep inheritance chains. If a third level appears, consider Strategy, Adapter, or composition.

## Common Data Structures

- Use `Record<K, V>` when the key set is known or constrained.
- Use `{ [key: string]: V }` when the object is truly open-ended.
- Use `Map<K, V>` when keys are not strings, insertion order matters, or frequent add/remove operations are central.
- Use arrays for ordered collections and tuples for fixed positional contracts.
- Use discriminated unions for state or command variants instead of loose booleans.
- Keep hash-like caches private unless callers need iteration, eviction, or explicit lifecycle.

## Basic Types and Utilities

- Use union literals for finite options: status, mode, operation, direction.
- Use `Pick`, `Omit`, `Partial`, `Required`, `Readonly`, `Record`, `Extract`, and `Exclude` before writing custom utilities.
- Use `keyof` and indexed access types for property-safe APIs.
- Use overloads sparingly; prefer a single options object when overloads become hard to read.
- Keep mapped types shallow unless the data is truly nested and the API benefits from deep transformation.

## Simple Decorators

- Use decorator factories to attach framework metadata or compose existing decorators.
- Keep decorator options serializable and explicit where possible.
- Separate metadata collection from runtime execution. A decorator should usually register intent; a loader/service should execute it later.
- Avoid parsing function source in ordinary decorators. If runtime argument-name mapping truly requires it, escalate to `advanced.md` and isolate the parser behind tests.
- Test decorators at the behavior boundary, not only by checking metadata keys.

## Pattern Choices

- Use Factory Method or simple factory functions when object creation varies by type or config.
- Use Builder for stepwise configuration only when partially built objects are common or order matters.
- Use Adapter to normalize third-party APIs behind project interfaces.
- Use Facade to simplify a noisy subsystem for callers.
- Use Decorator when behavior should wrap a method/object without changing its public contract.
- Use Template Method when a base class owns an algorithm and subclasses fill in specific steps.
- Use Strategy when an algorithm family changes independently from the caller.
- Use Observer or Mediator for event-style communication, but keep ownership and error handling explicit.

## Symbolic Examples

Use examples like these to reason about shape and tradeoffs. Keep final code adapted to the repository style.

### Strategy with a Narrow Interface

```typescript
interface PriceStrategy {
  total(items: CartItem[]): number;
}

class RetailPrice implements PriceStrategy {
  total(items: CartItem[]) {
    return items.reduce((sum, item) => sum + item.price, 0);
  }
}

class WholesalePrice implements PriceStrategy {
  total(items: CartItem[]) {
    return items.reduce((sum, item) => sum + item.price * 0.9, 0);
  }
}

class CheckoutService {
  constructor(private readonly strategy: PriceStrategy) {}

  quote(items: CartItem[]) {
    return this.strategy.total(items);
  }
}
```

Use this when the caller should not know which algorithm is active.

### Adapter for Third-Party Boundaries

```typescript
interface MessageBus {
  publish(topic: string, payload: unknown): Promise<void>;
}

class RabbitBusAdapter implements MessageBus {
  constructor(private readonly rabbit: RabbitClient) {}

  publish(topic: string, payload: unknown) {
    return this.rabbit.sendToQueue(topic, JSON.stringify(payload));
  }
}
```

Use this when external clients have noisy or unstable APIs.

### Template Method for Lifecycle Hooks

```typescript
abstract class ManagedClient<TConfig, TClient> {
  async connect(config: TConfig) {
    const client = await this.create(config);
    await this.start(client);
    return client;
  }

  protected abstract create(config: TConfig): Promise<TClient>;
  protected abstract start(client: TClient): Promise<void>;
}
```

Use this when the base class owns lifecycle order and subclasses fill the variable steps.

### Simple Decorator Metadata

```typescript
const HANDLER_KEY = "app:handler";

function Handler(name: string): MethodDecorator {
  return (_, __, descriptor) => {
    Reflect.defineMetadata(HANDLER_KEY, name, descriptor.value);
  };
}
```

Use this when methods declare intent and another loader executes it later.

## Practical Review Checklist

- Can a teammate understand the public API without reading private helpers?
- Does the type design represent real runtime rules?
- Are names domain-specific enough to explain intent?
- Is the pattern solving current duplication or variability?
- Are validation, transformation, persistence, and transport concerns separated?
- Are tests focused on behavior that the abstraction promises to preserve?
