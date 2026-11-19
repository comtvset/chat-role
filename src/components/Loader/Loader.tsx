import styles from './Loader.module.scss';

export const Loader: React.FC = () => {
  return (
    <div className={styles.loaderWrapper}>
      <span className={styles.loader}></span>
    </div>
  );
};
