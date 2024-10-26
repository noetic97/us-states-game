import React from "react";
import styled from "styled-components";
import { X } from "lucide-react";
import { Position } from "../types/ui";

const InputContainer = styled.div<{ position: Position }>`
  position: fixed;
  left: ${(props) => props.position.x}px;
  top: ${(props) => props.position.y}px;
  background-color: white;
  padding: 8px;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  border: 2px solid #e5e7eb;
  z-index: 1000;
  display: flex;
  gap: 8px;
`;

const StyledInput = styled.input`
  padding: 6px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  width: 200px;

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 1px #3b82f6;
  }
`;

const ActionButton = styled.button`
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
`;

const SubmitButton = styled(ActionButton)`
  background-color: #3b82f6;
  color: white;
  border: none;

  &:hover {
    background-color: #2563eb;
  }
`;

const CloseButton = styled(ActionButton)`
  background-color: transparent;
  border: none;
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #f3f4f6;
  }
`;

interface HardModeInputProps {
  position: Position;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onClose: () => void;
}

export function HardModeInput({
  position,
  value,
  onChange,
  onSubmit,
  onClose,
}: HardModeInputProps) {
  return (
    <InputContainer position={position}>
      <StyledInput
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type state name..."
        autoFocus
        onKeyDown={(e) => e.key === "Enter" && onSubmit()}
      />
      <SubmitButton onClick={onSubmit}>Submit</SubmitButton>
      <CloseButton onClick={onClose}>
        <X size={16} />
      </CloseButton>
    </InputContainer>
  );
}
