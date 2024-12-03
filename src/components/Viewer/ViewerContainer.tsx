import { memo } from 'react';

interface ViewerContainerProps {
  width?: string | number;
  height?: string | number;
  children: React.ReactNode;
}

export const ViewerContainer = memo(({
  width = '512px',
  height = '512px',
  children
}: ViewerContainerProps) => {
  const containerStyle = {
    width,
    height,
  };

  return (
    <div 
      className="relative bg-black rounded-lg overflow-hidden shadow-lg"
      style={containerStyle}
    >
      {children}
    </div>
  );
});

ViewerContainer.displayName = 'ViewerContainer';