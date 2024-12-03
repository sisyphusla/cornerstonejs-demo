import { useEffect, useRef, useState } from "react";
import { initializeCornerstoneCore } from '../../lib/cornerstoneInit';
import { setupTools } from '../../lib/toolsSetup';
import { setupRendering } from '../../lib/renderingSetup';
import { useViewerEvents } from '../../hook/useViewerEvents';
import { ImageCanvas } from './ImageCanvas';
import { ViewerOverlay } from './ViewerOverlay';

interface CTViewerProps {
  studyInstanceUID: string;
  seriesInstanceUID: string;
  wadoRsRoot: string;
  width?: string | number;
  height?: string | number;
}

export function Viewer({
  studyInstanceUID,
  seriesInstanceUID,
  wadoRsRoot,
  width = "512px",
  height = "512px"
}: CTViewerProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const running = useRef(false);
  const renderingEngineRef = useRef(null);
  const [imageIds, setImageIds] = useState<string[]>([]);
  
  const [imageSliceData, setImageSliceData] = useState({
    imageIndex: 0,
    numberOfSlices: 0,
    instanceNumber: null
  });
  
  const [voi, setVOI] = useState({
    windowCenter: 40,
    windowWidth: 400,
  });

  useViewerEvents({
    elementRef,
    renderingEngine: renderingEngineRef.current,
    imageIds,
    setImageSliceData,
    setVOI
  });

  useEffect(() => {
    const setup = async () => {
      if (!elementRef.current || running.current) return;
      running.current = true;

      try {
        await initializeCornerstoneCore();

        const { renderingEngine, imageIds: newImageIds } = await setupRendering({
          element: elementRef.current,
          studyInstanceUID,
          seriesInstanceUID,
          wadoRsRoot,
        });

        renderingEngineRef.current = renderingEngine;
        setImageIds(newImageIds);

        setImageSliceData(prev => ({
          ...prev,
          numberOfSlices: newImageIds.length
        }));

        setupTools({
          element: elementRef.current,
        });

        renderingEngine.render();

      } catch (error) {
        console.error('Error setting up viewer:', error);
        running.current = false;
      }
    };

    setup();
  }, [studyInstanceUID, seriesInstanceUID, wadoRsRoot]);

  return (
    <div className="relative" style={{ width, height }}>  
      <ImageCanvas 
        elementRef={elementRef}
      />
      <ViewerOverlay 
        sliceData={imageSliceData}
        voiData={voi}
      />
    </div>
  );
}