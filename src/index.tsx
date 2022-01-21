import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux';
import { store } from '@/store/index';
import * as serviceWorker from './serviceWorker';
import { injectStore } from '@/api';

injectStore(store);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

serviceWorker.unregister();
