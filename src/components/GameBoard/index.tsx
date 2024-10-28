import React, { useState, useRef, useEffect } from "react";
import { ZoomIn, ZoomOut } from "lucide-react";
import styled from "styled-components";
import { USAMap } from "../Map/USAMap";
import { StatesList } from "./StatesList";
import { HardModeInput } from "./HardModeInput";
import { HardModeInfo } from "./HardModeInfo";
import { GameMode } from "../../types/game";
import { Position } from "../../types/ui";

const GameBoardContainer = styled.div`
  display: flex;
  gap: 16px;
  flex: 1;
  min-height: 0;
  height: calc(100vh - 200px); // Limit maximum height
  max-height: calc(100vh - 200px); // Enforce maximum height
`;

const MapWrapper = styled.div`
  position: relative;
  flex: 1;
  min-height: 0;
  min-width: 0;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
`;

const SidePanel = styled.div<{ $visible: boolean }>`
  width: 200px;
  height: 100%;
  overflow: hidden;
  border-left: 1px solid #e5e7eb;
  padding-left: 16px;
  display: ${(props) => (props.$visible ? "block" : "none")};
`;

const MapControls = styled.div`
  position: absolute;
  right: 16px;
  bottom: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background-color: white;
  padding: 8px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ZoomControl = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;
`;

const ZoomButton = styled.button`
  padding: 8px;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #f3f4f6;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ZoomSlider = styled.input.attrs({ type: "range" })`
  width: 100px;
  writing-mode: bt-lr;
  appearance: slider-vertical;
  -webkit-appearance: slider-vertical;
  padding: 8px 0;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #3b82f6;
    cursor: pointer;
  }

  &::-webkit-slider-runnable-track {
    width: 4px;
    background: #e5e7eb;
    border-radius: 2px;
  }
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

interface ZoomState {
  scale: number;
  translateX: number;
  translateY: number;
}

const ZOOM_STEPS = {
  MIN: 1,
  MAX: 2,
  STEP: 0.25,
};

const BOUNDARY_MARGIN = 0.1; // 10% margin

export const GameBoard: React.FC<GameBoardProps> = ({
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
}) => {
  const [zoom, setZoom] = useState<ZoomState>({
    scale: 1,
    translateX: 0,
    translateY: 0,
  });
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const lastPosition = useRef({ x: 0, y: 0 });

  const handleZoomChange = (newScale: number) => {
    setZoom((prev) => {
      const scale = Math.min(
        Math.max(newScale, ZOOM_STEPS.MIN),
        ZOOM_STEPS.MAX
      );
      return {
        ...prev,
        scale,
        // Adjust translation to maintain center point
        translateX: prev.translateX * (scale / prev.scale),
        translateY: prev.translateY * (scale / prev.scale),
      };
    });
  };

  const handleZoomStep = (increment: boolean) => {
    const newScale =
      zoom.scale + (increment ? ZOOM_STEPS.STEP : -ZOOM_STEPS.STEP);
    handleZoomChange(newScale);
  };

  const constrainTranslation = (
    x: number,
    y: number
  ): { x: number; y: number } => {
    if (!mapContainerRef.current) return { x, y };

    const container = mapContainerRef.current.getBoundingClientRect();
    const mapWidth = container.width * zoom.scale;
    const mapHeight = container.height * zoom.scale;

    // Calculate boundaries with margin
    const marginX = container.width * BOUNDARY_MARGIN;
    const marginY = container.height * BOUNDARY_MARGIN;

    const minX = container.width - mapWidth + marginX;
    const maxX = -marginX;
    const minY = container.height - mapHeight + marginY;
    const maxY = -marginY;

    return {
      x: Math.min(Math.max(x, minX), maxX),
      y: Math.min(Math.max(y, minY), maxY),
    };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    lastPosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;

    const deltaX = e.clientX - lastPosition.current.x;
    const deltaY = e.clientY - lastPosition.current.y;

    const { x, y } = constrainTranslation(
      zoom.translateX + deltaX,
      zoom.translateY + deltaY
    );

    setZoom((prev) => ({
      ...prev,
      translateX: x,
      translateY: y,
    }));

    lastPosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  useEffect(() => {
    document.addEventListener("mouseup", handleMouseUp);
    return () => document.removeEventListener("mouseup", handleMouseUp);
  }, []);

  return (
    <GameBoardContainer>
      <MapWrapper
        ref={mapContainerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        style={{
          cursor: isDragging.current ? "grabbing" : "grab",
        }}
      >
        <div
          style={{
            transform: `scale(${zoom.scale}) translate(${zoom.translateX}px, ${zoom.translateY}px)`,
            transformOrigin: "0 0",
            transition: isDragging.current ? "none" : "transform 0.2s ease-out",
          }}
        >
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
        </div>

        <MapControls>
          <ZoomControl>
            <ZoomButton
              onClick={() => handleZoomStep(true)}
              disabled={zoom.scale >= ZOOM_STEPS.MAX}
            >
              <ZoomIn size={16} />
            </ZoomButton>

            <ZoomSlider
              value={zoom.scale}
              min={ZOOM_STEPS.MIN}
              max={ZOOM_STEPS.MAX}
              step={ZOOM_STEPS.STEP}
              onChange={(e) => handleZoomChange(parseFloat(e.target.value))}
            />

            <ZoomButton
              onClick={() => handleZoomStep(false)}
              disabled={zoom.scale <= ZOOM_STEPS.MIN}
            >
              <ZoomOut size={16} />
            </ZoomButton>
          </ZoomControl>
        </MapControls>
      </MapWrapper>
      <SidePanel $visible={true}>
        {gameMode === "easy" ? (
          <StatesList
            remainingStates={remainingStates}
            selectedState={selectedState}
            completedStates={completedStates}
            onStateSelect={onStateSelect}
          />
        ) : (
          <HardModeInfo completedCount={completedStates.length} />
        )}
      </SidePanel>{" "}
    </GameBoardContainer>
  );
};
