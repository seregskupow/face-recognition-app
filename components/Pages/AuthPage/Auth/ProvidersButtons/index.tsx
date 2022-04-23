import styles from './providerBtn.module.scss';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { FC } from 'react';
import GoogleImg from './google.svg';
import FacebookImg from './facebook.svg';
import { useActions } from '@/store/useActions';
import clsx from 'clsx';

const providers = {
  google: {
    url: process.env.NEXT_PUBLIC_GOOGLE_LOGIN,
    img: <GoogleImg />,
    title: 'Google',
  },
  facebook: {
    url: '',
    img: <FacebookImg />,
    title: 'Facebook',
  },
};

const ProviderButtons: FC<any> = () => {
  const { authenticateUser } = useActions();
  const redirectToGoogleSSO = async (url: string) => {
    let timer: NodeJS.Timeout | null = null;
    const newWindow = window.open(url, '_blank', 'width=500,height=600');

    if (newWindow) {
      timer = setInterval(() => {
        if (newWindow.closed) {
          authenticateUser();
          if (timer) clearInterval(timer);
        }
      }, 500);
    }
  };
  return (
    <div className={styles.provider__buttons__container}>
      <div className={styles.divider} />
      <ProviderBtn
        onClick={() => redirectToGoogleSSO(providers.google.url as string)}
        img={providers.google.img}
        title={providers.google.title}
        disabled={false}
      />
      <ProviderBtn
        onClick={() => redirectToGoogleSSO(providers.facebook.url as string)}
        img={providers.facebook.img}
        title={providers.facebook.title}
        disabled={true}
      />
    </div>
  );
};
export default ProviderButtons;
interface IProviderBtn {
  onClick: () => void;
  disabled: boolean;
  img: JSX.Element;
  title: string;
}
const ProviderBtn: FC<IProviderBtn> = ({ onClick, disabled, img, title }) => {
  return (
    <button
      type='button'
      className={clsx(styles.provider__btn, 'btn__click')}
      onClick={onClick}
      disabled={disabled}
    >
      <div className={styles.provider__logo}>{img}</div>
      <span>{title}</span>
    </button>
  );
};
