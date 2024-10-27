import React from "react";
import styled from "styled-components";
import { Timer, ArrowDown, ArrowUp } from "lucide-react";
import { TimerMode } from "../../types/game";

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const TimerButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const TimerButton = styled.button<{ $isSelected: boolean }>`
  background-color: ${(props) => (props.$isSelected ? "#3b82f6" : "#ef4444")};
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background-color: ${(props) => (props.$isSelected ? "#2563eb" : "#dc2626")};
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const TimeDisplay = styled.div`
  font-size: 14px;
  font-weight: 500;
  text-align: center;
`;

interface TimerControlsProps {
  timerMode: TimerMode;
  timeDisplay?: string;
  onTimerModeChange: (mode: TimerMode) => void;
}

export function TimerControls({
  timerMode,
  timeDisplay,
  onTimerModeChange,
}: TimerControlsProps) {
  return (
    <ButtonContainer>
      <TimerButtonGroup>
        <TimerButton
          $isSelected={timerMode === "countdown"}
          onClick={() =>
            onTimerModeChange(timerMode === "countdown" ? "none" : "countdown")
          }
        >
          <Timer />
          <ArrowDown />
          Countdown
        </TimerButton>
        <TimerButton
          $isSelected={timerMode === "stopwatch"}
          onClick={() =>
            onTimerModeChange(timerMode === "stopwatch" ? "none" : "stopwatch")
          }
        >
          <Timer />
          <ArrowUp />
          Stopwatch
        </TimerButton>
      </TimerButtonGroup>
      {timerMode !== "none" && timeDisplay && (
        <TimeDisplay>
          Time {timerMode === "countdown" ? "remaining" : "elapsed"}:{" "}
          {timeDisplay}
        </TimeDisplay>
      )}
    </ButtonContainer>
  );
}
