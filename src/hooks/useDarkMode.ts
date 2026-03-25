'use client'

import { useState, useEffect } from 'react'

export function useDarkMode() {
    const [isDark, setIsDark] = useState(false)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        setIsDark(mediaQuery.matches)

        const handler = (e: MediaQueryListEvent) => setIsDark(e.matches)
        mediaQuery.addEventListener('change', handler)
        return () => mediaQuery.removeEventListener('change', handler)
    }, [])

    return { isDark, mounted }
}

// Classes helper para uso em componentes
export function getDarkModeClasses(dark: string, light: string, isDark: boolean): string {
    return isDark ? dark : light
}
