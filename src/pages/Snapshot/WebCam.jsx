import { useRef, useState } from "react";
import Webcam from "react-webcam";
import styles from "./WebCam.module.scss";
import black1 from "@img/frame/black/black1.png";

const WebCam = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [image, setImage] = useState(null);

  const capture = () => {
    const video = webcamRef.current.video;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;
    const displayWidth = video.clientWidth;
    const displayHeight = video.clientHeight;

    const ratioDisplay = displayWidth / displayHeight;
    const ratioVideo = videoWidth / videoHeight;

    let sx, sy, sWidth, sHeight;

    if (ratioVideo > ratioDisplay) {
      sHeight = videoHeight;
      sWidth = videoHeight * ratioDisplay;
      sx = (videoWidth - sWidth) / 2;
      sy = 0;
    } else {
      sWidth = videoWidth;
      sHeight = videoWidth / ratioDisplay;
      sx = 0;
      sy = (videoHeight - sHeight) / 2;
    }

    canvas.width = displayWidth;
    canvas.height = displayHeight;

    ctx.drawImage(
      video,
      sx,
      sy,
      sWidth,
      sHeight,
      0,
      0,
      canvas.width,
      canvas.height
    );
    const dataURL = canvas.toDataURL("image/png");
    setImage(dataURL);
  };

  return (
    <>
      <div className={styles.webCamFrame}>
        <img src={black1} />
        <Webcam
          ref={webcamRef}
          mirrored={true}
          videoConstraints={{ facingMode: "user" }}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            aspectRatio: "3/4", // 원하는 비율
          }}
        />
      </div>
      <button onClick={capture}>📸 캡처</button>
      <canvas ref={canvasRef} style={{ display: "none" }} />
      {image && <img src={image} alt="Captured" />}
    </>
  );
};

export default WebCam;
