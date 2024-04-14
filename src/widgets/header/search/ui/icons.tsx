import styles from "./SearchBar.module.css";

export function ZoomIcon() {
  // TODO: Replace icons in code with better solution
  return (
    <i className={styles.searchIconContainer}>
      <svg
        className={styles.searchZoomIcon}
        viewBox="0 0 32 32"
        fill="currentColor"
        width={16}
        height={16}
        xmlns="http://www.w3.org/2000/svg"
      >
        <g>
          <path d="M29.71,28.29l-6.5-6.5-.07,0a12,12,0,1,0-1.39,1.39s0,.05,0,.07l6.5,6.5a1,1,0,0,0,1.42,0A1,1,0,0,0,29.71,28.29ZM14,24A10,10,0,1,1,24,14,10,10,0,0,1,14,24Z" />
        </g>
      </svg>
    </i>
  );
}
export function CloseIcon() {
  // TODO: Replace icons in code with better solution
  return (
    <i className={styles.searchIconContainer} id="close-icon">
      <svg
        className={styles.searchCloseIcon}
        fill="currentColor"
        height="10px"
        width="10px"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 460.775 460.775"
      >
        <path
          d="M285.08,230.397L456.218,59.27c6.076-6.077,6.076-15.911,0-21.986L423.511,4.565c-2.913-2.911-6.866-4.55-10.992-4.55
        c-4.127,0-8.08,1.639-10.993,4.55l-171.138,171.14L59.25,4.565c-2.913-2.911-6.866-4.55-10.993-4.55
        c-4.126,0-8.08,1.639-10.992,4.55L4.558,37.284c-6.077,6.075-6.077,15.909,0,21.986l171.138,171.128L4.575,401.505
        c-6.074,6.077-6.074,15.911,0,21.986l32.709,32.719c2.911,2.911,6.865,4.55,10.992,4.55c4.127,0,8.08-1.639,10.994-4.55
        l171.117-171.12l171.118,171.12c2.913,2.911,6.866,4.55,10.993,4.55c4.128,0,8.081-1.639,10.992-4.55l32.709-32.719
        c6.074-6.075,6.074-15.909,0-21.986L285.08,230.397z"
        />
      </svg>
    </i>
  );
}
