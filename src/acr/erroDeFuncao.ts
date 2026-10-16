// acr: texto legível do erro de uma edge function. O `invokeFunction` do upstream
// lança o erro cru (FunctionsHttpError, sem o corpo da resposta) e as telas de
// modelos o engoliam: lista vazia e botão que "não faz nada". Aqui o corpo é lido
// e o detalhe da Meta (cause.error) entra na frase.
import { FunctionsHttpError } from "@supabase/supabase-js";

type CorpoDoErro = {
  message?: unknown;
  cause?: {
    error?: {
      message?: unknown;
      error_user_title?: unknown;
      error_user_msg?: unknown;
    };
  } | null;
};

const texto = (v: unknown) =>
  typeof v === "string" && v.trim() ? v.trim() : null;

/** `acao` é a frase do que falhou, ex.: "Não foi possível carregar os modelos". */
export async function textoDoErro(e: unknown, acao: string): Promise<string> {
  if (e instanceof FunctionsHttpError) {
    const resposta = e.context as Response;
    let corpo: CorpoDoErro | null = null;
    try {
      corpo = (await resposta.json()) as CorpoDoErro;
    } catch {
      // corpo vazio ou que não é JSON: fica só o status
    }

    if (resposta.status === 401 || resposta.status === 403) {
      return `${acao}: sem permissão para esta ação (HTTP ${resposta.status}).`;
    }

    const meta = corpo?.cause?.error;
    const detalhe =
      texto(meta?.error_user_msg) ??
      texto(meta?.message) ??
      texto(corpo?.message);

    return `${acao}: ${detalhe ?? "erro sem detalhe"} (HTTP ${resposta.status}).`;
  }

  const detalhe = e instanceof Error ? texto(e.message) : null;
  return `${acao}: ${detalhe ?? "falha de conexão"}.`;
}
