import { useEffect, useRef, useState } from "react";
import { initializeCornerstoneCore } from '../../lib/cornerstoneInit';
import { setupTools } from '../../lib/toolsSetup';
import { setupRendering } from '../../lib/renderingSetup';
import { ToolGroupManager } from '../../lib/cornerstoneInit';
import { Enums, metaData, utilities } from '@cornerstonejs/core';
import { ViewerContainer } from './ViewerContainer';
import { ViewerOverlay } from './ViewerOverlay';

// Types
interface CTViewerProps {
  studyInstanceUID: string;
  seriesInstanceUID: string;
  wadoRsRoot: string;
  width?: string | number;
  height?: string | number;
}

interface ImageSliceData {
  imageIndex: number;
  numberOfSlices: number;
  instanceNumber: number | null;
}

interface VOIData {
  windowCenter: number;
  windowWidth: number;
}

// Constants
const DEFAULT_VIEWPORT_ID = 'CT_AXIAL';
const TOOLGROUP_ID = 'CT_TOOLGROUP_ID';
const DEFAULT_VOI = {
  windowCenter: 100,
  windowWidth: 1000,
};

function Viewer({
  studyInstanceUID,
  seriesInstanceUID,
  wadoRsRoot,
  width = "512px",
  height = "512px"
}: CTViewerProps) {
  // Refs
  const elementRef = useRef<HTMLDivElement>(null);
  const running = useRef(false);
  const renderingEngineRef = useRef(null);

  // State
  const [imageSliceData, setImageSliceData] = useState<ImageSliceData>({
    imageIndex: 0,
    numberOfSlices: 0,
    instanceNumber: null
  });

  const [voi, setVOI] = useState<VOIData>(DEFAULT_VOI);

  useEffect(() => {
    const setup = async () => {
      if (!elementRef.current || running.current) return;
      running.current = true;

      try {
        await initializeCornerstoneCore();

        const { renderingEngine, imageIds } = await setupRendering({
          element: elementRef.current,
          studyInstanceUID,
          seriesInstanceUID,
          wadoRsRoot,
        });

        renderingEngineRef.current = renderingEngine;

        setImageSliceData(prev => ({
          ...prev,
          numberOfSlices: imageIds.length
        }));

        setupTools({
          element: elementRef.current,
        });

        renderingEngine.render();

        // Event handlers
        const updateImageIndex = (evt: Event) => {
          const viewport = renderingEngine.getViewport(DEFAULT_VIEWPORT_ID);
          if (!viewport) return;

          const currentImageIdIndex = viewport.getCurrentImageIdIndex();
          const imageId = imageIds[currentImageIdIndex];
          
          const generalImageModule = metaData.get('generalImageModule', imageId) || {};
          const { instanceNumber } = generalImageModule;

          setImageSliceData(prev => ({
            ...prev,
            imageIndex: currentImageIdIndex,
            instanceNumber: instanceNumber ? parseInt(instanceNumber) : null
          }));
        };

        const updateVOI = (evt: CustomEvent) => {
          const { range } = evt.detail;
          if (!range) return;

          const { lower, upper } = range;
          const { windowWidth, windowCenter } = utilities.windowLevel.toWindowLevel(lower, upper);

          setVOI({
            windowCenter,
            windowWidth
          });
        };

        // Add event listeners
        elementRef.current.addEventListener(
          Enums.Events.IMAGE_RENDERED, 
          updateImageIndex as EventListener
        );
        elementRef.current.addEventListener(
          Enums.Events.VOI_MODIFIED, 
          updateVOI as EventListener
        );

        // Cleanup function
        return () => {
          if (elementRef.current) {
            elementRef.current.removeEventListener(
              Enums.Events.IMAGE_RENDERED, 
              updateImageIndex as EventListener
            );
            elementRef.current.removeEventListener(
              Enums.Events.VOI_MODIFIED, 
              updateVOI as EventListener
            );
          }
          ToolGroupManager.destroyToolGroup(TOOLGROUP_ID);
        };
      } catch (error) {
        console.error('Error setting up viewer:', error);
        running.current = false;
      }
    };

    setup();
  }, [studyInstanceUID, seriesInstanceUID, wadoRsRoot]);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  return (
    <ViewerContainer width={width} height={height}>
      <div
        ref={elementRef}
        className="w-full h-full"
        onContextMenu={handleContextMenu}
      />
      <ViewerOverlay
        imageIndex={imageSliceData.imageIndex}
        numberOfSlices={imageSliceData.numberOfSlices}
        windowWidth={voi.windowWidth}
        windowCenter={voi.windowCenter}
      />
    </ViewerContainer>
  );
}

export default Viewer;