import { useEffect, useState, useRef } from "react";
import { resultFrame } from "@constants/frameImages";
import { useParams } from "react-router-dom";
import styles from "./SaveSnapshot.module.scss";
import domtoimage from "dom-to-image-more";

const SaveSnapshot = () => {
  const [images, setImages] = useState([]);
  const [congratulationText, setCongratulationText] = useState("");
  const { type } = useParams();
  const frame = resultFrame[type];
  const resultRef = useRef();

  useEffect(() => {
    const stored = localStorage.getItem("filteredImages");
    const text = localStorage.getItem("congratulationText");

    if (stored) setImages(JSON.parse(stored));
    if (text) setCongratulationText(text);
  }, []);

  const downloadImage = async () => {
    if (!resultRef.current) return;

    try {
      const blob = await domtoimage.toBlob(resultRef.current);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "snapshot.png";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("이미지 저장 실패", err);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.resultFrameWrap} ref={resultRef}>
        <img src={frame} className={styles.resultFrame} alt="Frame" />
        <div className={styles.capturedImgWrap}>
          {images.map((src, idx) => (
            <img
              key={idx}
              src={src}
              className={styles.capturedImg}
              alt="Filtered"
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

      <button onClick={downloadImage}>이미지 다운로드</button>
    </div>
  );
};

export default SaveSnapshot;
