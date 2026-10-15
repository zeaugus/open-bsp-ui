// acr: guia "virar app" da equipe UASS-PJC, aberto mesmo sem login (ver src/acr/README.md).
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import GuiaInstalar from "@/acr/GuiaInstalar";

export const Route = createFileRoute("/instalar")({
  component: Instalar,
});

function Instalar() {
  const navigate = useNavigate();
  return (
    <div className="h-dvh overflow-y-auto">
      <GuiaInstalar aoSair={() => void navigate({ to: "/" })} />
    </div>
  );
}
