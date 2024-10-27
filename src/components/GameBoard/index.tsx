import React from "react";
import styled from "styled-components";
import { USAMap } from "../Map/USAMap";
import { StatesList } from "./StatesList";
import { HardModeInput } from "./HardModeInput";
import { GameMode } from "../../types/game";
import { Position } from "../../types/ui";

const GameBoardContainer = styled.div`
  display: flex;
  gap: 16px;
  flex: 1;
  min-height: 0;
  height: calc(100vh - 200px); // Adjust based on your header/controls height
`;

const MapWrapper = styled.div`
  position: relative;
  flex: 1;
  min-height: 0;
  min-width: 0; // Important for flex container
  overflow: hidden; // Prevent any potential overflow
`;

const StatesListWrapper = styled.div`
  width: 200px;
  height: 100%;
  overflow: hidden; // Ensure the container doesn't scroll
  border-left: 1px solid #e5e7eb; // Optional: adds a nice separator
  padding-left: 16px;
`;

interface GameBoardProps {
  gameMode: GameMode;
  selectedState: string;
  selectedMapState: string;
  hoveredState: string;
  remainingStates: string[];
  completedStates: string[];
  inputPosition: Position;
  userInput: string;
  onStateSelect: (state: string) => void;
  onMapStateSelect: (state: string, position: Position) => void;
  onStateHover: (state: string) => void;
  onStateLeave: () => void;
  onInputChange: (value: string) => void;
  onInputSubmit: () => void;
  onInputClose: () => void;
}

export function GameBoard({
  gameMode,
  selectedState,
  selectedMapState,
  hoveredState,
  remainingStates,
  completedStates,
  inputPosition,
  userInput,
  onStateSelect,
  onMapStateSelect,
  onStateHover,
  onStateLeave,
  onInputChange,
  onInputSubmit,
  onInputClose,
}: GameBoardProps) {
  return (
    <GameBoardContainer>
      <MapWrapper>
        <USAMap
          selectedMapState={selectedMapState}
          hoveredState={hoveredState}
          completedStates={completedStates}
          onStateClick={onMapStateSelect}
          onStateHover={onStateHover}
          onStateLeave={onStateLeave}
        />
        {gameMode === "hard" && selectedMapState && (
          <HardModeInput
            position={inputPosition}
            value={userInput}
            onChange={onInputChange}
            onSubmit={onInputSubmit}
            onClose={onInputClose}
          />
        )}
      </MapWrapper>

      {gameMode === "easy" && (
        <StatesListWrapper>
          <StatesList
            remainingStates={remainingStates}
            selectedState={selectedState}
            completedStates={completedStates}
            onStateSelect={onStateSelect}
          />
        </StatesListWrapper>
      )}
    </GameBoardContainer>
  );
}
