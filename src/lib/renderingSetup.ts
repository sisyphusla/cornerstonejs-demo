import { RenderingEngine, Enums, volumeLoader, setVolumesForViewports } from './cornerstoneInit';
import createImageIdsAndCacheMetaData from './createImageIdsAndCacheMetaData';

interface SetupRenderingProps {
  element: HTMLDivElement;
  studyInstanceUID: string;
  seriesInstanceUID: string;
  wadoRsRoot: string;
}

export async function setupRendering({
  element,
  studyInstanceUID,
  seriesInstanceUID,
  wadoRsRoot,
}: SetupRenderingProps) {
  const imageIds = await createImageIdsAndCacheMetaData({
    StudyInstanceUID: studyInstanceUID,
    SeriesInstanceUID: seriesInstanceUID,
    wadoRsRoot: wadoRsRoot,
  });

  const renderingEngine = new RenderingEngine("myRenderingEngine");
  const viewportId = "CT_AXIAL";

  const viewportInput = {
    viewportId,
    type: Enums.ViewportType.ORTHOGRAPHIC,
    element,
    defaultOptions: {
      orientation: Enums.OrientationAxis.AXIAL,
    },
  };

  renderingEngine.enableElement(viewportInput);

  const volumeId = "cornerstoneStreamingImageVolume:CT_VOLUME_ID";
  const volume = await volumeLoader.createAndCacheVolume(volumeId, {
    imageIds,
  });

  volume.load();

  await setVolumesForViewports(
    renderingEngine,
    [{ volumeId }],
    [viewportId]
  );

  return { renderingEngine, imageIds };
}