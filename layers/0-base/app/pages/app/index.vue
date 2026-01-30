<script setup lang="ts">
import {
  Search,
  Upload,
  FileText,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Camera,
  Mail,
  Phone,
  MapPin,
  Shield,
  Moon,
  Sun,
  Bell,
  Keyboard,
  Monitor,
  Eye,
  EyeOff,
  UserPlus,
  UserX,
  UserCheck,
  Pencil,
  RefreshCw
} from 'lucide-vue-next'

/**
 * Workspace Principal - Área de trabalho do analista
 * Interface multi-janelas para revisão de matches
 */
definePageMeta({
  layout: 'desktop',
  middleware: 'auth'
})

const windowManager = useWindowManager()
const authStore = useAuthStore()
const colorMode = useColorMode()

// ============================================
// JANELA DE BOAS-VINDAS
// ============================================

// ASCII Art do Tucuxi (golfinho da Amazônia)
const asciiTucuxi = `
                                          .--.
                  _______             .-"  .'
          .---u"""       """"---._  ."    %
        .'                        "--.    %
   __.--'  o                          "".. "
  (____.                                  ":
   \`----.__                                 ".
           \`----------__                     ".
                 ".   . ""--.                 ".
                   ". ".     ""-.              ".
                     "-.)        ""-.           ".
                                     "".         ".
                                        "".       ".
                                           "".      ".
                                              "".    ".
                        ^~^~^~^~^~^~^~^~^~^~^~^~^"".  "^~^~^~^~^
                                              ^~^~^~^  ~^~
                                                   ^~^~^~`

// Nome do usuário para boas-vindas
const userName = computed(() => {
  const nome = authStore.user?.nome || 'Usuário'
  return nome.split(' ')[0] // Primeiro nome
})

// Abre janela de boas-vindas ao entrar no workspace
onMounted(() => {
  // Verifica se não há janelas abertas (primeira visita)
  if (windowManager.windows.value.length === 0) {
    windowManager.open({
      id: 'welcome',
      title: 'Bem-vindo ao Tucuxi',
      position: { x: 150, y: 80 },
      size: { width: 550, height: 480 }
    })
  }
})

// ============================================
// FILA DE REVISÃO - Dados e funções
// ============================================
const pendingMatches = ref([
  { id: 1, score: 92, nameA: 'JOSÉ DA SILVA', nameB: 'JOSE SILVA', status: 'pending' },
  { id: 2, score: 87, nameA: 'MARIA SANTOS', nameB: 'MARIA DOS SANTOS', status: 'pending' },
  { id: 3, score: 78, nameA: 'JOÃO OLIVEIRA', nameB: 'JOAO OLIVEIRA FILHO', status: 'pending' },
  { id: 4, score: 81, nameA: 'ANA COSTA', nameB: 'ANA MARIA COSTA', status: 'pending' }
])

const selectedMatch = ref(pendingMatches.value[0])

function selectMatch(match: typeof pendingMatches.value[0]) {
  selectedMatch.value = match
  // Abre o match-viewer se não estiver aberto
  const existing = windowManager.windows.value.find(w => w.id === 'match-viewer')
  if (!existing) {
    windowManager.open({
      id: 'match-viewer',
      title: 'Comparador de Matches',
      position: { x: 390, y: 20 },
      size: { width: 700, height: 500 }
    })
  } else {
    windowManager.focus('match-viewer')
  }
}

function approveMatch() {
  if (!selectedMatch.value) return
  const index = pendingMatches.value.findIndex(m => m.id === selectedMatch.value?.id)
  if (index !== -1) {
    pendingMatches.value.splice(index, 1)
    selectedMatch.value = pendingMatches.value[0] ?? undefined
  }
}

function rejectMatch() {
  if (!selectedMatch.value) return
  const index = pendingMatches.value.findIndex(m => m.id === selectedMatch.value?.id)
  if (index !== -1) {
    pendingMatches.value.splice(index, 1)
    selectedMatch.value = pendingMatches.value[0] ?? undefined
  }
}

function getScoreColor(score: number) {
  if (score >= 90) return 'text-green-600 dark:text-green-400'
  if (score >= 80) return 'text-yellow-600 dark:text-yellow-400'
  return 'text-orange-600 dark:text-orange-400'
}

// ============================================
// BUSCA DE PACIENTE - Dados e funções
// ============================================
const searchQuery = ref('')
const searchResults = ref<Array<{
  id: number
  nome: string
  cpf: string
  dataNascimento: string
  cns: string
  municipio: string
}>>([])
const isSearching = ref(false)

// Mock de pacientes para busca
const mockPatients = [
  { id: 1, nome: 'JOSÉ DA SILVA', cpf: '123.456.789-00', dataNascimento: '15/03/1975', cns: '123456789012345', municipio: 'São Paulo' },
  { id: 2, nome: 'MARIA SANTOS', cpf: '987.654.321-00', dataNascimento: '22/07/1982', cns: '987654321098765', municipio: 'Rio de Janeiro' },
  { id: 3, nome: 'JOÃO OLIVEIRA', cpf: '456.789.123-00', dataNascimento: '10/11/1990', cns: '456789123456789', municipio: 'Belo Horizonte' },
  { id: 4, nome: 'ANA COSTA', cpf: '321.654.987-00', dataNascimento: '05/01/1968', cns: '321654987321654', municipio: 'Salvador' },
  { id: 5, nome: 'CARLOS FERREIRA', cpf: '159.753.486-00', dataNascimento: '28/09/1955', cns: '159753486159753', municipio: 'Fortaleza' }
]

async function searchPatients() {
  if (!searchQuery.value.trim()) {
    searchResults.value = []
    return
  }

  isSearching.value = true
  // Simula delay de API
  await new Promise(resolve => setTimeout(resolve, 500))

  const query = searchQuery.value.toLowerCase()
  searchResults.value = mockPatients.filter(p =>
    p.nome.toLowerCase().includes(query) ||
    p.cpf.includes(query) ||
    p.cns.includes(query)
  )
  isSearching.value = false
}

function viewPatientDetails(_patient: typeof mockPatients[0]) {
  // TODO: Abrir janela de detalhes do paciente
}

// ============================================
// IMPORTAÇÃO EM LOTE - Dados e funções
// ============================================
const batchFile = ref<File | null>(null)
const batchStatus = ref<'idle' | 'uploading' | 'processing' | 'completed' | 'error'>('idle')
const batchProgress = ref(0)
const batchResults = ref<{
  total: number
  processed: number
  matches: number
  errors: number
} | null>(null)

