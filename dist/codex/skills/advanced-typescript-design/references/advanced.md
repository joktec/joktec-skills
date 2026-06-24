# Advanced TypeScript Design Guidance

Use this reference for framework-level TypeScript, generic libraries, decorator infrastructure, metadata-driven loaders, and APIs where compile-time inference is part of the product experience.

## Escalation Criteria

Reach for advanced TypeScript only when at least one is true:

- The API is reused widely and type inference prevents real misuse.
- The runtime model is already generic, recursive, or metadata-driven.
- The abstraction eliminates repeated boilerplate across many entities, DTOs, repositories, services, clients, or transports.
- The type-level design mirrors a stable domain contract, not a speculative future.
- Tests or examples can prove both runtime behavior and developer ergonomics.

If the advanced type exists only to feel clever, delete it.

## Infer, Conditional, and Deferred Types

- Use `infer` to extract return types, payloads, entity types, DTO shapes, tuple elements, and callback signatures from source contracts.
- Control distributive conditional types intentionally. Wrap operands in tuples, such as `[T] extends [U]`, when union distribution is not wanted.
- Prefer named intermediate aliases when nested conditionals exceed two branches.
- Use `never` as a filter, but verify that it cannot erase useful error information from public APIs.
- Treat deferred conditional types and generic inference as public UX: callers should get helpful autocomplete and errors without manual type arguments.

## Recursive and Mapped Types

- Use recursive mapped types for query languages, nested sort/select/populate APIs, deep partials, and entity graph traversal.
- Add clear stop conditions for primitives, dates, arrays, functions, and branded values.
- Use branded or opaque types for special primitives such as `ObjectId`, `UserId`, tenant IDs, cursors, or external reference IDs when plain strings would blur domain boundaries.
- Avoid infinite or overly expensive type recursion. Keep recursion shallow enough for editor performance.
- Preserve optionality and readonly modifiers intentionally with `+?`, `-?`, `readonly`, and `-readonly`.
- Separate query operator typing from entity typing so the operator model remains testable and reusable.

## Reflection and Decorators

- Use `reflect-metadata` only when runtime type information materially improves the API: schema generation, validation composition, serialization, dependency injection, or loader registration.
- Remember that reflected TypeScript types are lossy at runtime. Arrays, unions, generics, and interfaces need explicit options or factories.
- Prefer decorator factories that normalize options, resolve type factories, compose framework decorators, and define one clear metadata contract.
- Keep advanced decorators thin at the call site and explicit internally: clone options, sanitize runtime-only fields, then compose validators, transformers, docs, and persistence metadata.
- For method decorators, preserve `this`, return values, thrown errors, and async behavior unless the decorator explicitly changes them.
- Use function source parsing only as a last-resort runtime technique for decorator infrastructure, such as mapping method argument names. Keep it isolated, deterministic, and covered by tests because minification, transpilation, defaults, destructuring, and comments can break it.
- Test decorator behavior through a class that uses it, especially for metadata, wrapping behavior, and dependency injection.

## Type-Level Verification

- Add type-level tests when changing exported generic utilities, query DSLs, decorators, builders, or public inference-heavy APIs.
- Prefer the project's existing compile/type test setup. If available, use `tsd`, `expect-type`, `vitest`/`jest` type helpers, or a dedicated `tsc --noEmit` fixture.
- Include positive inference examples from normal call sites, not only explicit generic arguments.
- Include negative examples with `@ts-expect-error` when an invalid state must stay rejected.
- Verify runtime tests separately when decorators, reflection metadata, validation, transformation, or loaders are involved.

## Expert Pattern Selection

- Abstract Factory fits families of related clients, repositories, or transport adapters that must be created consistently.
- Builder fits fluent configuration with required-step guarantees; type-state builders can enforce completeness but should stay readable.
- Factory Method fits framework hooks that create DTOs, pagination wrappers, controllers, or provider instances.
- Prototype fits cloning configured objects when construction is expensive or stateful.
- Singleton should usually be delegated to the DI container; avoid hand-rolled global state.
- Adapter fits third-party client normalization and migration layers.
- Bridge fits separating abstraction from implementation, such as transport-agnostic messaging APIs over Rabbit, Kafka, or Redis.
- Composite fits tree-shaped filters, pipelines, menu/routes, or nested query conditions.
- Decorator fits metrics, retries, circuit breakers, serialization, validation, or publishing side effects around existing behavior.
- Facade fits a stable service hiding multiple low-level collaborators.
- Flyweight fits large repeated metadata or schema objects only after measuring memory pressure.
- Proxy fits lazy clients, caching, access control, retries, and remote boundaries.
- Chain of Responsibility fits validation, middleware, parsing, and request pipelines.
- Command fits queued work, replayable operations, and undoable actions.
- Iterator fits cursor pagination and collection traversal without exposing storage details.
- Mediator fits module coordination where direct dependencies would become tangled.
- Memento fits snapshots, rollbacks, and state restoration.
- Observer fits event streams and pub/sub, with explicit unsubscribe and error policy.
- State fits lifecycle-heavy clients, jobs, or connections with mode-specific behavior.
- Strategy fits interchangeable algorithms selected by config or runtime context.
- Template Method fits abstract base services/clients that own lifecycle while subclasses implement `init`, `start`, `stop`, `validate`, or `transform` steps.
- Visitor fits operations over stable object structures when adding new operations is more common than adding new node types.

