// acr: guia ilustrado para colocar a caixa na tela do celular, no Android e no iPhone.
// Aparece sozinho na primeira visita pelo celular (GuiaPrimeiraVez) e fica em /instalar.
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Check, Copy, Download, TriangleAlert } from "lucide-react";
import { ehIOS } from "./push";
import {
  copiarTexto,
  iosForaDoSafari,
  marcarGuiaVisto,
  pedirInstalacao,
  usePodeInstalar,
} from "./instalar";
import {
  AvisoAtivar,
  ChromeBarra,
  ChromeConfirma,
  ChromeMenu,
  IconeNavegador,
  SafariBarra,
  SafariConfirma,
  SafariFolha,
  TelaInicial,
} from "./MockupsInstalar";
import "./instalar.css";

type Sistema = "android" | "iphone";
type Passo = { texto: ReactNode; desenho: ReactNode; destaque?: ReactNode };

const ABAS: { id: Sistema; nome: string }[] = [
  { id: "android", nome: "Android" },
  { id: "iphone", nome: "iPhone" },
];

/** Passo 1: o endereço desta página, com botão de copiar. */
function Endereco({ sistema }: { sistema: Sistema }) {
  const [copiado, setCopiado] = useState(false);
  return (
    <div className="flex flex-col gap-[10px] rounded-[18px] border border-[var(--g-borda)] bg-[var(--g-tela)] p-[12px]">
      <div className="flex items-center gap-[10px]">
        <IconeNavegador sistema={sistema} />
        <div className="min-w-0 flex-1 truncate rounded-full bg-[var(--g-tela-2)] px-[14px] py-[10px] text-[15px] font-semibold select-all">
          {window.location.host}
        </div>
      </div>
      <button
        type="button"
        className="flex h-[48px] items-center justify-center gap-[8px] rounded-full border-2 border-[var(--g-numero)] text-[16px] font-bold text-[var(--g-texto)] active:opacity-70"
        onClick={async () => {
          if (await copiarTexto(window.location.origin)) setCopiado(true);
        }}
      >
        {copiado ? <Check size={20} /> : <Copy size={20} />}
        <span aria-live="polite">
          {copiado ? "Endereço copiado" : "Copiar endereço"}
        </span>
      </button>
    </div>
  );
}

function passosDe(sistema: Sistema, foraDoSafari: boolean): Passo[] {
  const host = window.location.host;
  if (sistema === "android") {
    return [
      {
        texto: "Abra este endereço no Chrome.",
        desenho: <Endereco sistema="android" />,
      },
      {
        texto: "Toque nos três pontinhos, no canto de cima à direita.",
        desenho: <ChromeBarra host={host} />,
      },
      {
        texto: (
          <>
            Toque em <b>Instalar app</b>. Em alguns celulares o nome é{" "}
            <b>Adicionar à tela inicial</b>.
          </>
        ),
        desenho: <ChromeMenu host={host} />,
      },
      {
        texto: (
          <>
            Confirme tocando em <b>Instalar</b>.
          </>
        ),
        desenho: <ChromeConfirma host={host} />,
      },
      {
        texto: (
          <>
            Pronto. Procure o ícone <b>UASS Atende</b> na tela do celular e abra
            por ele.
          </>
        ),
        desenho: <TelaInicial sistema="android" />,
      },
      {
        texto: (
          <>
            Na primeira vez, entre com seu e-mail e senha e toque em{" "}
            <b>Ativar notificações</b>, para receber os avisos de conversa.
          </>
        ),
        desenho: <AvisoAtivar />,
      },
    ];
  }
  return [
    {
      texto: "Abra este endereço no Safari, o navegador da bússola azul.",
      desenho: <Endereco sistema="iphone" />,
      destaque: foraDoSafari ? (
        <div
          role="note"
          className="mt-[10px] flex items-start gap-[8px] rounded-[14px] bg-[var(--acr-amarelo)] px-[12px] py-[10px] text-[15px] leading-[1.35] font-semibold text-[var(--acr-navy-deep)]"
        >
          <TriangleAlert size={20} className="mt-[1px] shrink-0" />
          Você está em outro navegador. Copie o endereço e cole no Safari.
        </div>
      ) : undefined,
    },
    {
      texto:
        "Toque no botão de compartilhar, o quadrado com uma seta para cima, na barra de baixo. Se ele não aparecer, toque nos três pontinhos da barra de baixo e depois em Compartilhar.",
      desenho: <SafariBarra host={host} />,
    },
    {
      texto: (
        <>
          Role a lista para baixo e toque em <b>Adicionar à Tela de Início</b>.
        </>
      ),
      desenho: <SafariFolha host={host} />,
    },
    {
      texto: (
        <>
          Toque em <b>Adicionar</b>, no canto de cima à direita.
        </>
      ),
      desenho: <SafariConfirma origem={window.location.origin} />,
    },
    {
      texto: (
        <>
          Pronto. Abra o app pelo ícone <b>UASS Atende</b> na tela de início.
        </>
      ),
      desenho: <TelaInicial sistema="iphone" />,
    },
    {
      texto: (
        <>
          Na primeira vez, entre com seu e-mail e senha e toque em{" "}
          <b>Ativar notificações</b>. No iPhone, os avisos só chegam com o app
          aberto pelo ícone.
        </>
      ),
      desenho: <AvisoAtivar />,
    },
  ];
}

