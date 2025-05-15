import { Dialog, DialogContent, DialogHandle, DialogTrigger } from './modal';
import './App.css';
import { useState } from 'react';

const snapPoints = ['148px', '355px'];

function App() {
  const [snap, setSnap] = useState<number | string | null>(snapPoints[0]);
  const [parent, setParent] = useState<HTMLDivElement | null>(null);

  return (
    <>
      <div ref={setParent}>
        <Dialog
          container={parent}
          snapPoints={snapPoints}
          activeSnapPoint={snap}
          dismissible
          direction="bottom"
          handleOnly={true}
          dialogTrigger={
            <DialogTrigger>
              <button>Open Dialog</button>
            </DialogTrigger>
          }
        >
          <DialogContent>
            <DialogHandle
              snapPoints={snapPoints}
              activeSnapPoint={snap as string}
              setActiveSnapPoint={setSnap}
              dismissible
            />
            <h2>Dialog Title</h2>
            <p>This is the dialog content.</p>
            <button>Close</button>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}

export default App;
