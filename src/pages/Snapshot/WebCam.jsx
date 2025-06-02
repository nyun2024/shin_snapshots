import { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./WebCam.module.scss";
import { frameImages } from "@constants/frameImages.js";
import camera from "@img/camera.png";
import cameraVertical from "@img/camera_vertical.png";
import Container from "@components/common/Container";
import FilterButton from "@components/button/FilterButton";
import useIsMobile from "@utils/useIsMobile";
import { applyFilter } from "@utils/filterFunctions";
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
  const isMobile = useIsMobile();
  const frames = frameImages[type];
  const navigate = useNavigate();
  const [isHorMobileOnly, setisHorMobileOnly] = useState(false);
  const [isVerMobileOnly, setisVerMobileOnly] = useState(false);
  const containerRef = useRef(null);
  const [adjustedWidth, setAdjustedWidth] = useState(0);
  const [adjustedHeight, setAdjustedHeight] = useState(0);
  const [images, setImages] = useState([]);
  const [countdown, setCountdown] = useState(0);
  const [isCounting, setIsCounting] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("no filter");
  const [isOpen, setIsOpen] = useState(true);
  const [isBlinking, setIsBlinking] = useState(true);

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

    setisHorMobileOnly(isMobile && !isTablet && type !== "white");
    setisVerMobileOnly(isMobile && !isTablet && type === "white");
  }, []);

  useEffect(() => {
    const isSave = localStorage.getItem("saveEdit");
    if (images.length >= MAX_PHOTOS && isSave === "false") {
      const timer = setTimeout(() => {
        navigate(`/save/${type}`);
      }, 500);
      return () => clearTimeout(timer);
    } else if (isSave === "true") {
      // SaveEdit에서 뒤로가시 시 홈으로 이동
      navigate("/");
    }
  }, [images, navigate, type]);

  const startCountdown = () => {
    if (images.length >= MAX_PHOTOS || isCounting) return;

    setIsBlinking(false);
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

    if (isHorMobileOnly) {
      // 캔버스를 세로 기준으로 90도 회전
      canvas.width = video.clientHeight;
      canvas.height = video.clientWidth;

      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2); // 중심 이동
      ctx.rotate(-Math.PI / 2); // 90도 회전

      // 미러 효과 및 그리기
      ctx.scale(-1, 1);
      ctx.drawImage(
        video,
        sx,
        sy,
        sWidth,
        sHeight,
        -video.clientWidth / 2,
        -video.clientHeight / 2,
        video.clientWidth,
        video.clientHeight
      );
      ctx.restore();
    } else {
      // 기존 데스크탑 및 태블릿용 처리
      canvas.width = video.clientWidth;
      canvas.height = video.clientHeight;

      ctx.save();
      ctx.translate(canvas.width, 0);
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
    }

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const filteredData = applyFilter(imageData, selectedFilter);
    ctx.putImageData(filteredData, 0, 0);

    const dataURL = canvas.toDataURL("image/jpeg");
    const newImages = [...images, dataURL].slice(0, MAX_PHOTOS);
    setImages(newImages);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newImages));
  };

  const clearAll = () => {
    setImages([]);
    localStorage.removeItem(STORAGE_KEY);
  };
  const handleCloseClick = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (containerRef.current) {
        const parentHeight = containerRef.current.offsetHeight;
        const parentWidth = containerRef.current.offsetWidth;
        const widthWithMargin = parentHeight * 0.72;
        const heightWithMargin = parentWidth * 0.63;
        setAdjustedWidth(widthWithMargin);
        setAdjustedHeight(heightWithMargin);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [isHorMobileOnly]);

  return (
    <Container
      className={classNames(
        styles.webCamContainer,
        isMobile ? styles.mobile : styles.pc,
        isHorMobileOnly && styles.isHorMobileOnly,
        isVerMobileOnly && styles.isVerMobileOnly
      )}
      isWebCam={isHorMobileOnly || isVerMobileOnly}
    >
      <div className={styles.webCamInner}>
        <div className={styles.filterButtons}>
          {Object.keys(filterMap).map((filter) => (
            <FilterButton
              key={filter}
              text={filter}
              className={selectedFilter === filter ? styles.active : ""}
              disabled={isCounting}
              isHorMobileOnly={isHorMobileOnly}
              isVerMobileOnly={isVerMobileOnly}
              onClick={() => setSelectedFilter(filter)}
              isSelected={selectedFilter === filter}
            />
          ))}
        </div>
        <div
          className={classNames(
            type === "white"
              ? styles.verticalCameraWebCamWrap
              : styles.horizontalCameraWebCamWrap,
            styles.cameraWebCamWrap
          )}
        >
          <div className={styles.cameraWebCam}>
            <img
              src={type === "white" ? cameraVertical : camera}
              className={styles.cameraImg}
            />
            <button
              type="button"
              className={styles.captureBtn}
              onClick={startCountdown}
              disabled={isCounting || images.length >= MAX_PHOTOS}
            >
              <span className={isBlinking && [styles.blink]}>Click</span>
            </button>
            <div className={styles.webCamFrame} ref={containerRef}>
              {type === "blue" &&
                images.length < MAX_PHOTOS &&
                frames?.[images.length] && (
                  <img
                    src={frames[images.length]}
                    alt={`Frame ${images.length}`}
                    className={styles.frameBoxImg}
                  />
                )}
              <div className={styles.webCamVideo}>
                <Webcam
                  ref={webcamRef}
                  mirrored={true}
                  videoConstraints={videoConstraints}
                  style={
                    isHorMobileOnly
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
          <div className={styles.webCamEtc}>
            <div className={styles.photoLength}>
              {images.length} / {MAX_PHOTOS}
            </div>
            <button onClick={clearAll}>🗑️ All Clear</button>
          </div>
        </div>

        <canvas ref={canvasRef} style={{ display: "none" }} />

        {isHorMobileOnly && isOpen && (
          <div className={styles.layerMobile}>
            <div className={styles.dim} onClick={handleCloseClick}></div>
            <div className={styles.layerContainer}>
              <div className={styles.layerContent}>
                핸드폰을 가로로 돌려
                <br />
                촬영해주세요!
              </div>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={handleCloseClick}
              >
                OK
              </button>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
};

export default WebCam;
