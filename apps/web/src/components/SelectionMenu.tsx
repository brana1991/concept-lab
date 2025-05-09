import React from 'react';

interface SelectionMenuProps {
  position: { x: number; y: number };
  onHighlight: () => void;
  onNote: () => void;
  onAsk: () => void;
  onCopy: () => void;
  onCancel: () => void;
}

export const SelectionMenu: React.FC<SelectionMenuProps> = ({
  position,
  onHighlight,
  onNote,
  onAsk,
  onCopy,
  onCancel,
}) => {
  return (
    <div
      className="selection-menu"
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      <button onClick={onHighlight} title="Highlight">
        ⭐
      </button>
      <button onClick={onNote} title="Add Note">
        ✍
      </button>
      <button onClick={onAsk} title="Ask AI">
        🤖
      </button>
      <button onClick={onCopy} title="Copy">
        📋
      </button>
      <button onClick={onCancel} title="Cancel" className="cancel">
        ✖
      </button>
    </div>
  );
}; 