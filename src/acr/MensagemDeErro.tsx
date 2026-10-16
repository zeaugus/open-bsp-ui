// acr: aviso de erro de carregamento, com "Tentar de novo" opcional.
export default function MensagemDeErro({
  mensagem,
  onTentarDeNovo,
}: {
  mensagem: string;
  onTentarDeNovo?: () => void;
}) {
  return (
    <div role="alert" className="p-6 text-center text-sm text-destructive">
      <p>{mensagem}</p>
      {onTentarDeNovo && (
        <button
          type="button"
          className="mt-3 text-primary underline"
          onClick={onTentarDeNovo}
        >
          Tentar de novo
        </button>
      )}
    </div>
  );
}
