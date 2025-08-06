// pages/_app.tsx
import '../styles/globals.css'  // ここでTailwindなどのグローバルCSSを読み込む
export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}