'use client'

import { usePathname } from 'next/navigation'
import Chatbot from './Chatbot'

export default function ChatbotWrapper() {
  const pathname = usePathname()
  
  // Hide the chatbot on the builder route (e.g., /en/build, /ar/build)
  const isBuilder = pathname?.split('/').some(segment => segment === 'build')
  
  if (isBuilder) {
    return null
  }

  return <Chatbot />
}
