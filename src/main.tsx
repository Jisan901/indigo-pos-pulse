import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import React from 'react';
import { Provider } from 'react-redux';
import { persist, store } from './store/app/store.ts';
import { PersistGate } from 'redux-persist/integration/react';

createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <Provider store={store}>
            <PersistGate persistor={persist}>
                <App />
            </PersistGate>
        </Provider>
    </React.StrictMode>
);
