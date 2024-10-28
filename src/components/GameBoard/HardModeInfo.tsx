import React from "react";
import styled from "styled-components";

// Types
interface HardModeInfoProps {
  completedCount: number;
}

// Styled Components
const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const InfoCard = styled.div<{ $variant?: "blue" | "gray" | "green" }>`
  padding: 16px;
  border-radius: 8px;
  background-color: ${(props) => {
    switch (props.$variant) {
      case "blue":
        return "#EFF6FF";
      case "green":
        return "#F0FDF4";
      default:
        return "#F9FAFB";
    }
  }};
`;

const CardTitle = styled.h3`
  font-weight: 600;
  margin-bottom: 8px;
`;

const CardText = styled.p`
  font-size: 14px;
  color: #4b5563;
`;

const ProgressBar = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ProgressTrack = styled.div`
  flex: 1;
  height: 8px;
  background-color: #e5e7eb;
  border-radius: 9999px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ $progress: number }>`
  height: 100%;
  border-radius: 9999px;
  background-color: #3b82f6;
  width: ${(props) => props.$progress}%;
  transition: width 0.3s ease-in-out;
`;

const ProgressText = styled.span`
  font-size: 14px;
  color: #4b5563;
`;

const TipsList = styled.ul`
  font-size: 14px;
  color: #4b5563;
  list-style-type: disc;
  list-style-position: inside;
`;

const TipItem = styled.li`
  margin-bottom: 4px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const HardModeInfo: React.FC<HardModeInfoProps> = ({
  completedCount,
}) => {
  const progressPercentage = (completedCount / 50) * 100;

  return (
    <InfoSection>
      <InfoCard $variant="blue">
        <CardTitle>Hard Mode</CardTitle>
        <CardText>
          Click on a state and type its name correctly to earn points.
        </CardText>
      </InfoCard>

      <InfoCard $variant="gray">
        <CardTitle>Progress</CardTitle>
        <ProgressBar>
          <ProgressTrack>
            <ProgressFill $progress={progressPercentage} />
          </ProgressTrack>
          <ProgressText>{completedCount}/50</ProgressText>
        </ProgressBar>
      </InfoCard>

      <InfoCard $variant="green">
        <CardTitle>Tips</CardTitle>
        <TipsList>
          <TipItem>Spelling matters!</TipItem>
          <TipItem>State names are case-insensitive</TipItem>
          <TipItem>Press Enter to submit</TipItem>
        </TipsList>
      </InfoCard>
    </InfoSection>
  );
};
