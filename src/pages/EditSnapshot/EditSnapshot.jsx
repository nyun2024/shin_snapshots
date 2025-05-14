import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { resultFrame } from "@constants/frameImages.js";
import styles from "./EditSnapshot.module.scss";
import html2canvas from "html2canvas";

const EditSnapshot = () => {
  const [images, setImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [imgFilter, setImgFilter] = useState("");
  const [congratulationText, setCongratulationText] = useState(
    "Happy Birthday\nAsakura Shin"
  );
  const resultRef = useRef();

  const navigate = useNavigate();
  const { type } = useParams();
  const frame = resultFrame[type];

  const filter = [
    "no filter",
    "gingham",
    "moon",
    "lark",
    "reyes",
    "juno",
    "slumber",
    "willow",
    "blurBright",
    "softGlow",
    "rosy",
  ];

  const filterMap = {
    clarendon: "contrast(1.2) saturate(1.35)",
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

  // 이미지 가져오기
  useEffect(() => {
    const stored = localStorage.getItem("capturedImages");
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

  // 필터 변경 시 canvas로 적용해서 렌더할 이미지 갱신
  useEffect(() => {
    if (images.length === 0) return;

    const applyFilterToImages = async () => {
      const newImages = await Promise.all(
        images.map((src) => {
          return new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.src = src;
            img.onload = () => {
              const canvas = document.createElement("canvas");
              canvas.width = img.width;
              canvas.height = img.height;
              const ctx = canvas.getContext("2d");
              ctx.filter =
                imgFilter && filterMap[imgFilter] ? filterMap[imgFilter] : "none";
              ctx.drawImage(img, 0, 0);
              resolve(canvas.toDataURL("image/png"));
            };
          });
        })
      );
      setFilteredImages(newImages);
    };

    applyFilterToImages();
  }, [images, imgFilter]);

  const handleFilter = (filterName) => {
    setImgFilter(filterName === "no filter" ? "" : filterName);
  };

  const handleCongText = (e) => {
    setCongratulationText(e.target.value);
  };

  const saveFilteredImages = async () => {
    localStorage.setItem("filteredImages", JSON.stringify(filteredImages));
    localStorage.setItem("congratulationText", congratulationText);
    navigate("/save/" + type);
  };

  const downloadImage = async () => {
    if (!resultRef.current) return;

    try {
      const canvas = await html2canvas(resultRef.current, {
        useCORS: true,
        allowTaint: false,
      });
      const dataUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = "snapshot.png";
      a.click();
    } catch (err) {
      console.error("이미지 저장 실패", err);
    }
  };

  return (
    <div className={styles.container}>
      {filter.map((item) => (
        <button key={item} onClick={() => handleFilter(item)}>
          {item}
        </button>
      ))}

      <div>
        <label>축하 멘트를 적어주세요!</label>
        <textarea value={congratulationText} onChange={handleCongText} />
      </div>

      <div className={styles.resultFrameWrap} ref={resultRef}>
        <img src={frame} className={styles.resultFrame} alt="Frame" />
        <div className={styles.capturedImgWrap}>
          {filteredImages.map((src, index) => (
            <img
              key={index}
              src={src}
              className={styles.capturedImg}
              alt={`Captured ${index + 1}`}
            />
          ))}
        </div>
        <div className={styles.congratulationText}>
          {congratulationText.split("\n").map((line, idx) => (
            <span key={idx}>
              {line}
              <br />
            </span>
          ))}
        </div>
      </div>

      <button onClick={saveFilteredImages}>수정 완료</button>
      <button onClick={downloadImage}>다운로드</button>
    </div>
  );
};

export default EditSnapshot;
