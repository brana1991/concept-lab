import React, { useRef, ReactNode, PointerEvent, CSSProperties } from 'react';
import { DialogProvider, useDialogContext } from './context';
import { DialogDirection } from './types';

interface DialogProps {
  children: ReactNode;
  dialogTrigger: ReactNode;
  dismissible?: boolean;
  direction: DialogDirection;
  container?: HTMLDivElement | null;
  snapPoints: string[];
  activeSnapPoint: string | number | null;
  preventCycle?: boolean;
  handleOnly: boolean;
}

export const Dialog: React.FC<DialogProps> = ({
  children,
  dismissible = true,
  container,
  snapPoints,
  activeSnapPoint,
  direction,
  handleOnly = false,
  dialogTrigger,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const dialogHeightRef = useRef(dialogRef.current?.getBoundingClientRect().height || 0);
  const dialogWidthRef = useRef(dialogRef.current?.getBoundingClientRect().width || 0);

  return (
    <DialogProvider
      container={container}
      activeSnapPoint={activeSnapPoint as string}
      snapPoints={snapPoints}
      dismissible={dismissible}
      dialogRef={dialogRef}
      direction={direction}
      dialogHeightRef={dialogHeightRef}
      dialogWidthRef={dialogWidthRef}
      shouldScaleBackground
      handleOnly={handleOnly}
    >
      {children}
      {dialogTrigger}
    </DialogProvider>
  );
};

interface DialogTriggerProps {
  children: ReactNode;
}

export const DialogTrigger: React.FC<DialogTriggerProps> = ({ children }) => {
  const { showDialog } = useDialogContext();
  return <div onClick={showDialog}>{children}</div>;
};

interface DialogContentProps {
  children: ReactNode;
  style?: CSSProperties | undefined;
}

export const DialogContent: React.FC<DialogContentProps> = ({ children, style }) => {
  const {
    dialogRef,
    direction,
    handleOnly,
    onDrag,
    onRelease,
    onPress,
    snapPointsOffset,
    activeSnapPointIndex,
  } = useDialogContext();
  const pointerStartRef = useRef<{ x: number; y: number } | null>(null);
  const lastKnownPointerEventRef = useRef<PointerEvent<HTMLDialogElement> | null>(null);
  const wasBeyondThePointRef = useRef(false);

  const isDeltaInDirection = (
    delta: { x: number; y: number },
    direction: DialogDirection,
    threshold = 0,
  ) => {
    if (wasBeyondThePointRef.current) return true;

    const deltaY = Math.abs(delta.y);
    const deltaX = Math.abs(delta.x);
    const isDeltaX = deltaX > deltaY;
    const dFactor = ['bottom', 'right'].includes(direction) ? 1 : -1;

    if (direction === 'left' || direction === 'right') {
      const isReverseDirection = delta.x * dFactor < 0;
      if (!isReverseDirection && deltaX >= 0 && deltaX <= threshold) {
        return isDeltaX;
      }
    } else {
      const isReverseDirection = delta.y * dFactor < 0;
      if (!isReverseDirection && deltaY >= 0 && deltaY <= threshold) {
        return !isDeltaX;
      }
    }

    wasBeyondThePointRef.current = true;
    return true;
  };

  function handleOnPointerUp(event: React.PointerEvent<HTMLDialogElement> | null) {
    pointerStartRef.current = null;
    wasBeyondThePointRef.current = false;
    onRelease(event);
  }

  return (
    <dialog ref={dialogRef} data-dialog data-dialog-direction={direction}>
      <div
        className="dialog-content"
        style={
          snapPointsOffset && snapPointsOffset.length > 0
            ? ({
                '--snap-point-height': `${snapPointsOffset[activeSnapPointIndex ?? 0]!}px`,
                ...style,
              } as React.CSSProperties)
            : style
        }
        onPointerMove={(event) => {
          lastKnownPointerEventRef.current = event;
          if (handleOnly) return;
          // rest.onPointerMove?.(event);
          if (!pointerStartRef.current) return;
          const yPosition = event.pageY - pointerStartRef.current.y;
          const xPosition = event.pageX - pointerStartRef.current.x;

          const swipeStartThreshold = event.pointerType === 'touch' ? 10 : 2;
          const delta = { x: xPosition, y: yPosition };

          const isAllowedToSwipe = isDeltaInDirection(delta, direction, swipeStartThreshold);
          if (isAllowedToSwipe) onDrag(event);
          else if (
            Math.abs(xPosition) > swipeStartThreshold ||
            Math.abs(yPosition) > swipeStartThreshold
          ) {
            pointerStartRef.current = null;
          }
        }}
        onPointerUp={(event) => {
          // rest.onPointerUp?.(event);
          pointerStartRef.current = null;
          wasBeyondThePointRef.current = false;
          onRelease(event);
        }}
        onPointerDown={(event) => {
          if (handleOnly) return;
          //   rest.onPointerDown?.(event);
          pointerStartRef.current = { x: event.pageX, y: event.pageY };
          onPress(event);
        }}
        onPointerOut={(event) => {
          // rest.onPointerOut?.(event);
          handleOnPointerUp(lastKnownPointerEventRef.current);
        }}
      >
        {children}
      </div>
    </dialog>
  );
};

const LONG_HANDLE_PRESS_TIMEOUT = 250;
const DOUBLE_TAP_TIMEOUT = 120;

interface DialogHandleProps {
  snapPoints: string[];
  activeSnapPoint: string;
  preventCycle?: boolean;
  dismissible: boolean;
  setActiveSnapPoint: React.Dispatch<React.SetStateAction<string | number | null>>;
}

export const DialogHandle = ({
  preventCycle = false,
  activeSnapPoint,
  setActiveSnapPoint,
  snapPoints,
  dismissible,
}: DialogHandleProps) => {
  const closeTimeoutIdRef = useRef<number | null>(null);
  const shouldCancelInteractionRef = useRef(false);
  const { closeDialog, isDragging, handleOnly, onDrag, onPress } = useDialogContext();

  function handleStartInteraction() {
    closeTimeoutIdRef.current = window.setTimeout(() => {
      // Cancel click interaction on a long press
      shouldCancelInteractionRef.current = true;
    }, LONG_HANDLE_PRESS_TIMEOUT);
  }

  function handleCancelInteraction() {
    if (closeTimeoutIdRef.current) {
      window.clearTimeout(closeTimeoutIdRef.current);
    }
    shouldCancelInteractionRef.current = false;
  }

  function handleCycleSnapPoints() {
    // Prevent accidental taps while resizing drawer
    if (isDragging || preventCycle || shouldCancelInteractionRef.current) {
      handleCancelInteraction();
      return;
    }
    // Make sure to clear the timeout id if the user releases the handle before the cancel timeout
    handleCancelInteraction();

    if (!snapPoints || snapPoints.length === 0) {
      if (!dismissible) {
        closeDialog();
      }
      return;
    }

    const isLastSnapPoint = activeSnapPoint === snapPoints[snapPoints.length - 1];

    if (isLastSnapPoint && dismissible) {
      closeDialog();
      return;
    }

    const currentSnapIndex = snapPoints.findIndex((point) => point === activeSnapPoint);
    if (currentSnapIndex === -1) return; // activeSnapPoint not found in snapPoints
    const nextSnapPoint = snapPoints[currentSnapIndex + 1];
    setActiveSnapPoint(nextSnapPoint);
  }

  function handleStartCycle() {
    // Stop if this is the second click of a double click
    if (shouldCancelInteractionRef.current) {
      handleCancelInteraction();
      return;
    }
    window.setTimeout(() => {
      handleCycleSnapPoints();
    }, DOUBLE_TAP_TIMEOUT);
  }

  return (
    <div
      onClick={handleStartCycle}
      onPointerCancel={handleCancelInteraction}
      onPointerDown={(e) => {
        if (handleOnly) onPress(e);
        handleStartInteraction();
      }}
      onPointerMove={(e) => {
        if (handleOnly) onDrag(e);
      }}
      //   ref={ref}
      //   data-dialog-drawer-visible={isOpen ? 'true' : 'false'}
      data-dialog-handle=""
      aria-hidden="true"
      //   {...rest}
    >
      {/* Expand handle's hit area beyond what's visible to ensure a 44x44 tap target for touch devices */}
      <span data-dialog-handle-hitarea="" aria-hidden="true">
        {/* {children} */}
      </span>
    </div>
  );
};