// Mock de histórico de importações
const importHistory = ref([
  { id: 1, filename: 'pacientes_jan_2024.csv', date: '15/01/2024', records: 1250, status: 'completed' },
  { id: 2, filename: 'atualizacao_dados.csv', date: '10/01/2024', records: 450, status: 'completed' },
  { id: 3, filename: 'novos_cadastros.csv', date: '05/01/2024', records: 2100, status: 'error' }
])

function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    batchFile.value = target.files[0]
    batchStatus.value = 'idle'
    batchResults.value = null
  }
}

async function startBatchImport() {
  if (!batchFile.value) return

  batchStatus.value = 'uploading'
  batchProgress.value = 0

  // Simula upload
  for (let i = 0; i <= 30; i += 10) {
    await new Promise(resolve => setTimeout(resolve, 200))
    batchProgress.value = i
  }

  batchStatus.value = 'processing'

  // Simula processamento
  for (let i = 30; i <= 100; i += 5) {
    await new Promise(resolve => setTimeout(resolve, 150))
    batchProgress.value = i
  }

  batchStatus.value = 'completed'
  batchResults.value = {
    total: 1500,
    processed: 1487,
    matches: 342,
    errors: 13
  }
}

function resetBatchImport() {
  batchFile.value = null
  batchStatus.value = 'idle'
  batchProgress.value = 0
  batchResults.value = null
}

// ============================================
// PERFIL DO USUÁRIO - Dados e funções
// ============================================
const user = computed(() => authStore.user)

const userInitials = computed(() => {
  if (!user.value?.nome) return '??'
  const names = user.value.nome.trim().split(' ').filter(n => n.length > 0)
  if (names.length === 0) return '??'
  const first = names[0] ?? ''
  const last = names[names.length - 1] ?? ''
  if (names.length === 1) return first.substring(0, 2).toUpperCase()
  return ((first[0] ?? '') + (last[0] ?? '')).toUpperCase()
})

// Formulário de edição do perfil (campos da API)
const profileForm = ref({
  nome: '',
  email: '',
  telefone: '',
  estado: '',
  cidade: '',
  funcao: '',
  instituicao: ''
})

const isEditingProfile = ref(false)
const isSavingProfile = ref(false)

function startEditProfile() {
  profileForm.value = {
    nome: user.value?.nome || '',
    email: user.value?.email || '',
    telefone: user.value?.telefone || '',
    estado: user.value?.estado || '',
    cidade: user.value?.cidade || '',
    funcao: user.value?.funcao || '',
    instituicao: user.value?.instituicao || ''
  }
  isEditingProfile.value = true
}

function cancelEditProfile() {
  isEditingProfile.value = false
}

async function saveProfile() {
  if (!user.value?.id) return

  isSavingProfile.value = true
  try {
    await $fetch(`/api/v1/usuarios/${user.value.id}`, {
      method: 'PUT',
      body: profileForm.value
    })
    // Atualiza os dados do usuário no store
    await authStore.checkAuth()
    isEditingProfile.value = false
  } catch {
    // TODO: Mostrar erro ao usuário
  } finally {
    isSavingProfile.value = false
  }
}

// Alteração de senha (campos da API: active_password, new_password)
const passwordForm = ref({
  activePassword: '',
  newPassword: '',
  confirmPassword: ''
})
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const isChangingPassword = ref(false)
const isSavingPassword = ref(false)
const passwordError = ref('')

function togglePasswordChange() {
  isChangingPassword.value = !isChangingPassword.value
  passwordError.value = ''
  if (!isChangingPassword.value) {
    passwordForm.value = {
      activePassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  }
}

async function savePassword() {
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    passwordError.value = 'As senhas não coincidem'
    return
  }

  if (passwordForm.value.newPassword.length < 6) {
    passwordError.value = 'A senha deve ter pelo menos 6 caracteres'
    return
  }

  isSavingPassword.value = true
  passwordError.value = ''

  try {
    await $fetch('/api/v1/usuarios/change-password', {
      method: 'POST',
      body: {
        active_password: passwordForm.value.activePassword,
        new_password: passwordForm.value.newPassword
      }
    })
    isChangingPassword.value = false
    passwordForm.value = {
      activePassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  } catch {
    passwordError.value = 'Senha atual incorreta'
  } finally {
    isSavingPassword.value = false
  }
}

// ============================================
// CONFIGURAÇÕES - Dados e funções
// ============================================
const settings = ref({
  theme: 'system' as 'light' | 'dark' | 'system',
  notifications: {
    email: true,
    push: true,
    sound: false
  },
  workspace: {
    autoOpenReviewQueue: true,
    confirmBeforeClose: true,
    snapToGrid: false
  }
})

function setTheme(theme: 'light' | 'dark' | 'system') {
  settings.value.theme = theme
  colorMode.preference = theme
}

// Atalhos de teclado (mock)
const shortcuts = [
  { key: 'Ctrl + N', action: 'Nova busca de paciente' },
  { key: 'Ctrl + R', action: 'Abrir fila de revisão' },
  { key: 'Ctrl + Enter', action: 'Aprovar match selecionado' },
  { key: 'Ctrl + Backspace', action: 'Rejeitar match selecionado' },
  { key: 'Esc', action: 'Fechar janela ativa' }
]

// ============================================
// GERENCIAMENTO DE USUÁRIOS (Admin)
// ============================================
interface UserListItem {
  id: number
  nome: string
  email: string
  admin?: boolean
  ativo?: boolean
  telefone?: string | null
  estado?: string | null
  cidade?: string | null
  funcao?: string | null
  instituicao?: string | null
  ultimo_login?: string | null
}

const userManagementTab = ref<'list' | 'new'>('list')
const usersList = ref<UserListItem[]>([])
const usersLoading = ref(false)
const usersSearch = ref('')
const selectedUserForEdit = ref<UserListItem | null>(null)

// Formulário de novo usuário
const newUserForm = ref({
  nome: '',
  email: '',
  senha: '',
  confirmarSenha: '',
  telefone: '',
  estado: '',
  cidade: '',
  funcao: '',
  instituicao: '',
  admin: false,
  masterKey: ''
})
const isCreatingUser = ref(false)
const createUserError = ref('')

// Formulário de edição
const editUserForm = ref({
  nome: '',
  email: '',
  telefone: '',
  estado: '',
  cidade: '',
  funcao: '',
  instituicao: '',
  admin: false,
  ativo: true
})
const isEditingUser = ref(false)
const isSavingUser = ref(false)

/** Carrega lista de usuários */
async function loadUsers() {
  usersLoading.value = true
  try {
    const params = new URLSearchParams()
    if (usersSearch.value) {
      params.set('search', usersSearch.value)
    }
    params.set('limit', '50')

    const response = await $fetch<{ data: UserListItem[] }>(`/api/v1/usuarios?${params}`)
    usersList.value = response.data
  } catch {
    usersList.value = []
  } finally {
    usersLoading.value = false
  }
}

/** Busca usuários com debounce */
let searchTimeout: ReturnType<typeof setTimeout> | null = null
function searchUsers() {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    loadUsers()
  }, 300)
}

