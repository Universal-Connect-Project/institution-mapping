import { beforeAll, afterEach, afterAll } from "vitest";
import { server } from "./src/shared/test/testServer";

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
