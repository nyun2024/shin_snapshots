import { Link } from "react-router-dom";
import useIsMobile from "@utils/useIsMobile";
import styles from "./Header.module.scss";
import classNames from "classnames";

const Header = () => {
  const isMobile = useIsMobile();

  return (
    <header
      className={classNames(
        isMobile ? styles.mobile : styles.pc,
        styles.header
      )}
    >
      <div className={styles.headerInner}>
        <div className={styles.ect}>Esper</div>
        <div className={styles.mainLink}>
          <Link to={"/"}>ASAKURA SHIN</Link>
        </div>
        <div className={styles.ect}>Shin days</div>
      </div>
    </header>
  );
};

export default Header;