/** Cria novo usuário */
async function createUser() {
  if (newUserForm.value.senha !== newUserForm.value.confirmarSenha) {
    createUserError.value = 'As senhas não coincidem'
    return
  }

  if (newUserForm.value.senha.length < 8) {
    createUserError.value = 'A senha deve ter pelo menos 8 caracteres'
    return
  }

  isCreatingUser.value = true
  createUserError.value = ''

  try {
    await $fetch('/api/v1/usuarios/signup', {
      method: 'POST',
      body: {
        nome: newUserForm.value.nome,
        email: newUserForm.value.email,
        senha: newUserForm.value.senha,
        telefone: newUserForm.value.telefone || null,
        estado: newUserForm.value.estado || null,
        cidade: newUserForm.value.cidade || null,
        funcao: newUserForm.value.funcao || null,
        instituicao: newUserForm.value.instituicao || null,
        admin: newUserForm.value.admin,
        master_key: newUserForm.value.masterKey
      }
    })

    // Limpa formulário e volta para lista
    resetNewUserForm()
    userManagementTab.value = 'list'
    await loadUsers()
  } catch {
    createUserError.value = 'Erro ao criar usuário. Verifique os dados e a chave mestre.'
  } finally {
    isCreatingUser.value = false
  }
}

/** Reseta formulário de novo usuário */
function resetNewUserForm() {
  newUserForm.value = {
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    telefone: '',
    estado: '',
    cidade: '',
    funcao: '',
    instituicao: '',
    admin: false,
    masterKey: ''
  }
  createUserError.value = ''
}

/** Abre edição de usuário */
function startEditUser(userItem: UserListItem) {
  selectedUserForEdit.value = userItem
  editUserForm.value = {
    nome: userItem.nome,
    email: userItem.email,
    telefone: userItem.telefone || '',
    estado: userItem.estado || '',
    cidade: userItem.cidade || '',
    funcao: userItem.funcao || '',
    instituicao: userItem.instituicao || '',
    admin: userItem.admin || false,
    ativo: userItem.ativo !== false
  }
  isEditingUser.value = true
}

/** Cancela edição */
function cancelEditUser() {
  isEditingUser.value = false
  selectedUserForEdit.value = null
}

/** Salva edição do usuário */
async function saveEditUser() {
  if (!selectedUserForEdit.value) return

  isSavingUser.value = true
  try {
    await $fetch(`/api/v1/usuarios/${selectedUserForEdit.value.id}`, {
      method: 'PUT',
      body: {
        nome: editUserForm.value.nome,
        email: editUserForm.value.email,
        telefone: editUserForm.value.telefone || null,
        estado: editUserForm.value.estado || null,
        cidade: editUserForm.value.cidade || null,
        funcao: editUserForm.value.funcao || null,
        instituicao: editUserForm.value.instituicao || null,
        admin: editUserForm.value.admin,
        ativo: editUserForm.value.ativo
      }
    })

    isEditingUser.value = false
    selectedUserForEdit.value = null
    await loadUsers()
  } catch {
    // TODO: mostrar erro
  } finally {
    isSavingUser.value = false
  }
}

/** Alterna status ativo/inativo do usuário */
async function toggleUserStatus(userItem: UserListItem) {
  try {
    await $fetch(`/api/v1/usuarios/${userItem.id}`, {
      method: 'PUT',
      body: {
        ativo: !userItem.ativo
      }
    })
    await loadUsers()
  } catch {
    // TODO: mostrar erro
  }
}

/** Formata data do último login */
function formatLastLogin(dateStr: string | null | undefined): string {
  if (!dateStr) return 'Nunca'
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return 'Nunca'
  }
}
</script>

