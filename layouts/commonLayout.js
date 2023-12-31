import { NextSeo } from "next-seo";
import Head from "next/head";

export default function CommonLayout({ children }) {
  return (
    <>
      <NextSeo
        title={"LEADdata"}
        description={"LEADdata website"}
        additionalMetaTags={[
          {
            name: "viewport",
            content: "width=device-width,initial-scale=1.0,shrink-to-fit=no, maximum-scale=1.0,user-scalable=no",
          },
        ]}
        openGraph={{
          url: "",
          title: "LEADdata",
          description: "LEADdata website",
          site_name: "LEADdata",
          type: "website",
          images: [
            {
              url: "/assets/images/share_l.jpg",
              alt: "LEADdata",
              type: "image/jpg",
            },
          ],
        }}
      />
      <Head>
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="76x76" href="/favicon.ico" />
      </Head>

      {children}
    </>
  );
}
