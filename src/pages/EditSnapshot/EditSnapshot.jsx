import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { resultFrame } from "@constants/frameImages.js";
import styles from "./EditSnapshot.module.scss";
import html2canvas from "html2canvas";

const EditSnapshot = () => {
  const [images, setImages] = useState([]);
  const [congratulationText, setCongratulationText] = useState("Happy Birthday\nAsakura Shin");
  const resultRef = useRef();

  const navigate = useNavigate();
  const { type } = useParams();
  const frame = resultFrame[type];

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

  const handleCongText = (e) => {
    setCongratulationText(e.target.value);
  };

  const saveFilteredImages = () => {
    // 필터 재적용 없이 그대로 저장
    localStorage.setItem("filteredImages", JSON.stringify(images));
    localStorage.setItem("congratulationText", congratulationText);
    navigate("/save/" + type);
  };

  const downloadImage = async () => {
    if (!resultRef.current) return;

    try {
      const canvas = await html2canvas(resultRef.current, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        scale: 2,
      });

      const dataURL = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = dataURL;
      a.download = "snapshot.png";
      a.click();
    } catch (err) {
      console.error("이미지 저장 실패", err);
    }
  };

  return (
    <div className={styles.container}>
      <div>
        <label>축하 멘트를 적어주세요!</label>
        <textarea value={congratulationText} onChange={handleCongText} />
      </div>

      <div className={styles.resultFrameWrap} ref={resultRef}>
        <img src={frame} className={styles.resultFrame} alt="Frame" />
        <div className={styles.capturedImgWrap}>
          {images.map((src, index) => (
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
