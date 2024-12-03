import { RefObject } from 'react';

interface ImageCanvasProps {
  elementRef: RefObject<HTMLDivElement>;
}

export function ImageCanvas({ elementRef }: ImageCanvasProps) {
  return (
    <div
      ref={elementRef}
      style={{ width: '100%', height: '100%' }}  
      onContextMenu={(e) => e.preventDefault()}
    />
  );
}