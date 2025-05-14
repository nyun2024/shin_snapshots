import { useEffect, useState, useRef } from "react";
import html2canvas from "html2canvas";
import { resultFrame } from "@constants/frameImages";
import { useParams } from "react-router-dom";
import styles from "./SaveSnapshot.module.scss";

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

    const canvas = await html2canvas(resultRef.current);
    const dataUrl = canvas.toDataURL("image/png");

    const userAgent = navigator.userAgent.toLowerCase();
    const isIOSChrome =
      /iphone|ipad|ipod/.test(userAgent) && /crios/.test(userAgent);

    if (isIOSChrome) {
      const newTab = window.open();
      if (newTab) {
        newTab.document.body.innerHTML = `
        <p style="text-align: center; font-family: sans-serif;">길게 눌러 이미지를 저장하세요</p>
        <img src="${dataUrl}" alt="snapshot" style="width: 100%;" />
      `;
      } else {
        alert("팝업 차단이 활성화되어 이미지를 열 수 없습니다.");
      }
    } else {
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "snapshot.png";
      link.click();
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
