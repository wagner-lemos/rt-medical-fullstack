import React, { useEffect, useRef, useState } from 'react';
import cornerstone from 'cornerstone-core';
import cornerstoneTools from 'cornerstone-tools';
import cornerstoneMath from 'cornerstone-math';
import dicomParser from 'dicom-parser';
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';

cornerstoneTools.external.cornerstone = cornerstone;
cornerstoneTools.external.cornerstoneMath = cornerstoneMath;
cornerstoneTools.external.dicomParser = dicomParser;
cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
cornerstoneWADOImageLoader.external.dicomParser = dicomParser;

cornerstoneWADOImageLoader.configure({ useWebWorkers: false });

if (!cornerstoneTools.store) {
  cornerstoneTools.init();
}

const DicomViewer = ({ imageUrl }) => {
  const elementRef = useRef();
  const [rotation, setRotation] = useState(0);
  const [measuring, setMeasuring] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    cornerstone.enable(element);

    const loadImageAndTools = async () => {
      const image = await cornerstone.loadImage(imageUrl);
      cornerstone.displayImage(element, image);

      // Adiciona LengthTool
      cornerstoneTools.addTool(cornerstoneTools.LengthTool);

      // Personaliza o texto da régua para mostrar cm arredondado de 5 em 5
      const configuration = {
        getTextCallback: (data) => {
          const mm = data.length;
          const roundedCm = Math.round((mm / 10) / 5) * 5; // arredonda em cm
          return `${roundedCm} cm`;
        },
      };
      cornerstoneTools.addTool(cornerstoneTools.LengthTool, { configuration });

      // Botão direito ativa rotação
      cornerstoneTools.addTool(cornerstoneTools.RotateTool);
      cornerstoneTools.setToolActive('Rotate', { mouseButtonMask: 2 });
    };

    loadImageAndTools();

    return () => cornerstone.disable(element);
  }, [imageUrl]);

  const rotateImage = () => {
    const element = elementRef.current;
    const viewport = cornerstone.getViewport(element);
    const newRotation = (viewport.rotation + 90) % 360;
    viewport.rotation = newRotation;
    cornerstone.setViewport(element, viewport);
    setRotation(newRotation);
  };

  const resetViewport = () => {
    const element = elementRef.current;
    const image = cornerstone.getImage(element);
    const defaultViewport = cornerstone.getDefaultViewportForImage(element, image);
    cornerstone.setViewport(element, defaultViewport);
    setRotation(0);
  };

  const toggleRuler = () => {
    const element = elementRef.current;
    if (!measuring) {
      cornerstoneTools.setToolActive('Length', { mouseButtonMask: 1 });
    } else {
      cornerstoneTools.setToolDisabled('Length');
    }
    setMeasuring(!measuring);
  };

  return (
    <div>
      <div className="mb-3">
        <div className="btn btn-warning px-4 me-2" onClick={resetViewport}>Carregar Imagem</div>
        <div className="btn btn-warning px-4 me-2" onClick={rotateImage}>Rotacionar Imagem</div>
        <div className="btn btn-warning px-4 me-2" onClick={toggleRuler}>
          {measuring ? 'Desativar Régua' : 'Ativar Régua 5cm'}
        </div>
      </div>

      <div style={{ position: 'relative', width: '100%', height: 500 }}>
        <div
          ref={elementRef}
          style={{ width: '100%', height: '100%', border: '1px solid #ccc' }}
        />
      </div>
    </div>
  );
};

export default DicomViewer;
