import 'tailwindcss/tailwind.css';
import 'react-toastify/dist/ReactToastify.css';
import { SessionProvider } from 'next-auth/react';
import { Provider } from 'react-redux';
import { store, persistor } from '../redux/Store';
import { PersistGate } from 'redux-persist/integration/react';
import { ToastContainer } from 'react-toastify';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const getLayout = Component.getLayout || ((page) => page);
  return (
    <SessionProvider session={session}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ToastContainer />
          {getLayout(<Component {...pageProps} />)}
        </PersistGate>
      </Provider>
    </SessionProvider>
  );
}

export default MyApp;
