import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import useIsMobile from "@utils/useIsMobile";
import styles from "./Home.module.scss";
import Container from "@components/common/Container";
import classNames from "classnames";
import shin01 from "@img/home/home_shin01.png";
import shin02 from "@img/home/home_shin02.png";
import shin03 from "@img/home/home_shin03.png";
import shin04 from "@img/home/home_shin04.png";
import starLine from "@img/home/StarLine.gif";
import Loading from "@pages/Loading/Loading";

const images = [shin01, shin02, shin03, shin04];

const Home = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const goToSelect = () => {
    navigate("/select");
  };

  useEffect(() => {
    // WebCam 이미지 초기화
    localStorage.removeItem("filteredImages");
    localStorage.setItem("saveEdit", false);

    // Loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

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

  // main img fade inout 애니메이션
  useEffect(() => {
    if (!isLoading) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [isLoading]);

  return (
    <>
      {isLoading ? <Loading /> : ""}
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
              <div className={styles.imgInnerWrap}>
                {images.map((src, index) => (
                  <img
                    key={index}
                    src={src}
                    className={classNames(styles.mainImg, {
                      [styles.visible]: index === currentImageIndex,
                    })}
                    alt={`home image ${index + 1}`}
                  />
                ))}
                <img src={shin01} className={styles.dummyImg} />
              </div>
              <div className={styles.birth}></div>
              <div className={styles.imgCount}>
                0{currentImageIndex + 1} / 0{images.length}
              </div>
            </div>
            <button type="button" className={styles.goBtn} onClick={goToSelect}>
              <span>GO</span>
            </button>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Home;
