import React from "react";
import styled from "styled-components";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import { Position } from "../types/ui";
import { STATE_CONFIG } from "./stateConfig";

const MapContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: #fff;
`;

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

interface USAMapProps {
  remainingStates: string[];
  selectedMapState: string;
  hoveredState: string;
  onStateClick: (state: string, position: Position) => void;
  onStateHover: (state: string) => void;
  onStateLeave: () => void;
}

export function USAMap({
  remainingStates,
  selectedMapState,
  hoveredState,
  onStateClick,
  onStateHover,
  onStateLeave,
}: USAMapProps) {
  const getStateFill = (geo: any): string => {
    const stateName = geo.properties.name;
    if (selectedMapState === stateName) return STATE_CONFIG.colors.selected;
    if (hoveredState === stateName) return STATE_CONFIG.colors.hover;
    if (!remainingStates.includes(stateName))
      return STATE_CONFIG.colors.completed;
    return STATE_CONFIG.colors.default;
  };

  return (
    <MapContainer>
      <ComposableMap
        projection="geoAlbersUsa"
        projectionConfig={{
          scale: 1000,
        }}
      >
        <ZoomableGroup>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
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
                  onMouseEnter={() => onStateHover(geo.properties.name)}
                  onMouseLeave={onStateLeave}
                  onClick={(event) =>
                    onStateClick(geo.properties.name, {
                      x: event.clientX,
                      y: event.clientY,
                    })
                  }
                />
              ))
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
    </MapContainer>
  );
}
