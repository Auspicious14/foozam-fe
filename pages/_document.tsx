import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta
          name="description"
          content="Discover and share amazing Nigerian food recipes. Just upload a photo of a dish, and we'll tell you all about it!"
        />
        <meta
          name="keywords"
          content="Nigerian food, recipe identifier, food recognition, Shazam for food, African cuisine"
        />
        <meta name="author" content="Shazam for Food" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#fb923c" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}