'use client'

import { useState, useEffect, useCallback } from 'react'
import { X, Share2, Code, Quote, Facebook, Linkedin, Check, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  calculatorName: string
  calculatorUrl: string
  includeResults?: boolean
  locale?: string
}

type TabType = 'share' | 'embed' | 'cite'

export function ShareModal({
  isOpen,
  onClose,
  calculatorName,
  calculatorUrl,
  includeResults = false,
  locale = 'en-US',
}: ShareModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('share')
  const [shareWithResults, setShareWithResults] = useState(includeResults)
  const [copied, setCopied] = useState(false)
  const [citeFormat, setCiteFormat] = useState<'text' | 'html' | 'bibtex'>('text')

  // Handle escape key to close modal
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose]
  )

  useEffect(() => {
    if (!isOpen) return

    document.addEventListener('keydown', handleEscape)
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, handleEscape])

  if (!isOpen) return null

  const shareUrl = shareWithResults ? `${calculatorUrl}?shared=true` : calculatorUrl
  const currentDate = new Date().toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const citations = {
    text: `World Calculator. ${calculatorName}. Available at: ${calculatorUrl}. Accessed: ${currentDate}.`,
    html: `<a href="${calculatorUrl}">${calculatorName}</a> - World Calculator. Accessed ${currentDate}.`,
    bibtex: `@misc{worldcalculator_${calculatorName.toLowerCase().replace(/\s+/g, '_')},
  title = {${calculatorName}},
  author = {World Calculator},
  howpublished = {\\url{${calculatorUrl}}},
  note = {Accessed: ${currentDate}}
}`,
  }

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSocialShare = (platform: 'facebook' | 'x' | 'linkedin') => {
    const text = `Check out this ${calculatorName} on World Calculator!`
    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      x: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    }
    window.open(urls[platform], '_blank', 'width=600,height=400')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <Card className="relative z-10 w-full max-w-lg mx-4 bg-background p-0 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h2 className="text-lg font-semibold">
              {activeTab === 'cite' ? 'Cite' : 'Share Calculator'}
            </h2>
            <p className="text-sm text-muted-foreground">{calculatorName}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('share')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
              activeTab === 'share'
                ? 'text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Share2 className="h-4 w-4" />
            Share
          </button>
          <button
            onClick={() => setActiveTab('embed')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
              activeTab === 'embed'
                ? 'text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Code className="h-4 w-4" />
            Embed
          </button>
          <button
            onClick={() => setActiveTab('cite')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
              activeTab === 'cite'
                ? 'text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Quote className="h-4 w-4" />
            Cite
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'share' && (
            <div className="space-y-6">
              {/* Share with results checkbox */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={shareWithResults}
                  onChange={(e) => setShareWithResults(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <span className="text-sm">Check to share calculator with results</span>
              </label>

              {/* Social buttons */}
              <div className="flex justify-center gap-6">
                <button
                  onClick={() => handleSocialShare('facebook')}
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className="h-14 w-14 rounded-full bg-[#1877F2] flex items-center justify-center group-hover:opacity-90 transition-opacity">
                    <Facebook className="h-7 w-7 text-white" fill="white" />
                  </div>
                  <span className="text-sm text-muted-foreground">Facebook</span>
                </button>
                <button
                  onClick={() => handleSocialShare('x')}
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className="h-14 w-14 rounded-full bg-black flex items-center justify-center group-hover:opacity-90 transition-opacity">
                    <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </div>
                  <span className="text-sm text-muted-foreground">X</span>
                </button>
                <button
                  onClick={() => handleSocialShare('linkedin')}
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className="h-14 w-14 rounded-full bg-[#0A66C2] flex items-center justify-center group-hover:opacity-90 transition-opacity">
                    <Linkedin className="h-7 w-7 text-white" fill="white" />
                  </div>
                  <span className="text-sm text-muted-foreground">Linkedin</span>
                </button>
              </div>

              {/* URL copy */}
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="flex-1 bg-transparent text-sm outline-none truncate"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy(shareUrl)}
                  className="text-primary hover:text-primary shrink-0"
                >
                  {copied ? <Check className="h-4 w-4" /> : 'Copy'}
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'embed' && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="rounded-full bg-muted p-4 mb-4">
                <Code className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Coming Soon</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Embed functionality is coming soon. You&apos;ll be able to add our calculators to your website with a simple code snippet.
              </p>
            </div>
          )}

          {activeTab === 'cite' && (
            <div className="space-y-4">
              {/* Format tabs */}
              <div className="flex gap-1">
                {(['text', 'html', 'bibtex'] as const).map((format) => (
                  <button
                    key={format}
                    onClick={() => setCiteFormat(format)}
                    className={`px-4 py-2 text-sm font-medium rounded-l-none rounded-r-none first:rounded-l-lg last:rounded-r-lg transition-colors ${
                      citeFormat === format
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                  >
                    {format === 'text' ? 'Text' : format === 'html' ? 'HTML' : 'BibTeX'}
                  </button>
                ))}
              </div>

              {/* Citation box */}
              <div className="p-4 bg-muted rounded-lg min-h-[100px]">
                <pre className="text-sm whitespace-pre-wrap font-mono">
                  {citations[citeFormat]}
                </pre>
              </div>

              <p className="text-sm text-muted-foreground text-center">
                Appreciate our scientific content creators and cite this page. Your support matters and keeps us motivated!
              </p>

              <Button
                className="w-full"
                onClick={() => handleCopy(citations[citeFormat])}
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy to clipboard
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
