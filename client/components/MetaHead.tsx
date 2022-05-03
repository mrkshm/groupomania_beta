import React from "react";
import Head from "next/head";

function MetaHead() {
  return (
    <Head>
      <title>Groupomania</title>
      <meta
        name="Groupomania"
        content="Le reseau social de votre entreprise."
      />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
}

export default MetaHead;
