import { useState, useEffect } from "react";
import black from "@img/frame/black/all_black_frame.png";
import white from "@img/frame/white/all_white_frame.png";
import styles from "./FrameTypeButton.module.scss";

const imgs = {
  black,
  white,
};

const FrameTypeButton = ({ type, onClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const imgSrc = imgs[type];

  const handleZoomClick = () => {
    setIsOpen(true);
  };

  const handleCloseClick = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  return (
    <>
      <div className={styles.frameTypeButton}>
        <div className={styles.imgWrap}>
          {imgSrc && <img src={imgSrc} alt={`${type} icon`} />}
          <button type="button" onClick={handleZoomClick}>
            확대
          </button>
        </div>
        <div>{type}</div>
        <button type="button" onClick={onClick}>
          선택
        </button>
      </div>

      {isOpen && (
        <div className={styles.frameLayer}>
          <div className={styles.dim} onClick={handleCloseClick}></div>
          <img src={imgSrc} alt={`${type} icon`} />
        </div>
      )}
    </>
  );
};

export default FrameTypeButton;
