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
- `FaixaDeEstado.tsx`: faixa sob o cabeçalho do chat. IA (neutra), aguardando equipe (amarelo,
  "há N min" pelo `passada_em`, motivo legível) ou com atendente (navy, botão "Devolver para a
  IA"). Estado desconhecido conta como `ia`. Erro de RPC: mostra IA e loga `[acr] ...`.
- `EstadoNaLista.tsx`: barra de 4 px na borda esquerda do item da lista e chip ("IA",
  "Aguardando N min", nome do dono). Substitui o antigo `SeloAguardando`.
- `RotuloIA.tsx`: `useEhIA(agent_id)` (agente sem `user_id` = IA) e o rótulo "Mia (IA)" do balão.
  O balão da IA usa a classe `.acr-ia` (`theme.css`), que só troca `--chat-out` (o rabo herda).
  Mensagem de pessoa segue com o nome que o upstream já mostra.
- `AvisoAoResponder.tsx`: linha fina acima do campo de mensagem, em `ia` e `aguardando_humano`.
- `util.ts` (`estadoDe`, `formatarTempo`, `useAgora`, relógio de 30 s) e `motivos.ts` (cópia do
  `ROTULOS` de `acr-atendimento/lib/avisos/params.ts`; se lá mudar, mudar aqui).
- `AvisoNotificacoes.tsx`, `theme.css` (variáveis de cor UASS).
- Fora daqui: `public/sw.js`, `public/manifest.json`, `public/uass-*.png` (ícones do brasão
  sobre navy, gerados de `assets/logos/uass-crest-tight.png` do design system).

## O que foi tocado no upstream (cada ponto tem `// acr`)

- `index.html`:6-15 meta iOS e `apple-touch-icon`; :17 `theme-color` navy.
- `public/manifest.json`: reescrito (nome, cores, ícones UASS).
- `src/main.tsx`:4-5 imports do tema e do push; :59-60 `registrarServiceWorker()`.
- `src/components/ChatListItem.tsx`:34 import; :343 `relative` no item (ancora a barra);
  :441-442 `<EstadoNaLista />`.
- `src/components/Message/Message.tsx`:28 import; :355 prop `ia` do `OutMessage`; :373 classe
  `acr-ia` no balão; :392-396 `<RotuloIA />` no lugar do nome do agente quando é IA; :411 tipo
  `ia?`; :428 `useEhIA`; :637 repasse de `ia` ao `OutMessage`.
- `src/routes/_auth.tsx`:17-19 imports; :81-82 `<AvisoNotificacoes />`; :122 `<FaixaDeEstado />`
  entre `ChatHeader` e `Chat`; :124 `<AvisoAoResponder />` entre `Chat` e `ChatFooter`.
  (`ChatHeader.tsx` não é mais tocado.)
- `.env.example`: `VITE_VAPID_PUBLIC_KEY=`.

## Push

Formato recebido por `sw.js`: `{ titulo, corpo, url }`. Clique: foca uma janela do app e navega
para a `url`; sem janela, abre uma. O SW não faz cache. iPhone só recebe push com o app na
tela de início (o aviso explica). Textos da camada são fixos em português (não passam pelo
`translate` do upstream).

## Como testar

1. `.env` com `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` e `VITE_VAPID_PUBLIC_KEY`;
   `acr-fluxo.sql` aplicado no banco; `npm run dev`.
2. Entrar, abrir uma conversa: a faixa sob o cabeçalho mostra o estado. No banco, ponha a linha em
   `acr.conversas` com `estado = 'aguardando_humano'`: a lista mostra "Aguardando" em até 30 s e
   a faixa ao reabrir. "Devolver para a IA" deve voltar `estado` para `ia`.
3. Notificações: o aviso aparece após o login; tocar pede permissão e grava a inscrição
   (`acr.atendentes.push`). Enviar um push `{titulo, corpo, url:"/conversations#<id>"}` pelo
   cron/`web-push` e clicar nele. No iPhone, instalar na tela de início primeiro.
4. Gate: `npm run check` e `npm run build` (gera `dist/sw.js` e `dist/manifest.json`).
