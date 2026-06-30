import type { LogData, LogLevel } from "@/services";
import type { RecieveLogMessageAction } from "./actions";

export type LogEntry = {
  readonly level: LogLevel;
  readonly message: string;
  readonly data?: LogData;
  readonly timestamp: number;
};

export type LogState = {
  readonly entries: readonly LogEntry[];
};

const MAX_ENTRIES = 50;

export const defaultState: LogState = {
  entries: [],
};

export const reducer = (state: LogState = defaultState, action: RecieveLogMessageAction): LogState => {
  if (action.type === "LOG_RECIEVE_MESSAGE") {
    const entry: LogEntry = {
      level: action.payload.level,
      message: action.payload.message,
      data: action.payload.data,
      timestamp: Date.now(),
    };

    return {
      entries: [entry, ...state.entries].slice(0, MAX_ENTRIES),
    };
  }

  return state;
};
