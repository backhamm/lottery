import React from 'react'
import ReactDOM from 'react-dom/client'
import Home from './pages'
import './utils/entry'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Home />
    </React.StrictMode>,
)

// Remove Preload scripts loading
postMessage({ payload: 'removeLoading' }, '*')
