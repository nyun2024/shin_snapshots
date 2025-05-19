import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import FrameTypeButton from "@components/button/FrameTypeButton";
import styles from "./SelectFrame.module.scss";

const SelectFrame = () => {
  const navigate = useNavigate();

  const goToWebCam = (type) => {
    navigate(`/webcam/${type}`);
  };

  useEffect(() => {
    // WebCam 이미지 초기화
    localStorage.removeItem("filteredImages");
  }, []);

  return (
    <>
      <div className={styles.frameButtonWrap}>
        <FrameTypeButton type="black" onClick={() => goToWebCam("black")} />
        <FrameTypeButton type="white" onClick={() => goToWebCam("white")} />
      </div>
    </>
  );
};

export default SelectFrame;
