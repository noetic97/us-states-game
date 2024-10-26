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
// import { HardModeInput } from "./GameBoard/HardModeInput";
import { STATE_CONFIG } from "./Map/stateConfig";

const GameContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  display: flex;
  flex-direction: column;
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
  padding: 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 0;
`;

const ControlsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
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

const initialGameState: GameState = {
  mode: "easy",
  timer: {
    mode: "none",
    time: 300,
    isActive: false,
  },
  score: 0,
  remainingStates: Object.keys(STATE_CONFIG.stateAbbreviations), // Use all state names
  selections: {
    fromList: "",
    fromMap: "",
  },
  status: {
    message: "Select a state to begin!",
    type: "info",
  },
};

export default function USStatesGame() {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [hoveredState, setHoveredState] = useState("");
  const [inputPosition, setInputPosition] = useState<Position>({ x: 0, y: 0 });
  const [userInput, setUserInput] = useState("");

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

  const resetGame = () => {
    setGameState((prev) => ({
      ...initialGameState,
      mode: prev.mode,
      timer: {
        ...initialGameState.timer,
        mode: prev.timer.mode,
        time: prev.timer.mode === "countdown" ? 300 : 0,
      },
    }));
    setUserInput("");
    setHoveredState("");
  };

  const handleGameModeChange = (mode: GameMode) => {
    setGameState((prev) => ({
      ...initialGameState,
      mode,
      timer: { ...prev.timer },
    }));
    setUserInput("");
  };

  const handleTimerModeChange = (mode: TimerMode) => {
    setGameState((prev) => ({
      ...prev,
      timer: {
        mode,
        time: mode === "countdown" ? 300 : 0,
        isActive: false,
      },
    }));
  };

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
    const newRemainingStates = prevState.remainingStates.filter(
      (s) => s !== state
    );

    const isGameComplete = newRemainingStates.length === 0;

    return {
      ...prevState,
      score: prevState.score + points,
      remainingStates: newRemainingStates,
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
