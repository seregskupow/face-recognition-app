import { WikiActorInfo } from "@/types";
import clsx from "clsx";
import { FC } from "react";
import styles from "./actorCardSmall.module.scss";

interface WikiCardProps extends WikiActorInfo {}

const WikiCard: FC<WikiCardProps> = ({ name, photo, link }) => (
  <a
    href={link}
    target="_blank noreferrer"
    onClick={(e) => e.currentTarget.blur()}
    className={clsx(
      styles.WikiCard,
      'btn__click',
      'hover__border',
      'tab__focus'
    )}
    tabIndex={0}
  >
    <div className={styles.body}>
      <div className={styles.imgWrap}>
        <img src={photo} alt={name} />
      </div>
      <div className={styles.name}>
        <p>{name}</p>
      </div>
    </div>
  </a>
);

export default WikiCard;

export const WikiLoaderCard = () => (
  <div className={styles.WikiPreloaderCard}>
    <div className={styles.body}>
      <div className={styles.imgWrap} />
      <div className={styles.name}></div>
    </div>
  </div>
);