/** O guia inteiro. `aoSair` roda depois de "Já instalei" ou "Agora não". */
export default function GuiaInstalar({ aoSair }: { aoSair: () => void }) {
  const [sistema, setSistema] = useState<Sistema>(() =>
    ehIOS() ? "iphone" : "android",
  );
  const podeInstalar = usePodeInstalar();
  const foraDoSafari = iosForaDoSafari();
  const titulo = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    titulo.current?.focus();
  }, []);

  const sair = () => {
    marcarGuiaVisto();
    aoSair();
  };

  return (
    <div className="acr-guia flex min-h-full flex-col">
      <header className="bg-[var(--acr-navy)] px-[20px] pt-[calc(env(safe-area-inset-top)+24px)] pb-[44px] text-white">
        <div className="mx-auto max-w-[448px]">
          <img
            src="/uass-icon-192.png"
            alt=""
            className="h-[64px] w-[64px] rounded-[16px] shadow-lg ring-1 ring-white/25"
          />
          <h1
            ref={titulo}
            id="acr-guia-titulo"
            tabIndex={-1}
            className="mt-[16px] text-[26px] leading-[1.15] font-extrabold tracking-tight outline-none"
          >
            Coloque a caixa da UASS na tela do seu celular
          </h1>
          <p className="mt-[10px] text-[17px] leading-[1.4] text-[var(--acr-celeste)]">
            Leva menos de um minuto. Depois é só tocar no ícone, como em
            qualquer app.
          </p>
        </div>
      </header>

      <main className="mx-auto -mt-[26px] w-full max-w-[480px] flex-1 px-[16px]">
        <div
          role="tablist"
          aria-label="Escolha o seu celular"
          className="flex gap-[4px] rounded-full border border-[var(--g-borda)] bg-[var(--g-cartao)] p-[4px] shadow-md"
        >
          {ABAS.map((aba) => (
            <button
              key={aba.id}
              type="button"
              role="tab"
              id={`acr-aba-${aba.id}`}
              aria-selected={sistema === aba.id}
              aria-controls="acr-passos"
              onClick={() => setSistema(aba.id)}
              className={`h-[44px] flex-1 rounded-full text-[17px] font-bold transition-colors motion-reduce:transition-none ${
                sistema === aba.id
                  ? "bg-[var(--g-numero)] text-[var(--g-numero-texto)]"
                  : "text-[var(--g-suave)]"
              }`}
            >
              {aba.nome}
            </button>
          ))}
        </div>

        <div
          role="tabpanel"
          id="acr-passos"
          aria-labelledby={`acr-aba-${sistema}`}
        >
          {sistema === "android" && podeInstalar && (
            <button
              type="button"
              onClick={() => void pedirInstalacao()}
              className="mt-[16px] flex h-[58px] w-full items-center justify-center gap-[10px] rounded-full bg-[var(--acr-amarelo)] text-[18px] font-extrabold text-[var(--acr-navy-deep)] shadow-md active:opacity-80"
            >
              <Download size={22} strokeWidth={2.6} />
              Instalar o app
            </button>
          )}

          <ol role="list" className="mt-[16px] flex flex-col gap-[14px]">
            {passosDe(sistema, foraDoSafari).map((passo, i) => (
              <li
                key={`${sistema}-${i}`}
                className={`rounded-[22px] bg-[var(--g-cartao)] p-[14px] ${
                  passo.destaque
                    ? "border-2 border-[var(--acr-amarelo)]"
                    : "border border-[var(--g-borda)]"
                }`}
              >
                <div className="flex items-start gap-[12px]">
                  <span
                    aria-hidden
                    className="grid h-[44px] w-[44px] shrink-0 place-items-center rounded-full bg-[var(--g-numero)] text-[22px] font-extrabold text-[var(--g-numero-texto)]"
                  >
                    {i + 1}
                  </span>
                  <p className="pt-[8px] text-[18px] leading-[1.35] font-medium [&_b]:font-extrabold">
                    {passo.texto}
                  </p>
                </div>
                {passo.destaque}
                <div className="mt-[12px]">{passo.desenho}</div>
              </li>
            ))}
          </ol>
        </div>
      </main>

      <div className="sticky bottom-0 mt-[20px] border-t border-[var(--g-borda)] bg-[var(--g-fundo)] px-[16px] pt-[12px] pb-[calc(env(safe-area-inset-bottom)+12px)]">
        <div className="mx-auto flex max-w-[448px] gap-[10px]">
          <button
            type="button"
            onClick={sair}
            className="h-[52px] flex-1 rounded-full border-2 border-[var(--g-borda)] text-[16px] font-bold text-[var(--g-texto)] active:opacity-70"
          >
            Agora não
          </button>
          <button
            type="button"
            onClick={sair}
            className="h-[52px] flex-1 rounded-full bg-[var(--g-numero)] text-[16px] font-bold text-[var(--g-numero-texto)] active:opacity-80"
          >
            Já instalei
          </button>
        </div>
      </div>
    </div>
  );
}
