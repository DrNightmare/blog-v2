// components/CustomLink.js

import Link from 'next/link';
import styles from './CustomLink.module.css'; // Importing CSS module for styling

const CustomLink = ({ href, target, children }) => {
  return (
    <Link href={href} legacyBehavior>
      <a className={styles.customLink} target={target}>{children}</a>
    </Link>
  );
};

export default CustomLink;
