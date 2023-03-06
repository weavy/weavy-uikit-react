import { useContext } from "react";
import { QueryKey, useMutation, useQueryClient } from "react-query";
import { WeavyContext } from "../contexts/WeavyContext";
import { AppType } from "../types/types";

export function useMutateAppsSubscribe(appKey: QueryKey) {

    const { client } = useContext(WeavyContext);
    const queryClient = useQueryClient();

    if (!client) {
        throw new Error('useMutateAppsSubscribe must be used within an WeavyProvider');
    }

    type MutateProps = {
        appId: number,
        subscribe: boolean
    }

    const subscribeMutation = useMutation(async ({ appId, subscribe }: MutateProps) => {
        if (appId >= 1) {
            const response = await client.post(`/api/apps/${appId}/${subscribe ? "subscribe": "unsubscribe"}`, "POST", "");
            if (!response.ok) {
                throw await response.json();
            }
            return response.json();
        } else {
            throw new Error(`Could not subscribe to app ${appId}.`);
        }
    },{
        onMutate: async (variables: MutateProps) => {
            var previousSubscribe: boolean | undefined;
            queryClient.setQueryData(appKey, (filesApp: any) => {
                previousSubscribe = filesApp.is_subscribed; 
                return Object.assign(filesApp, { is_subscribed: variables.subscribe })
            })
            return { previousSubscribe: previousSubscribe, subscribe: variables.subscribe }
        },
        onSuccess: (data: AppType, variables: MutateProps, context: any) => {
            queryClient.setQueryData(appKey, (app: any) => Object.assign(app, data), { updatedAt: Date.now() })
            queryClient.invalidateQueries({ queryKey: appKey, exact: true });
        },
        onError(error: any, variables: MutateProps, context: any) {
            queryClient.setQueryData(appKey, (app: any) => Object.assign(app, { is_subscribed: context.previousSubscribe }))
        },
    });

    return subscribeMutation;
}