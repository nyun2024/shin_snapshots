import FrameTypeButton from "@components/button/FrameTypeButton";
import WebCam from "../Snapshot/WebCam";
import styles from "./Home.module.scss";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const goToWebCam = (type) => {
    navigate(`/webcam/${type}`);
  };
  return (
    <>
      <div className={styles.title}>
        Happy
        <br />
        Birthday
        <br />
        <strong>Asakura Shin</strong>
      </div>
      <div className={styles.frameButtonWrap}>
        <FrameTypeButton type="black" onClick={() => goToWebCam("black")} />
        <FrameTypeButton type="white" onClick={() => goToWebCam("white")} />
      </div>
    </>
  );
};

export default Home;
