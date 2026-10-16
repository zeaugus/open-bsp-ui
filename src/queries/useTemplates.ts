import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { FunctionInvokeOptions } from "@supabase/supabase-js";
import { invokeFunction, type TemplateData } from "@/supabase/client";
import useBoundStore from "@/stores/useBoundStore";
import { textoDoErro } from "@/acr/erroDeFuncao"; // acr

// acr: o erro da edge function (com o detalhe da Meta) vira texto legível; as
// telas de modelos engoliam o erro cru.
const ACAO_DO_ERRO = {
  PUT: "Não foi possível carregar os modelos",
  POST: "Não foi possível enviar o modelo para revisão",
  PATCH: "Não foi possível atualizar o modelo",
  DELETE: "Não foi possível excluir o modelo",
} as const;

async function invokeTemplates<T>(
  options: FunctionInvokeOptions & { method: keyof typeof ACAO_DO_ERRO },
): Promise<T | null> {
  try {
    return await invokeFunction<T>("whatsapp-management/templates", options);
  } catch (e) {
    throw new Error(await textoDoErro(e, ACAO_DO_ERRO[options.method]));
  }
}

export function useTemplates(organizationAddress?: string) {
  const activeOrgId = useBoundStore((state) => state.ui.activeOrgId);

  return useQuery({
    queryKey: ["templates", activeOrgId, organizationAddress],
    queryFn: async () => {
      if (!organizationAddress) return [];

      // Meta wraps the list in `{ data: [...] }`.
      const body = await invokeTemplates<{ data?: TemplateData[] }>({
        method: "PUT",
        body: {
          organization_id: activeOrgId,
          organization_address: organizationAddress,
        },
      });

      return body?.data || [];
    },
    enabled: !!activeOrgId && !!organizationAddress,
    retry: false, // acr: erro de Meta/permissão não melhora com 3 tentativas (7 s de spinner)
  });
}

export function useCreateTemplate() {
  const queryClient = useQueryClient();
  const activeOrgId = useBoundStore((state) => state.ui.activeOrgId);

  return useMutation({
    mutationFn: async ({
      template,
      organizationAddress,
    }: {
      template: TemplateData;
      organizationAddress: string;
    }) => {
      await invokeTemplates<unknown>({
        method: "POST",
        body: {
          organization_id: activeOrgId,
          organization_address: organizationAddress,
          template,
        },
      });
    },
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: ["templates", activeOrgId, variables.organizationAddress],
      });
    },
  });
}

export function useUpdateTemplate() {
  const queryClient = useQueryClient();
  const activeOrgId = useBoundStore((state) => state.ui.activeOrgId);

  return useMutation({
    mutationFn: async ({
      template,
      organizationAddress,
    }: {
      template: TemplateData;
      organizationAddress: string;
    }) => {
      await invokeTemplates<unknown>({
        method: "PATCH",
        body: {
          organization_id: activeOrgId,
          organization_address: organizationAddress,
          template,
        },
      });
    },
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: ["templates", activeOrgId, variables.organizationAddress],
      });
    },
  });
}

export function useDeleteTemplate() {
  const queryClient = useQueryClient();
  const activeOrgId = useBoundStore((state) => state.ui.activeOrgId);

  return useMutation({
    mutationFn: async ({
      template,
      organizationAddress,
    }: {
      template: TemplateData;
      organizationAddress: string;
    }) => {
      await invokeTemplates<unknown>({
        method: "DELETE",
        body: {
          organization_id: activeOrgId,
          organization_address: organizationAddress,
          template,
        },
      });
    },
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: ["templates", activeOrgId, variables.organizationAddress],
      });
    },
  });
}
