import {
  createContext,
  PointerEvent,
  ReactNode,
  RefObject,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { DialogDirection } from './types';
import { dampenValue, getTranslate, isVertical, set } from './helpers';
import { CLOSE_THRESHOLD, TRANSITIONS, VELOCITY_THRESHOLD } from './constants';
import { useControllableState } from './use-controllable-state';
import { isIOS } from './browser';

interface DialogContextProps {
  open: boolean;
  showDialog: () => void;
  closeDialog: () => void;
  direction: DialogDirection;
  dialogRef: RefObject<HTMLDialogElement | null>;
  isDragging: boolean;
  handleOnly: boolean;
  snapPointsOffset: number[];
  activeSnapPointIndex: number;
  onPress(event: React.PointerEvent<HTMLDivElement>): void;
  onDrag: (event: PointerEvent<HTMLDivElement | HTMLDialogElement>) => void;
  onRelease(event: PointerEvent<HTMLDialogElement> | null): void;
}

const DialogContext = createContext<DialogContextProps | undefined>(undefined);

export const useDialogContext = (): DialogContextProps => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('useDialogContext must be used within a DialogProvider');
  }
  return context;
};

export interface WithFadeFromProps {
  /**
   * Array of numbers from 0 to 100 that corresponds to % of the screen a given snap point should take up.
   * Should go from least visible. Example `[0.2, 0.5, 0.8]`.
   * You can also use px values, which doesn't take screen height into account.
   */
  snapPoints: (number | string)[];
  /**
   * Index of a `snapPoint` from which the overlay fade should be applied. Defaults to the last snap point.
   */
  fadeFromIndex: number;
}

export interface WithoutFadeFromProps {
  /**
   * Array of numbers from 0 to 100 that corresponds to % of the screen a given snap point should take up.
   * Should go from least visible. Example `[0.2, 0.5, 0.8]`.
   * You can also use px values, which doesn't take screen height into account.
   */
  snapPoints?: (number | string)[];
  fadeFromIndex?: never;
}

interface DialogProviderProps {
  children: ReactNode;
  container?: HTMLDivElement | null;
  snapPoints: string[];
  activeSnapPoint?: number | string | null;
  setActiveSnapPoint?: (snapPoint: number | string | null) => void;
  snapToSequentialPoint?: boolean;
  dismissible: boolean;
  dialogRef: RefObject<HTMLDialogElement | null>;
  direction: DialogDirection;
  dialogWidthRef: React.RefObject<number>;
  dialogHeightRef: React.RefObject<number>;
  shouldScaleBackground: boolean;
  closeThreshold?: number;
  handleOnly: boolean;
}

export const DialogProvider = ({
  children,
  container,
  snapPoints,
  activeSnapPoint,
  dismissible,
  dialogRef,
  direction,
  dialogWidthRef,
  dialogHeightRef,
  fadeFromIndex,
  shouldScaleBackground,
  setActiveSnapPoint,
  closeThreshold = CLOSE_THRESHOLD,
  snapToSequentialPoint = false,
  handleOnly,
}: DialogProviderProps & (WithFadeFromProps | WithoutFadeFromProps)) => {
  const [open, setOpen] = useState(false);
  const activeSnapPointIndex = snapPoints.indexOf(activeSnapPoint as string);

  const closeDialog = useCallback(() => {
    if (dialogRef.current) {
      dialogRef.current.close();
      setOpen(false);
    }
  }, [dialogRef]);

  const { onDrag, isDragging, onPress, onRelease, snapPointsOffset } = useHandleGesture({
    dialogRef,
    container,
    closeDialog,
    activeSnapPointIndex,
    direction,
    dismissible,
    dialogHeightRef,
    dialogWidthRef,
    fadeFromIndex,
    shouldScaleBackground,
    snapPoints,
    activeSnapPoint,
    closeThreshold,
    setActiveSnapPoint,
    snapToSequentialPoint,
  });

  const showDialog = useCallback(() => {
    if (dialogRef.current) {
      dialogRef.current.showModal();
      setOpen(true);
    }
  }, [dialogRef]);

  const handleBackdropClick = useCallback(
    (event: MouseEvent) => {
      if (event.target === dialogRef.current) {
        closeDialog();
      }
    },
    [closeDialog, dialogRef],
  );

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    dialog.addEventListener('click', handleBackdropClick);
    return () => {
      dialog.removeEventListener('click', handleBackdropClick);
    };
  }, [closeDialog, handleBackdropClick, dialogRef]);

  return (
    <DialogContext.Provider
      value={{
        open,
        showDialog,
        closeDialog,
        dialogRef,
        isDragging,
        handleOnly,
        onPress,
        onDrag,
        onRelease,
        direction,
        snapPointsOffset,
        activeSnapPointIndex,
      }}
    >
      {children}
    </DialogContext.Provider>
  );
};

