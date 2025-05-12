import { useRef, useState } from "react";
import Webcam from "react-webcam";
import styles from "./WebCam.module.scss";
import black1 from "@img/frame/black/black1.png";

const WebCam = () => {
  const webcamRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);

  const capture = () => {
    const image = webcamRef.current.getScreenshot();
    setImageSrc(image);
  };

  return (
    <div>
      <div className={styles.webCamFrame}>
        <img src={black1} />
        <Webcam
          className={styles.webCam}
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={{
            facingMode: "user",
          }}
        />
      </div>
      <button onClick={capture}>📷 사진 찍기</button>
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
