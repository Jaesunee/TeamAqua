'use client';

import { ReactNode } from 'react';
import { Navbar } from '@/app/Navbar/Navbar';
import classes from './Layout.module.css';

export const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div
      className={classes.container}
    >
      <Navbar />
      <div className={classes.content}>{children}</div>
    </div>
  );
};
