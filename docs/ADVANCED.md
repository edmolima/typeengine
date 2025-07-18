# Advanced Usage: Plugins, Validation, and Migration

## Writing Plugins
- Use `registerTransform` to add custom document transforms
- Use `registerSchemaExtension` for custom schema logic
- Example: see `examples/plugins/example-transform-plugin.ts`

## Writing Validators
- Use `registerValidator` to enforce schema rules
- Example: see `examples/validation/example-validator.ts`

## Writing Migration Scripts
- Use `registerMigration` for upgrades/downgrades
- Example: see `examples/migration/example-migration.ts`

## Best Practices
- Always version your schemas and migrations
- Write idempotent migration scripts
- Validate documents before and after migration
- Use the permission model for plugin security

## Benchmarking
- See `benchmarks/validation-migration.bench.ts` for performance testing
