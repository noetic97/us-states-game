export type GameMode = "easy" | "hard";
export type TimerMode = "none" | "countdown" | "stopwatch";

export interface StateData {
  name: string;
  abbreviation: string; // Add this for matching with map data
}

export interface GameState {
  mode: GameMode;
  timer: {
    mode: TimerMode;
    time: number;
    isActive: boolean;
  };
  score: number;
  remainingStates: string[];
  completedStates: string[];
  selections: {
    fromList: string;
    fromMap: string;
  };
  status: {
    message: string;
    type: "success" | "error" | "info";
  };
}

export interface SavedGameState {
  mode: GameMode;
  score: number;
  completedStates: string[];
  timerMode: TimerMode;
  timestamp: number;
}
