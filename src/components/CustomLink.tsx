// components/CustomLink.js

import Link from 'next/link';
import styles from './CustomLink.module.css'; // Importing CSS module for styling
import { ReactNode } from 'react';

const CustomLink = ({ href, target, children }: { href?: string; target?: string; children: ReactNode }) => {
  return href && (
    <Link href={href} legacyBehavior>
      <a className={styles.customLink} target={target}>{children}</a>
    </Link>
  );
};

export default CustomLink;
