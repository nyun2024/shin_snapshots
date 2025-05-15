import { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./WebCam.module.scss";
import { frameImages } from "@constants/frameImages.js";

const MAX_PHOTOS = 4;
const STORAGE_KEY = "filteredImages";

const filterMap = {
  "no filter": "none",
  gingham: "contrast(0.9) brightness(1.05) sepia(0.04)",
  moon: "grayscale(1) contrast(1.1) brightness(1.1)",
  lark: "contrast(1.1) saturate(1.2) brightness(1.05)",
  reyes: "sepia(0.22) brightness(1.1) contrast(0.85)",
  juno: "hue-rotate(-10deg) contrast(1.1) saturate(1.3)",
  slumber: "saturate(0.66) brightness(1.05)",
  willow: "grayscale(0.5) sepia(0.2) brightness(1.05)",
  blurBright: "brightness(1.1) saturate(1.2) contrast(0.95) blur(0.4px)",
  softGlow: "brightness(1.15) contrast(0.9) blur(0.4px)",
  rosy: "brightness(1.1) saturate(1.4) hue-rotate(-10deg) contrast(0.95)",
};

const WebCam = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const { type } = useParams();
  const frames = frameImages[type];
  const navigate = useNavigate();

  const [images, setImages] = useState([]);
  const [countdown, setCountdown] = useState(0);
  const [isCounting, setIsCounting] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("no filter");

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

  useEffect(() => {
    if (images.length >= MAX_PHOTOS) {
      const timer = setTimeout(() => {
        navigate(`/edit/${type}`);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [images, navigate, type]);

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

    const vw = video.videoWidth;
    const vh = video.videoHeight;
    const cw = (canvas.width = video.clientWidth);
    const ch = (canvas.height = video.clientHeight);

    // 비율 유지하면서 자르기
    const ratioDisplay = cw / ch;
    const ratioVideo = vw / vh;

    let sx, sy, sWidth, sHeight;
    if (ratioVideo > ratioDisplay) {
      sHeight = vh;
      sWidth = vh * ratioDisplay;
      sx = (vw - sWidth) / 2;
      sy = 0;
    } else {
      sWidth = vw;
      sHeight = vw / ratioDisplay;
      sx = 0;
      sy = (vh - sHeight) / 2;
    }

    ctx.save();
    ctx.translate(cw, 0); // 좌우 반전
    ctx.scale(-1, 1);
    ctx.filter = filterMap[selectedFilter] || "none";
    ctx.drawImage(video, sx, sy, sWidth, sHeight, 0, 0, cw, ch);
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
          <img
            src={frames[images.length]}
            alt={`Frame ${images.length}`}
            className={styles.frameImage}
          />
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
            filter: filterMap[selectedFilter],
          }}
        />

        {countdown > 0 && (
          <div className={styles.countdown}>
            <span>{countdown}</span>
          </div>
        )}
      </div>

      <div className={styles.filterButtons}>
        {Object.keys(filterMap).map((filter) => (
          <button
            key={filter}
            onClick={() => setSelectedFilter(filter)}
            disabled={isCounting}
            className={selectedFilter === filter ? styles.active : ""}
          >
            {filter}
          </button>
        ))}
      </div>

      <button
        onClick={startCountdown}
        disabled={isCounting || images.length >= MAX_PHOTOS}
      >
        📸 캡처 ({images.length}/{MAX_PHOTOS})
      </button>
      <button onClick={clearAll}>🗑 전체 삭제</button>

      <canvas ref={canvasRef} style={{ display: "none" }} />
    </>
  );
};

export default WebCam;
