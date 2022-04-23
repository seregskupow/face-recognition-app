import { useDetectMobile } from '@/hooks/useDetectMobile';
import { FC } from 'react';
import DesktopMenu from './DesktopMenu';
import MobileMenu from './MobileMenu';

const Navigation: FC = () => {
  const isMobile = useDetectMobile();
  return isMobile ? <MobileMenu /> : <DesktopMenu />;
};

export default Navigation;
