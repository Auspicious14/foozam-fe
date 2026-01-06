import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <title>FooZam | Shazam for Food Discovery</title>
        <meta
          name="description"
          content="Identify any dish in seconds. FooZam uses advanced AI to discover ingredients, nutritional facts, and local spots for your favorite foods."
        />
        <meta
          name="keywords"
          content="FooZam, food recognition, AI food identifier, dish recognition, Nigerian food, recipe discovery, food nutritional facts, local restaurants"
        />
        <meta name="author" content="FooZam AI" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://foozam.ai/" />
        <meta property="og:title" content="FooZam | Shazam for Food Discovery" />
        <meta property="og:description" content="Identify any dish in seconds with FooZam. Advanced AI for the ultimate foodie experience." />
        <meta property="og:image" content="/logo.png" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://foozam.ai/" />
        <meta property="twitter:title" content="FooZam | Shazam for Food Discovery" />
        <meta property="twitter:description" content="Identify any dish in seconds with FooZam. Advanced AI for the ultimate foodie experience." />
        <meta property="twitter:image" content="/logo.png" />

        <link rel="icon" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <meta name="theme-color" content="#FF8A00" />
      </Head>

      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}