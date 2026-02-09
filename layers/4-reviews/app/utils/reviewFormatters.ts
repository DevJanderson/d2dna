export function formatDate(date?: string | null): string {
  if (!date) return '\u2014'
  return new Date(date).toLocaleDateString('pt-BR')
}

export function statusLabel(status?: string | null): string {
  if (!status) return 'pendente'
  return status
}

export function statusColor(status?: string | null): string {
  switch (status) {
    case 'aprovado':
      return 'bg-green-500/15 text-green-600'
    case 'rejeitado':
      return 'bg-red-500/15 text-red-600'
    case 'corrigido':
      return 'bg-yellow-500/15 text-yellow-600'
    default:
      return 'bg-muted text-muted-foreground'
  }
}

export function statusTextColor(status?: string | null): string {
  switch (status) {
    case 'aprovado':
      return 'text-green-500'
    case 'rejeitado':
      return 'text-red-500'
    case 'corrigido':
      return 'text-yellow-500'
    default:
      return 'text-muted-foreground'
  }
}

export function statusLineColor(status?: string | null): string {
  switch (status) {
    case 'aprovado':
      return 'bg-green-500/30'
    case 'rejeitado':
      return 'bg-red-500/30'
    case 'corrigido':
      return 'bg-yellow-500/30'
    default:
      return 'bg-border'
  }
}
