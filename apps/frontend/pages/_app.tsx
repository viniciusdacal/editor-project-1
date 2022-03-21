import React from 'react';
import type { AppProps } from 'next/app'
import CssBaseline from '@mui/material/CssBaseline'

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => (
  <>
    <CssBaseline />
    <Component {...pageProps} />
  </>
)

export default MyApp
