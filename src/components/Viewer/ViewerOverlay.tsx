interface ViewerOverlayProps {
  sliceData: {
    imageIndex: number;
    numberOfSlices: number;
  };
  voiData: {
    windowWidth: number;
    windowCenter: number;
  };
}

export function ViewerOverlay({ sliceData, voiData }: ViewerOverlayProps) {
  return (
    <>
      {/* 右上角切片信息 */}
      <div className="absolute top-2.5 right-2.5 text-red-500 bg-black/50 px-2.5 py-1 rounded text-sm z-[1000]">
        Slice: {sliceData.imageIndex + 1}/{sliceData.numberOfSlices}
      </div>

      {/* 左上角窗位信息 */}
      <div className="absolute top-2.5 left-2.5 text-red-500 bg-black/50 px-2.5 py-1 rounded text-sm z-[1000]">
        W: {voiData.windowWidth.toFixed(0)} L: {voiData.windowCenter.toFixed(0)}
      </div>
    </>
  );
}