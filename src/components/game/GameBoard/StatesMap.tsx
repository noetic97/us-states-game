import React from "react";
import { StateMap } from "../types/game";
import { Position } from "../types/ui";

interface StatesMapProps {
  statePaths: StateMap;
  remainingStates: string[];
  selectedMapState: string;
  hoveredState: string;
  onStateClick: (state: string, position: Position) => void;
  onStateHover: (state: string) => void;
  onStateLeave: () => void;
}

export function StatesMap({
  statePaths,
  remainingStates,
  selectedMapState,
  hoveredState,
  onStateClick,
  onStateHover,
  onStateLeave,
}: StatesMapProps) {
  const handleClick = (
    state: string,
    event: React.MouseEvent<SVGPathElement>
  ) => {
    onStateClick(state, {
      x: event.clientX,
      y: event.clientY,
    });
  };

  const getStateFill = (stateId: string): string => {
    if (selectedMapState === stateId) return "#81c784";
    if (hoveredState === stateId) return "#a5d6a7";
    if (!remainingStates.includes(stateId)) return "#E0E0E0";
    return "#FFFFFF";
  };

  return (
    <div className="w-full h-full states-map-container">
      <svg
        viewBox="0 0 959 593"
        className="w-full h-full object-contain"
        preserveAspectRatio="xMidYMid meet"
      >
        <g>
          {Object.entries(statePaths).map(([stateId, stateData]) => (
            <path
              key={stateId}
              d={stateData.path}
              fill={getStateFill(stateId)}
              stroke="#000"
              strokeWidth="1"
              onMouseEnter={() => onStateHover(stateId)}
              onMouseLeave={onStateLeave}
              onClick={(e) => handleClick(stateId, e)}
              className={`cursor-pointer transition-colors duration-200 ${
                !remainingStates.includes(stateId) ? "opacity-50" : ""
              }`}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
