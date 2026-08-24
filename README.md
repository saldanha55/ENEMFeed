# ENEMFeed

> Micro-learning diário para o ENEM — 10 minutos por dia, estudo de alta qualidade.

---

### 💖 Sobre o Projeto & Dedicação

Este projeto nasceu de uma história real e cheia de carinho: fiz esta versão especialmente para a minha namorada, **Luana**, que estava desesperada e sobrecarregada tentando conciliar a rotina de trabalho com os estudos para o ENEM.

Pensando nisso, desenvolvi o **ENEMFeed**: um formato 100% *CLT-friendly*, direto ao ponto e sem enrolação, para permitir que ela (e qualquer pessoa na correria do dia a dia) consiga revisar conceitos-chave, vocabulário e resolver questões do ENEM em sessões diárias rápidas de 10 minutos — com streak humanizado sem punições tóxicas! ✨

---

## Stack

- **Next.js 15** (App Router) + TypeScript
- **Tailwind CSS** com dark mode via classe
- **Framer Motion** para animações
- **Lucide React** para ícones
- **canvas-confetti** para celebração
- **@ducanh2912/next-pwa** para PWA
- **Google Apps Script** como backend (planilha + Gemini AI para geração de conteúdo)

---

## Instalação e execução

> **Pré-requisito:** Node.js 18+ e npm instalados.

```bash
# Instalar dependências
npm install

# Rodar em modo desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no navegador (use DevTools → modo mobile 375px para a experiência ideal).

---

## Estrutura do projeto

```
src/
├── app/
│   ├── layout.tsx          # Layout raiz (fonts, Header, dark mode)
│   ├── page.tsx            # Home: conteúdo do dia + catch-up + domingo de descanso
│   ├── globals.css         # Estilos globais + Tailwind directives
│   ├── study/
│   │   ├── page.tsx        # Fluxo: Palavras → Contexto → Questões → Conclusão
│   │   └── components/
│   │       ├── WordsStep.tsx
│   │       ├── ContextStep.tsx
│   │       ├── QuestionStep.tsx
│   │       └── CompleteStep.tsx
│   └── history/
│       └── page.tsx        # Arquivo de Aulas + Caderno de Erros + Mini Calendário
├── components/
│   ├── Header.tsx          # Navegação + StreakBadge + ThemeToggle
│   └── ui/
│       ├── AnimatedPage.tsx
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── DisciplineBadge.tsx
│       ├── MiniCalendar.tsx    # Calendário interativo com status por dia
│       ├── ProgressBar.tsx
│       ├── StreakBadge.tsx
│       └── ThemeToggle.tsx
├── hooks/
│   ├── useDailyContent.ts  # Fetch + cache da API
│   ├── useStudyProgress.ts # Estado das respostas da sessão
│   └── useTheme.ts         # Tema claro/escuro com localStorage
├── lib/
│   ├── api.ts              # Fetch do Google Apps Script + cache versionado
│   ├── curriculum.ts       # Banco local de conteúdo + lógica de disponibilidade
│   ├── progress.ts         # Histórico, streak, caderno de erros
│   ├── utils.ts            # cn(), getDisciplinaConfig(), datas, streak helpers
│   └── fallback.ts         # Conteúdo demo para modo offline
└── types/
    └── index.ts            # Interfaces TypeScript
