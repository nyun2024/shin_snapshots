import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import useIsMobile from "@utils/useIsMobile";
import styles from "./Home.module.scss";
import Container from "@components/common/Container";
import classNames from "classnames";
import shin01 from "@img/home/home_shin01.png";
import starLine from "@img/home/StarLine.gif";
import Loading from "@pages/Loading/Loading";

const Home = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(true);

  const goToSelect = () => {
    navigate("/select");
  };

  useEffect(() => {
    // WebCam 이미지 초기화
    localStorage.removeItem("filteredImages");

    // Loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleClick = (event) => {
      console.log("Clicked element:", event.target);
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <Container
          className={classNames(
            styles.homeContents,
            isMobile ? styles.homeMobile : styles.homePC
          )}
          isHome
        >
          <div className={styles.contentsInner}>
            <div className={styles.contentsInfo}>
              <h2 className={styles.title}>
                <div>Happy Birthday</div>
                <div>{!isMobile && "Asakura "}Shin</div>
              </h2>
              {!isMobile && (
                <ul className={styles.shinProfile}>
                  <li>
                    <label>Name</label>
                    <p>Asakura Shin</p>
                  </li>
                  <li>
                    <label>Birthday</label>
                    <p>2000.06.07</p>
                  </li>
                  <li>
                    <label>Height/Weight</label>
                    <p>172 cm/67 kg</p>
                  </li>
                  <li>
                    <label>Affiliation</label>
                    <p>Sakamoto's Store</p>
                  </li>
                  <li>
                    <label>Hobby</label>
                    <p>
                      Listening to music
                      <br />
                      Watching movies
                    </p>
                  </li>
                </ul>
              )}
            </div>
            <div className={styles.homeMainWrap}>
              <img src={starLine} className={styles.starLine} />
              <div className={styles.imgWrap}>
                <img src={shin01} className={styles.mainImg} alt="home image" />
                <div className={styles.birth}></div>
              </div>
              <button
                type="button"
                className={styles.goBtn}
                onClick={goToSelect}
              >
                <span>GO</span>
              </button>
            </div>
          </div>
        </Container>
      )}
    </>
  );
};

export default Home;
