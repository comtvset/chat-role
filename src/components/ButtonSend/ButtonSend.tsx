import styles from './ButtonSend.module.scss';
// import Arrow from '../../assets/arrow-right.svg?react';
import Arrow from '../../assets/arrow-right.svg?react';
// import { ReactComponent as Arrow } from '../../assets/arrow-right.svg';

type ButtonSendProps = {
  onClick: () => void;
  disabled?: boolean;
};

export const ButtonSend: React.FC<ButtonSendProps> = ({ onClick, disabled }) => {
  return (
    <>
      <button onClick={onClick} disabled={disabled} className={styles.button}>
        <Arrow className={styles.icon} />
      </button>
    </>
  );
};
