import Viewer from './components/Viewer';

function App() {
  return (
    <Viewer 
      studyInstanceUID="1.3.6.1.4.1.14519.5.2.1.7009.2403.334240657131972136850343327463"
      seriesInstanceUID="1.3.6.1.4.1.14519.5.2.1.7009.2403.226151125820845824875394858561"
      wadoRsRoot="https://d14fa38qiwhyfd.cloudfront.net/dicomweb"
      width="512px"
      height="512px"
    />
  );
}

export default App;