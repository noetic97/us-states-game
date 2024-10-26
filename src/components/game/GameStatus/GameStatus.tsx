import React from "react";
import styled from "styled-components";
import { Trophy } from "lucide-react";

const StatusContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ScoreContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
`;

const MessageText = styled.div<{ type: "success" | "error" | "info" }>`
  text-align: center;
  font-weight: 500;
  color: ${(props) => {
    switch (props.type) {
      case "success":
        return "#16a34a";
      case "error":
        return "#dc2626";
      default:
        return "#4b5563";
    }
  }};
`;

interface GameStatusProps {
  score: number;
  message: string;
  messageType: "success" | "error" | "info";
}

export function GameStatus({ score, message, messageType }: GameStatusProps) {
  return (
    <StatusContainer>
      <ScoreContainer>
        <Trophy size={24} />
        <span>{score} points</span>
      </ScoreContainer>
      <MessageText type={messageType}>{message}</MessageText>
    </StatusContainer>
  );
}
