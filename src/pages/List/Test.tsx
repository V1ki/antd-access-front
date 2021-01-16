import { TableOutlined, TabletFilled, TabletOutlined } from '@ant-design/icons';
import React from 'react';
import styles from './Test.css';


export default () => {
  return (
    <div>
      <h1 className={styles.title}>Page List/Test</h1>
      <TabletFilled />
      <TableOutlined />
    </div>
  );
}