## Symbolic Examples

Use examples like these as compact templates for thinking. Keep production implementations smaller or larger depending on the actual force.

### Type-Safe Event Map

```typescript
type EventMap = {
  "user.created": { id: string };
  "invoice.paid": { invoiceId: string; amount: number };
};

class EventBus<TEvents extends Record<string, unknown>> {
  on<K extends keyof TEvents>(event: K, handler: (payload: TEvents[K]) => void) {}
  emit<K extends keyof TEvents>(event: K, payload: TEvents[K]) {}
}

const bus = new EventBus<EventMap>();
bus.emit("invoice.paid", { invoiceId: "inv_1", amount: 100 });
```

Use this for Observer/Mediator-style APIs where event names and payloads must stay coupled.

### API Contract Inference

```typescript
type Endpoint = {
  "/users/:id": {
    GET: { params: { id: string }; response: User };
    PATCH: { params: { id: string }; body: Partial<User>; response: User };
  };
};

type ResponseOf<T> = T extends { response: infer R } ? R : never;

class ApiClient<TContract extends Record<string, any>> {
  request<Path extends keyof TContract, Method extends keyof TContract[Path]>(
    path: Path,
    method: Method,
  ): Promise<ResponseOf<TContract[Path][Method]>> {
    return null as any;
  }
}
```

Use this when a contract object should drive call-site inference.

### Type-State Builder

```typescript
type With<K extends string> = Record<K, true>;

class JobBuilder<State = {}> {
  queue(name: string): JobBuilder<State & With<"queue">> {
    return this as any;
  }

  handler(fn: () => Promise<void>): JobBuilder<State & With<"handler">> {
    return this as any;
  }

  build(this: State extends With<"queue"> & With<"handler"> ? JobBuilder<State> : never) {
    return {};
  }
}
```

Use this when incomplete configuration is common and worth rejecting at compile time.

### Recursive Query Shape

```typescript
type Primitive = string | number | boolean | Date;
type FieldOp<T> = T | { $eq?: T; $in?: T[] };
type Brand<T, Name extends string> = T & { readonly __brand: Name };
type ObjectId = Brand<string, "ObjectId">;

type Query<T> = {
  [K in keyof T]?: T[K] extends Primitive
    ? FieldOp<T[K]>
    : T[K] extends Array<infer U>
      ? Query<U>
      : Query<T[K]>;
} & {
  $or?: Query<T>[];
};
```

Use this for Composite-style nested filters, but add stop conditions before expanding it.

### Opaque ID Boundary

```typescript
type Brand<T, Name extends string> = T & { readonly __brand: Name };
type UserId = Brand<string, "UserId">;
type PostId = Brand<string, "PostId">;

function asUserId(value: string): UserId {
  return value as UserId;
}

function findUser(id: UserId) {}

findUser(asUserId("u_1"));
// @ts-expect-error raw strings are not accepted here
findUser("u_1");
```

Use this when a domain primitive crosses many generic/query layers and accidental mixing would be costly.

### Decorator Wrapper with Preserved Method Contract

```typescript
function Around(run: (next: () => unknown) => unknown): MethodDecorator {
  return (_, __, descriptor) => {
    const original = descriptor.value;

    descriptor.value = function (...args: unknown[]) {
      return run(() => original.apply(this, args));
    };
  };
}
```

Use this for metrics, retry, logging, or publishing side effects; preserve `this`, args, return values, and thrown errors.

## JokTec-Style Signals to Reuse

- Recursive query typing can combine entity properties with operator unions, nested entity traversal, and logical `$or`/`$and` shapes.
- Base services and clients commonly use Template Method: the base class owns lifecycle and shared behavior while subclasses provide specific implementation steps.
- Controller factories can return decorated classes to avoid repetitive NestJS endpoint scaffolding while preserving DTO-specific metadata.
- Decorator infrastructure often composes Swagger, validation, transformation, persistence, and metric behavior from one options object.
- Rabbit loaders show a metadata registry plus module-init loader pattern: decorators declare intent; loaders resolve providers and connect runtime consumers.

## Advanced Review Checklist

- Does every generic parameter appear in the public contract or implementation?
- Can inference succeed from normal call-site arguments?
- Does the type-level model match runtime validation and transformation?
- Are metadata keys centralized and collision-resistant?
- Are decorator side effects documented by tests?
- Is editor performance acceptable after adding recursive or conditional types?
- Is there a simpler Strategy, Adapter, or function-based design that would provide the same value?
