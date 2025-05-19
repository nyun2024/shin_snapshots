import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import useIsMobile from "@utils/useIsMobile";
import styles from "./Home.module.scss";
import Container from "@components/common/Container";
import classNames from "classnames";
import shin01 from "@img/home/home_shin01.png";
import starLine from "@img/home/StarLine.gif";

const Home = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const goToSelect = () => {
    navigate("/select");
  };

  useEffect(() => {
    // WebCam 이미지 초기화
    localStorage.removeItem("filteredImages");
  }, []);

  return (
    <Container
      className={classNames(
        styles.homeContents,
        isMobile ? styles.homeMobile : styles.homePC
      )}
      isHome
    >
      <h2 className={styles.title}>
        Happy Birthday
        <br />
        Shin
      </h2>
      <div className={styles.homeMainWrap}>
        <img src={starLine} className={styles.starLine} />
        <div className={styles.imgWrap}>
          <img src={shin01} className={styles.mainImg} alt="home image" />
        </div>
      </div>
    </Container>
  );
};

export default Home;
