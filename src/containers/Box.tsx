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
  width,
  height,
  size,
  pageHeight,
  pageWidth,
  updateBoxAttachment,
}: BoxAttachment & Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
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
      UpdateInput();
    }
  };

  const UpdateInput = () => {
    // Deselect any selection when returning to command mode
    document.getSelection()?.removeAllRanges();

    updateBoxAttachment({

    });
  };

  // const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const value = event.currentTarget.value;

  //   console.log("onChange value")
  //   console.log(value)
  //   // updateBoxAttachment({ ...upload });
  // };

  const onChange = (newAttachment: Attachment) => {

    console.log("onChange newAttachment")
    console.log(newAttachment)
    // updateBoxAttachment({ ...newAttachment, type: 'box' });
    updateBoxAttachment({ ...newAttachment });
  };

  return (
    <BoxComponent
      width={width}
      height={height}
      mode={boxMode}
      size={size}
      inputRef={inputRef}
      positionTop={positionTop}
      // onChange={onChange}
      onChangeImage={onChange}
      positionLeft={positionLeft}
      handleMouseUp={handleMouseUp}
      handleMouseOut={handleMouseOut}
      handleMouseDown={handleMousedown}
      handleMouseMove={handleMouseMove}
    />
  );
};
