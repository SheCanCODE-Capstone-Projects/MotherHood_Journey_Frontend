/**
 * auth.ts (project root) — re-export shim.
 *
 * The actual NextAuth configuration lives in src/auth.ts so that the `@/auth`
 * path alias (which maps @/ → ./src/) resolves correctly everywhere.
 *
 * This root-level file exists only for any tooling that expects auth.ts at
 * the project root (e.g. some CLI scripts or deployment checks).
 */
export { handlers, auth, signIn, signOut } from "./src/auth";
