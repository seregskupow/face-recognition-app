import styles from './styledLink.module.scss';
import Link from 'next/link';
import React from 'react';
import { useRouter } from 'next/router';

interface IProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  prefetch?: boolean;
  checkActive?: boolean;
  className?: string;
}
const StyledLink = React.forwardRef(
  (
    { href, prefetch, checkActive = false, className = '', ...props }: IProps,
    ref: any
  ) => {
    const router = useRouter();
    const activeClass =
      checkActive && router.pathname === href ? styles.active : '';
    return (
      <Link href={href} prefetch={prefetch || false}>
        <a
          className={`${styles['styled-link']} ${activeClass} ${className}`}
          {...props}
          ref={ref}
        />
      </Link>
    );
  }
);
StyledLink.displayName = 'MyLink';
export default StyledLink;
