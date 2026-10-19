import { Preferences } from "@capacitor/preferences";
import { createStorage } from "./store";

vi.mock("@capacitor/core", () => ({ Capacitor: { getPlatform: () => "web" } }));
vi.mock("@capacitor/preferences", () => ({ Preferences: { get: vi.fn(), set: vi.fn() } }));

it("preserves an unreadable saved record when subsequent writes recover", async () => {
  let saved = "saved learner progress";
  vi.mocked(Preferences.get)
    .mockRejectedValueOnce(new Error("Temporarily blocked"))
    .mockImplementation(async () => ({ value: saved }));
  vi.mocked(Preferences.set).mockImplementation(async ({ value }) => {
    saved = value;
  });
  const storage = createStorage();
  await storage.getItem("persist:study-log");
  await storage.setItem("persist:study-log", "empty defaults");
  expect((await Preferences.get({ key: "persist:study-log" })).value).toBe("saved learner progress");
});