```

---

## Regras de negócio chave

### Streak sem punição tóxica (CLT 6x1)
- Domingo é **folga oficial** — o streak não é afetado e nenhum conteúdo obrigatório é exigido.
- Se a estudante completar o conteúdo do dia anterior hoje (Modo Recuperação), o streak é **preservado**.
- O Modo Recuperação pode ser usado **uma vez por dia**.
- Na segunda-feira (quando ontem foi domingo), o app aponta automaticamente para o caderno de sábado como o "caderno de ontem" — sem deixar a Luana cair numa armadilha de conteúdo inexistente.

### Calendário interativo
- Exibe todos os dias do cronograma com status visual: ✅ concluído, ⏳ pendente, ☕ domingo de descanso.
- Domingos aparecem com estilo amber/café independente de estarem na planilha.
- Clicar em um dia filtra a lista de cadernos automaticamente.

### Caderno de Erros
- Toda questão respondida incorretamente é salva automaticamente.
- Na página `/history`, aba "Caderno de Erros", é possível **refazer** as questões erradas em modo treino.

### Sincronização com a planilha
- O conteúdo vem de um Google Apps Script conectado a uma planilha com conteúdo gerado pelo Gemini.
- O app sincroniza as datas disponíveis na planilha a cada visita à página de histórico.
- Cache local versionado (`v2`) garante que dados antigos com normalização incorreta sejam descartados automaticamente.

### PWA Offline
- O conteúdo do dia é cacheado no `localStorage` assim que carregado.
- Se a API falhar, o último conteúdo salvo é exibido.

---

## Desafios técnicos resolvidos 🛠️

### 📅 Organização e filtros de cadernos
O primeiro grande desafio foi construir o **Arquivo de Aulas** na página de histórico: uma lista paginável de todos os cadernos da planilha, com filtros por disciplina, status (concluído/pendente) e busca por texto. A `MiniCalendar` precisou ser construída do zero para refletir o estado real de cada dia do cronograma e servir como filtro de data clicável.

### 📆 Domingos no calendário sumindo
Os ícones ☕ dos domingos desapareciam porque o calendário só renderizava o estilo especial de domingo quando `hasContent === true` — mas domingos nunca têm entrada na planilha. A correção foi introduzir um flag `isRestDay` separado, que se baseia apenas no dia da semana e na data de início do cronograma, sem depender da planilha.

### 🧠 "Capa" do caderno mostrando conteúdo errado
Esse foi o bug mais traiçoeiro. As questões e o texto vinham certos da planilha, mas o título, a disciplina e a semana mostrados na "capa" eram de outra matéria. O problema tinha **três camadas**:

1. **Inferência incorreta:** `normalizeDailyContent` chamava `inferTopicAndDisciplina()` mesmo quando a planilha já tinha mandado os dados corretos, e a inferência por palavras-chave sobrescrevia com dados do currículo local.

2. **Cache envenenado:** A correção da lógica só valia para novos fetches. Dados incorretos já salvos no `localStorage` continuavam sendo servidos direto, sem passar pela nova normalização. A solução foi adicionar versionamento de cache (`CACHE_VERSION = "v2"`) — as chaves antigas são ignoradas automaticamente, forçando re-fetch limpo. Além disso, `getCachedContent` passou a sempre re-normalizar o que lê antes de retornar.

3. **Raiz real no histórico:** Mesmo com isso, os cards na página de histórico ainda mostravam dados errados. O motivo: `getAllCalendarDays()` em `curriculum.ts` usava `getCurriculumForDate()` (banco local hardcoded) para popular o `content` dos cadernos pendentes — ignorando completamente o que estava cacheado da planilha. A correção final foi enriquecer a lista de cadernos com `getCachedContent()` após o sync, garantindo que os cards mostrem sempre o conteúdo real da planilha.

### 📖 "Fazer caderno de ontem" no domingo sem tratamento
Quando hoje é domingo, o botão "Fazer caderno de ontem" usava `getYesterdayString()` diretamente — sem verificar se sábado tinha conteúdo disponível. Além disso, o `study/page.tsx` não sabia lidar com a segunda-feira em que "ontem" era domingo (folga). A correção foi criar `getLastStudyDayString()` que encontra o último dia de estudo real (não-domingo) antes de hoje, e usar isso em toda a lógica de catch-up e navegação.

### 🔒 Disponibilidade de cadernos muito restritiva
Sem sincronização prévia, o app só liberava "hoje" como data disponível, bloqueando o acesso ao caderno de ontem mesmo sendo um dia de estudo válido. A correção passou a abrir também "ontem" (se não for domingo) quando o `localStorage` ainda está vazio.

---

## Próximos passos 🚀

Essas são as coisas que ainda quero fazer e que vão melhorar bastante a experiência:

- **Notificações push diárias** — mandar um lembrete no horário que a Luana definir ("ei, seus 10 minutos ainda não aconteceram hoje 👀"). Vai precisar de um service worker dedicado com suporte a Push API.

- **Progresso visual geral do ENEM** — mostrar quantos % do cronograma total já foram concluídos, com breakdown por disciplina. Tipo uma barra de "você tá aqui no caminho pra aprovação".

- **Revisão espaçada** — além do caderno de erros, ter um sistema que relembra automaticamente conteúdos de semanas atrás que a Luana errou muito, seguindo a lógica do Anki.

- **Modo simuladão** — de vez em quando, juntar 10 questões de disciplinas variadas e simular um mini-ENEM cronometrado. Útil nos fins de semana ou quando ela quiser testar o nível geral.

- **Tela de estatísticas mais rica** — gráfico de evolução do aproveitamento ao longo do tempo, disciplina com mais erros, sequência de dias estudados visualmente etc.

- **Suporte a múltiplos usuários** — hoje o app é 100% feito pra Luana, mas seria legal conseguir compartilhar com outras pessoas que também estudam pro ENEM no ritmo CLT, com cronogramas personalizados.

- **Anotações no caderno** — deixar a estudante escrever uma nota rápida em cada questão ("lembrar que essa cai sempre em contexto de Revolução Francesa") que fica salva junto com o caderno.

---

## Build para produção

```bash
npm run build
npm run start
```

---

## Ícones PWA

Os ícones PNG precisam ser gerados a partir de `public/icons/icon.svg`:

```bash
npx sharp-cli -i public/icons/icon.svg -o public/icons/icon-192x192.png resize 192 192
npx sharp-cli -i public/icons/icon.svg -o public/icons/icon-512x512.png resize 512 512
```

Ou use qualquer ferramenta online de conversão SVG → PNG.


