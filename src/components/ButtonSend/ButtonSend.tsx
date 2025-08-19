import styles from './ButtonSend.module.scss';
// import Arrow from '../../assets/arrow-right.svg?react';
import Arrow from '../../assets/arrow-right.svg?react';
// import { ReactComponent as Arrow } from '../../assets/arrow-right.svg';

type ButtonSendProps = {
  onClick: () => void;
};

export const ButtonSend: React.FC<ButtonSendProps> = ({ onClick }) => {
  return (
    <>
      <button onClick={onClick} className={styles.button}>
        <Arrow className={styles.icon} />
      </button>
    </>
  );
};
