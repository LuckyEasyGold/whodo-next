'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'

type Props = {
    onLoadMore: () => Promise<void>
    hasMore: boolean
    isLoading: boolean
}

export default function LoadMorePosts({ onLoadMore, hasMore, isLoading }: Props) {
    const [loading, setLoading] = useState(false)

    const handleClick = async () => {
        setLoading(true)
        await onLoadMore()
        setLoading(false)
    }

    if (!hasMore) return null

    return (
        <div className="flex justify-center py-6">
            <button
                onClick={handleClick}
                disabled={loading || isLoading}
                className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading || isLoading ? (
                    <>
                        <Loader2 size={18} className="animate-spin" />
                        Carregando...
                    </>
                ) : (
                    'Ver mais publicações'
                )}
            </button>
        </div>
    )
}
