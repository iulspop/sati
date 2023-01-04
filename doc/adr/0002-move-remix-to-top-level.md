# 2. Move Remix to top level

Date: 2023-01-04

## Status

Accepted

## Context

Previously, we organized the code as follows:

```
src/
  cli/
  personal-data-collection/
  test/
  web/
```

Where `web/` contained all Remix/React related application files, ` cli`` all CLI app related files, and  `personal-data-collection/` the domain core & driven-side infrastructure.

However, the way tree-shaking is configured on Remix, when importing a module from outside the Remix project folder, it doesn't remove it from the browser bundle even when adding `.server.ts` hint for the compiler. This makes our Prisma client initialize on the browser and error.

## Decision

To make Remix tree-shake the browser bundle correctly, we'll move the Remix project folder to top-level. The new folder structure as follows:

```
app/
public/
test/
cli/
personal-data-colection/
```

## Consequences

The neat separation between domain and application layers won't be as clear at a glance to the folder structure, but it will be the same. The `cli/` and `personal-data-collection/` folders will be in the Remix project folder, but won't depend on it.
