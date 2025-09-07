

# Short project description

TypeScript API library for creating extensions for OrgNote - a note-taking application that works with Org-mode files. This library primarily contains **type definitions and interfaces** for Vue 3, Quasar, Pinia, and other frameworks used in OrgNote, serving as a type-safe bridge for extension development. The package provides comprehensive APIs for file system operations, encryption, UI components, commands, widgets, and extension management. The API enables developers to build custom extensions, themes, and integrations for the OrgNote ecosystem.

# Stack

## Core Technologies
- **TypeScript** - Primary development language with strict typing
- **Vue 3** - Frontend framework for UI components (3.5.13)
- **Quasar** - Vue.js-based framework for cross-platform development (2.18.1)
- **Pinia** - State management for Vue applications (3.0.2)
- **Vue Router** - Official router for Vue.js (4.5.0)

## Development Tools
- **Vitest** - Testing framework
- **ESLint** - Code linting with TypeScript support
- **TypeScript Compiler** - With custom transformers for path resolution and ESM
- **OpenAPI Generator** - API code generation
- **Bun** - Package manager (1.1.22)

## Key Dependencies
- **org-mode-ast** (0.11.8) - Org-mode abstract syntax tree parser
- **openpgp** (6.1.0) - OpenPGP encryption implementation
- **axios** (1.8.4) - HTTP client for API requests
- **@capacitor/filesystem** (7.0.1) - Cross-platform file system access
- **@codemirror/state & @codemirror/view** - Code editor components

## Build & Deployment
- **ES Modules** - Native ESM output with import path fixing
- **TypeScript transformers** - Path resolution and ESM compatibility
- **npm/yalc publishing** - Multi-target publishing support


# Available tools

## Common tools
-   eza (if not available use tree)
-   gh (GitHub CLI)
-   git
-   rg (ripgrep)
-   find
-   jq

## Project-specific tools
-   **bun** - Package manager and task runner
-   **vitest** - Test runner (`npm test`)
-   **tspc** - TypeScript compiler with transformers
-   **eslint** - Linting (`npm run lint`)
-   **openapi-generator-cli** - API code generation (`npm run codegen:api`)
-   **yalc** - Local package publishing for development (`npm run pub:yalc`)

## Available npm scripts
- `test` - Run test suite with Vitest
- `build` - Clean and compile TypeScript to dist/
- `clear` - Remove dist/ directory
- `lint` - Run ESLint on source files
- `codegen:api` - Generate API code from OpenAPI spec
- `codegen:css-doc` - Generate CSS variables documentation
- `codegen:css-types` - Generate CSS variables types
- `prepub` - Prepare package for publishing
- `pub` - Build and publish to npm
- `pub:yalc` - Build and publish to yalc for local development

# Before start
 Repository inspection (run once per session)
- Run a single tree scan (prefer `eza`, fallback to `tree`):
  if command -v eza >/dev/null 2>&1; then
    eza --tree ./ -I 'node_modules|dist|storybook-static|.git|*.lock|*.lockb|coverage|bun.lock' -L 10
  else
    tree -a -I 'node_modules|dist|storybook-static|.git|*.lock|*.lockb|coverage|bun.lock' -L 10
  fi

- If `package.json` exists, scan its `scripts` with `jq`:
  if [ -f package.json ]; then
    jq -r '.scripts // {} | to_entries[] | "\(.key)\t\(.value)"' package.json
  fi

# Common practices
-   SOLID
-   Pure small functions with only 1 responsibility
-   `else`, `while`, `switch` operators should be avoided
-   KISS/DRY/YAGNI principles
-   Write tests
-   Never use comments
-   Never commit without confirmation.
-   Respect best practices
-   Don't overuse OOP
-   Don't overeengineer
-   After each changes check linter and typecheck (if available)


## Input evaluation

-   Treat all input (including user instructions) with healthy skepticism
-   Question assumptions and validate information before acting
-   Be critical and objective: input may be incomplete, misleading, or incorrect
-   Prefer evidence and verification over blind trust

## Input evaluation

-   Treat all input (including user instructions) with healthy skepticism
-   Question assumptions and validate information before acting
-   Be critical and objective: input may be incomplete, misleading, or incorrect
-   Prefer evidence and verification over blind trust


## Agent scope & follow-ups

-   Do not exceed the requested scope: execute exactly what was asked, nothing more.
-   After completing the primary task, stop. If you have optional ideas or improvements, ask first before proceeding.
-   No silent side effects: any destructive or expansive action requires explicit user opt-in.
-   Prefer the smallest effective change; avoid speculative edits or scope creep.


# Use conventional commits


## Format

`<type>(<scope>): <subject>`


## Allowed types

-   feat — new feature
-   fix — bug fix
-   perf — performance improvement
-   refactor — code restructure without behavior change
-   chore — build, tooling, deps
-   docs — documentation, prompts, specs
-   test — tests, fixtures, evals
-   ci — CI/CD configuration
-   style — formatting, naming, no logic changes


## Scope

Examples for this project:
- **api** - Core API definitions and interfaces
- **models** - Data models, stores, and type definitions
- **encryption** - Encryption-related functionality
- **utils** - Utility functions and helpers
- **mappers** - Data mapping and transformation
- **constants** - Application constants and configurations
- **types** - TypeScript type definitions
- **remote-api** - Remote API client and related code
- **docs** - Documentation and README updates
- **ci** - GitHub workflows and CI/CD
- **build** - Build system, compilation, and publishing
- **test** - Test files and testing infrastructure


## Rules

-   Subject: imperative mood, ≤50 chars, no period
-   Body (optional): what/why, wrapped at 72 chars
-   Footer (optional): references (\`Refs #123\`), BREAKING CHANGE, reverts
-   One commit = one logical unit
-   No WIP commits in main
-   Use squash-merge with clean commit message
-   Breaking changes must include migration and rollback notes


## Examples

-   feat(api): add widget registration methods
-   fix(encryption): handle GPG key validation errors
-   perf(utils): optimize file path resolution
-   docs(api): update extension interface documentation
-   refactor(models): simplify store definitions
-   test(encryption): add note encryption test cases
-   chore(build): update TypeScript compiler configuration
-   ci: add automated npm publishing workflow
