/* eslint-disable react/jsx-props-no-spreading */
import styles from './checkbox.module.scss';
import { Field, FieldProps, useFormikContext } from 'formik';
import { FC } from 'react';

interface Props {
  name: string;
  value: string | number;
  label: string;
  delay: number;
}

const Checkbox: FC<Props> = ({ value, name, delay, label, ...props }) => {
  const { submitForm } = useFormikContext();
  const submitOnChange = () => {
    setTimeout(submitForm, delay);
  };
  return (
    <Field name={name}>
      {({ field, form }: FieldProps) => (
        <label className={styles.checkbox}>
          {label}
          <input
            type='checkbox'
            {...props}
            checked={field.value.includes(value)}
            onChange={() => {
              if (field.value.includes(value)) {
                const nextValue = field.value.filter(
                  (val: any) => val !== value
                );
                form.setFieldValue(name, nextValue);
              } else {
                const nextValue = field.value.concat(value);
                form.setFieldValue(name, nextValue);
              }
              submitOnChange();
            }}
          />
          <span className={styles.checkmark}></span>
        </label>
      )}
    </Field>
  );
};

export default Checkbox;
