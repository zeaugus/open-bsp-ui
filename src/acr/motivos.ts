// acr: motivo legível da passagem para a equipe.
// Copiado de acr-atendimento/lib/avisos/params.ts (const ROTULOS), as mesmas
// chaves e textos que o atendente lê no aviso de WhatsApp. Se lá mudar, mude aqui.
const ROTULOS: Record<string, string> = {
  pediu_pessoa: "pediu para falar com uma pessoa",
  pagamento_ou_comprovante: "pagamento ou comprovante",
  desconto_ou_bolsa: "desconto ou bolsa",
  matricula: "matrícula",
  transferencia: "transferência",
  documento: "documento",
  reclamacao: "reclamação",
  saude_mental: "saúde mental",
  fora_da_base: "pergunta fora da base da Mia",
  tres_voltas_sem_avancar: "conversa travada",
  pedido_de_visita: "quer visitar o campus",
  falha_da_ia: "a Mia falhou ao responder",
};

/** Texto legível do motivo; valor desconhecido volta cru; vazio devolve null. */
export function motivoLegivel(motivo: string | null | undefined) {
  if (!motivo) return null;
  return ROTULOS[motivo] ?? motivo;
}
