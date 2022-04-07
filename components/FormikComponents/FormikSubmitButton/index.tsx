import Spinner from '@/components/UI/Spinner';
import styles from './submit.module.scss';

export default function FormikSubmitButton({
  isSubmitting,
  margin = 6,
  text,
}: {
  isSubmitting: boolean;
  margin?: number;
  text: string;
}) {
  const btnText: string = isSubmitting ? 'Submitting...' : 'Submit';
  return (
    <div
      className={styles.button__container}
      style={{ margin: `${`${margin.toString()}px`} 0px` }}
    >
      <button
        className={`${styles.formik__submit__button} ${styles.btn__click}`}
        type='submit'
        disabled={isSubmitting}
      >
        {isSubmitting && (
          <span>
            <Spinner color='white' height={2} />
          </span>
        )}
        {text}
      </button>
    </div>
  );
}
