import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="id">
      <Head>
        <link rel="icon" href="/icon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/icon.png" />
        <meta name="theme-color" content="#E11D3A" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
