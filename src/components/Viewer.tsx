import { useEffect, useRef, useState } from "react";
import { initializeCornerstoneCore } from '../lib/cornerstoneInit';
import { setupTools } from '../lib/toolsSetup';
import { setupRendering } from '../lib/renderingSetup';
import { ToolGroupManager } from '../lib/cornerstoneInit';
import { Enums, metaData, utilities } from '@cornerstonejs/core';

interface CTViewerProps {
  studyInstanceUID: string;
  seriesInstanceUID: string;
  wadoRsRoot: string;
  width?: string | number;
  height?: string | number;
}

const DEFAULT_VIEWPORT_ID = 'CT_AXIAL';

function Viewer({
  studyInstanceUID,
  seriesInstanceUID,
  wadoRsRoot,
  width = "512px",
  height = "512px"
}: CTViewerProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [imageSliceData, setImageSliceData] = useState({
    imageIndex: 0,
    numberOfSlices: 0,
    instanceNumber: null
  });
  const [voi, setVOI] = useState({
    windowCenter: 100,
    windowWidth: 1000,
  });
  const running = useRef(false);
  const renderingEngineRef = useRef(null);

  useEffect(() => {
    const setup = async () => {
      if (!elementRef.current || running.current) return;
      running.current = true;

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

      // 添加事件監聽
      const updateImageIndex = (evt) => {
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

      const updateVOI = (evt) => {
        const { range } = evt.detail;
        if (!range) return;

        const { lower, upper } = range;
        const { windowWidth, windowCenter } = utilities.windowLevel.toWindowLevel(lower, upper);

        setVOI({
          windowCenter,
          windowWidth
        });
      };

      elementRef.current.addEventListener(Enums.Events.IMAGE_RENDERED, updateImageIndex);
      elementRef.current.addEventListener(Enums.Events.VOI_MODIFIED, updateVOI);

      return () => {
        if (elementRef.current) {
          elementRef.current.removeEventListener(Enums.Events.IMAGE_RENDERED, updateImageIndex);
          elementRef.current.removeEventListener(Enums.Events.VOI_MODIFIED, updateVOI);
        }
        ToolGroupManager.destroyToolGroup('CT_TOOLGROUP_ID');
      };
    };

    setup();
  }, [studyInstanceUID, seriesInstanceUID, wadoRsRoot]);

  return (
    <div style={{ position: 'relative', width, height }}>  
      <div
        ref={elementRef}
        style={{ width: '100%', height: '100%' }}  
        onContextMenu={(e) => e.preventDefault()}
      />
      {/* 右上角切片信息 */}
      <div
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          color: 'red',
          padding: '5px 10px',
          borderRadius: '4px',
          fontSize: '14px',
          zIndex: 1000
        }}
      >
        <span>
          Slice: {imageSliceData.imageIndex + 1}/{imageSliceData.numberOfSlices}
        </span>
      </div>
      {/* 左上角窗位信息 */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        color: 'red',
        padding: '5px 10px',
        borderRadius: '4px',
        fontSize: '14px',
        zIndex: 1000
      }}>
        <span>
          W: {voi.windowWidth.toFixed(0)} L: {voi.windowCenter.toFixed(0)}
        </span>
      </div>
    </div>
  );
}

export default Viewer;