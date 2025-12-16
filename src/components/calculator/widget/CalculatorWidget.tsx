'use client'

import { useState } from 'react'
import {
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Share2,
  Code,
  Quote,
  ChevronDown,
  ChevronUp,
  BookOpen,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ShareModal } from './ShareModal'

interface Source {
  title: string
  url: string
}

interface CalculatorWidgetProps {
  calculatorName: string
  calculatorUrl: string
  sources?: Source[]
  initialLikes?: number
  initialHelpful?: number
  onFeedback?: () => void
}

export function CalculatorWidget({
  calculatorName,
  calculatorUrl,
  sources = [],
  initialLikes = 0,
  initialHelpful = 0,
}: CalculatorWidgetProps) {
  const [likes, setLikes] = useState(initialLikes)
  const [hasLiked, setHasLiked] = useState(false)
  const [hasDisliked, setHasDisliked] = useState(false)
  const [sourcesExpanded, setSourcesExpanded] = useState(false)
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [shareModalTab, setShareModalTab] = useState<'share' | 'embed' | 'cite'>('share')

  const helpfulCount = initialHelpful + likes

  const handleLike = () => {
    if (hasLiked) {
      setLikes(likes - 1)
      setHasLiked(false)
    } else {
      setLikes(likes + 1)
      setHasLiked(true)
      if (hasDisliked) {
        setHasDisliked(false)
      }
    }
  }

  const handleDislike = () => {
    if (hasDisliked) {
      setHasDisliked(false)
    } else {
      setHasDisliked(true)
      if (hasLiked) {
        setLikes(likes - 1)
        setHasLiked(false)
      }
    }
  }

  const openShareModal = (tab: 'share' | 'embed' | 'cite') => {
    setShareModalTab(tab)
    setShareModalOpen(true)
  }

  return (
    <>
      <div className="space-y-3 py-4">
        {/* Sources section */}
        {sources.length > 0 && (
          <div className="space-y-2">
            <button
              onClick={() => setSourcesExpanded(!sourcesExpanded)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <BookOpen className="h-4 w-4" />
              <span>
                Based on <strong className="text-foreground">{sources.length} sources</strong>
              </span>
              {sourcesExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>

            {sourcesExpanded && (
              <div className="pl-6 space-y-1">
                {sources.map((source, index) => (
                  <a
                    key={index}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm text-primary hover:underline"
                  >
                    {source.title}
                  </a>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Helpful count */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <ThumbsUp className="h-4 w-4" />
          <span>
            <strong className="text-foreground">{helpfulCount}</strong> people find this calculator helpful
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Like/Dislike group */}
          <div className="flex items-center border rounded-lg overflow-hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`rounded-none border-r h-9 px-3 ${hasLiked ? 'bg-primary/10 text-primary' : ''}`}
            >
              <ThumbsUp className={`h-4 w-4 ${hasLiked ? 'fill-current' : ''}`} />
              <span className="ml-1.5">{likes}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDislike}
              className={`rounded-none h-9 px-3 ${hasDisliked ? 'bg-destructive/10 text-destructive' : ''}`}
            >
              <ThumbsDown className={`h-4 w-4 ${hasDisliked ? 'fill-current' : ''}`} />
            </Button>
          </div>

          {/* Feedback button */}
          <Button
            variant="outline"
            size="sm"
            className="h-9"
            onClick={() => {
              // Mock feedback - to be implemented
              alert('Feedback feature coming soon!')
            }}
          >
            <MessageSquare className="h-4 w-4" />
          </Button>

          {/* Share button */}
          <Button
            variant="outline"
            size="sm"
            className="h-9"
            onClick={() => openShareModal('share')}
          >
            <Share2 className="h-4 w-4" />
          </Button>

          {/* Embed button */}
          <Button
            variant="outline"
            size="sm"
            className="h-9"
            onClick={() => {
              // Embed feature coming soon
              alert('Embed feature coming soon!')
            }}
          >
            <Code className="h-4 w-4" />
          </Button>

          {/* Cite button */}
          <Button
            variant={shareModalTab === 'cite' && shareModalOpen ? 'default' : 'outline'}
            size="sm"
            className="h-9"
            onClick={() => openShareModal('cite')}
          >
            <Quote className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        calculatorName={calculatorName}
        calculatorUrl={calculatorUrl}
      />
    </>
  )
}
