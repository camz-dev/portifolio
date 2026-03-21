'use client'

import { useState, useEffect } from 'react'
import { useAdminStore } from '@/store/admin-store'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Plus, Pencil, Trash2, Link2, ExternalLink, Github, Linkedin, Mail, Globe } from 'lucide-react'
import type { Contact, ContactInput } from '@/types/portfolio'

const defaultContact: ContactInput = {
  platform: '',
  url: '',
  icon: '',
  username: '',
  order_index: 0,
  visible: true,
}

const platformIcons: Record<string, React.ReactNode> = {
  github: <Github className="w-5 h-5" />,
  linkedin: <Linkedin className="w-5 h-5" />,
  email: <Mail className="w-5 h-5" />,
  website: <Globe className="w-5 h-5" />,
  default: <Link2 className="w-5 h-5" />,
}

export function ContactsManager() {
  const { contacts, setContacts } = useAdminStore()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingContact, setEditingContact] = useState<Contact | null>(null)
  const [formData, setFormData] = useState<ContactInput>(defaultContact)
  const [isLoading, setIsLoading] = useState(false)

  const fetchContacts = async () => {
    try {
      const response = await fetch('/api/admin/contacts')
      const data = await response.json()
      if (Array.isArray(data)) {
        setContacts(data)
      }
    } catch (error) {
      console.error('Error fetching contacts:', error)
    }
  }

  useEffect(() => {
    fetchContacts()
  }, [])

  const handleOpenDialog = (contact?: Contact) => {
    if (contact) {
      setEditingContact(contact)
      setFormData({
        platform: contact.platform,
        url: contact.url,
        icon: contact.icon || '',
        username: contact.username || '',
        order_index: contact.order_index,
        visible: contact.visible,
      })
    } else {
      setEditingContact(null)
      setFormData({ ...defaultContact, order_index: contacts.length })
    }
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingContact(null)
    setFormData(defaultContact)
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const url = editingContact
        ? `/api/admin/contacts/${editingContact.id}`
        : '/api/admin/contacts'
      const method = editingContact ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await fetchContacts()
        handleCloseDialog()
      }
    } catch (error) {
      console.error('Error saving contact:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este contato?')) return

    try {
      const response = await fetch(`/api/admin/contacts/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchContacts()
      }
    } catch (error) {
      console.error('Error deleting contact:', error)
    }
  }

  const getPlatformIcon = (platform: string) => {
    const lowerPlatform = platform.toLowerCase()
    return platformIcons[lowerPlatform] || platformIcons.default
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Contatos</h1>
          <p className="text-slate-400 mt-1">Gerencie seus links de contato e redes sociais</p>
        </div>
        <Button
          onClick={() => handleOpenDialog()}
          className="bg-emerald-500 hover:bg-emerald-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Contato
        </Button>
      </div>

      {/* Contacts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {contacts.map((contact) => (
          <Card
            key={contact.id}
            className={`bg-slate-800/50 border-slate-700 ${
              !contact.visible ? 'opacity-60' : ''
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  {getPlatformIcon(contact.platform)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-white font-medium">{contact.platform}</p>
                    {!contact.visible && (
                      <Badge variant="secondary" className="text-xs">
                        Oculto
                      </Badge>
                    )}
                  </div>
                  <p className="text-slate-400 text-sm truncate">
                    {contact.username || contact.url}
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    asChild
                    className="text-slate-400 hover:text-white"
                  >
                    <a href={contact.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleOpenDialog(contact)}
                    className="text-slate-400 hover:text-white"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(contact.id)}
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

      {contacts.length === 0 && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="py-12 text-center">
            <Link2 className="w-12 h-12 mx-auto text-slate-500 mb-4" />
            <p className="text-slate-400">Nenhum contato cadastrado</p>
            <Button
              onClick={() => handleOpenDialog()}
              className="mt-4 bg-emerald-500 hover:bg-emerald-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Contato
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingContact ? 'Editar Contato' : 'Novo Contato'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Plataforma *</Label>
              <Input
                value={formData.platform}
                onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="GitHub, LinkedIn, Email, etc."
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">URL *</Label>
              <Input
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="https://..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Username</Label>
                <Input
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="@username"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Ícone (emoji ou URL)</Label>
                <Input
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="🌟 ou URL"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Ordem</Label>
                <Input
                  type="number"
                  value={formData.order_index}
                  onChange={(e) =>
                    setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })
                  }
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div className="flex items-center gap-2 pt-6">
                <Switch
                  checked={formData.visible}
                  onCheckedChange={(checked) => setFormData({ ...formData, visible: checked })}
                />
                <Label className="text-slate-300">Visível</Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={handleCloseDialog}>
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!formData.platform || !formData.url || isLoading}
              className="bg-emerald-500 hover:bg-emerald-600"
            >
              {isLoading ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
