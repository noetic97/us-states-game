import React from "react";
import styled from "styled-components";
import { USAMap } from "../Map/USAMap";
import { StatesList } from "./StatesList";
import { HardModeInput } from "./HardModeInput";
import { GameMode } from "../types/game";
import { Position } from "../types/ui";

const GameBoardContainer = styled.div`
  display: flex;
  gap: 16px;
  flex: 1;
  min-height: 0;
`;

const MapWrapper = styled.div`
  position: relative;
  flex: 1;
  min-height: 0;
`;

const StatesListWrapper = styled.div`
  width: 200px;
  overflow-y: auto;
`;

interface GameBoardProps {
  gameMode: GameMode;
  remainingStates: string[];
  selectedState: string;
  selectedMapState: string;
  hoveredState: string;
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
  remainingStates,
  selectedState,
  selectedMapState,
  hoveredState,
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
          remainingStates={remainingStates}
          selectedMapState={selectedMapState}
          hoveredState={hoveredState}
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
            onStateSelect={onStateSelect}
          />
        </StatesListWrapper>
      )}
    </GameBoardContainer>
  );
}
