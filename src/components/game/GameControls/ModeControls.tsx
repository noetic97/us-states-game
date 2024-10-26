import React from "react";
import styled from "styled-components";
import { GameMode } from "../types/game";

interface ModeControlsProps {
  gameMode: GameMode;
  onGameModeChange: (mode: GameMode) => void;
}

const ButtonContainer = styled.div`
  display: flex;
  gap: 8px;
`;

const ModeButton = styled.button<{ $isSelected: boolean }>`
  background-color: ${(props) => (props.$isSelected ? "#3b82f6" : "#ef4444")};
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${(props) => (props.$isSelected ? "#2563eb" : "#dc2626")};
  }
`;

export function ModeControls({
  gameMode,
  onGameModeChange,
}: ModeControlsProps) {
  return (
    <ButtonContainer>
      <ModeButton
        $isSelected={gameMode === "easy"}
        onClick={() => onGameModeChange("easy")}
      >
        Easy Mode
      </ModeButton>
      <ModeButton
        $isSelected={gameMode === "hard"}
        onClick={() => onGameModeChange("hard")}
      >
        Hard Mode
      </ModeButton>
    </ButtonContainer>
  );
}
