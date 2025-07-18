# API Documentation

To generate API documentation from TSDoc comments:

1. Install TypeDoc (if not already):
   ```sh
   pnpm add -D typedoc
   ```
2. Run the script:
   ```sh
   pnpm ts-node scripts/generate-api-docs.ts
   ```
3. View the generated docs in `docs/api/`

See `typedoc.json` for configuration.
