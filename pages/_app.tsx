// pages/_app.tsx
import { AppProps } from 'next/app';
import "../styles/globals.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}