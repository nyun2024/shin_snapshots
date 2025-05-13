import { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./WebCam.module.scss";
import { frameImages } from "@constants/frameImages.js";

const MAX_PHOTOS = 4;
const STORAGE_KEY = "capturedImages";

const WebCam = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const { type } = useParams(); // URL에서 type 추출
  const frames = frameImages[type];
  const navigate = useNavigate();

  const [images, setImages] = useState([]);
  const [countdown, setCountdown] = useState(0);
  const [isCounting, setIsCounting] = useState(false);

  // 로컬 스토리지 복원
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

  //4장 활영 끝나면 0.5초 뒤에 이동
  useEffect(() => {
    const resultSnapshot = localStorage.getItem("resultSnapshot");

    if (images.length >= MAX_PHOTOS && resultSnapshot === "false") {
      const timer = setTimeout(() => {
        navigate(`/edit/${type}`);
      }, 500);

      return () => clearTimeout(timer);
    }

    // edit에서 뒤로가기 막음
    if (resultSnapshot === "true") {
      navigate("/edit");
    }
  }, [images, navigate]);

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

    const dataURL = canvas.toDataURL("image/jpeg");
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
        {images.length < MAX_PHOTOS && frames?.[images.length] && (
          <img src={frames[images.length]} alt={`Frame ${images.length}`} />
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

      <div className={styles.capturedImages} style={{ display: "none" }}>
        {images.map((src, index) => (
          <img key={index} src={src} alt={`Captured ${index + 1}`} />
        ))}
      </div>
    </>
  );
};

export default WebCam;
