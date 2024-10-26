import React, { RefObject } from "react";
import styled from "styled-components";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import { geoPath, geoAlbersUsa } from "d3-geo";
import { Position } from "../types/ui";
import {
  STATE_CONFIG,
  standardizeStateName,
  getStateAbbreviation,
} from "./stateConfig";

const MapContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: #fff;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StateLabel = styled.text`
  font-size: 12px;
  font-weight: 800;
  fill: red;
  text-anchor: middle;
  /* alignment-baseline: middle; */
  pointer-events: auto;
  cursor: help;
  transition: font-size 0.2s ease;
  paint-order: stroke;
  stroke: white;
  stroke-width: 2px;

  &:hover {
    font-size: 14px;
  }
`;

const Tooltip = styled.div<{ $x: number; $y: number }>`
  position: fixed; // Change to fixed to use viewport coordinates
  left: ${(props) => props.$x}px;
  top: ${(props) => props.$y}px;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  transform: translate(-50%, -100%);
  margin-top: -8px;
  pointer-events: none;
  z-index: 1000;
  white-space: nowrap;
`;

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

interface USAMapProps {
  selectedMapState: string;
  hoveredState: string;
  completedStates: string[];
  onStateClick: (state: string, position: Position) => void;
  onStateHover: (state: string) => void;
  onStateLeave: () => void;
}

export function USAMap({
  selectedMapState,
  hoveredState,
  completedStates,
  onStateClick,
  onStateHover,
  onStateLeave,
}: USAMapProps) {
  const [tooltipContent, setTooltipContent] = React.useState("");
  const [tooltipPosition, setTooltipPosition] = React.useState({ x: 0, y: 0 });
  const mapRef: RefObject<HTMLDivElement> = React.useRef(null);

  React.useEffect(() => {
    if (mapRef.current) {
      const svg = mapRef.current.querySelector("svg");
      if (svg) {
        console.log("SVG ViewBox:", svg.getAttribute("viewBox"));
        console.log("SVG Dimensions:", {
          width: svg.clientWidth,
          height: svg.clientHeight,
        });
      }
    }
  }, []);

  const handleLabelHover = (event: React.MouseEvent, stateName: string) => {
    // Get the position of the label element itself
    const element = event.currentTarget as SVGTextElement;
    const bbox = element.getBoundingClientRect();
    const x = bbox.x + bbox.width / 2; // Center of the label
    const y = bbox.y; // Top of the label
    setTooltipContent(stateName);
    setTooltipPosition({ x, y });
  };

  const handleLabelLeave = () => {
    setTooltipContent("");
  };

  const getStateFill = (geo: any): string => {
    const rawStateName = geo.properties.name;
    const standardizedName = standardizeStateName(rawStateName);

    if (completedStates.includes(standardizedName)) {
      return hoveredState === standardizedName
        ? STATE_CONFIG.colors.completedHover
        : STATE_CONFIG.colors.completed;
    }
    if (selectedMapState === standardizedName)
      return STATE_CONFIG.colors.selected;
    if (hoveredState === standardizedName) return STATE_CONFIG.colors.hover;
    return STATE_CONFIG.colors.default;
  };

  const projection = geoAlbersUsa();
  const path = geoPath().projection(projection);

  return (
    <MapContainer ref={mapRef}>
      <ComposableMap
        projection="geoAlbersUsa"
        projectionConfig={{
          scale: 1050, // Adjust this value to change map size
        }}
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <ZoomableGroup center={[0, 0]} zoom={1}>
          <Geographies geography={geoUrl}>
            {({ geographies }) => (
              <>
                {geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={getStateFill(geo)}
                    stroke="#000"
                    strokeWidth={0.5}
                    style={{
                      default: {
                        transition: "all 0.3s ease",
                        cursor: "pointer",
                      },
                      hover: {
                        outline: "none",
                        transition: "all 0.3s ease",
                        cursor: "pointer",
                      },
                      pressed: {
                        outline: "none",
                      },
                    }}
                    onMouseEnter={() => {
                      const standardizedName = standardizeStateName(
                        geo.properties.name
                      );
                      onStateHover(standardizedName);
                    }}
                    onMouseLeave={onStateLeave}
                    onClick={(event) => {
                      const standardizedName = standardizeStateName(
                        geo.properties.name
                      );
                      onStateClick(standardizedName, {
                        x: event.clientX,
                        y: event.clientY,
                      });
                    }}
                  />
                ))}

                {geographies.map((geo) => {
                  const rawStateName = geo.properties.name;
                  const standardizedName = standardizeStateName(rawStateName);

                  if (completedStates.includes(standardizedName)) {
                    const centroid = path.centroid(geo);
                    if (centroid) {
                      const adjustedX = centroid[0] - 80; // Move up by 80 units
                      const adjustedY = centroid[1] + 45; // Move left 45 units
                      return (
                        <g key={`label-${standardizedName}`}>
                          <circle
                            cx={adjustedX}
                            cy={adjustedY + 7}
                            r={3}
                            fill="red"
                            style={{ pointerEvents: "none" }}
                          />
                          <StateLabel
                            x={adjustedX}
                            y={adjustedY}
                            onMouseEnter={(e) =>
                              handleLabelHover(e, standardizedName)
                            }
                            onMouseLeave={handleLabelLeave}
                          >
                            {getStateAbbreviation(standardizedName)}
                          </StateLabel>
                        </g>
                      );
                    }
                  }
                  return null;
                })}
              </>
            )}
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>

      {tooltipContent && (
        <Tooltip $x={tooltipPosition.x} $y={tooltipPosition.y}>
          {tooltipContent}
        </Tooltip>
      )}
    </MapContainer>
  );
}
