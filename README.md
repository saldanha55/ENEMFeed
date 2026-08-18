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

## Instalação e execução

> **Pré-requisito:** Node.js 18+ e npm instalados.

```bash
# Instalar dependências
npm install

# Rodar em modo desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no navegador (use DevTools → modo mobile 375px para a experiência ideal).

## Estrutura do projeto

```
src/
├── app/
│   ├── layout.tsx          # Layout raiz (fonts, Header, dark mode)
│   ├── page.tsx            # Home: conteúdo do dia + catch-up
│   ├── globals.css         # Estilos globais + Tailwind directives
│   ├── study/
│   │   ├── page.tsx        # Fluxo: Palavras → Contexto → Questões → Conclusão
│   │   └── components/
│   │       ├── WordsStep.tsx
│   │       ├── ContextStep.tsx
│   │       ├── QuestionStep.tsx
│   │       └── CompleteStep.tsx
│   └── history/
│       └── page.tsx        # Arquivo de Aulas + Caderno de Erros
├── components/
│   ├── Header.tsx          # Navegação + StreakBadge + ThemeToggle
│   └── ui/
│       ├── AnimatedPage.tsx
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── DisciplineBadge.tsx
│       ├── ProgressBar.tsx
│       ├── StreakBadge.tsx
│       └── ThemeToggle.tsx
├── hooks/
│   ├── useDailyContent.ts  # Fetch + cache da API
│   ├── useStudyProgress.ts # Estado das respostas da sessão
│   └── useTheme.ts         # Tema claro/escuro com localStorage
├── lib/
│   ├── api.ts              # Fetch do Google Apps Script + cache
│   ├── progress.ts         # Histórico, streak, caderno de erros
│   └── utils.ts            # cn(), getDisciplinaConfig(), datas
└── types/
    └── index.ts            # Interfaces TypeScript
```

## Regras de negócio chave

### Streak sem punição tóxica (CLT 6x1)
- O streak não é zerado imediatamente se um dia for perdido.
- Se a estudante completar o conteúdo do dia anterior hoje (Modo Recuperação), o streak é **preservado**.
- O Modo Recuperação pode ser usado **uma vez por dia**.

### Caderno de Erros
- Toda questão respondida incorretamente é salva automaticamente.
- Na página `/history`, aba "Caderno de Erros", é possível **refazer** as questões erradas.

### PWA Offline
- O conteúdo do dia é cacheado no `localStorage` assim que carregado.
- Se a API falhar, o último conteúdo salvo é exibido.

## Ícones PWA

Os ícones PNG precisam ser gerados a partir de `public/icons/icon.svg`:

```bash
# Exemplo com sharp (opcional)
npx sharp-cli -i public/icons/icon.svg -o public/icons/icon-192x192.png resize 192 192
npx sharp-cli -i public/icons/icon.svg -o public/icons/icon-512x512.png resize 512 512
```

Ou use qualquer ferramenta online de conversão SVG → PNG.

## Build para produção

```bash
npm run build
npm run start
```
