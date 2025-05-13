import { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import styles from "./WebCam.module.scss";
import { useParams } from "react-router-dom";

// 프레임 이미지 가져오기
import black1 from "@img/frame/black/black1.png";
import black2 from "@img/frame/black/black2.png";
import black3 from "@img/frame/black/black3.png";
import black4 from "@img/frame/black/black4.png";
import white1 from "@img/frame/white/white1.png";
import white2 from "@img/frame/white/white2.png";
import white3 from "@img/frame/white/white3.png";
import white4 from "@img/frame/white/white4.png";

// 타입별 프레임 세트
const frameType = {
  black: [black1, black2, black3, black4],
  white: [white1, white2, white3, white4],
};

const MAX_PHOTOS = 4;
const STORAGE_KEY = "capturedImages";

const WebCam = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [images, setImages] = useState([]);
  const [countdown, setCountdown] = useState(0);
  const [isCounting, setIsCounting] = useState(false);
  const { type } = useParams();

  // localStorage에서 복원
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setImages(parsed);
        }
      } catch (e) {
        console.error("Failed to parse stored images:", e);
      }
    }
  }, []);

  // 카운트다운 후 자동 캡처
  const startCountdown = () => {
    if (images.length >= MAX_PHOTOS || isCounting) return;

    setIsCounting(true);
    setCountdown(3);

    let current = 3;
    const interval = setInterval(() => {
      current -= 1;
      if (current <= 0) {
        clearInterval(interval);
        setCountdown(0);
        capture();
        setIsCounting(false);
      } else {
        setCountdown(current);
      }
    }, 1000);
  };

  // 실제 캡처
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

    ctx.save();
    ctx.translate(canvas.width, 0); // 좌우 반전
    ctx.scale(-1, 1);
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
    ctx.restore();

    const dataURL = canvas.toDataURL("image/jpeg", 0.8);
    const newImages = [...images, dataURL].slice(0, MAX_PHOTOS);
    setImages(newImages);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newImages));
  };

  const clearAll = () => {
    setImages([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <>
      <div className={styles.webCamFrame}>
        {images.length >= MAX_PHOTOS || !frameType[type] ? null : (
          <img src={frameType[type][images.length]} alt="Frame" />
        )}

        <Webcam
          ref={webcamRef}
          mirrored={true}
          videoConstraints={{ facingMode: "user" }}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            aspectRatio: "3/4",
          }}
        />

        {countdown > 0 && (
          <div className={styles.countdown}>
            <span>{countdown}</span>
          </div>
        )}
      </div>

      <button
        onClick={startCountdown}
        disabled={isCounting || images.length >= MAX_PHOTOS}
      >
        📸 캡처 ({images.length}/{MAX_PHOTOS})
      </button>
      <button onClick={clearAll}>🗑 전체 삭제</button>

      <canvas ref={canvasRef} style={{ display: "none" }} />

      <div className={styles.capturedImages}>
        {images.map((src, index) => (
          <img key={index} src={src} alt={`Captured ${index + 1}`} />
        ))}
      </div>
    </>
  );
};

export default WebCam;
