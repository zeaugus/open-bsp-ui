// acr: desenhos simplificados das telas do Chrome e do Safari para o guia "virar app".
// Só ilustram (aria-hidden): o texto do passo é que explica.
import type { ReactNode } from "react";
import {
  ArrowRight,
  BatteryFull,
  BookOpen,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Copy,
  Download,
  EllipsisVertical,
  History,
  House,
  Info,
  Lock,
  Plus,
  RotateCw,
  Settings,
  Share,
  Share2,
  Signal,
  SlidersHorizontal,
  Smartphone,
  SquarePlus,
  Star,
  Wifi,
} from "lucide-react";

const ICONE = "/uass-icon-192.png";

function Tela({
  children,
  altura,
  className = "border border-[var(--g-borda)] bg-[var(--g-tela)]",
}: {
  children: ReactNode;
  altura: string;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={`relative overflow-hidden rounded-[18px] text-[var(--g-texto)] ${altura} ${className}`}
    >
      {children}
    </div>
  );
}

function BarraStatus({ clara }: { clara?: boolean }) {
  return (
    <div
      className={`flex h-[24px] items-center justify-between px-[14px] text-[11px] font-semibold ${clara ? "text-white" : ""}`}
    >
      <span>9:41</span>
      <span className="flex items-center gap-[4px]">
        <Signal size={12} />
        <Wifi size={12} />
        <BatteryFull size={15} />
      </span>
    </div>
  );
}