<template>
  <Desktop>
    <!-- ========== JANELA DE BOAS-VINDAS ========== -->
    <template #welcome>
      <div class="h-full flex flex-col px-2">
        <!-- Golfinho ASCII -->
        <div class="flex-shrink-0 overflow-hidden -mt-2 -mx-2">
          <pre class="text-[7px] leading-tight text-primary/70 font-mono select-none whitespace-pre">{{ asciiTucuxi }}</pre>
        </div>

        <!-- Mensagem de boas-vindas -->
        <div class="flex-1 space-y-5 -mt-2">
          <div>
            <h2 class="text-base font-semibold">
              Olá, {{ userName }}!
            </h2>
            <p class="text-xs text-muted-foreground mt-0.5">
              Bem-vindo ao <strong>Tucuxi</strong> - Sistema de Record Linkage e Gestão de Dados.
            </p>
          </div>

          <div class="space-y-2">
            <p class="text-xs text-muted-foreground">
              Tecnologia <strong>DNA</strong> (Digital Numeric Algorithm) para:
            </p>
            <ul class="space-y-1.5 text-xs text-muted-foreground ml-1">
              <li class="flex items-start gap-2">
                <span class="text-primary text-[10px]">▸</span>
                <span><strong>Identificar</strong> pacientes com dados incompletos</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-primary text-[10px]">▸</span>
                <span><strong>Unificar</strong> registros em cadastro único</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-primary text-[10px]">▸</span>
                <span><strong>Qualificar</strong> dados com revisão assistida</span>
              </li>
            </ul>
          </div>

          <Separator class="my-3" />

          <div class="space-y-2">
            <p class="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Comece por</p>
            <div class="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                class="justify-start h-9 text-xs"
                @click="windowManager.open({ id: 'review-queue', title: 'Fila de Revisão', position: { x: 20, y: 20 }, size: { width: 350, height: 500 } })"
              >
                <span class="text-primary mr-2">≡</span>
                Fila de Revisão
              </Button>
              <Button
                variant="outline"
                size="sm"
                class="justify-start h-9 text-xs"
                @click="windowManager.open({ id: 'patient-search', title: 'Buscar Paciente', position: { x: 100, y: 50 }, size: { width: 500, height: 400 } })"
              >
                <span class="text-primary mr-2">◎</span>
                Buscar Paciente
              </Button>
            </div>
          </div>
        </div>

        <!-- Rodapé -->
        <div class="flex-shrink-0 pt-3 border-t mt-auto">
          <p class="text-[9px] text-muted-foreground/50 text-center">
            D2DNA © {{ new Date().getFullYear() }} • Tecnologia DNA para dados de saúde
          </p>
        </div>
      </div>
    </template>

    <!-- Fila de Revisão -->
    <template #review-queue>
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-sm text-muted-foreground">
            {{ pendingMatches.length }} pendentes
          </span>
          <Button variant="outline" size="sm">
            Filtrar
          </Button>
        </div>

        <div class="space-y-2">
          <Card
            v-for="match in pendingMatches"
            :key="match.id"
            class="cursor-pointer transition-colors hover:bg-muted"
            :class="{ 'border-primary bg-primary/5': selectedMatch?.id === match.id }"
            @click="selectMatch(match)"
          >
            <CardContent class="p-3">
              <div class="flex items-center justify-between">
                <span class="font-medium text-sm">Match #{{ match.id }}</span>
                <span class="text-sm font-bold" :class="getScoreColor(match.score)">
                  {{ match.score }}%
                </span>
              </div>
              <div class="mt-1 text-xs text-muted-foreground">
                {{ match.nameA }} ↔ {{ match.nameB }}
              </div>
            </CardContent>
          </Card>
        </div>

        <div v-if="pendingMatches.length === 0" class="py-8 text-center text-muted-foreground">
          <p class="text-sm">Nenhum match pendente</p>
          <p class="text-xs mt-1">Bom trabalho!</p>
        </div>
      </div>
    </template>

    <!-- Comparador de Matches -->
    <template #match-viewer>
      <div v-if="selectedMatch" class="h-full flex flex-col">
        <!-- Header do match -->
        <div class="flex items-center justify-between pb-4 border-b">
          <div>
            <h3 class="font-semibold">Match #{{ selectedMatch.id }}</h3>
            <p class="text-sm text-muted-foreground">
              Score: <span :class="getScoreColor(selectedMatch.score)" class="font-bold">{{ selectedMatch.score }}%</span>
            </p>
          </div>
          <div class="flex gap-2">
            <Button variant="outline" size="sm" @click="rejectMatch">
              Rejeitar
            </Button>
            <Button size="sm" @click="approveMatch">
              Aprovar
            </Button>
          </div>
        </div>

        <!-- Comparação lado a lado -->
        <div class="flex-1 grid grid-cols-2 gap-4 py-4">
          <!-- Registro A -->
          <Card>
            <CardHeader class="pb-2">
              <CardTitle class="text-xs font-medium text-muted-foreground">REGISTRO A</CardTitle>
            </CardHeader>
            <CardContent class="space-y-3">
              <div>
                <span class="text-xs text-muted-foreground">Nome</span>
                <p class="font-medium">{{ selectedMatch.nameA }}</p>
              </div>
              <div>
                <span class="text-xs text-muted-foreground">CPF</span>
                <p class="font-medium">123.456.789-00</p>
              </div>
              <div>
                <span class="text-xs text-muted-foreground">Data Nascimento</span>
                <p class="font-medium">15/03/1975</p>
              </div>
              <div>
                <span class="text-xs text-muted-foreground">Nome da Mae</span>
                <p class="font-medium">MARIA DA SILVA</p>
              </div>
              <div>
                <span class="text-xs text-muted-foreground">CNS</span>
                <p class="font-medium">123456789012345</p>
              </div>
            </CardContent>
          </Card>

          <!-- Registro B -->
          <Card>
            <CardHeader class="pb-2">
              <CardTitle class="text-xs font-medium text-muted-foreground">REGISTRO B</CardTitle>
            </CardHeader>
            <CardContent class="space-y-3">
              <div>
                <span class="text-xs text-muted-foreground">Nome</span>
                <p class="font-medium">{{ selectedMatch.nameB }}</p>
              </div>
              <div>
                <span class="text-xs text-muted-foreground">CPF</span>
                <p class="font-medium text-muted-foreground italic">(vazio)</p>
              </div>
              <div>
                <span class="text-xs text-muted-foreground">Data Nascimento</span>
                <p class="font-medium">00/03/1975</p>
              </div>
              <div>
                <span class="text-xs text-muted-foreground">Nome da Mae</span>
                <p class="font-medium">MARIA SILVA</p>
              </div>
              <div>
                <span class="text-xs text-muted-foreground">CNS</span>
                <p class="font-medium">987654321098765</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- Motivo do match -->
        <div class="pt-4 border-t">
          <p class="text-xs text-muted-foreground">
            <strong>Motivo do match:</strong> Nome similar (fonético) + Mês de nascimento + Nome da mãe similar
          </p>
        </div>
      </div>

      <div v-else class="h-full flex items-center justify-center text-muted-foreground">
        <p>Selecione um match na fila para visualizar</p>
      </div>
    </template>

    <!-- ========== BUSCAR PACIENTE ========== -->
    <template #patient-search>
      <div class="h-full flex flex-col gap-4">
        <!-- Campo de busca -->
        <div class="flex gap-2">
          <div class="relative flex-1">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              v-model="searchQuery"
              placeholder="Buscar por nome, CPF ou CNS..."
              class="pl-10"
              @keyup.enter="searchPatients"
            />
          </div>
          <Button :disabled="isSearching" @click="searchPatients">
            {{ isSearching ? 'Buscando...' : 'Buscar' }}
          </Button>
        </div>

        <!-- Resultados -->
        <div class="flex-1 overflow-auto">
          <div v-if="isSearching" class="py-8 text-center text-muted-foreground">
            <p class="text-sm">Buscando pacientes...</p>
          </div>

          <div v-else-if="searchResults.length > 0" class="space-y-2">
            <p class="text-xs text-muted-foreground mb-2">
              {{ searchResults.length }} resultado(s) encontrado(s)
            </p>
            <Card
              v-for="patient in searchResults"
              :key="patient.id"
              class="cursor-pointer transition-colors hover:bg-muted"
              @click="viewPatientDetails(patient)"
            >
              <CardContent class="p-3">
                <div class="flex items-start justify-between">
                  <div>
                    <p class="font-medium text-sm">{{ patient.nome }}</p>
                    <p class="text-xs text-muted-foreground mt-1">
                      CPF: {{ patient.cpf }} | Nasc: {{ patient.dataNascimento }}
                    </p>
                    <p class="text-xs text-muted-foreground">
                      CNS: {{ patient.cns }}
                    </p>
                  </div>
                  <span class="text-xs text-muted-foreground">
                    {{ patient.municipio }}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div v-else-if="searchQuery && !isSearching" class="py-8 text-center text-muted-foreground">
            <p class="text-sm">Nenhum paciente encontrado</p>
            <p class="text-xs mt-1">Tente buscar por outro termo</p>
          </div>

          <div v-else class="py-8 text-center text-muted-foreground">
            <Search class="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p class="text-sm">Digite um termo para buscar</p>
            <p class="text-xs mt-1">Nome, CPF ou CNS</p>
          </div>
        </div>
      </div>
    </template>

    <!-- ========== IMPORTAÇÃO EM LOTE ========== -->
    <template #batch-import>
      <div class="h-full flex flex-col gap-4">
        <!-- Upload de arquivo -->
        <Card>
          <CardContent class="p-4">
            <div v-if="!batchFile" class="text-center py-6">
              <Upload class="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
              <p class="text-sm font-medium mb-1">Selecione um arquivo CSV</p>
              <p class="text-xs text-muted-foreground mb-4">
                Formatos aceitos: .csv, .xlsx (máx. 10MB)
              </p>
              <label class="cursor-pointer">
                <input
                  type="file"
                  accept=".csv,.xlsx"
                  class="hidden"
                  @change="handleFileSelect"
                />
                <Button as="span" variant="outline">
                  <Upload class="h-4 w-4 mr-2" />
                  Escolher arquivo
                </Button>
              </label>
            </div>

            <div v-else class="space-y-4">
              <!-- Arquivo selecionado -->
              <div class="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <FileText class="h-8 w-8 text-muted-foreground" />
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium truncate">{{ batchFile.name }}</p>
                  <p class="text-xs text-muted-foreground">
                    {{ (batchFile.size / 1024).toFixed(1) }} KB
                  </p>
                </div>
                <Button variant="ghost" size="sm" @click="resetBatchImport">
                  <XCircle class="h-4 w-4" />
                </Button>
              </div>

              <!-- Barra de progresso -->
              <div v-if="batchStatus !== 'idle' && batchStatus !== 'completed'" class="space-y-2">
                <div class="flex justify-between text-xs">
                  <span class="text-muted-foreground">
                    {{ batchStatus === 'uploading' ? 'Enviando arquivo...' : 'Processando registros...' }}
                  </span>
                  <span class="font-medium">{{ batchProgress }}%</span>
                </div>
                <div class="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    class="h-full bg-primary transition-all duration-300"
                    :style="{ width: `${batchProgress}%` }"
                  />
                </div>
              </div>

              <!-- Resultados -->
              <div v-if="batchResults" class="grid grid-cols-2 gap-3">
                <div class="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                  <div class="flex items-center gap-2 text-green-600 dark:text-green-400">
                    <CheckCircle2 class="h-4 w-4" />
                    <span class="text-xs font-medium">Processados</span>
                  </div>
                  <p class="text-lg font-bold mt-1">{{ batchResults.processed }}</p>
                </div>
                <div class="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <div class="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                    <AlertCircle class="h-4 w-4" />
                    <span class="text-xs font-medium">Matches</span>
                  </div>
                  <p class="text-lg font-bold mt-1">{{ batchResults.matches }}</p>
                </div>
                <div class="p-3 bg-red-50 dark:bg-red-950 rounded-lg col-span-2">
                  <div class="flex items-center gap-2 text-red-600 dark:text-red-400">
                    <XCircle class="h-4 w-4" />
                    <span class="text-xs font-medium">Erros</span>
                  </div>
                  <p class="text-lg font-bold mt-1">{{ batchResults.errors }}</p>
                </div>
              </div>

              <!-- Botões de ação -->
              <div class="flex gap-2">
                <Button
                  v-if="batchStatus === 'idle'"
                  class="flex-1"
                  @click="startBatchImport"
                >
                  Iniciar Importação
                </Button>
                <Button
                  v-if="batchStatus === 'completed'"
                  class="flex-1"
                  @click="resetBatchImport"
                >
                  Nova Importação
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Histórico de importações -->
        <div class="flex-1 overflow-auto">
          <p class="text-xs font-medium text-muted-foreground mb-2">Histórico recente</p>
          <div class="space-y-2">
            <Card v-for="item in importHistory" :key="item.id">
              <CardContent class="p-3">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium">{{ item.filename }}</p>
                    <p class="text-xs text-muted-foreground">
                      {{ item.date }} • {{ item.records.toLocaleString() }} registros
                    </p>
                  </div>
                  <span
                    class="text-xs px-2 py-1 rounded-full"
                    :class="{
                      'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300': item.status === 'completed',
                      'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300': item.status === 'error'
                    }"
                  >
                    {{ item.status === 'completed' ? 'Concluído' : 'Erro' }}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </template>

    <!-- ========== PERFIL DO USUÁRIO ========== -->
    <template #user-profile>
      <div class="h-full flex flex-col gap-4 overflow-auto">
        <!-- Header com avatar -->
        <div class="flex items-center gap-4 pb-4 border-b">
          <div class="relative">
            <Avatar class="h-20 w-20">
              <AvatarImage
                v-if="user?.foto_perfil"
                :src="user.foto_perfil"
                :alt="user?.nome"
              />
              <AvatarFallback class="text-2xl font-semibold bg-primary text-primary-foreground">
                {{ userInitials }}
              </AvatarFallback>
            </Avatar>
            <button
              class="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors"
            >
              <Camera class="h-4 w-4" />
            </button>
          </div>
          <div class="flex-1">
            <h3 class="font-semibold text-lg">{{ user?.nome || 'Usuário' }}</h3>
            <p class="text-sm text-muted-foreground">{{ user?.funcao || 'Analista' }}</p>
            <p class="text-xs text-muted-foreground mt-1">
              Membro desde Jan/2024
            </p>
          </div>
        </div>

        <!-- Informações do perfil -->
        <div v-if="!isEditingProfile" class="space-y-4">
          <div class="grid gap-3">
            <div class="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Mail class="h-4 w-4 text-muted-foreground" />
              <div>
                <p class="text-xs text-muted-foreground">Email</p>
                <p class="text-sm font-medium">{{ user?.email || '-' }}</p>
              </div>
            </div>
            <div class="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Phone class="h-4 w-4 text-muted-foreground" />
              <div>
                <p class="text-xs text-muted-foreground">Telefone</p>
                <p class="text-sm font-medium">{{ user?.telefone || '-' }}</p>
              </div>
            </div>
            <div class="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <MapPin class="h-4 w-4 text-muted-foreground" />
              <div>
                <p class="text-xs text-muted-foreground">Localização</p>
                <p class="text-sm font-medium">
                  {{ user?.cidade && user?.estado ? `${user.cidade} - ${user.estado}` : '-' }}
                </p>
              </div>
            </div>
            <div class="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Shield class="h-4 w-4 text-muted-foreground" />
              <div>
                <p class="text-xs text-muted-foreground">Instituição</p>
                <p class="text-sm font-medium">{{ user?.instituicao || '-' }}</p>
              </div>
            </div>
          </div>

          <Button variant="outline" class="w-full" @click="startEditProfile">
            Editar Perfil
          </Button>
        </div>

        <!-- Formulário de edição -->
        <div v-else class="space-y-4">
          <div class="space-y-3">
            <div>
              <Label for="profile-nome">Nome completo</Label>
              <Input id="profile-nome" v-model="profileForm.nome" class="mt-1" />
            </div>
            <div>
              <Label for="profile-email">Email</Label>
              <Input id="profile-email" v-model="profileForm.email" type="email" class="mt-1" />
            </div>
            <div>
              <Label for="profile-telefone">Telefone</Label>
              <Input
                id="profile-telefone"
                v-model="profileForm.telefone"
                placeholder="(99) 99999-9999"
                class="mt-1"
              />
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <Label for="profile-cidade">Cidade</Label>
                <Input id="profile-cidade" v-model="profileForm.cidade" class="mt-1" />
              </div>
              <div>
                <Label for="profile-estado">Estado (UF)</Label>
                <Input
                  id="profile-estado"
                  v-model="profileForm.estado"
                  placeholder="SP"
                  maxlength="2"
                  class="mt-1 uppercase"
                />
              </div>
            </div>
            <div>
              <Label for="profile-funcao">Função/Cargo</Label>
              <Input id="profile-funcao" v-model="profileForm.funcao" class="mt-1" />
            </div>
            <div>
              <Label for="profile-instituicao">Instituição</Label>
              <Input id="profile-instituicao" v-model="profileForm.instituicao" class="mt-1" />
            </div>
          </div>

          <div class="flex gap-2">
            <Button variant="outline" class="flex-1" :disabled="isSavingProfile" @click="cancelEditProfile">
              Cancelar
            </Button>
            <Button class="flex-1" :disabled="isSavingProfile" @click="saveProfile">
              {{ isSavingProfile ? 'Salvando...' : 'Salvar' }}
            </Button>
          </div>
        </div>

        <!-- Seção de senha -->
        <div class="pt-4 border-t">
          <button
            class="flex items-center justify-between w-full p-3 rounded-lg hover:bg-muted transition-colors"
            @click="togglePasswordChange"
          >
            <div class="flex items-center gap-3">
              <Shield class="h-4 w-4 text-muted-foreground" />
              <span class="text-sm font-medium">Alterar senha</span>
            </div>
            <span class="text-xs text-muted-foreground">
              {{ isChangingPassword ? 'Cancelar' : 'Alterar' }}
            </span>
          </button>

          <div v-if="isChangingPassword" class="mt-3 space-y-3 p-3 bg-muted/50 rounded-lg">
            <div>
              <Label for="current-password">Senha atual</Label>
              <div class="relative mt-1">
                <Input
                  id="current-password"
                  v-model="passwordForm.activePassword"
                  :type="showCurrentPassword ? 'text' : 'password'"
                />
                <button
                  type="button"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  @click="showCurrentPassword = !showCurrentPassword"
                >
                  <Eye v-if="!showCurrentPassword" class="h-4 w-4" />
                  <EyeOff v-else class="h-4 w-4" />
                </button>
              </div>
            </div>
            <div>
              <Label for="new-password">Nova senha</Label>
              <div class="relative mt-1">
                <Input
                  id="new-password"
                  v-model="passwordForm.newPassword"
                  :type="showNewPassword ? 'text' : 'password'"
                  placeholder="Mínimo 6 caracteres"
                />
                <button
                  type="button"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  @click="showNewPassword = !showNewPassword"
                >
                  <Eye v-if="!showNewPassword" class="h-4 w-4" />
                  <EyeOff v-else class="h-4 w-4" />
                </button>
              </div>
            </div>
            <div>
              <Label for="confirm-password">Confirmar nova senha</Label>
              <Input
                id="confirm-password"
                v-model="passwordForm.confirmPassword"
                type="password"
                class="mt-1"
              />
            </div>
            <!-- Mensagem de erro -->
            <p v-if="passwordError" class="text-xs text-destructive">
              {{ passwordError }}
            </p>
            <Button
              class="w-full"
              :disabled="!passwordForm.activePassword || !passwordForm.newPassword || isSavingPassword"
              @click="savePassword"
            >
              {{ isSavingPassword ? 'Alterando...' : 'Alterar Senha' }}
            </Button>
          </div>
        </div>
      </div>
    </template>

    <!-- ========== CONFIGURAÇÕES ========== -->
    <template #user-settings>
      <div class="h-full flex flex-col gap-6 overflow-auto">
        <!-- Tema -->
        <div class="space-y-3">
          <h4 class="text-sm font-medium flex items-center gap-2">
            <Monitor class="h-4 w-4" />
            Aparência
          </h4>
          <div class="grid grid-cols-3 gap-2">
            <button
              class="p-3 rounded-lg border-2 transition-colors flex flex-col items-center gap-2"
              :class="settings.theme === 'light' ? 'border-primary bg-primary/5' : 'border-transparent bg-muted hover:border-muted-foreground/20'"
              @click="setTheme('light')"
            >
              <Sun class="h-5 w-5" />
              <span class="text-xs">Claro</span>
            </button>
            <button
              class="p-3 rounded-lg border-2 transition-colors flex flex-col items-center gap-2"
              :class="settings.theme === 'dark' ? 'border-primary bg-primary/5' : 'border-transparent bg-muted hover:border-muted-foreground/20'"
              @click="setTheme('dark')"
            >
              <Moon class="h-5 w-5" />
              <span class="text-xs">Escuro</span>
            </button>
            <button
              class="p-3 rounded-lg border-2 transition-colors flex flex-col items-center gap-2"
              :class="settings.theme === 'system' ? 'border-primary bg-primary/5' : 'border-transparent bg-muted hover:border-muted-foreground/20'"
              @click="setTheme('system')"
            >
              <Monitor class="h-5 w-5" />
              <span class="text-xs">Sistema</span>
            </button>
          </div>
        </div>

        <!-- Notificações -->
        <div class="space-y-3">
          <h4 class="text-sm font-medium flex items-center gap-2">
            <Bell class="h-4 w-4" />
            Notificações
          </h4>
          <div class="space-y-2">
            <label class="flex items-center justify-between p-3 bg-muted/50 rounded-lg cursor-pointer">
              <span class="text-sm">Notificações por email</span>
              <input
                v-model="settings.notifications.email"
                type="checkbox"
                class="h-4 w-4 rounded border-gray-300"
              />
            </label>
            <label class="flex items-center justify-between p-3 bg-muted/50 rounded-lg cursor-pointer">
              <span class="text-sm">Notificações push</span>
              <input
                v-model="settings.notifications.push"
                type="checkbox"
                class="h-4 w-4 rounded border-gray-300"
              />
            </label>
            <label class="flex items-center justify-between p-3 bg-muted/50 rounded-lg cursor-pointer">
              <span class="text-sm">Sons de notificação</span>
              <input
                v-model="settings.notifications.sound"
                type="checkbox"
                class="h-4 w-4 rounded border-gray-300"
              />
            </label>
          </div>
        </div>

        <!-- Workspace -->
        <div class="space-y-3">
          <h4 class="text-sm font-medium flex items-center gap-2">
            <Monitor class="h-4 w-4" />
            Workspace
          </h4>
          <div class="space-y-2">
            <label class="flex items-center justify-between p-3 bg-muted/50 rounded-lg cursor-pointer">
              <div>
                <span class="text-sm">Abrir fila de revisão automaticamente</span>
                <p class="text-xs text-muted-foreground">Ao entrar no workspace</p>
              </div>
              <input
                v-model="settings.workspace.autoOpenReviewQueue"
                type="checkbox"
                class="h-4 w-4 rounded border-gray-300"
              />
            </label>
            <label class="flex items-center justify-between p-3 bg-muted/50 rounded-lg cursor-pointer">
              <div>
                <span class="text-sm">Confirmar antes de fechar</span>
                <p class="text-xs text-muted-foreground">Janelas com alterações não salvas</p>
              </div>
              <input
                v-model="settings.workspace.confirmBeforeClose"
                type="checkbox"
                class="h-4 w-4 rounded border-gray-300"
              />
            </label>
            <label class="flex items-center justify-between p-3 bg-muted/50 rounded-lg cursor-pointer">
              <div>
                <span class="text-sm">Snap em grid</span>
                <p class="text-xs text-muted-foreground">Alinhar janelas automaticamente</p>
              </div>
              <input
                v-model="settings.workspace.snapToGrid"
                type="checkbox"
                class="h-4 w-4 rounded border-gray-300"
              />
            </label>
          </div>
        </div>

        <!-- Atalhos de teclado -->
        <div class="space-y-3">
          <h4 class="text-sm font-medium flex items-center gap-2">
            <Keyboard class="h-4 w-4" />
            Atalhos de teclado
          </h4>
          <div class="space-y-1">
            <div
              v-for="shortcut in shortcuts"
              :key="shortcut.key"
              class="flex items-center justify-between p-2 text-sm"
            >
              <span class="text-muted-foreground">{{ shortcut.action }}</span>
              <kbd class="px-2 py-1 bg-muted rounded text-xs font-mono">
                {{ shortcut.key }}
              </kbd>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- ========== GERENCIAMENTO DE USUÁRIOS (Admin) ========== -->
    <template #user-management>
      <div class="h-full flex flex-col gap-4">
        <!-- Tabs -->
        <div class="flex gap-2 border-b pb-2">
          <button
            class="px-4 py-2 text-sm font-medium rounded-t-lg transition-colors"
            :class="userManagementTab === 'list'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground'"
            @click="userManagementTab = 'list'; loadUsers()"
          >
            Lista de Usuários
          </button>
          <button
            class="px-4 py-2 text-sm font-medium rounded-t-lg transition-colors"
            :class="userManagementTab === 'new'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground'"
            @click="userManagementTab = 'new'; resetNewUserForm()"
          >
            <UserPlus class="h-4 w-4 inline mr-1" />
            Novo Usuário
          </button>
        </div>

        <!-- Tab: Lista de Usuários -->
        <div v-if="userManagementTab === 'list'" class="flex-1 flex flex-col gap-3 overflow-hidden">
          <!-- Busca -->
          <div class="flex gap-2">
            <div class="relative flex-1">
              <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                v-model="usersSearch"
                placeholder="Buscar por nome ou email..."
                class="pl-10"
                @input="searchUsers"
              />
            </div>
            <Button variant="outline" size="icon" :disabled="usersLoading" @click="loadUsers">
              <RefreshCw class="h-4 w-4" :class="{ 'animate-spin': usersLoading }" />
            </Button>
          </div>

          <!-- Lista -->
          <div class="flex-1 overflow-auto">
            <div v-if="usersLoading" class="py-8 text-center text-muted-foreground">
              <RefreshCw class="h-6 w-6 mx-auto mb-2 animate-spin" />
              <p class="text-sm">Carregando usuários...</p>
            </div>

            <div v-else-if="usersList.length > 0" class="space-y-2">
              <Card v-for="userItem in usersList" :key="userItem.id">
                <CardContent class="p-3">
                  <div class="flex items-start justify-between gap-3">
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2">
                        <p class="font-medium text-sm truncate">{{ userItem.nome }}</p>
                        <span
                          v-if="userItem.admin"
                          class="px-1.5 py-0.5 text-xs rounded bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
                        >
                          Admin
                        </span>
                        <span
                          :class="userItem.ativo !== false
                            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                            : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'"
                          class="px-1.5 py-0.5 text-xs rounded"
                        >
                          {{ userItem.ativo !== false ? 'Ativo' : 'Inativo' }}
                        </span>
                      </div>
                      <p class="text-xs text-muted-foreground truncate">{{ userItem.email }}</p>
                      <p class="text-xs text-muted-foreground mt-1">
                        {{ userItem.funcao || 'Sem função' }}
                        {{ userItem.instituicao ? `• ${userItem.instituicao}` : '' }}
                      </p>
                      <p class="text-xs text-muted-foreground">
                        Último login: {{ formatLastLogin(userItem.ultimo_login) }}
                      </p>
                    </div>
                    <div class="flex gap-1">
                      <Button variant="ghost" size="icon" class="h-8 w-8" @click="startEditUser(userItem)">
                        <Pencil class="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        class="h-8 w-8"
                        :class="userItem.ativo !== false ? 'text-destructive' : 'text-green-600'"
                        @click="toggleUserStatus(userItem)"
                      >
                        <UserX v-if="userItem.ativo !== false" class="h-4 w-4" />
                        <UserCheck v-else class="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div v-else class="py-8 text-center text-muted-foreground">
              <p class="text-sm">Nenhum usuário encontrado</p>
              <Button variant="link" size="sm" class="mt-2" @click="loadUsers">
                Carregar usuários
              </Button>
            </div>
          </div>

          <!-- Modal de Edição -->
          <div
            v-if="isEditingUser && selectedUserForEdit"
            class="absolute inset-0 bg-background/95 backdrop-blur-sm z-10 p-4 overflow-auto"
          >
            <div class="max-w-md mx-auto">
              <h4 class="font-semibold mb-4">Editar Usuário</h4>
              <div class="space-y-3">
                <div>
                  <Label>Nome</Label>
                  <Input v-model="editUserForm.nome" class="mt-1" />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input v-model="editUserForm.email" type="email" class="mt-1" />
                </div>
                <div>
                  <Label>Telefone</Label>
                  <Input v-model="editUserForm.telefone" placeholder="(99) 99999-9999" class="mt-1" />
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Cidade</Label>
                    <Input v-model="editUserForm.cidade" class="mt-1" />
                  </div>
                  <div>
                    <Label>Estado (UF)</Label>
                    <Input v-model="editUserForm.estado" maxlength="2" class="mt-1 uppercase" />
                  </div>
                </div>
                <div>
                  <Label>Função</Label>
                  <Input v-model="editUserForm.funcao" class="mt-1" />
                </div>
                <div>
                  <Label>Instituição</Label>
                  <Input v-model="editUserForm.instituicao" class="mt-1" />
                </div>
                <div class="flex gap-4">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input v-model="editUserForm.admin" type="checkbox" class="h-4 w-4 rounded" />
                    <span class="text-sm">Administrador</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input v-model="editUserForm.ativo" type="checkbox" class="h-4 w-4 rounded" />
                    <span class="text-sm">Ativo</span>
                  </label>
                </div>
              </div>
              <div class="flex gap-2 mt-6">
                <Button variant="outline" class="flex-1" :disabled="isSavingUser" @click="cancelEditUser">
                  Cancelar
                </Button>
                <Button class="flex-1" :disabled="isSavingUser" @click="saveEditUser">
                  {{ isSavingUser ? 'Salvando...' : 'Salvar' }}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab: Novo Usuário -->
        <div v-if="userManagementTab === 'new'" class="flex-1 overflow-auto">
          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-3">
              <div class="col-span-2">
                <Label>Nome completo *</Label>
                <Input v-model="newUserForm.nome" class="mt-1" />
              </div>
              <div class="col-span-2">
                <Label>Email *</Label>
                <Input v-model="newUserForm.email" type="email" class="mt-1" />
              </div>
              <div>
                <Label>Senha *</Label>
                <Input v-model="newUserForm.senha" type="password" placeholder="Mínimo 8 caracteres" class="mt-1" />
              </div>
              <div>
                <Label>Confirmar Senha *</Label>
                <Input v-model="newUserForm.confirmarSenha" type="password" class="mt-1" />
              </div>
              <div>
                <Label>Telefone</Label>
                <Input v-model="newUserForm.telefone" placeholder="(99) 99999-9999" class="mt-1" />
              </div>
              <div class="grid grid-cols-2 gap-2">
                <div>
                  <Label>Cidade</Label>
                  <Input v-model="newUserForm.cidade" class="mt-1" />
                </div>
                <div>
                  <Label>UF</Label>
                  <Input v-model="newUserForm.estado" maxlength="2" class="mt-1 uppercase" />
                </div>
              </div>
              <div>
                <Label>Função</Label>
                <Input v-model="newUserForm.funcao" class="mt-1" />
              </div>
              <div>
                <Label>Instituição</Label>
                <Input v-model="newUserForm.instituicao" class="mt-1" />
              </div>
              <div class="col-span-2">
                <Label>Chave Mestre *</Label>
                <Input v-model="newUserForm.masterKey" type="password" class="mt-1" />
                <p class="text-xs text-muted-foreground mt-1">
                  Chave de segurança para criação de usuários
                </p>
              </div>
              <div class="col-span-2">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input v-model="newUserForm.admin" type="checkbox" class="h-4 w-4 rounded" />
                  <span class="text-sm">Criar como Administrador</span>
                </label>
              </div>
            </div>

            <!-- Erro -->
            <p v-if="createUserError" class="text-sm text-destructive">
              {{ createUserError }}
            </p>

            <!-- Botões -->
            <div class="flex gap-2">
              <Button
                variant="outline"
                class="flex-1"
                @click="resetNewUserForm"
              >
                Limpar
              </Button>
              <Button
                class="flex-1"
                :disabled="isCreatingUser || !newUserForm.nome || !newUserForm.email || !newUserForm.senha || !newUserForm.masterKey"
                @click="createUser"
              >
                {{ isCreatingUser ? 'Criando...' : 'Criar Usuário' }}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </template>
  </Desktop>
</template>
