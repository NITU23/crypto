import Head from 'next/head';
import CryptoTable from '../components/cryptoTable';

const Home = () => {
  return (
    <div>
      <Head>
        <title>Crypto App</title>
        <meta name="description" content="Crypto App using Next.js and Redux" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <CryptoTable />
      </main>
    </div>
  );
};

export default Home;
