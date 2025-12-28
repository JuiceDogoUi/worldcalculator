'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface SearchBarProps {
  placeholder: string
  locale: string
}

export function SearchBar({ placeholder, locale }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const router = useRouter()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const trimmedQuery = query.trim()

    if (!trimmedQuery) return

    // Navigate to calculators page with search query
    router.push(`/${locale}/calculators?q=${encodeURIComponent(trimmedQuery)}`)
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          aria-label="Search calculators"
          className="w-full h-14 pl-14 pr-6 text-lg rounded-2xl border-2 border-border bg-background/80 backdrop-blur-sm shadow-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
        />
      </div>
    </form>
  )
}
