'use client'

import { useAdminStore } from '@/store/admin-store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FolderKanban, Code2, Mail, Palette, TrendingUp, Clock } from 'lucide-react'

export function Dashboard() {
  const { projects, skills, contacts, messages, themes } = useAdminStore()

  const stats = [
    {
      title: 'Projetos',
      value: projects.length,
      description: 'Total de projetos',
      icon: FolderKanban,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/20',
    },
    {
      title: 'Skills',
      value: skills.length,
      description: 'Habilidades cadastradas',
      icon: Code2,
      color: 'text-teal-400',
      bg: 'bg-teal-500/20',
    },
    {
      title: 'Contatos',
      value: contacts.filter(c => c.visible).length,
      description: 'Links visíveis',
      icon: Mail,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/20',
    },
    {
      title: 'Mensagens',
      value: messages.filter(m => !m.read).length,
      description: 'Não lidas',
      icon: Mail,
      color: 'text-orange-400',
      bg: 'bg-orange-500/20',
    },
    {
      title: 'Temas',
      value: themes.length,
      description: 'Temas disponíveis',
      icon: Palette,
      color: 'text-purple-400',
      bg: 'bg-purple-500/20',
    },
  ]

  const recentProjects = projects.slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400 mt-1">Visão geral do seu portfólio</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">{stat.title}</p>
                  <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
                  <p className="text-slate-500 text-xs mt-1">{stat.description}</p>
                </div>
                <div className={`p-3 rounded-xl ${stat.bg}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              Projetos Recentes
            </CardTitle>
            <CardDescription>Últimos projetos adicionados</CardDescription>
          </CardHeader>
          <CardContent>
            {recentProjects.length > 0 ? (
              <div className="space-y-3">
                {recentProjects.map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-slate-700/50"
                  >
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                      <FolderKanban className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">{project.title}</p>
                      <p className="text-slate-400 text-sm truncate">{project.category}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${
                      project.status === 'published' 
                        ? 'bg-emerald-500/20 text-emerald-400' 
                        : project.status === 'draft'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-slate-500/20 text-slate-400'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400">
                <FolderKanban className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Nenhum projeto cadastrado</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Messages */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-400" />
              Mensagens Recentes
            </CardTitle>
            <CardDescription>Últimas mensagens recebidas</CardDescription>
          </CardHeader>
          <CardContent>
            {messages.length > 0 ? (
              <div className="space-y-3">
                {messages.slice(0, 5).map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      message.read ? 'bg-slate-700/50' : 'bg-slate-700'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-orange-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">{message.name}</p>
                      <p className="text-slate-400 text-sm truncate">{message.email}</p>
                    </div>
                    {!message.read && (
                      <span className="w-2 h-2 rounded-full bg-orange-400" />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400">
                <Mail className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Nenhuma mensagem recebida</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
