import styles from './Role.module.scss';

type RoleProps = {
  img: string;
  role: string;
  active: boolean;
  onClick: () => void;
};

export const Role = ({ img, role, active, onClick }: RoleProps) => {
  return (
    <button
      onClick={onClick}
      title={role}
      className={`${styles.button} ${active ? styles.buttonActive : ''}`}
    >
      <img src={img} alt={role} className={styles.img} />
    </button>
  );
};
