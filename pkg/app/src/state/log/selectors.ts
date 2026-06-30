import type { RootState } from "@/state/rootReducer";
import type { LogEntry } from "./reducer";

export const logEntriesSelector = (state: RootState): readonly LogEntry[] => state.log.entries;
