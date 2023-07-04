import React, { useState, useRef, useEffect } from 'react';
import { Box as BoxComponent } from '../components/Box';
import { getMovePosition } from '../utils/helpers';
import { BoxMode, DragActions } from '../entities';

interface Props {
  pageWidth: number;
  pageHeight: number;
  updateBoxAttachment: (boxObject: Partial<TextAttachment>) => void;
}

export const Box = ({
  x,
  y,
  text,
  width,
  height,
  size,
  pageHeight,
  pageWidth,
  updateBoxAttachment,
}: TextAttachment & Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [content, setContent] = useState(text || '');
  const [mouseDown, setMouseDown] = useState(false);
  const [positionTop, setPositionTop] = useState(y);
  const [positionLeft, setPositionLeft] = useState(x);
  const [operation, setOperation] = useState<DragActions>(
    DragActions.NO_MOVEMENT
  );
  const [boxMode, setBoxMode] = useState<BoxMode>(BoxMode.COMMAND);

  useEffect(() => {
    console.log("positionTop: ", positionTop);
    console.log("positionLeft: ", positionLeft);
  }, [positionTop, positionLeft])
  

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();

    if (mouseDown) {
      const { top, left } = getMovePosition(
        positionLeft,
        positionTop,
        event.movementX,
        event.movementY,
        width,
        height,
        pageWidth,
        pageHeight
      );

      setPositionTop(top);
      setPositionLeft(left);
    }
  };

  const handleMousedown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (boxMode !== BoxMode.COMMAND) {
      return;
    }

    setMouseDown(true);
    setOperation(DragActions.MOVE);
  };

  const handleMouseUp = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();

    if (boxMode !== BoxMode.COMMAND) {
      return;
    }

    setMouseDown(false);

    if (operation === DragActions.MOVE) {
      const { top, left } = getMovePosition(
        positionLeft,
        positionTop,
        event.movementX,
        event.movementY,
        width,
        height,
        pageWidth,
        pageHeight
      );

      updateBoxAttachment({
        x: left,
        y: top,
      });
    }

    // if (operation === DragActions.SCALE) {
    //     updateboxObject({
    //         x: positionLeft,
    //         y: positionTop,
    //     });

    // }

    setOperation(DragActions.NO_MOVEMENT);
  };

  const handleMouseOut = (event: React.MouseEvent<HTMLDivElement>) => {
    if (operation === DragActions.MOVE) {
      handleMouseUp(event);
    }

    if (boxMode === BoxMode.INSERT) {
      setBoxMode(BoxMode.COMMAND);
      prepareTextAndUpdate();
    }
  };

  const prepareTextAndUpdate = () => {
    // Deselect any selection when returning to command mode
    document.getSelection()?.removeAllRanges();

    const lines = [content];
    updateBoxAttachment({
      lines,
      text: content,
    });
  };

  const onChangeText = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setContent(value);
  };

  return (
    <BoxComponent
      text={content}
      width={width}
      height={height}
      mode={boxMode}
      size={size}
      inputRef={inputRef}
      positionTop={positionTop}
      onChangeText={onChangeText}
      positionLeft={positionLeft}
      handleMouseUp={handleMouseUp}
      handleMouseOut={handleMouseOut}
      handleMouseDown={handleMousedown}
      handleMouseMove={handleMouseMove}
    />
  );
};
