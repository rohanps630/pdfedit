import React, { RefObject } from "react";
import { BoxMode } from "../entities";
import { UploadTypes, useUploader } from "../hooks/useUploader";
import { useAttachments } from "../hooks/useAttachments";

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
  width,
  height,
  mode,
  size,
  fontFamily,
  positionTop,
  positionLeft,
  handleMouseDown,
  handleMouseMove,
  handleMouseOut,
  handleMouseUp,
  lineHeight,
}) => {

  const {
    add: addAttachment,
    allPageAttachments,
    pageAttachments,
    reset: resetAttachments,
    update,
    remove,
    setPageIndex,
  } = useAttachments();
  
  const {
    inputRef: imageInput,
    handleClick: handleImageClick,
    onClick: onImageClick,
    upload: uploadImage,
  } = useUploader({
    use: UploadTypes.IMAGE,
    afterUploadAttachment: addAttachment,
  });
  
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
        type="file"
        ref={imageInput}
        readOnly={mode === BoxMode.COMMAND}
        id="image"
        name="image"
        accept="image/*"
        onClick={onImageClick}
        onChange={uploadImage}
      />
    </div>
  );
};