interface UseHandleGestureProps {
  dialogRef: React.RefObject<HTMLDialogElement | null>;
  direction: DialogDirection;
  snapPoints: string[];
  dismissible: boolean;
  activeSnapPointIndex: number;
  dialogHeightRef: React.RefObject<number>;
  dialogWidthRef: React.RefObject<number>;
  fadeFromIndex: number | undefined;
  shouldScaleBackground: boolean;
  container?: HTMLDivElement | null;
  snapToSequentialPoint?: boolean;
  closeThreshold?: number;
  activeSnapPoint?: number | string | null;
  setActiveSnapPoint?: (snapPoint: number | string | null) => void;
  closeDialog: () => void;
}

const useHandleGesture = ({
  dialogRef,
  direction,
  snapPoints,
  dismissible,
  activeSnapPointIndex,
  dialogHeightRef,
  dialogWidthRef,
  fadeFromIndex,
  shouldScaleBackground = false,
  container,
  closeDialog,
  snapToSequentialPoint = false,
  closeThreshold = CLOSE_THRESHOLD,
  activeSnapPoint: activeSnapPointProp,
  setActiveSnapPoint: setActiveSnapPointProp,
}: UseHandleGestureProps) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartTime = useRef<Date | null>(null);
  const dragEndTime = useRef<Date | null>(null);
  // const [justReleased, setJustReleased] = useState<boolean>(false);
  const pointerStart = useRef(0);
  const lastTimeDragPrevented = useRef<Date | null>(null);
  const isAllowedToDrag = useRef<boolean>(false);
  const openTime = useRef<Date | null>(null);

  const [windowDimensions, setWindowDimensions] = useState(
    typeof window !== 'undefined'
      ? {
          innerWidth: window.innerWidth,
          innerHeight: window.innerHeight,
        }
      : undefined,
  );

  useEffect(() => {
    function onResize() {
      setWindowDimensions({
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
      });
    }
    window.addEventListener('resize', onResize);

    return () => window.removeEventListener('resize', onResize);
  }, []);

  const [activeSnapPoint, setActiveSnapPoint] = useControllableState<string | number | null>({
    prop: activeSnapPointProp,
    defaultProp: snapPoints?.[0],
    onChange: setActiveSnapPointProp,
  });

  const isLastSnapPoint = useMemo(
    () => activeSnapPoint === snapPoints?.[snapPoints.length - 1] || null,
    [snapPoints, activeSnapPoint],
  );

  const snapPointsOffset = useMemo(() => {
    const containerSize = container
      ? {
          width: container.getBoundingClientRect().width,
          height: container.getBoundingClientRect().height,
        }
      : typeof window !== 'undefined'
      ? { width: window.innerWidth, height: window.innerHeight }
      : { width: 0, height: 0 };

    return (
      snapPoints?.map((snapPoint) => {
        const isPx = typeof snapPoint === 'string';
        let snapPointAsNumber = 0;

        if (isPx) {
          snapPointAsNumber = parseInt(snapPoint, 10);
        }

        if (isVertical(direction)) {
          const height = isPx
            ? snapPointAsNumber
            : windowDimensions
            ? snapPoint * containerSize.height
            : 0;

          if (windowDimensions) {
            return direction === 'bottom'
              ? containerSize.height - height
              : -containerSize.height + height;
          }

          return height;
        }
        const width = isPx
          ? snapPointAsNumber
          : windowDimensions
          ? snapPoint * containerSize.width
          : 0;

        if (windowDimensions) {
          return direction === 'right' ? containerSize.width - width : -containerSize.width + width;
        }

        return width;
      }) ?? []
    );
  }, [snapPoints, windowDimensions, container, direction]);

  const activeSnapPointOffset = useMemo(
    () => (activeSnapPointIndex !== null ? snapPointsOffset?.[activeSnapPointIndex] : null),
    [snapPointsOffset, activeSnapPointIndex],
  );

  const onSnapPointChange = useCallback(
    (activeSnapPointIndex: number) => {
      // Change openTime ref when we reach the last snap point to prevent dragging for 500ms incase it's scrollable.
      if (snapPoints && activeSnapPointIndex === snapPointsOffset.length - 1)
        openTime.current = new Date();
    },
    [snapPoints, snapPointsOffset.length],
  );

  const snapToPoint = useCallback(
    (dimension: number) => {
      const newSnapPointIndex =
        snapPointsOffset?.findIndex((snapPointDim) => snapPointDim === dimension) ?? null;
      onSnapPointChange(newSnapPointIndex);

      set(dialogRef.current, {
        transition: `transform ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(
          ',',
        )})`,
        transform: isVertical(direction)
          ? `translate3d(0, ${dimension}px, 0)`
          : `translate3d(${dimension}px, 0, 0)`,
      });

      // if (
      //   snapPointsOffset &&
      //   newSnapPointIndex !== snapPointsOffset.length - 1 &&
      //   fadeFromIndex !== undefined &&
      //   newSnapPointIndex !== fadeFromIndex &&
      //   newSnapPointIndex < fadeFromIndex
      // ) {
      //   set(overlayRef.current, {
      //     transition: `opacity ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(
      //       ',',
      //     )})`,
      //     opacity: '0',
      //   });
      // } else {
      //   set(overlayRef.current, {
      //     transition: `opacity ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(
      //       ',',
      //     )})`,
      //     opacity: '1',
      //   });
      // }

      setActiveSnapPoint(snapPoints?.[Math.max(newSnapPointIndex, 0)]);
    },
    [
      dialogRef,
      snapPoints,
      snapPointsOffset,
      // fadeFromIndex,
      // overlayRef,
      setActiveSnapPoint,
      direction,
      onSnapPointChange,
    ],
  );

  const shouldFade =
    (snapPoints &&
      snapPoints.length > 0 &&
      (fadeFromIndex || fadeFromIndex === 0) &&
      !Number.isNaN(fadeFromIndex) &&
      snapPoints[fadeFromIndex] === activeSnapPoint) ||
    !snapPoints;

  function shouldDrag(el: EventTarget, isDraggingInDirection: boolean) {
    let element = el as HTMLElement;
    const highlightedText = window.getSelection()?.toString();
    const swipeAmount = dialogRef.current ? getTranslate(dialogRef.current, direction) : null;
    const date = new Date();

    // Fixes https://github.com/emilkowalski/vaul/issues/483
    if (element.tagName === 'SELECT') {
      return false;
    }

    if (element.hasAttribute('data-vaul-no-drag') || element.closest('[data-vaul-no-drag]')) {
      return false;
    }

    if (direction === 'right' || direction === 'left') {
      return true;
    }

    // Allow scrolling when animating
    if (openTime.current && date.getTime() - openTime.current.getTime() < 500) {
      return false;
    }

    if (swipeAmount !== null) {
      if (direction === 'bottom' ? swipeAmount > 0 : swipeAmount < 0) {
        return true;
      }
    }

    // Don't drag if there's highlighted text
    if (highlightedText && highlightedText.length > 0) {
      return false;
    }

    // Disallow dragging if drawer was scrolled within `scrollLockTimeout`
    if (
      lastTimeDragPrevented.current &&
      date.getTime() - lastTimeDragPrevented.current.getTime() < 100 &&
      // date.getTime() - lastTimeDragPrevented.current.getTime() < scrollLockTimeout &&
      swipeAmount === 0
    ) {
      lastTimeDragPrevented.current = date;
      return false;
    }

    if (isDraggingInDirection) {
      lastTimeDragPrevented.current = date;

      // We are dragging down so we should allow scrolling
      return false;
    }

    // Keep climbing up the DOM tree as long as there's a parent
    while (element) {
      // Check if the element is scrollable
      if (element.scrollHeight > element.clientHeight) {
        if (element.scrollTop !== 0) {
          lastTimeDragPrevented.current = new Date();

          // The element is scrollable and not scrolled to the top, so don't drag
          return false;
        }

        if (element.getAttribute('role') === 'dialog') {
          return true;
        }
      }

      // Move up to the parent element
      element = element.parentNode as HTMLElement;
    }

    // No scrollable parents not scrolled to the top found, so drag
    return true;
  }

  function getPercentageDragged(absDraggedDistance: number, isDraggingDown: boolean) {
    if (
      !snapPoints ||
      typeof activeSnapPointIndex !== 'number' ||
      !snapPointsOffset ||
      fadeFromIndex === undefined
    )
      return null;

    // If this is true we are dragging to a snap point that is supposed to have an overlay
    const isOverlaySnapPoint = activeSnapPointIndex === fadeFromIndex - 1;
    const isOverlaySnapPointOrHigher = activeSnapPointIndex >= fadeFromIndex;

    if (isOverlaySnapPointOrHigher && isDraggingDown) {
      return 0;
    }

    // Don't animate, but still use this one if we are dragging away from the overlaySnapPoint
    if (isOverlaySnapPoint && !isDraggingDown) return 1;
    if (!shouldFade && !isOverlaySnapPoint) return null;

    // Either fadeFrom index or the one before
    const targetSnapPointIndex = isOverlaySnapPoint
      ? activeSnapPointIndex + 1
      : activeSnapPointIndex - 1;

    // Get the distance from overlaySnapPoint to the one before or vice-versa to calculate the opacity percentage accordingly
    const snapPointDistance = isOverlaySnapPoint
      ? snapPointsOffset[targetSnapPointIndex] - snapPointsOffset[targetSnapPointIndex - 1]
      : snapPointsOffset[targetSnapPointIndex + 1] - snapPointsOffset[targetSnapPointIndex];

    const percentageDragged = absDraggedDistance / Math.abs(snapPointDistance);

    if (isOverlaySnapPoint) {
      return 1 - percentageDragged;
    } else {
      return percentageDragged;
    }
  }

  function resetDialog() {
    if (!dialogRef.current) return;
    const wrapper = document.querySelector('[data-vaul-drawer-wrapper]');
    const currentSwipeAmount = getTranslate(dialogRef.current, direction);

    set(dialogRef.current, {
      transform: 'translate3d(0, 0, 0)',
      transition: `transform ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(',')})`,
    });

    set(overlayRef.current, {
      transition: `opacity ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(',')})`,
      opacity: '1',
    });

    // Don't reset background if swiped upwards
    if (shouldScaleBackground && currentSwipeAmount && currentSwipeAmount > 0 && isOpen) {
      set(
        wrapper,
        {
          borderRadius: `${BORDER_RADIUS}px`,
          overflow: 'hidden',
          ...(isVertical(direction)
            ? {
                transform: `scale(${getScale()}) translate3d(0, calc(env(safe-area-inset-top) + 14px), 0)`,
                transformOrigin: 'top',
              }
            : {
                transform: `scale(${getScale()}) translate3d(calc(env(safe-area-inset-top) + 14px), 0, 0)`,
                transformOrigin: 'left',
              }),
          transitionProperty: 'transform, border-radius',
          transitionDuration: `${TRANSITIONS.DURATION}s`,
          transitionTimingFunction: `cubic-bezier(${TRANSITIONS.EASE.join(',')})`,
        },
        true,
      );
    }
  }

  function cancelDrag() {
    if (!isDragging || !dialogRef.current) return;

    dialogRef.current.classList.remove('dragging');
    isAllowedToDrag.current = false;
    setIsDragging(false);
    dragEndTime.current = new Date();
  }

  function onReleaseSnapPoint({
    draggedDistance,
    closeDialog,
    velocity,
    dismissible,
  }: {
    draggedDistance: number;
    closeDialog: () => void;
    velocity: number;
    dismissible: boolean;
  }) {
    if (fadeFromIndex === undefined) return;

    const currentPosition =
      direction === 'bottom' || direction === 'right'
        ? (activeSnapPointOffset ?? 0) - draggedDistance
        : (activeSnapPointOffset ?? 0) + draggedDistance;
    const isOverlaySnapPoint = activeSnapPointIndex === fadeFromIndex - 1;
    const isFirst = activeSnapPointIndex === 0;
    const hasDraggedUp = draggedDistance > 0;

    // if (isOverlaySnapPoint) {
    //   set(overlayRef.current, {
    //     transition: `opacity ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(',')})`,
    //   });
    // }

    if (!snapToSequentialPoint && velocity > 2 && !hasDraggedUp) {
      if (dismissible) closeDialog();
      else snapToPoint(snapPointsOffset[0]); // snap to initial point
      return;
    }

    if (!snapToSequentialPoint && velocity > 2 && hasDraggedUp && snapPointsOffset && snapPoints) {
      snapToPoint(snapPointsOffset[snapPoints.length - 1] as number);
      return;
    }

    // Find the closest snap point to the current position
    const closestSnapPoint = snapPointsOffset?.reduce((prev, curr) => {
      if (typeof prev !== 'number' || typeof curr !== 'number') return prev;

      return Math.abs(curr - currentPosition) < Math.abs(prev - currentPosition) ? curr : prev;
    });

    const dim = isVertical(direction) ? window.innerHeight : window.innerWidth;
    if (velocity > VELOCITY_THRESHOLD && Math.abs(draggedDistance) < dim * 0.4) {
      const dragDirection = hasDraggedUp ? 1 : -1; // 1 = up, -1 = down

      // Don't do anything if we swipe upwards while being on the last snap point
      if (dragDirection > 0 && isLastSnapPoint && snapPoints) {
        snapToPoint(snapPointsOffset[snapPoints.length - 1]);
        return;
      }

      if (isFirst && dragDirection < 0 && dismissible) {
        closeDialog();
      }

      if (activeSnapPointIndex === null) return;

      snapToPoint(snapPointsOffset[activeSnapPointIndex + dragDirection]);
      return;
    }

    snapToPoint(closestSnapPoint);
  }

  function onRelease(event: PointerEvent<HTMLDivElement> | null) {
    if (!isDragging || !dialogRef.current) return;

    dialogRef.current.classList.remove('dragging');
    isAllowedToDrag.current = false;
    setIsDragging(false);
    dragEndTime.current = new Date();
    const swipeAmount = getTranslate(dialogRef.current, direction);

    if (!event || !shouldDrag(event.target, false) || !swipeAmount || Number.isNaN(swipeAmount))
      return;

    if (dragStartTime.current === null) return;

    const timeTaken = dragEndTime.current.getTime() - dragStartTime.current.getTime();
    const distMoved = pointerStart.current - (isVertical(direction) ? event.pageY : event.pageX);
    const velocity = Math.abs(distMoved) / timeTaken;

    // if (velocity > 0.05) {
    //   // `justReleased` is needed to prevent the drawer from focusing on an input when the drag ends, as it's not the intent most of the time.
    //   setJustReleased(true);

    //   setTimeout(() => {
    //     setJustReleased(false);
    //   }, 200);
    // }

    if (snapPoints) {
      const directionMultiplier = direction === 'bottom' || direction === 'right' ? 1 : -1;
      onReleaseSnapPoint({
        draggedDistance: distMoved * directionMultiplier,
        closeDialog,
        velocity,
        dismissible,
      });
      // onReleaseProp?.(event, true);
      return;
    }

    // Moved upwards, don't do anything
    if (direction === 'bottom' || direction === 'right' ? distMoved > 0 : distMoved < 0) {
      resetDialog();
      // onReleaseProp?.(event, true);
      return;
    }

    // if (velocity > VELOCITY_THRESHOLD) {
    if (velocity > 0.4) {
      closeDialog();
      // onReleaseProp?.(event, false);
      return;
    }

    const visibleDrawerHeight = Math.min(
      dialogRef.current.getBoundingClientRect().height ?? 0,
      window.innerHeight,
    );
    const visibleDrawerWidth = Math.min(
      dialogRef.current.getBoundingClientRect().width ?? 0,
      window.innerWidth,
    );

    const isHorizontalSwipe = direction === 'left' || direction === 'right';
    if (
      Math.abs(swipeAmount) >=
      (isHorizontalSwipe ? visibleDrawerWidth : visibleDrawerHeight) * closeThreshold
    ) {
      closeDialog();
      // onReleaseProp?.(event, false);
      return;
    }

    // onReleaseProp?.(event, true);
    resetDialog();
  }

  function onDragSnapPoints({ draggedDistance }: { draggedDistance: number }) {
    if (activeSnapPointOffset === null) return;
    const newValue =
      direction === 'bottom' || direction === 'right'
        ? activeSnapPointOffset - draggedDistance
        : activeSnapPointOffset + draggedDistance;

    // Don't do anything if we exceed the last(biggest) snap point
    if (
      (direction === 'bottom' || direction === 'right') &&
      newValue < snapPointsOffset[snapPointsOffset.length - 1]
    ) {
      return;
    }
    if (
      (direction === 'top' || direction === 'left') &&
      newValue > snapPointsOffset[snapPointsOffset.length - 1]
    ) {
      return;
    }

    set(dialogRef.current, {
      transform: isVertical(direction)
        ? `translate3d(0, ${newValue}px, 0)`
        : `translate3d(${newValue}px, 0, 0)`,
    });
  }

  function getScale() {
    return (window.innerWidth - 26) / window.innerWidth;
  }

  function onDrag(event: PointerEvent<HTMLDivElement | HTMLDialogElement>) {
    if (!dialogRef.current) {
      return;
    }

    // We need to know how much of the drawer has been dragged in percentages so that we can transform background accordingly
    if (isDragging) {
      const directionMultiplier = direction === 'bottom' || direction === 'right' ? 1 : -1;
      const draggedDistance =
        (pointerStart.current - (isVertical(direction) ? event.pageY : event.pageX)) *
        directionMultiplier;
      const isDraggingInDirection = draggedDistance > 0;

      // Pre condition for disallowing dragging in the close direction.
      const noCloseSnapPointsPreCondition = snapPoints && !dismissible && !isDraggingInDirection;

      // Disallow dragging down to close when first snap point is the active one and dismissible prop is set to false.
      if (noCloseSnapPointsPreCondition && activeSnapPointIndex === 0) return;

      // We need to capture last time when drag with scroll was triggered and have a timeout between
      const absDraggedDistance = Math.abs(draggedDistance);
      const wrapper = document.querySelector('[data-vaul-drawer-wrapper]');
      const drawerDimension =
        direction === 'bottom' || direction === 'top'
          ? dialogHeightRef.current
          : dialogWidthRef.current;

      // Calculate the percentage dragged, where 1 is the closed position
      let percentageDragged = absDraggedDistance / drawerDimension;
      const snapPointPercentageDragged = getPercentageDragged(
        absDraggedDistance,
        isDraggingInDirection,
      );

      if (snapPointPercentageDragged !== null) {
        percentageDragged = snapPointPercentageDragged;
      }

      // Disallow close dragging beyond the smallest snap point.
      if (noCloseSnapPointsPreCondition && percentageDragged >= 1) {
        return;
      }

      if (!isAllowedToDrag.current && !shouldDrag(event.target, isDraggingInDirection)) return;
      dialogRef.current.classList.add('dragging');
      // If shouldDrag gave true once after pressing down on the drawer, we set isAllowedToDrag to true and it will remain true until we let go, there's no reason to disable dragging mid way, ever, and that's the solution to it
      isAllowedToDrag.current = true;
      set(dialogRef.current, {
        transition: 'none',
      });

      //   set(overlayRef.current, {
      //     transition: 'none',
      //   });

      if (snapPoints) {
        onDragSnapPoints({ draggedDistance });
      }

      // Run this only if snapPoints are not defined or if we are at the last snap point (highest one)
      if (isDraggingInDirection && !snapPoints) {
        const dampenedDraggedDistance = dampenValue(draggedDistance);

        const translateValue = Math.min(dampenedDraggedDistance * -1, 0) * directionMultiplier;
        set(dialogRef.current, {
          transform: isVertical(direction)
            ? `translate3d(0, ${translateValue}px, 0)`
            : `translate3d(${translateValue}px, 0, 0)`,
        });
        return;
      }

      const opacityValue = 1 - percentageDragged;

      //   if (shouldFade || (fadeFromIndex && activeSnapPointIndex === fadeFromIndex - 1)) {
      //     onDragProp?.(event, percentageDragged);

      //     set(
      //       overlayRef.current,
      //       {
      //         opacity: `${opacityValue}`,
      //         transition: 'none',
      //       },
      //       true,
      //     );
      //   }

      // if (wrapper && overlayRef.current && shouldScaleBackground) {
      if (wrapper && shouldScaleBackground) {
        // Calculate percentageDragged as a fraction (0 to 1)
        const scaleValue = Math.min(getScale() + percentageDragged * (1 - getScale()), 1);
        const borderRadiusValue = 8 - percentageDragged * 8;

        const translateValue = Math.max(0, 14 - percentageDragged * 14);

        set(
          wrapper,
          {
            borderRadius: `${borderRadiusValue}px`,
            transform: isVertical(direction)
              ? `scale(${scaleValue}) translate3d(0, ${translateValue}px, 0)`
              : `scale(${scaleValue}) translate3d(${translateValue}px, 0, 0)`,
            transition: 'none',
          },
          true,
        );
      }

      if (!snapPoints) {
        const translateValue = absDraggedDistance * directionMultiplier;

        set(dialogRef.current, {
          transform: isVertical(direction)
            ? `translate3d(0, ${translateValue}px, 0)`
            : `translate3d(${translateValue}px, 0, 0)`,
        });
      }
    }
  }

  function onPress(event: React.PointerEvent<HTMLDivElement>) {
    if (!dismissible && !snapPoints) return;
    if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) return;

    dialogHeightRef.current = dialogRef.current?.getBoundingClientRect().height || 0;
    dialogWidthRef.current = dialogRef.current?.getBoundingClientRect().width || 0;
    setIsDragging(true);
    dragStartTime.current = new Date();

    // iOS doesn't trigger mouseUp after scrolling so we need to listen to touched in order to disallow dragging
    if (isIOS()) {
      window.addEventListener('touchend', () => (isAllowedToDrag.current = false), { once: true });
    }
    // Ensure we maintain correct pointer capture even when going outside of the drawer
    (event.target as HTMLElement).setPointerCapture(event.pointerId);

    pointerStart.current = isVertical(direction) ? event.pageY : event.pageX;
  }

  return { onDrag, onPress, onRelease, isDragging, snapPointsOffset };
};
