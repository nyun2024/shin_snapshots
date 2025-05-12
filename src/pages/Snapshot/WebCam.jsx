import { useRef, useState } from "react";
import Webcam from "react-webcam";

const WebCam = () => {
  const webcamRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);

  const capture = () => {
    const image = webcamRef.current.getScreenshot();
    setImageSrc(image);
  };

  return (
    <div>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={320}
        height={240}
        videoConstraints={{
          facingMode: "user",
        }}
      />
      <button onClick={capture}>사진 찍기</button>
      {imageSrc && (
        <div>
          <h3>촬영된 사진:</h3>
          <img src={imageSrc} alt="captured" />
        </div>
      )}
    </div>
  );
};

export default WebCam;
