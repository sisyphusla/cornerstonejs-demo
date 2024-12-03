import { init as csRenderInit } from "@cornerstonejs/core";
import { init as csToolsInit } from "@cornerstonejs/tools";
import { init as dicomImageLoaderInit } from "@cornerstonejs/dicom-image-loader";

export async function initializeCornerstoneCore() {
  await csRenderInit();
  await csToolsInit();
  dicomImageLoaderInit({ maxWebWorkers: 1 });
}


export { 
  RenderingEngine,
  Enums,
  volumeLoader, 
  setVolumesForViewports 
} from "@cornerstonejs/core";

export { 
  ToolGroupManager,
  Enums as ToolsEnums,
  WindowLevelTool,
  PanTool,
  ZoomTool,
  StackScrollTool,
} from "@cornerstonejs/tools";