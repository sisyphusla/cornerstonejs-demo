interface ViewerOverlayProps {
  imageIndex: number;
  numberOfSlices: number;
  windowWidth: number;
  windowCenter: number;
}

export function ViewerOverlay({
  imageIndex,
  numberOfSlices,
  windowWidth,
  windowCenter
}: ViewerOverlayProps) {
  return (
    <>
      <div className="absolute top-2 right-2 px-3 py-1.5 bg-black/50 text-red-500 rounded text-sm z-10">
        <span>
          Slice: {imageIndex + 1}/{numberOfSlices}
        </span>
      </div>
      <div className="absolute top-2 left-2 px-3 py-1.5 bg-black/50 text-red-500 rounded text-sm z-10">
        <span>
          W: {windowWidth.toFixed(0)} L: {windowCenter.toFixed(0)}
        </span>
      </div>
    </>
  );
}