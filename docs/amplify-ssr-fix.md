# Amplify SSR Fix

- Frontend app lives in the `frontend/` subfolder.
- Next standalone output is required for the Amplify SSR deployment path.
- `@swc/helpers` ESM files needed explicit output tracing.
- Without that tracing, Amplify returned a runtime `500` with `MODULE_NOT_FOUND` for `@swc/helpers`.

## Notes

- Relevant config lives in [`frontend/next.config.ts`](C:/Users/nikit/OneDrive/Documents/GitHub/niwo-webapp/frontend/next.config.ts).
- The key additions were:
  - `output: "standalone"`
  - `outputFileTracingIncludes` for `./node_modules/@swc/helpers/esm/**/*.js`
