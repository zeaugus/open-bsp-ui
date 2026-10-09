# acr: camada da equipe UASS-PJC neste fork

**Rota da conversa:** `/conversations#<conversation_id>` (o id é o uuid de `public.conversations`).
O upstream já abre a conversa pelo fragmento (`_auth.tsx` sincroniza `location.hash` com
`activeConvId`), então não foi criada rota nova. Link completo: `${CAIXA_URL}/conversations#<id>`.
Sem sessão, o app manda ao login e depois volta para essa URL.

**Env nova:** `VITE_VAPID_PUBLIC_KEY` (chave pública VAPID, a mesma `VAPID_PUBLIC_KEY` do
`acr-atendimento`). Entra no build (Vercel, Production). Sem ela o aviso de ativar notificações
não aparece.

## Arquivos (todos novos, isolados aqui)

- `api.ts`: `estadoConversas`, `devolver`, `inscreverPush` (RPCs do schema `acr`).
- `push.ts`: registra `/sw.js`, detecta iOS/instalado, `ativarNotificacoes()`.
- `useEstado.ts`: `useEstadoLista` (todas as conversas numa chamada, a cada 30 s) e
  `useEstadoConversa` (recarrega ao abrir e a cada 30 s).
- `EstadoDaConversa.tsx`: etiqueta "Com a IA" / "Aguardando equipe" / "Com <dono_nome>" e botão
  "Devolver para a IA" (aparece quando o estado não é `ia`). Erro de RPC: mostra "Com a IA" e
  loga `[acr] ...` no console.
- `SeloAguardando.tsx`, `AvisoNotificacoes.tsx`, `theme.css` (variáveis de cor UASS).
- Fora daqui: `public/sw.js`, `public/manifest.json`, `public/uass-*.png` (ícones do brasão
  sobre navy, gerados de `assets/logos/uass-crest-tight.png` do design system).

## O que foi tocado no upstream (cada ponto tem `// acr`)

- `index.html`:6-15 meta iOS e `apple-touch-icon`; :17 `theme-color` navy.
- `public/manifest.json`: reescrito (nome, cores, ícones UASS).
- `src/main.tsx`:4-5 imports do tema e do push; :59-60 `registrarServiceWorker()`.
- `src/components/ChatHeader.tsx`:7 import; :103-105 `<EstadoDaConversa />`.
- `src/components/ChatListItem.tsx`:34 import; :440-441 `<SeloAguardando />`.
- `src/routes/_auth.tsx`:17 import; :79-80 `<AvisoNotificacoes />`.
- `.env.example`: `VITE_VAPID_PUBLIC_KEY=`.

## Push

Formato recebido por `sw.js`: `{ titulo, corpo, url }`. Clique: foca uma janela do app e navega
para a `url`; sem janela, abre uma. O SW não faz cache. iPhone só recebe push com o app na
tela de início (o aviso explica). Textos da camada são fixos em português (não passam pelo
`translate` do upstream).

## Como testar

1. `.env` com `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` e `VITE_VAPID_PUBLIC_KEY`;
   `acr-fluxo.sql` aplicado no banco; `npm run dev`.
2. Entrar, abrir uma conversa: cabeçalho mostra a etiqueta. No banco, ponha a linha em
   `acr.conversas` com `estado = 'aguardando_humano'`: a lista mostra "Aguardando" em até 30 s e
   o cabeçalho ao reabrir. "Devolver para a IA" deve voltar `estado` para `ia`.
3. Notificações: o aviso aparece após o login; tocar pede permissão e grava a inscrição
   (`acr.atendentes.push`). Enviar um push `{titulo, corpo, url:"/conversations#<id>"}` pelo
   cron/`web-push` e clicar nele. No iPhone, instalar na tela de início primeiro.
4. Gate: `npm run check` e `npm run build` (gera `dist/sw.js` e `dist/manifest.json`).
