import styles from './textField.module.scss';
import { Field, ErrorMessage, useField } from 'formik';
import { useState } from 'react';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
type fieldInputs = {
  type: 'text' | 'password' | 'email';
  name: string;
  margin?: number;
  disabled?: boolean;
};

const ShowBtn: React.FC<{ show: boolean; setShow: () => void }> = ({
  show,
  setShow,
}) => {
  return (
    <div className={styles.show__password__btn} onClick={setShow}>
      {show === true ? (
        <AiFillEyeInvisible className='btn__click' />
      ) : (
        <AiFillEye className='btn__click' />
      )}
    </div>
  );
};

const FormikTextField: React.FC<fieldInputs> = ({
  type,
  name,
  margin = 6,
  disabled = false,
}) => {
  const [fieldType, setFieldType] = useState<'text' | 'password' | 'email'>(
    type
  );
  const [field, meta] = useField(name);
  const errorClass = meta.error && meta.touched ? styles.field__error : '';
  return (
    <div className={styles.form__field__wrapper}>
      <div
        className={`${styles.form__field__container} ${errorClass}`}
        style={{ margin: `${`${margin.toString()}px`} 0px` }}
      >
        <Field
          className={styles.form__field}
          disabled={disabled}
          data-type={type}
          type={type === 'password' ? fieldType : type}
          name={name}
        />
        {type === 'password' && (
          <ShowBtn
            show={fieldType !== 'password'}
            setShow={() =>
              setFieldType(fieldType === 'password' ? 'text' : 'password')
            }
          />
        )}
      </div>
      <ErrorMessage
        className={styles.form__input__error}
        name={name}
        component='div'
      />
    </div>
  );
};
export default FormikTextField;
