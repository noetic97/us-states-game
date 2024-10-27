import React from "react";
import styled from "styled-components";

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 200px;
  max-height: calc(
    100vh - 200px
  ); // Adjust the 200px based on your header/controls height
  overflow-y: auto;
  padding-right: 8px; // Add some padding for the scrollbar

  /* Webkit scrollbar styling */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

const StateButton = styled.button<{
  $isSelected: boolean;
  $isCompleted: boolean;
}>`
  background-color: ${(props) => {
    if (props.$isCompleted) return "#4CAF50";
    if (props.$isSelected) return "#3b82f6";
    return "white";
  }};
  color: ${(props) =>
    props.$isCompleted || props.$isSelected ? "white" : "#374151"};
  padding: 8px 16px;
  border-radius: 6px;
  border: 1px solid
    ${(props) => {
      if (props.$isCompleted) return "#4CAF50";
      if (props.$isSelected) return "#3b82f6";
      return "#d1d5db";
    }};
  cursor: ${(props) => (props.$isCompleted ? "default" : "pointer")};
  font-size: 14px;
  font-weight: 500;
  text-align: left;
  width: 100%;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(props) => {
      if (props.$isCompleted) return "#4CAF50";
      if (props.$isSelected) return "#2563eb";
      return "#f3f4f6";
    }};
  }
`;

interface StatesListProps {
  remainingStates: string[];
  selectedState: string;
  completedStates: string[];
  onStateSelect: (state: string) => void;
}

export function StatesList({
  remainingStates,
  selectedState,
  completedStates,
  onStateSelect,
}: StatesListProps) {
  return (
    <ListContainer>
      {remainingStates.map((state) => (
        <StateButton
          key={state}
          $isSelected={selectedState === state}
          $isCompleted={completedStates.includes(state)}
          onClick={() =>
            !completedStates.includes(state) && onStateSelect(state)
          }
          disabled={completedStates.includes(state)}
        >
          {state}
        </StateButton>
      ))}
    </ListContainer>
  );
}
