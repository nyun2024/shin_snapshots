import { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./WebCam.module.scss";
import { frameImages } from "@constants/frameImages.js";
import camera from "@img/camera.png";
import Container from "@components/common/Container";
import FilterButton from "../../components/button/FilterButton";
import classNames from "classnames";

const MAX_PHOTOS = 4;
const STORAGE_KEY = "filteredImages";

const filterMap = {
  "no filter": "none",
  moon: "grayscale(1) brightness(1.05)",
  gingham: "contrast(0.9) brightness(1.05) sepia(0.04)",
  slumber: "saturate(1.1) brightness(0.65)",
  lark: "contrast(1.1) saturate(1.15) brightness(1.05)",
  reyes: "sepia(0.2) brightness(1.05) contrast(0.9)",
  juno: "hue-rotate(-10deg) contrast(1.05) saturate(1.2)",
};

const videoConstraints = {
  facingMode: "user",
  width: { ideal: 720 },
  height: { ideal: 960 },
};

const WebCam = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const { type } = useParams();
  const frames = frameImages[type];
  const navigate = useNavigate();
  const [isMobileOnly, setIsMobileOnly] = useState(false);
  const containerRef = useRef(null);
  const [adjustedWidth, setAdjustedWidth] = useState(0);
  const [adjustedHeight, setAdjustedHeight] = useState(0);

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

    // 모바일 감지(테블릿 제외)
    const ua = navigator.userAgent.toLowerCase();
    const isTablet =
      /ipad/.test(ua) ||
      (/(android)/.test(ua) && !/mobile/.test(ua)) ||
      (window.innerWidth >= 768 && window.innerWidth <= 1024);

    const isMobile = /iphone|ipod|android.*mobile|windows phone/.test(ua);

    setIsMobileOnly(isMobile && !isTablet);
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
    ctx.translate(cw, 0); // mirror
    ctx.scale(-1, 1);
    ctx.drawImage(video, sx, sy, sWidth, sHeight, 0, 0, cw, ch);
    ctx.restore();

    const imageData = ctx.getImageData(0, 0, cw, ch);
    const data = imageData.data;

    switch (selectedFilter) {
      case "moon":
        for (let i = 0; i < data.length; i += 4) {
          const avg = ((data[i] + data[i + 1] + data[i + 2]) / 3) * 1.1;
          data[i] = data[i + 1] = data[i + 2] = avg;
        }
        break;
      case "gingham":
        for (let i = 0; i < data.length; i += 4) {
          let r = data[i];
          let g = data[i + 1];
          let b = data[i + 2];

          // brightness(1.05)
          r *= 1.05;
          g *= 1.05;
          b *= 1.05;

          // contrast(0.9)
          r = (r - 128) * 0.9 + 128;
          g = (g - 128) * 0.9 + 128;
          b = (b - 128) * 0.9 + 128;

          // sepia(0.04)
          const sepiaR = r * 0.393 + g * 0.769 + b * 0.189;
          const sepiaG = r * 0.349 + g * 0.686 + b * 0.168;
          const sepiaB = r * 0.272 + g * 0.534 + b * 0.131;

          r = r * 0.96 + sepiaR * 0.04;
          g = g * 0.96 + sepiaG * 0.04;
          b = b * 0.96 + sepiaB * 0.04;

          // 값 보정 (0~255 범위로 클램핑)
          data[i] = Math.min(255, Math.max(0, r));
          data[i + 1] = Math.min(255, Math.max(0, g));
          data[i + 2] = Math.min(255, Math.max(0, b));
        }
        break;
      case "slumber":
        for (let i = 0; i < data.length; i += 4) {
          let r = data[i];
          let g = data[i + 1];
          let b = data[i + 2];

          // 1️⃣ brightness(0.65)
          r *= 0.65;
          g *= 0.65;
          b *= 0.65;

          // 2️⃣ saturate(1.1)
          const gray = r * 0.2126 + g * 0.7152 + b * 0.0722;
          r = gray + (r - gray) * 1.1;
          g = gray + (g - gray) * 1.1;
          b = gray + (b - gray) * 1.1;

          // 클램핑
          data[i] = Math.min(255, Math.max(0, r));
          data[i + 1] = Math.min(255, Math.max(0, g));
          data[i + 2] = Math.min(255, Math.max(0, b));
        }
        break;
      case "lark":
        for (let i = 0; i < data.length; i += 4) {
          let r = data[i];
          let g = data[i + 1];
          let b = data[i + 2];

          // 1. contrast(1.1)
          r = (r - 128) * 1.1 + 128;
          g = (g - 128) * 1.1 + 128;
          b = (b - 128) * 1.1 + 128;

          // 2. saturate(1.15)
          const gray = r * 0.2126 + g * 0.7152 + b * 0.0722;
          r = gray + (r - gray) * 1.15;
          g = gray + (g - gray) * 1.15;
          b = gray + (b - gray) * 1.15;

          // 3. brightness(1.05)
          r *= 1.05;
          g *= 1.05;
          b *= 1.05;

          // Clamp to [0, 255]
          data[i] = Math.min(255, Math.max(0, r));
          data[i + 1] = Math.min(255, Math.max(0, g));
          data[i + 2] = Math.min(255, Math.max(0, b));
          // data[i + 3] = alpha 그대로
        }
        break;
      case "reyes":
      case "yourFilterName": // 원하는 이름으로 바꾸세요
        for (let i = 0; i < data.length; i += 4) {
          let r = data[i];
          let g = data[i + 1];
          let b = data[i + 2];

          // 1. sepia(0.2)
          const sr = r * 0.393 + g * 0.769 + b * 0.189;
          const sg = r * 0.349 + g * 0.686 + b * 0.168;
          const sb = r * 0.272 + g * 0.534 + b * 0.131;
          r = r * 0.8 + sr * 0.2;
          g = g * 0.8 + sg * 0.2;
          b = b * 0.8 + sb * 0.2;

          // 2. brightness(1.05)
          r *= 1.05;
          g *= 1.05;
          b *= 1.05;

          // 3. contrast(0.9)
          r = (r - 128) * 0.9 + 128;
          g = (g - 128) * 0.9 + 128;
          b = (b - 128) * 0.9 + 128;

          // Clamp to [0, 255]
          data[i] = Math.min(255, Math.max(0, r));
          data[i + 1] = Math.min(255, Math.max(0, g));
          data[i + 2] = Math.min(255, Math.max(0, b));
          // alpha (data[i + 3])는 그대로 유지
        }
        break;

      case "juno": {
        const cosA = Math.cos((-10 * Math.PI) / 180);
        const sinA = Math.sin((-10 * Math.PI) / 180);
        const m = [
          0.213 + cosA * 0.787 - sinA * 0.213,
          0.715 - cosA * 0.715 - sinA * 0.715,
          0.072 - cosA * 0.072 + sinA * 0.928,
          0.213 - cosA * 0.213 + sinA * 0.143,
          0.715 + cosA * 0.285 + sinA * 0.14,
          0.072 - cosA * 0.072 - sinA * 0.283,
          0.213 - cosA * 0.213 - sinA * 0.787,
          0.715 - cosA * 0.715 + sinA * 0.715,
          0.072 + cosA * 0.928 + sinA * 0.072,
        ];

        for (let i = 0; i < data.length; i += 4) {
          let r = data[i];
          let g = data[i + 1];
          let b = data[i + 2];

          // hue-rotate(-10deg)
          const r2 = r * m[0] + g * m[1] + b * m[2];
          const g2 = r * m[3] + g * m[4] + b * m[5];
          const b2 = r * m[6] + g * m[7] + b * m[8];
          r = r2;
          g = g2;
          b = b2;

          // contrast(1.05)
          r = (r - 128) * 1.05 + 128;
          g = (g - 128) * 1.05 + 128;
          b = (b - 128) * 1.05 + 128;

          // saturate(1.2)
          const sr = r * 0.213 + g * 0.715 + b * 0.072;
          r = sr + (r - sr) * 1.2;
          g = sr + (g - sr) * 1.2;
          b = sr + (b - sr) * 1.2;

          data[i] = Math.min(255, Math.max(0, r));
          data[i + 1] = Math.min(255, Math.max(0, g));
          data[i + 2] = Math.min(255, Math.max(0, b));
        }
        break;
      }
      default:
        break;
    }

    ctx.putImageData(imageData, 0, 0);

    const dataURL = canvas.toDataURL("image/jpeg");
    const newImages = [...images, dataURL].slice(0, MAX_PHOTOS);
    setImages(newImages);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newImages));
  };

  const clearAll = () => {
    setImages([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  useEffect(() => {
    if (containerRef.current) {
      const parentHeight = containerRef.current.offsetHeight;
      const parentWidth = containerRef.current.offsetWidth;
      const widthWithMargin = parentHeight * 0.69; // 100% - 18% = 82%
      const heightWithMargin = parentWidth * 0.58; // 100% - 18% = 82%
      setAdjustedWidth(widthWithMargin);
      setAdjustedHeight(heightWithMargin);
    }
  }, [isMobileOnly]);

  return (
    <Container
      className={classNames(
        styles.webCamContainer,
        isMobileOnly && styles.isMobileOnly
      )}
      isWebCam={isMobileOnly}
    >
      <div className={styles.webCamInner}>
        <div className={styles.filterButtons}>
          {Object.keys(filterMap).map((filter) => (
            <FilterButton
              key={filter}
              text={filter}
              className={selectedFilter === filter ? styles.active : ""}
              onClick={() => setSelectedFilter(filter)}
              disabled={isCounting}
              isMobileOnly={isMobileOnly}
            />
          ))}
        </div>
        <div className={styles.cameraWebCam}>
          <img src={camera} className={styles.cameraImg} />
          <button
            type="button"
            className={styles.captureBtn}
            onClick={startCountdown}
            disabled={isCounting || images.length >= MAX_PHOTOS}
          >
            Click
          </button>
          <div className={styles.webCamFrame} ref={containerRef}>
            {type === "white" &&
              images.length < MAX_PHOTOS &&
              frames?.[images.length] && (
                <img
                  src={frames[images.length]}
                  alt={`Frame ${images.length}`}
                  className={styles.frameImg}
                />
              )}
            <div className={styles.webCamVideo}>
              <Webcam
                ref={webcamRef}
                mirrored={true}
                videoConstraints={videoConstraints}
                style={
                  isMobileOnly
                    ? {
                        width: adjustedWidth + "px", // 부모의 높이를 너비에 적용
                        height: adjustedHeight + "px",
                        transform: "rotate(-90deg)",
                        transformOrigin: "center center",
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        translate: "-50% -50%",
                        objectFit: "cover",
                        filter: filterMap[selectedFilter],
                      }
                    : {
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        filter: filterMap[selectedFilter],
                      }
                }
              />
            </div>

            {countdown > 0 && (
              <div className={styles.countdown}>
                <span>{countdown}</span>
              </div>
            )}
          </div>
        </div>
        <div>
          {images.length}/{MAX_PHOTOS}
        </div>
        <button onClick={clearAll}>🗑 전체 삭제</button>

        <canvas ref={canvasRef} style={{ display: "none" }} />
      </div>
    </Container>
  );
};

export default WebCam;
