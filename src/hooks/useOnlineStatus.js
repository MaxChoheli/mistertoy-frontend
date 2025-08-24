import { useEffect, useState } from 'react'

export function useOnlineStatus() {
    const [isOnline, setIsOnline] = useState(navigator.onLine)
    useEffect(() => {
        function on() { setIsOnline(true) }
        function off() { setIsOnline(false) }
        window.addEventListener('online', on)
        window.addEventListener('offline', off)
        return () => {
            window.removeEventListener('online', on)
            window.removeEventListener('offline', off)
        }
    }, [])
    return isOnline
}
