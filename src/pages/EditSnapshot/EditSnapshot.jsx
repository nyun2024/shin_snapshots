import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { resultFrame } from "@constants/frameImages.js";
import styles from "./EditSnapshot.module.scss";
import classNames from "classnames";
import html2canvas from "html2canvas";

const EditSnapshot = () => {
  const [images, setImages] = useState([]);
  const [imgFilter, setImgFilter] = useState("");
  const [congratulationText, setCongratulationText] = useState(
    `Happy Birthday\nAsakura Shin`
  );

  const navigate = useNavigate();
  const { type } = useParams();
  const frame = resultFrame[type];

  const resultRef = useRef(null); // 캡처 대상 ref

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

  const handleFilter = (filterName) => {
    setImgFilter(filterName === "no filter" ? "" : filterName);
  };

  const handleCongText = (e) => {
    setCongratulationText(e.target.value);
  };

  const downloadImage = async () => {
    if (!resultRef.current) return;

    const canvas = await html2canvas(resultRef.current);
    const dataUrl = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "snapshot.png";
    link.click();
  };

  return (
    <div>
      {filter.map((item) => (
        <button key={item} type="button" onClick={() => handleFilter(item)}>
          {item}
        </button>
      ))}

      <div>
        <label>축하 멘트를 적어주세요!</label>
        <textarea onChange={handleCongText} />
      </div>

      <div className={styles.resultFrameWrap} ref={resultRef}>
        <img src={frame} className={styles.resultFrame} alt="Frame" />
        <div className={styles.capturedImgWrap}>
          {images.map((src, index) => (
            <img
              key={index}
              className={classNames(
                styles.capturedImg,
                styles[`filter-${imgFilter}`]
              )}
              src={src}
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

      <button type="button" onClick={downloadImage}>
        이미지 다운로드
      </button>

      <button type="button" onClick={goHome}>
        다시 찍기
      </button>
    </div>
  );
};

export default EditSnapshot;
