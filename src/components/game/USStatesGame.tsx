"use client";

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { RefreshCw } from "lucide-react";
import { GameBoard } from "./GameBoard";
import { ModeControls } from "./GameControls/ModeControls";
import { TimerControls } from "./GameControls/TimerControls";
import { GameStatus } from "./GameStatus/GameStatus";
import { GameMode, TimerMode, GameState } from "./types/game";
import { Position } from "./types/ui";
import { STATE_CONFIG } from "./Map/stateConfig";
import { gameStorage } from "../../storage/GameStorage";

const GameContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden; // Prevent scrolling
`;

const GameHeader = styled.div`
  padding: 24px 24px 0;
`;

const GameTitle = styled.h1`
  font-size: 24px;
  font-weight: bold;
  margin: 0;
`;

const GameContent = styled.div`
  padding: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 0;
  overflow: hidden;
`;

const ControlsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-shrink: 0; // Prevent controls from shrinking
`;

const ControlsGroup = styled.div`
  display: flex;
  gap: 16px;
`;

const ResetButton = styled.button`
  padding: 8px 16px;
  border-radius: 6px;
  background-color: white;
  border: 1px solid #d1d5db;
  color: #374151;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f3f4f6;
  }
`;

const DEFAULT_SETTINGS = {
  soundEnabled: false,
  darkMode: false,
  lastGameMode: "easy" as GameMode,
  timerPreferences: {
    easy: "none" as TimerMode,
    hard: "none" as TimerMode,
  },
};

const getInitialGameState = (mode: GameMode): GameState => ({
  mode,
  timer: {
    mode: "none",
    time: 300,
    isActive: false,
  },
  score: 0,
  remainingStates: Object.keys(STATE_CONFIG.stateAbbreviations),
  completedStates: [],
  selections: {
    fromList: "",
    fromMap: "",
  },
  status: {
    message: "Select a state to begin!",
    type: "info",
  },
});

