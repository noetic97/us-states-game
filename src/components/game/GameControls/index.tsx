import React from "react";
import styled from "styled-components";
import { ModeControls } from "./ModeControls";
import { TimerControls } from "./TimerControls";
import { GameMode, TimerMode } from "../types/game";

const ControlsContainer = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
`;

interface GameControlsProps {
  gameMode: GameMode;
  timerMode: TimerMode;
  timeDisplay?: string;
  onGameModeChange: (mode: GameMode) => void;
  onTimerModeChange: (mode: TimerMode) => void;
}

export function GameControls({
  gameMode,
  timerMode,
  timeDisplay,
  onGameModeChange,
  onTimerModeChange,
}: GameControlsProps) {
  return (
    <ControlsContainer>
      <ModeControls gameMode={gameMode} onGameModeChange={onGameModeChange} />
      <TimerControls
        timerMode={timerMode}
        timeDisplay={timeDisplay}
        onTimerModeChange={onTimerModeChange}
      />
    </ControlsContainer>
  );
}
