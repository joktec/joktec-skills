---
name: advanced-typescript-design
description: Use this skill for TypeScript framework/library design, including generic public APIs, infer/conditional/recursive mapped types, decorator metadata, type-safe query DSLs, lifecycle abstractions, and design pattern selection. Use for TypeScript/NestJS packages, repositories, DTO/query types, clients, loaders, metrics, or when deciding whether simple TypeScript is enough or advanced type-system design is justified.
---

# Advanced TypeScript Design

## Overview

Act as a TypeScript architecture partner. Choose the simplest design that preserves clear boundaries, runtime correctness, and useful compile-time guarantees.

Use design patterns as vocabulary and pressure tests, not as decoration. Prefer local project conventions, readable APIs, and low-friction extension points before adding type-level machinery.

## Architectural Mindset

- Start from the domain boundary: identify entity, request/response, service, repository, client, decorator, loader, and integration responsibilities.
- Keep public APIs narrow and stable. Make extension explicit through interfaces, abstract classes, generic constraints, or composition.
- Use classes when lifecycle, inheritance hooks, decorators, or framework reflection matter. Use plain functions/types when behavior is stateless or purely transformational.
- Let runtime validation and compile-time types reinforce each other. Do not pretend TypeScript types validate untrusted runtime data.
- Do not assume TypeScript generics, interfaces, unions, or array element types exist at runtime through `reflect-metadata`.
- Escalate type complexity only when it removes real duplication, prevents invalid states, or makes an API substantially safer.
- Check existing code before inventing a new pattern; mirror the repository's style when it already solves the same class of problem.

## Public API Compatibility

- Treat exported types, classes, decorators, config objects, modules, and provider APIs as public contracts.
- Prefer additive changes over breaking renames, deleted fields, changed generic parameter order, or narrower accepted input shapes.
- Before changing exported generic types, check downstream inference from normal call sites and verify that common extension patterns still compile.
- If a breaking type or runtime contract change is unavoidable, report migration impact explicitly and include the smallest migration path.

## Pattern Vocabulary

Use the classic catalog as shared language, including the TypeScript examples catalog from Refactoring.Guru.

- Creational Patterns: Abstract Factory, Builder, Factory Method, Prototype, Singleton.
- Structural Patterns: Adapter, Bridge, Composite, Decorator, Facade, Flyweight, Proxy.
- Behavioral Patterns: Chain of Responsibility, Iterator, Memento, State, Template Method, Command, Mediator, Observer, Strategy, Visitor.

Treat pattern names as a starting point for design discussion. Validate whether the implementation needs the pattern's tradeoffs, or whether a direct function, data object, or interface is enough.

## Agent Workflow

1. Inspect local code first when working inside a repository. Look for existing abstractions, decorators, DTO types, factory functions, lifecycle hooks, and tests.
2. Classify the task:
   - Use `references/simple.md` for everyday TypeScript, OOP, data modeling, classes, interfaces, types, records, maps, arrays, simple decorators, and pragmatic refactors.
   - Use `references/advanced.md` for generic framework code, recursive mapped types, `infer`, distributed/deferred conditional types, reflection metadata, advanced decorators, type-safe builders, plugin architectures, or expert pattern selection.
3. Choose the least complex pattern that solves the force in front of you. Record why a simpler alternative was not enough when choosing advanced machinery.
4. Design the public surface before implementation: inputs, outputs, extension points, error behavior, lifecycle, and type inference experience.
5. Implement incrementally. Keep runtime behavior testable, and add focused type-level checks when exported generic or decorator behavior is subtle.
6. Review for overengineering: remove unused generic parameters, speculative base classes, unnecessary inheritance, and type utilities that do not protect a real API.

## Repository Signals

In JokTec-style TypeScript, expect patterns such as:

- Generic request/query types with recursive conditions and sort/populate typing.
- Factory functions that return decorated NestJS classes.
- Abstract services and clients with template methods for lifecycle-specific behavior.
- Decorator factories that compose validation, Swagger, transformation, metrics, and integration metadata.
- Loader/registry patterns that collect decorator metadata and wire runtime behavior during module initialization.
