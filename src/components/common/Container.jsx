import useIsMobile from "@utils/useIsMobile";
import classNames from "classnames";
import styles from "./Container.module.scss";
import Header from "./Header";

const Container = ({ children, className, isHome, isWebCam }) => {
  const isMobile = useIsMobile();

  return (
    <div
      className={classNames(
        isMobile ? styles.mobile : styles.pc,
        isWebCam && styles.isWebCam,
        styles.container,
        isHome && styles.isHome
      )}
    >
      {!isWebCam && <Header />}
      <div className={classNames(styles.contents, className)}>{children}</div>
    </div>
  );
};

export default Container;
