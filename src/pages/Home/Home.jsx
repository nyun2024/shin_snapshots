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
      <div className={styles.contentsInner}>
        <h2 className={styles.title}>
          <div>Happy Birthday</div>
          <div>{!isMobile && "Asakura "}Shin</div>
        </h2>
        <div className={styles.homeMainWrap}>
          <img src={starLine} className={styles.starLine} />
          <div className={styles.imgWrap}>
            <img src={shin01} className={styles.mainImg} alt="home image" />
            <div className={styles.birth}></div>
            <button type="button" className={styles.goBtn} onClick={goToSelect}>
              <span>GO</span>
            </button>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Home;
