'use client'

import { useState, useEffect } from 'react'
import { useAdminStore } from '@/store/admin-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Mail, Trash2, Eye, Check, X, Clock } from 'lucide-react'
import type { Message } from '@/types/portfolio'

export function MessagesManager() {
  const { messages, setMessages } = useAdminStore()
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/admin/messages')
      const data = await response.json()
      if (Array.isArray(data)) {
        setMessages(data)
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [])

  const handleMarkAsRead = async (id: string) => {
    try {
      await fetch(`/api/admin/messages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: true }),
      })
      await fetchMessages()
    } catch (error) {
      console.error('Error marking message as read:', error)
    }
  }

  const handleMarkAsReplied = async (id: string) => {
    try {
      await fetch(`/api/admin/messages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ replied: true }),
      })
      await fetchMessages()
    } catch (error) {
      console.error('Error marking message as replied:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta mensagem?')) return

    try {
      const response = await fetch(`/api/admin/messages/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchMessages()
      }
    } catch (error) {
      console.error('Error deleting message:', error)
    }
  }

  const handleOpenMessage = (message: Message) => {
    setSelectedMessage(message)
    setIsDialogOpen(true)
    if (!message.read) {
      handleMarkAsRead(message.id)
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const unreadCount = messages.filter((m) => !m.read).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Mensagens</h1>
        <p className="text-slate-400 mt-1">
          {unreadCount > 0
            ? `${unreadCount} mensagem(ns) não lida(s)`
            : 'Todas as mensagens foram lidas'}
        </p>
      </div>

      {/* Messages List */}
      <div className="space-y-3">
        {messages.map((message) => (
          <Card
            key={message.id}
            className={`bg-slate-800/50 border-slate-700 cursor-pointer transition-all hover:bg-slate-800 ${
              !message.read ? 'border-l-4 border-l-emerald-500' : ''
            }`}
            onClick={() => handleOpenMessage(message)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-medium">
                    {message.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white font-medium">{message.name}</span>
                    {!message.read && (
                      <Badge className="bg-emerald-500/20 text-emerald-400 text-xs">
                        Nova
                      </Badge>
                    )}
                    {message.replied && (
                      <Badge className="bg-slate-500/20 text-slate-400 text-xs">
                        Respondida
                      </Badge>
                    )}
                  </div>
                  <p className="text-slate-400 text-sm">{message.email}</p>
                  <p className="text-slate-300 text-sm mt-2 line-clamp-2">{message.message}</p>
                  <p className="text-slate-500 text-xs mt-2 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDate(message.created_at)}
                  </p>
                </div>
                <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleMarkAsReplied(message.id)}
                    className="text-slate-400 hover:text-white"
                    title="Marcar como respondida"
                  >
                    <Check className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(message.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {messages.length === 0 && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="py-12 text-center">
            <Mail className="w-12 h-12 mx-auto text-slate-500 mb-4" />
            <p className="text-slate-400">Nenhuma mensagem recebida</p>
          </CardContent>
        </Card>
      )}

      {/* Message Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">Detalhes da Mensagem</DialogTitle>
          </DialogHeader>

          {selectedMessage && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center">
                  <span className="text-white font-medium text-lg">
                    {selectedMessage.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-white font-medium">{selectedMessage.name}</p>
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="text-emerald-400 text-sm hover:underline"
                  >
                    {selectedMessage.email}
                  </a>
                </div>
              </div>

              {selectedMessage.subject && (
                <div>
                  <p className="text-slate-400 text-sm mb-1">Assunto</p>
                  <p className="text-white">{selectedMessage.subject}</p>
                </div>
              )}

              <div>
                <p className="text-slate-400 text-sm mb-1">Mensagem</p>
                <p className="text-white whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>

              <p className="text-slate-500 text-xs">
                Enviada em: {formatDate(selectedMessage.created_at)}
              </p>

              <div className="flex gap-2 pt-4">
                <Button
                  asChild
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600"
                >
                  <a href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject || 'Sua mensagem'}`}>
                    <Mail className="w-4 h-4 mr-2" />
                    Responder
                  </a>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    handleMarkAsReplied(selectedMessage.id)
                    setIsDialogOpen(false)
                  }}
                  className="border-slate-600 text-white"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Marcar Respondida
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
