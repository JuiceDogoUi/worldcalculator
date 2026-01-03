/**
 * Scientific Calculator History Panel Component
 * Shows calculation history with ability to reuse results
 */

'use client'

import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { HistoryEntry } from '../types'

interface HistoryTranslations {
  title: string
  empty: string
  clear: string
  useResult: string
}

interface HistoryPanelProps {
  history: HistoryEntry[]
  onSelectEntry: (entry: HistoryEntry) => void
  onClearHistory: () => void
  translations: HistoryTranslations
  locale: string
}

export function HistoryPanel({
  history,
  onSelectEntry,
  onClearHistory,
  translations: t,
  locale,
}: HistoryPanelProps) {
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat(locale, {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{t.title}</CardTitle>
          {history.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearHistory}
              className="h-8 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              {t.clear}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            {t.empty}
          </p>
        ) : (
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-3">
              {history.map((entry) => (
                <button
                  key={entry.id}
                  className="w-full text-left p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors group"
                  onClick={() => onSelectEntry(entry)}
                  aria-label={`${t.useResult}: ${entry.result}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-muted-foreground font-mono truncate">
                        {entry.expression}
                      </div>
                      <div className="text-lg font-semibold font-mono">
                        = {entry.result}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 ml-2">
                      <span className="text-xs text-muted-foreground">
                        {formatTime(new Date(entry.timestamp))}
                      </span>
                      <span className="text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                        {entry.angleMode === 'degrees' ? 'DEG' : 'RAD'}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}
