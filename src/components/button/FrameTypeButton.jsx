import { useState, useEffect } from "react";
import black from "@img/frame/black/black_frame.png";
import blue from "@img/frame/blue/blue_frame.png";
import white from "@img/frame/white/white_frame.png";
import useIsMobile from "@utils/useIsMobile";
import styles from "./FrameTypeButton.module.scss";
import classNames from "classnames";

const imgs = {
  black,
  blue,
  white,
};

const FrameTypeButton = ({ type, onClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const imgSrc = imgs[type];
  const isMobile = useIsMobile();

  const handleZoomClick = () => {
    setIsOpen(true);
  };

  const handleCloseClick = () => {
    setIsOpen(false);
  };

  const capitalizeFirstLetter = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
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
      <div
        className={classNames(
          isMobile ? styles.mobile : styles.pc,
          styles.frameTypeButton
        )}
      >
        <div className={styles.frameName}>{capitalizeFirstLetter(type)}</div>
        <div
          className={classNames(
            styles.imgWrap,
            type === "white" && styles.white
          )}
        >
          {imgSrc && <img src={imgSrc} alt={`${type} icon`} />}
        </div>
        <button
          type="button"
          className={styles.selectBtn}
          onClick={onClick}
        ></button>
        <button
          type="button"
          className={styles.zoomBtn}
          onClick={handleZoomClick}
        ></button>
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
