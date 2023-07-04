import React, { RefObject } from "react";
import { BoxMode } from "../entities";

interface Props {
  inputRef: RefObject<HTMLInputElement>;
  text?: string;
  mode: string;
  width: number;
  size?: number;
  height: number;
  lineHeight?: number;
  fontFamily?: string;
  positionTop: number;
  positionLeft: number;
  handleMouseDown: DragEventListener<HTMLDivElement>;
  handleMouseUp: DragEventListener<HTMLDivElement>;
  handleMouseMove: DragEventListener<HTMLDivElement>;
  handleMouseOut: DragEventListener<HTMLDivElement>;
  onChangeText: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Box: React.FC<Props> = ({
  text,
  width,
  height,
  inputRef,
  mode,
  size,
  fontFamily,
  positionTop,
  positionLeft,
  onChangeText,
  handleMouseDown,
  handleMouseMove,
  handleMouseOut,
  handleMouseUp,
  lineHeight,
}) => {
  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseOut={handleMouseOut}
      style={{
        width,
        border: 1,
        height,
        fontFamily,
        fontSize: size,
        lineHeight,
        top: positionTop,
        left: positionLeft,
        borderColor: "gray",
        borderStyle: "solid",
        wordWrap: "break-word",
        padding: 0,
        position: "absolute",
        cursor: mode === BoxMode.COMMAND ? "move" : "default",
      }}
    >
      <input
        type="text"
        ref={inputRef}
        onChange={onChangeText}
        readOnly={mode === BoxMode.COMMAND}
        style={{
          width: "100%",
          borderStyle: "none",
          borderWidth: 0,
          fontFamily,
          fontSize: size,
          outline: "none",
          padding: 0,
          boxSizing: "border-box",
          lineHeight,
          height,
          margin: 0,
          // backgroundColor: 'transparent',
          backgroundColor: "black",
          cursor: mode === BoxMode.COMMAND ? "move" : "text",
        }}
        value={text}
      />
    </div>
  );
};
