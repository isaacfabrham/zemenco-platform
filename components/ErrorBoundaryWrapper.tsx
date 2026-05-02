'use client'

import { ErrorBoundary } from 'react-error-boundary'

function ErrorFallback({ error, resetErrorBoundary }: { error: Error, resetErrorBoundary: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-surface p-8 text-center">
      <div className="max-w-md bg-white p-12 rounded-2xl shadow-xl border border-red-50">
        <h2 className="text-2xl font-black uppercase tracking-tight text-red-600 mb-4">Something went wrong</h2>
        <p className="text-gray-500 mb-8 text-sm leading-relaxed">{error.message}</p>
        <button 
          onClick={resetErrorBoundary}
          className="px-8 py-3 bg-[#0A0F1C] text-white font-bold uppercase text-[10px] tracking-widest rounded-lg hover:bg-[#B5780A] transition-all"
        >
          Try Again
        </button>
      </div>
    </div>
  )
}

export default function ErrorBoundaryWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        window.location.reload()
      }}
    >
      {children}
    </ErrorBoundary>
  )
}
