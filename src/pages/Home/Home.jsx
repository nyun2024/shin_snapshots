import WebCam from "../Snapshot/WebCam";
import styles from "./Home.module.scss";

const Home = () => {
  return (
    <>
      <div className={styles.title}>
        Happy
        <br />
        Birthday
        <br />
        <strong>Asakura Shin</strong>
      </div>
      <WebCam />
    </>
  );
};

export default Home;
