import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import "./style/global.css"
import "./style/Style.css"
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './style/ThemeContext'
import { reduxStore } from './redux/store.js'
import { Provider } from 'react-redux'
import { Toaster } from 'react-hot-toast'
import { HelmetProvider } from 'react-helmet-async'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <Provider store={reduxStore}>
        <BrowserRouter>
          <HelmetProvider>
            <App />
          </HelmetProvider>
          <Toaster />
        </BrowserRouter>
      </Provider>
    </ThemeProvider>
  </React.StrictMode>,
)
