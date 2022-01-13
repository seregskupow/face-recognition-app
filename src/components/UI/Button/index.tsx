import styles from './button.module.scss';

type ButtonProps = {
  className?: string;
  fontSize?: number;
  text: string;
  event?: () => void;
  color?: 'contrast' | 'default';
};
/**
 * Select component
 * @param number fontSize rem
 * @param  text Button label
 * @param event Function executed on click
 * @param color "contrast" or "default"
 */
const Button = ({
  className = '',
  fontSize = 1.5,
  text,
  event = () => {},
  color = 'default',
}: ButtonProps) => {
  return (
    <button
      type='button'
      onClick={event}
      style={{ fontSize: `${fontSize}rem` }}
      className={`${styles.btn} ${
        styles[`btn-${color}`]
      } btn__click ${className}`}
    >
      <span>{text}</span>
    </button>
  );
};

export default Button;
