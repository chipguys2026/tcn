# Repository structure

```text
tcn/
├── .github/
│   ├── workflows/ci-release.yml # Local definition; runs after publishing to GitHub
│   └── main-ruleset.json       # Import on GitHub later; not active from this file alone
├── package.json              # npm package and tcn executable
├── src/                      # Node-compatible CLI implementation
│   ├── main.ts               # Arguments and command dispatch
│   ├── config.ts             # Project config, aliases and installed metadata
│   ├── registry.ts           # Bundled registry and source transformation
│   ├── operations.ts         # Read-only init/add/remove/diff planning
│   ├── files.ts              # Path checks, guards, locks and file transactions
│   └── types.ts
├── schemas/tcn.schema.json
├── registry/                 # Generated index and format documentation
├── scripts/
│   ├── build.ts              # Compile registry, template snapshot and executable
│   ├── check-version.ts      # Committed base/head SemVer and changelog gate
│   ├── pack.ts               # Versioned tarball, SHA256SUMS and release metadata
│   ├── smoke.ts              # Test the exact packed CLI and generated application
│   ├── release.ts            # CI-only GitHub publisher; disabled locally
│   └── lib/                  # Pure version/artifact helpers and injectable release engine
├── tests/                    # CLI and source-management integration tests
├── docs/
├── templates/starter/        # Canonical application and UI source
│   ├── src/app/              # Home, Gallery and Tweak routes
│   ├── src/features/
│   ├── src/components/ui/    # Public component source
│   ├── src/lib/ui/           # Shared primitives, focus, theme and helpers
│   ├── docs/ui/
│   └── tests/
└── dist/                     # Generated npm payload
```

There is one maintained source for components: the starter. The registry compiler uses TypeScript module resolution to collect file ownership, imports, dependencies and package requirements. Component styles belong to their component unit. Shared helper files are internal units, copied once per project and reference-counted through explicit root reachability.

Generated registry JSON is not manually maintained. Build reads only this repository, never the earlier sibling starter. The application UI has no dependency on CLI code and does not read tcn.json or .tcn metadata at runtime. Root CLI tests and template tests have separate commands, dependency scopes and tsconfig files.
