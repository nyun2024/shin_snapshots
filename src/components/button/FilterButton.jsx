// FilterButton.js
import classNames from "classnames";
import styles from "./FilterButton.module.scss";

const FilterButton = ({
  text,
  onClick,
  disabled,
  className,
  isMobileOnly,
  isSelected,
}) => {
  return (
    <button
      type="button"
      className={classNames(
        styles.filterBtn,
        isMobileOnly && styles.isMobileOnly,
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
