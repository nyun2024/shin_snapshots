import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { resultFrame } from "@constants/frameImages.js";
import styles from "./SaveEditSnapshot.module.scss";
import html2canvas from "html2canvas";
import Container from "@components/common/Container";
import useIsMobile from "@utils/useIsMobile";
import classNames from "classnames";

const SaveEditSnapshot = () => {
  const [images, setImages] = useState([]);
  const [congratulationText, setCongratulationText] = useState(
    "Happy Birthday\nAsakura Shin"
  );
  const [textareaText, setTextareaText] = useState("");
  const [isHorMobileOnly, setisHorMobileOnly] = useState(false);
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

    // 모바일 감지(테블릿 제외)
    const ua = navigator.userAgent.toLowerCase();
    const isTablet =
      /ipad/.test(ua) ||
      (/(android)/.test(ua) && !/mobile/.test(ua)) ||
      (window.innerWidth >= 768 && window.innerWidth <= 1024);

    const isMobile = /iphone|ipod|android.*mobile|windows phone/.test(ua);

    setisHorMobileOnly(isMobile && !isTablet);

    // 뒤로가시 시 홈으로 이동
    localStorage.setItem("saveEdit", true);
  }, []);

  const goToSelect = () => {
    navigate("/select");
  };

  const handleCongText = (e) => {
    const newText = e.target.value;

    // 25자 제한
    if (newText.length <= 25 || newText.length < textareaText.length) {
      setTextareaText(newText);
      setCongratulationText(newText);
    }
    // 입력값이 없으면 생일문구 노출
    if (newText.length === 0) {
      setCongratulationText("Happy Birthday\nAsakura Shin");
    }
  };

  const downloadImage = async () => {
    if (!resultRef.current) return;

    try {
      const canvas = await html2canvas(resultRef.current, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        scale: 4,
      });

      const dataURL = canvas.toDataURL("image/png");

      const userAgent = navigator.userAgent.toLowerCase();
      const isIOSChrome =
        /iphone|ipad|ipod/.test(userAgent) && /crios/.test(userAgent);

      if (isIOSChrome) {
        const newTab = window.open();
        if (newTab) {
          newTab.document.body.innerHTML = `
          <p style="text-align: center; font-family: sans-serif; font-size: 40px; margin: 20px 0 16px;">길게 눌러 이미지를 저장하세요</p>
          <img src="${dataURL}" alt="snapshot" style="width: 100%;" />
        `;
        } else {
          alert("팝업 차단이 활성화되어 이미지를 열 수 없습니다.");
        }
      } else {
        const link = document.createElement("a");
        link.href = dataURL;
        link.download = "shin-snapshot.png";
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
        isMobile ? styles.mobile : styles.pc,
        isHorMobileOnly && styles.isHorMobileOnly,
        type === "white" && styles.white
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
        {type !== "white" && (
          <div
            className={classNames(
              styles.congratulationText,
              type === "blue" && styles.blueText
            )}
          >
            {congratulationText.split("\n").map((line, idx) => (
              <span key={idx}>
                {line}
                <br />
              </span>
            ))}
          </div>
        )}
      </div>
      <div className={styles.editSaveEtc}>
        {type !== "white" && (
          <div className={styles.textAreaWrap}>
            <div>* 프레임 하단 문구 (25자 제한)</div>
            <textarea
              value={textareaText}
              onChange={handleCongText}
              placeholder="문구를 입력해주세요."
            />
          </div>
        )}
        <div className={styles.buttonContainer}>
          <button
            type="button"
            className={classNames(styles.downloadBtn, styles.etcButton)}
            onClick={downloadImage}
          >
            다운로드
          </button>
          <button
            type="button"
            className={classNames(styles.replayBtn, styles.etcButton)}
            onClick={goToSelect}
          >
            재촬영 하기
          </button>
        </div>
      </div>
    </Container>
  );
};

export default SaveEditSnapshot;
