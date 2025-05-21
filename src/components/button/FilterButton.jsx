import classNames from "classnames";
import styles from "./FilterButton.module.scss";

const FilterButton = ({ text, key, onClick, disabled, className }) => {
  return (
    <button
      type="button"
      key={key}
      className={classNames(styles.filterBtn, className)}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default FilterButton;