export default function USStatesGame() {
  const [gameState, setGameState] = useState<GameState>(
    getInitialGameState("easy")
  );
  const [hoveredState, setHoveredState] = useState("");
  const [inputPosition, setInputPosition] = useState<Position>({ x: 0, y: 0 });
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isStorageInitialized, setIsStorageInitialized] = useState(false);

  const loadSavedGame = async () => {
    try {
      setIsLoading(true);

      // Load settings
      const settings = (await gameStorage.getSettings()) || DEFAULT_SETTINGS;
      const initialMode = settings.lastGameMode;

      // Load progress for the mode
      const progress = await gameStorage.getProgressForMode(initialMode);

      setGameState((prevState) => ({
        ...getInitialGameState(initialMode),
        mode: initialMode,
        timer: {
          mode: settings.timerPreferences[initialMode],
          time: progress?.timeRemaining || 300,
          isActive: false,
        },
        completedStates: progress?.completedStates || [],
        remainingStates: Object.keys(STATE_CONFIG.stateAbbreviations).filter(
          (state) => !progress?.completedStates.includes(state)
        ),
        status: {
          message: progress
            ? `Welcome back! You've completed ${progress.completedStates.length} states in ${initialMode} mode.`
            : "Select a state to begin!",
          type: "info",
        },
      }));
    } catch (error) {
      console.error("Failed to load saved game:", error);
      // Fallback to initial state if loading fails
      setGameState(getInitialGameState("easy"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGameModeChange = async (newMode: GameMode) => {
    if (!isStorageInitialized) return;

    try {
      // Save current progress
      await saveCurrentProgress();

      // Load settings and update with new mode
      const settings = (await gameStorage.getSettings()) || DEFAULT_SETTINGS;
      await gameStorage.saveSettings({
        ...settings,
        lastGameMode: newMode,
      });

      // Load progress for new mode
      const progress = await gameStorage.getProgressForMode(newMode);

      // Update game state
      setGameState((prevState) => ({
        ...getInitialGameState(newMode),
        mode: newMode,
        timer: {
          mode: settings.timerPreferences[newMode],
          time: progress?.timeRemaining || 300,
          isActive: false,
        },
        completedStates: progress?.completedStates || [],
        remainingStates: Object.keys(STATE_CONFIG.stateAbbreviations).filter(
          (state) => !progress?.completedStates.includes(state)
        ),
        status: {
          message: progress
            ? `Switched to ${newMode} mode. You've completed ${progress.completedStates.length} states.`
            : `Switched to ${newMode} mode. Good luck!`,
          type: "info",
        },
      }));
    } catch (error) {
      console.error("Failed to change game mode:", error);
    }
  };

  const saveCurrentProgress = async () => {
    if (!isStorageInitialized || !gameState.completedStates.length) return;

    try {
      await gameStorage.saveProgressForMode({
        mode: gameState.mode,
        completedStates: gameState.completedStates,
        timerMode: gameState.timer.mode,
        timeRemaining:
          gameState.timer.mode === "countdown"
            ? gameState.timer.time
            : undefined,
        lastPlayed: Date.now(),
      });
    } catch (error) {
      console.error("Failed to save progress:", error);
    }
  };

  const handleTimerModeChange = async (mode: TimerMode) => {
    if (!isStorageInitialized) return;

    try {
      const settings = (await gameStorage.getSettings()) || DEFAULT_SETTINGS;
      await gameStorage.saveSettings({
        ...settings,
        timerPreferences: {
          ...settings.timerPreferences,
          [gameState.mode]: mode,
        },
      });

      setGameState((prev) => ({
        ...prev,
        timer: {
          mode,
          time: mode === "countdown" ? 300 : 0,
          isActive: false,
        },
      }));
    } catch (error) {
      console.error("Failed to update timer mode:", error);
    }
  };

  const resetGame = async () => {
    if (!isStorageInitialized) return;

    try {
      // Save empty progress for current mode
      await gameStorage.saveProgressForMode({
        mode: gameState.mode,
        completedStates: [],
        timerMode: gameState.timer.mode,
        timeRemaining: 300,
        lastPlayed: Date.now(),
      });

      setGameState((prev) => ({
        ...getInitialGameState(prev.mode),
        timer: {
          ...prev.timer,
          time: prev.timer.mode === "countdown" ? 300 : 0,
        },
      }));
      setUserInput("");
      setHoveredState("");
    } catch (error) {
      console.error("Failed to reset game:", error);
    }
  };

  // Initialize storage when component mounts
  useEffect(() => {
    const initializeStorage = async () => {
      try {
        await gameStorage.initialize();
        setIsStorageInitialized(true);
      } catch (error) {
        console.error("Failed to initialize storage:", error);
        setIsStorageInitialized(true); // Still set to true so we can proceed without storage
      }
    };
    initializeStorage();
  }, []);

  // Load saved game state when storage is initialized
  useEffect(() => {
    if (isStorageInitialized) {
      loadSavedGame();
    }
  }, [isStorageInitialized]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (gameState.timer.isActive && gameState.timer.mode !== "none") {
      interval = setInterval(() => {
        setGameState((prev) => {
          const newTime =
            prev.timer.mode === "countdown"
              ? prev.timer.time - 1
              : prev.timer.time + 1;

          if (prev.timer.mode === "countdown" && newTime <= 0) {
            return {
              ...prev,
              timer: { ...prev.timer, isActive: false, time: 0 },
              status: {
                message: "Time's up! Game Over",
                type: "info",
              },
            };
          }

          return {
            ...prev,
            timer: { ...prev.timer, time: newTime },
          };
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [gameState.timer.isActive, gameState.timer.mode]);

  // Auto-save progress when states are completed
  useEffect(() => {
    if (isStorageInitialized && gameState.completedStates.length > 0) {
      saveCurrentProgress();
    }
  }, [gameState.completedStates]);

  // Save progress when component unmounts
  useEffect(() => {
    return () => {
      if (isStorageInitialized && gameState.completedStates.length > 0) {
        saveCurrentProgress();
      }
    };
  }, []);

  if (isLoading) {
    return (
      <GameContainer>
        <div className="flex items-center justify-center h-full">
          Loading your game...
        </div>
      </GameContainer>
    );
  }

  const startTimerIfNeeded = () => {
    if (!gameState.timer.isActive && gameState.timer.mode !== "none") {
      setGameState((prev) => ({
        ...prev,
        timer: { ...prev.timer, isActive: true },
      }));
    }
  };

  const handleStateSelect = (state: string) => {
    startTimerIfNeeded();

    setGameState((prev) => {
      if (prev.selections.fromMap) {
        if (prev.selections.fromMap === state) {
          return handleCorrectMatch(prev, state);
        }
        return handleIncorrectMatch(prev);
      }
      return {
        ...prev,
        selections: { ...prev.selections, fromList: state },
      };
    });
  };

  const handleMapStateSelect = (state: string, position: Position) => {
    startTimerIfNeeded();
    setInputPosition(position);

    setGameState((prev) => {
      if (prev.mode === "easy" && prev.selections.fromList) {
        if (prev.selections.fromList === state) {
          return handleCorrectMatch(prev, state);
        }
        return handleIncorrectMatch(prev);
      }
      return {
        ...prev,
        selections: { ...prev.selections, fromMap: state },
      };
    });
  };

  const handleCorrectMatch = (
    prevState: GameState,
    state: string
  ): GameState => {
    const timeBonus =
      prevState.timer.mode === "countdown"
        ? Math.floor(prevState.timer.time / 10)
        : 0;
    const points = 10 + timeBonus;
    // const newRemainingStates = prevState.remainingStates.filter(
    //   (s) => s !== state
    // );

    const newCompletedStates = [...prevState.completedStates, state];
    const isGameComplete =
      newCompletedStates.length ===
      Object.keys(STATE_CONFIG.stateAbbreviations).length;

    // const isGameComplete = newRemainingStates.length === 0;

    return {
      ...prevState,
      score: prevState.score + points,
      // remainingStates: newRemainingStates,
      completedStates: newCompletedStates,
      selections: { fromList: "", fromMap: "" },
      status: {
        message: isGameComplete
          ? `Game Complete! Final Score: ${prevState.score + points}`
          : `Correct! +${points} points`,
        type: "success",
      },
      timer: {
        ...prevState.timer,
        isActive: !isGameComplete,
      },
    };
  };

  const handleIncorrectMatch = (prevState: GameState): GameState => {
    return {
      ...prevState,
      selections: { fromList: "", fromMap: "" },
      status: {
        message: "Try again! Selections don't match.",
        type: "error",
      },
    };
  };

  const handleHardModeInput = () => {
    if (gameState.mode === "hard" && gameState.selections.fromMap) {
      const normalizedInput = userInput.trim().toLowerCase();
      const normalizedState = gameState.selections.fromMap.toLowerCase();

      if (normalizedState === normalizedInput) {
        setGameState((prev) =>
          handleCorrectMatch(prev, prev.selections.fromMap)
        );
      } else {
        setGameState((prev) => ({
          ...prev,
          status: {
            message: "Incorrect state name. Try again!",
            type: "error",
          },
        }));
      }
      setUserInput("");
    }
  };

  const handleInputClose = () => {
    setGameState((prev) => ({
      ...prev,
      selections: { ...prev.selections, fromMap: "" },
    }));
    setUserInput("");
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <GameContainer>
      <GameHeader>
        <GameTitle>US States Learning Game</GameTitle>
      </GameHeader>
      <GameContent>
        <ControlsContainer>
          <ControlsGroup>
            <ModeControls
              gameMode={gameState.mode}
              onGameModeChange={handleGameModeChange}
            />
            <TimerControls
              timerMode={gameState.timer.mode}
              timeDisplay={formatTime(gameState.timer.time)}
              onTimerModeChange={handleTimerModeChange}
            />
          </ControlsGroup>
          <ResetButton onClick={resetGame}>
            <RefreshCw size={16} />
            Reset Game
          </ResetButton>
        </ControlsContainer>

        <GameStatus
          score={gameState.score}
          message={gameState.status.message}
          messageType={gameState.status.type}
        />

        <GameBoard
          gameMode={gameState.mode}
          remainingStates={gameState.remainingStates}
          selectedState={gameState.selections.fromList}
          selectedMapState={gameState.selections.fromMap}
          hoveredState={hoveredState}
          completedStates={gameState.completedStates}
          inputPosition={inputPosition}
          userInput={userInput}
          onStateSelect={handleStateSelect}
          onMapStateSelect={handleMapStateSelect}
          onStateHover={setHoveredState}
          onStateLeave={() => setHoveredState("")}
          onInputChange={setUserInput}
          onInputSubmit={handleHardModeInput}
          onInputClose={handleInputClose}
        />
      </GameContent>
    </GameContainer>
  );
}
