import React from 'react'

export function NicePopup({ heading, footing, isOpen, onClose, children }) {
    React.useEffect(() => {
        function onKey(e) { if (e.key === 'Escape') onClose?.() }
        if (isOpen) document.addEventListener('keydown', onKey)
        return () => document.removeEventListener('keydown', onKey)
    }, [isOpen, onClose])

    if (!isOpen) return null

    function onBackdrop(e) {
        if (e.target === e.currentTarget) onClose?.()
    }

    return (
        <div className="popup-backdrop" onMouseDown={onBackdrop}>
            <div className="popup" role="dialog" aria-modal="true" aria-labelledby="popup-title">
                <header className="popup-header">
                    <h3 id="popup-title">{heading}</h3>
                    <button className="btn" onClick={onClose} aria-label="Close">✕</button>
                </header>
                <main className="popup-main">
                    {children}
                </main>
                <footer className="popup-footer">
                    {footing}
                </footer>
            </div>
        </div>
    )
}
