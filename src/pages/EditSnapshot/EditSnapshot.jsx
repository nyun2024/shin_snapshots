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

    const userAgent = navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);

    if (isIOS) {
      // iOS: 새 탭에서 이미지 열기
      const newTab = window.open();
      if (newTab) {
        newTab.document.body.innerHTML = `
        <p style="text-align:center; font-family:sans-serif;">길게 눌러 이미지를 저장하세요</p>
        <img src="${dataUrl}" alt="snapshot" style="width:100%;" />
      `;
      } else {
        alert("팝업 차단이 활성화되어 이미지를 열 수 없습니다.");
      }
    } else {
      // 그 외 환경: 다운로드
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "snapshot.png";
      link.click();
    }
  };

  return (
    <div className={styles.container}>
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
