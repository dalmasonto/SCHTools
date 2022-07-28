import Head from 'next/head'
import Navbar from '../components/Navbar'
import { Provider } from 'react-redux'

import { useEffect } from 'react';

import 'bootstrap/dist/css/bootstrap.css';
import '../styles/globals.css'
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from '../app/store';

function MyApp({ Component, pageProps }) {
  //   async function getInitialProps({ Component, ctx }) {
  //   return {
  //     pageProps: (Component.getInitialProps ? await Component.getInitialProps(ctx) : {})
  //   };
  // }
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap");
  }, []);
  return (
    <>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <Head>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <Navbar />
          <Component {...pageProps} />
        </PersistGate>
      </Provider>
    </>
  )
}

export default MyApp