/** Conteúdo genérico de página, só para a tela não ficar vazia. */
function Tracos({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col gap-[8px] px-[16px] pt-[12px] ${className}`}>
      <span className="h-[10px] w-[55%] rounded-full bg-[var(--g-traco)]" />
      <span className="h-[8px] w-[85%] rounded-full bg-[var(--g-traco)]" />
      <span className="h-[8px] w-[70%] rounded-full bg-[var(--g-traco)]" />
    </div>
  );
}

/** Anel amarelo pulsando em volta do que se toca. */
function Alvo({
  children,
  forma = "rounded-full",
  linha,
}: {
  children: ReactNode;
  forma?: string;
  linha?: boolean;
}) {
  return (
    <span className={`acr-alvo ${linha ? "acr-alvo-linha" : ""} flex ${forma}`}>
      {children}
    </span>
  );
}

/** Ícones dos navegadores, desenhados de forma simples para reconhecer de longe. */
export function IconeNavegador({ sistema }: { sistema: "android" | "iphone" }) {
  if (sistema === "android") {
    return (
      <span
        aria-hidden
        className="grid h-[48px] w-[48px] shrink-0 place-items-center rounded-full"
        style={{
          background:
            "conic-gradient(from -60deg, #ea4335 0 120deg, #fbbc04 0 240deg, #34a853 0)",
        }}
      >
        <span className="grid h-[22px] w-[22px] place-items-center rounded-full bg-white">
          <span className="h-[16px] w-[16px] rounded-full bg-[#4285f4]" />
        </span>
      </span>
    );
  }
  return (
    <svg
      aria-hidden
      viewBox="0 0 48 48"
      className="h-[48px] w-[48px] shrink-0 drop-shadow-sm"
    >
      <defs>
        <linearGradient id="acr-bussola" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5ac8fa" />
          <stop offset="1" stopColor="#0a64d8" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="11" fill="#fff" />
      <circle cx="24" cy="24" r="19" fill="url(#acr-bussola)" />
      <g transform="rotate(45 24 24)">
        <polygon points="24,8 27.6,24 20.4,24" fill="#ff3b30" />
        <polygon points="24,40 27.6,24 20.4,24" fill="#fff" />
      </g>
    </svg>
  );
}

function BarraChrome({ host, alvo }: { host: string; alvo?: boolean }) {
  const pontos = (
    <span className="grid h-[38px] w-[38px] place-items-center rounded-full">
      <EllipsisVertical size={22} strokeWidth={2.6} />
    </span>
  );
  return (
    <div className="flex h-[52px] items-center gap-[8px] px-[10px]">
      <House size={20} className="shrink-0 text-[var(--g-suave)]" />
      <div className="flex h-[36px] min-w-0 flex-1 items-center gap-[6px] rounded-full bg-[var(--g-tela-2)] px-[12px] text-[13px]">
        <SlidersHorizontal size={14} className="shrink-0" />
        <span className="truncate">{host}</span>
      </div>
      <span className="grid h-[20px] w-[20px] shrink-0 place-items-center rounded-[5px] border-2 border-current text-[11px] font-bold">
        1
      </span>
      {alvo ? (
        <Alvo>
          <span className="rounded-full bg-[var(--g-tela-2)]">{pontos}</span>
        </Alvo>
      ) : (
        pontos
      )}
    </div>
  );
}

/** Android, passo 2: barra de cima do Chrome com os três pontinhos. */
export function ChromeBarra({ host }: { host: string }) {
  return (
    <Tela altura="h-[150px]">
      <BarraStatus />
      <BarraChrome host={host} alvo />
      <Tracos />
    </Tela>
  );
}

function LinhaMenu({ icone, texto }: { icone: ReactNode; texto: string }) {
  return (
    <div className="flex h-[32px] items-center gap-[12px] px-[14px] text-[13px]">
      <span className="shrink-0 text-[var(--g-suave)]">{icone}</span>
      {texto}
    </div>
  );
}

/** Android, passo 3: menu do Chrome com "Instalar app" em destaque. */
export function ChromeMenu({ host }: { host: string }) {
  return (
    <Tela altura="h-[246px]">
      <BarraStatus />
      <div className="opacity-40">
        <BarraChrome host={host} />
        <Tracos />
      </div>
      <div className="absolute top-[28px] right-[8px] w-[214px] rounded-[16px] border border-[var(--g-borda)] bg-[var(--g-cartao)] py-[6px] shadow-xl">
        <div className="flex h-[30px] items-center justify-around px-[8px] text-[var(--g-suave)]">
          <ArrowRight size={17} />
          <Star size={17} />
          <Download size={17} />
          <Info size={17} />
          <RotateCw size={17} />
        </div>
        <LinhaMenu icone={<Plus size={16} />} texto="Nova guia" />
        <LinhaMenu icone={<History size={16} />} texto="Histórico" />
        <LinhaMenu icone={<Share2 size={16} />} texto="Compartilhar" />
        <div className="mx-[6px]">
          <Alvo forma="rounded-[10px]" linha>
            <span className="flex h-[32px] w-full items-center gap-[12px] rounded-[10px] bg-[color-mix(in_srgb,var(--acr-amarelo)_22%,transparent)] px-[8px] text-[13px] font-bold">
              <Smartphone size={16} className="shrink-0" />
              Instalar app
            </span>
          </Alvo>
        </div>
        <LinhaMenu icone={<Settings size={16} />} texto="Configurações" />
      </div>
    </Tela>
  );
}

/** Android, passo 4: janela de confirmação do Chrome. */
export function ChromeConfirma({ host }: { host: string }) {
  return (
    <Tela altura="h-[190px]">
      <BarraStatus />
      <Tracos />
      <div className="absolute inset-0 bg-black/45" />
      <div className="absolute top-1/2 left-1/2 w-[250px] -translate-x-1/2 -translate-y-1/2 rounded-[22px] bg-[var(--g-cartao)] p-[16px] shadow-xl">
        <div className="text-[16px] font-bold">Instalar app</div>
        <div className="mt-[10px] flex items-center gap-[10px]">
          <img src={ICONE} alt="" className="h-[38px] w-[38px] rounded-full" />
          <div className="min-w-0">
            <div className="text-[14px] font-semibold">UASS Atende</div>
            <div className="truncate text-[12px] text-[var(--g-suave)]">
              {host}
            </div>
          </div>
        </div>
        <div className="mt-[14px] flex items-center justify-end gap-[14px] text-[13px] font-semibold">
          <span className="text-[var(--g-azul-chrome)]">Cancelar</span>
          <Alvo>
            <span className="rounded-full bg-[var(--g-azul-chrome)] px-[16px] py-[7px] text-[var(--g-sobre-azul)]">
              Instalar
            </span>
          </Alvo>
        </div>
      </div>
    </Tela>
  );
}

/** Passo 5: tela de início com o ícone UASS Atende. */
export function TelaInicial({ sistema }: { sistema: "android" | "iphone" }) {
  const forma = sistema === "android" ? "rounded-full" : "rounded-[12px]";
  const vazio = (i: number) => (
    <div key={i} className="flex flex-col items-center gap-[5px]">
      <span className={`h-[44px] w-[44px] bg-white/30 ${forma}`} />
      <span className="h-[5px] w-[30px] rounded-full bg-white/40" />
    </div>
  );
  return (
    <Tela
      altura="h-[232px]"
      className="bg-gradient-to-b from-[#1f2b5d] via-[#3d5797] to-[#8fc3e3]"
    >
      <BarraStatus clara />
      <div className="grid grid-cols-4 justify-items-center gap-y-[14px] px-[14px] pt-[12px]">
        {[0, 1, 2, 3, 4].map(vazio)}
        <div className="flex flex-col items-center gap-[5px]">
          <Alvo forma={forma}>
            <img src={ICONE} alt="" className={`h-[44px] w-[44px] ${forma}`} />
          </Alvo>
          <span className="text-[10px] leading-[10px] font-semibold text-white">
            UASS Atende
          </span>
        </div>
        {[6, 7].map(vazio)}
      </div>
      <div className="absolute inset-x-[12px] bottom-[10px] flex h-[52px] items-center justify-around rounded-[20px] bg-white/20">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className={`h-[36px] w-[36px] bg-white/35 ${forma}`} />
        ))}
      </div>
    </Tela>
  );
}

/** Passo 6: a caixa aberta com o aviso "Ativar notificações deste aparelho". */
export function AvisoAtivar() {
  return (
    <Tela altura="h-[200px]">
      <BarraStatus />
      <div className="px-[14px] pt-[4px] text-[15px] font-bold">Conversas</div>
      <div className="flex flex-col gap-[12px] px-[14px] pt-[10px]">
        {[70, 55, 62].map((largura) => (
          <div key={largura} className="flex items-center gap-[10px]">
            <span className="h-[30px] w-[30px] shrink-0 rounded-full bg-[var(--g-tela-2)]" />
            <div className="flex flex-1 flex-col gap-[5px]">
              <span
                className="h-[8px] rounded-full bg-[var(--g-traco)]"
                style={{ width: `${largura}%` }}
              />
              <span className="h-[6px] w-[85%] rounded-full bg-[var(--g-traco)] opacity-70" />
            </div>
          </div>
        ))}
      </div>
      <div className="absolute inset-x-0 bottom-[14px] flex justify-center">
        <Alvo>
          <span className="rounded-full bg-[var(--acr-navy)] px-[14px] py-[7px] text-[12px] text-white shadow-lg">
            Ativar notificações deste aparelho
          </span>
        </Alvo>
      </div>
    </Tela>
  );
}

/** iPhone, passo 2: barra de baixo do Safari com o botão de compartilhar. */
export function SafariBarra({ host }: { host: string }) {
  return (
    <Tela altura="h-[176px]">
      <BarraStatus />
      <Tracos />
      <div className="absolute inset-x-0 bottom-0 border-t border-[var(--g-borda)] bg-[var(--g-tela-2)] px-[12px] pt-[8px] pb-[8px]">
        <div className="flex h-[34px] items-center gap-[8px] rounded-[12px] bg-[var(--g-tela)] px-[10px] text-[13px]">
          <span className="text-[12px] font-semibold">aA</span>
          <span className="flex min-w-0 flex-1 items-center justify-center gap-[4px]">
            <Lock size={11} className="shrink-0" />
            <span className="truncate">{host}</span>
          </span>
          <RotateCw size={14} />
        </div>
        <div className="mt-[6px] flex items-center justify-between px-[4px] text-[var(--g-azul-ios)]">
          <ChevronLeft size={24} />
          <ChevronRight size={24} className="opacity-40" />
          <Alvo forma="rounded-[12px]">
            <span className="grid h-[40px] w-[44px] place-items-center rounded-[12px] bg-[var(--g-tela)]">
              <Share size={22} />
            </span>
          </Alvo>
          <BookOpen size={22} />
          <Copy size={22} />
        </div>
        <div className="mx-auto mt-[6px] h-[4px] w-[110px] rounded-full bg-[var(--g-texto)] opacity-70" />
      </div>
    </Tela>
  );
}

function LinhaFolha({
  texto,
  icone,
  destaque,
}: {
  texto: string;
  icone: ReactNode;
  destaque?: boolean;
}) {
  const conteudo = (
    <span
      className={`flex h-[34px] w-full items-center justify-between rounded-[10px] px-[12px] text-[13px] ${destaque ? "bg-[color-mix(in_srgb,var(--acr-amarelo)_22%,transparent)] font-bold" : ""}`}
    >
      {texto}
      {icone}
    </span>
  );
  return destaque ? (
    <Alvo forma="rounded-[10px]" linha>
      {conteudo}
    </Alvo>
  ) : (
    conteudo
  );
}

/** iPhone, passo 3: folha de compartilhar com "Adicionar à Tela de Início". */
export function SafariFolha({ host }: { host: string }) {
  return (
    <Tela altura="h-[264px]">
      <Tracos />
      <div className="absolute inset-0 bg-black/35" />
      <div className="absolute inset-x-0 top-[24px] bottom-0 rounded-t-[18px] bg-[var(--g-tela-2)] px-[12px] pt-[12px]">
        <div className="flex items-center gap-[10px]">
          <img src={ICONE} alt="" className="h-[34px] w-[34px] rounded-[8px]" />
          <div className="min-w-0">
            <div className="truncate text-[13px] font-semibold">
              UASS-PJC Atendimento
            </div>
            <div className="truncate text-[11px] text-[var(--g-suave)]">
              {host}
            </div>
          </div>
        </div>
        <div className="mt-[10px] flex gap-[14px]">
          {["#2f8cf7", "#34c759", "#5ac8fa", "#ff9f0a", "#8e8e93"].map(
            (cor) => (
              <span
                key={cor}
                className="h-[34px] w-[34px] rounded-full"
                style={{ background: cor }}
              />
            ),
          )}
        </div>
        <div className="mt-[10px] flex flex-col gap-[2px] rounded-[12px] bg-[var(--g-tela)] p-[3px]">
          <LinhaFolha texto="Copiar" icone={<Copy size={16} />} />
          <LinhaFolha
            texto="Adicionar aos Favoritos"
            icone={<BookOpen size={16} />}
          />
          <LinhaFolha
            texto="Adicionar à Tela de Início"
            icone={<SquarePlus size={16} />}
            destaque
          />
        </div>
        <div className="mt-[4px] flex justify-center text-[var(--g-suave)]">
          <ChevronDown size={18} />
        </div>
      </div>
    </Tela>
  );
}

/** iPhone, passo 4: tela de confirmação com "Adicionar" no canto de cima. */
export function SafariConfirma({ origem }: { origem: string }) {
  return (
    <Tela altura="h-[168px]">
      <BarraStatus />
      <div className="flex h-[44px] items-center justify-between gap-[8px] px-[10px] text-[13px]">
        <span className="shrink-0 text-[var(--g-azul-ios)]">Cancelar</span>
        <span className="min-w-0 truncate text-[12px] font-semibold">
          Adicionar à Tela de Início
        </span>
        <Alvo>
          <span className="shrink-0 rounded-full px-[9px] py-[4px] font-bold text-[var(--g-azul-ios)]">
            Adicionar
          </span>
        </Alvo>
      </div>
      <div className="mx-[12px] mt-[6px] flex items-center gap-[12px] rounded-[12px] bg-[var(--g-tela-2)] p-[10px]">
        <img src={ICONE} alt="" className="h-[52px] w-[52px] rounded-[12px]" />
        <div className="min-w-0 flex-1">
          <div className="border-b border-[var(--g-traco)] pb-[6px] text-[14px]">
            UASS Atende
          </div>
          <div className="truncate pt-[6px] text-[11px] text-[var(--g-suave)]">
            {origem}
          </div>
        </div>
      </div>
    </Tela>
  );
}
