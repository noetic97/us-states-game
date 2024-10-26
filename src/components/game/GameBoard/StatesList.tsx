import React from "react";
import styled from "styled-components";

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 200px;
`;

const StateButton = styled.button<{ $isSelected: boolean }>`
  background-color: ${(props) => (props.$isSelected ? "#3b82f6" : "white")};
  color: ${(props) => (props.$isSelected ? "white" : "#374151")};
  padding: 8px 16px;
  border-radius: 6px;
  border: 1px solid ${(props) => (props.$isSelected ? "#3b82f6" : "#d1d5db")};
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  text-align: left;
  width: 100%;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(props) => (props.$isSelected ? "#2563eb" : "#f3f4f6")};
  }
`;

interface StatesListProps {
  remainingStates: string[];
  selectedState: string;
  onStateSelect: (state: string) => void;
}

export function StatesList({
  remainingStates,
  selectedState,
  onStateSelect,
}: StatesListProps) {
  return (
    <ListContainer>
      {remainingStates.map((state) => (
        <StateButton
          key={state}
          $isSelected={selectedState === state}
          onClick={() => onStateSelect(state)}
        >
          {state}
        </StateButton>
      ))}
    </ListContainer>
  );
}
