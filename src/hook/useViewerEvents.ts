import { useCallback, useEffect } from 'react';
import { Enums, metaData, utilities } from '@cornerstonejs/core';

interface ImageSliceData {
  imageIndex: number;
  numberOfSlices: number;
  instanceNumber: number | null;
}

interface VOIData {
  windowCenter: number;
  windowWidth: number;
}

interface UseViewerEventsProps {
  elementRef: React.RefObject<HTMLDivElement>;
  renderingEngine: any; 
  imageIds: string[];
  setImageSliceData: (data: ImageSliceData | ((prev: ImageSliceData) => ImageSliceData)) => void;
  setVOI: (data: VOIData) => void;
}

export const useViewerEvents = ({
  elementRef,
  renderingEngine,
  imageIds,
  setImageSliceData,
  setVOI
}: UseViewerEventsProps) => {
  // 更新切片信息
  const handleImageRendered = useCallback(() => {
    if (!renderingEngine) return;

    const viewport = renderingEngine.getViewport('CT_AXIAL');
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
  }, [renderingEngine, imageIds, setImageSliceData]);

  // 更新窗位窗寬信息
  const handleVOIModified = useCallback((evt: any) => {
    const { range } = evt.detail;
    if (!range) return;

    const { lower, upper } = range;
    const { windowWidth, windowCenter } = utilities.windowLevel.toWindowLevel(
      lower,
      upper
    );

    setVOI({ windowWidth, windowCenter });
  }, [setVOI]);

  // 綁定事件
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    element.addEventListener(Enums.Events.IMAGE_RENDERED, handleImageRendered);
    element.addEventListener(Enums.Events.VOI_MODIFIED, handleVOIModified);

    // 清理函數
    return () => {
      element.removeEventListener(Enums.Events.IMAGE_RENDERED, handleImageRendered);
      element.removeEventListener(Enums.Events.VOI_MODIFIED, handleVOIModified);
    };
  }, [elementRef, handleImageRendered, handleVOIModified]);
};