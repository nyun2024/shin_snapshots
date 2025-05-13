import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { resultFrame } from "@constants/frameImages.js";
import styles from "./EditSnapshot.module.scss";

const EditSnapshot = () => {
  const [images, setImages] = useState([]);
  const navigate = useNavigate();
  const { type } = useParams(); // URL에서 type 추출
  const frame = resultFrame[type];

  useEffect(() => {
    const stored = localStorage.getItem("capturedImages");
    localStorage.setItem("resultSnapshot", true);

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

  const goHome = () => {
    navigate("/");
  };

  return (
    <div>
      <h2>꾸미기</h2>
      <div className={styles.resultFrameWrap}>
        <img src={frame} className={styles.resultFrame} alt="Frame" />
        <div className={styles.capturedImgWrap}>
          {images.map((src, index) => (
            <img
              key={index}
              className={styles.capturedImg}
              src={src}
              alt={`Captured ${index + 1}`}
            />
          ))}
        </div>
      </div>
      <button type="button" onClick={goHome}>
        다시 찍기
      </button>
    </div>
  );
};

export default EditSnapshot;
