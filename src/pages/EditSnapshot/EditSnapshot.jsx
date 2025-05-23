import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { resultFrame } from "@constants/frameImages.js";
import styles from "./EditSnapshot.module.scss";
import html2canvas from "html2canvas";
import Container from "@components/common/Container";
import useIsMobile from "@utils/useIsMobile";
import classNames from "classnames";

const EditSnapshot = () => {
  const [images, setImages] = useState([]);
  const [congratulationText, setCongratulationText] = useState(
    "Happy Birthday\nAsakura Shin"
  );
  const resultRef = useRef();
  const { type } = useParams();
  const frame = resultFrame[type];
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect(() => {
    const stored = localStorage.getItem("filteredImages");
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
    const newText = e.target.value;

    // 현재보다 짧아지거나, 20자 이내면 허용
    if (newText.length <= 25 || newText.length < congratulationText.length) {
      setCongratulationText(newText);
    }
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

      const userAgent = navigator.userAgent.toLowerCase();
      const isIOSChrome =
        /iphone|ipad|ipod/.test(userAgent) && /crios/.test(userAgent);

      if (isIOSChrome) {
        const newTab = window.open();
        if (newTab) {
          newTab.document.body.innerHTML = `
          <p style="text-align: center; font-family: sans-serif;">길게 눌러 이미지를 저장하세요</p>
          <img src="${dataURL}" alt="snapshot" style="width: 100%;" />
        `;
        } else {
          alert("팝업 차단이 활성화되어 이미지를 열 수 없습니다.");
        }
      } else {
        const link = document.createElement("a");
        link.href = dataURL;
        link.download = "snapshot.png";
        link.click();
      }
    } catch (err) {
      console.error("이미지 저장 실패", err);
    }
  };

  return (
    <Container
      className={classNames(
        styles.EditSaveContainer,
        isMobile ? styles.mobile : styles.pc
      )}
    >
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
      <div className={styles.editSaveEtc}>
        <div className={styles.textAreaWrap}>
          <div>* 프레임 하단 문구 (20자 제한)</div>
          <textarea
            value={congratulationText}
            onChange={handleCongText}
            placeholder="문구를 입력해주세요."
          />
        </div>
        <button
          type="button"
          className={styles.downloadBtn}
          onClick={downloadImage}
        >
          다운로드
        </button>
      </div>
    </Container>
  );
};

export default EditSnapshot;
