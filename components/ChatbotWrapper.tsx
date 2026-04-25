'use client'

import { usePathname } from 'next/navigation'
import Chatbot from './Chatbot'

export default function ChatbotWrapper() {
  const pathname = usePathname()
  
  // Hide the chatbot on the builder route
  if (pathname?.startsWith('/build')) {
    return null
  }

  return <Chatbot />
}
