import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export function useUnsavedChanges(enabled) {
    const navigate = useNavigate()

    useEffect(() => {
        function onBeforeUnload(e) {
            if (!enabled) return
            e.preventDefault()
            e.returnValue = ''
        }
        window.addEventListener('beforeunload', onBeforeUnload)
        return () => window.removeEventListener('beforeunload', onBeforeUnload)
    }, [enabled])

    function confirmNavigate(to) {
        if (!enabled) { navigate(to); return }
        const ok = window.confirm('You have unsaved changes. Leave this page?')
        if (ok) navigate(to)
    }

    return { confirmNavigate }
}
