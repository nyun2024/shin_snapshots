// FilterButton.js
import classNames from "classnames";
import styles from "./FilterButton.module.scss";

const FilterButton = ({
  text,
  onClick,
  disabled,
  className,
  isHorMobileOnly,
  isVerMobileOnly,
  isSelected,
}) => {
  return (
    <button
      type="button"
      className={classNames(
        styles.filterBtn,
        isHorMobileOnly && styles.isHorMobileOnly,
        isVerMobileOnly && styles.isVerMobileOnly,
        isSelected && styles.selected,
        className
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default FilterButton;
