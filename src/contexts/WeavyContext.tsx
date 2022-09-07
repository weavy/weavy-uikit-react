import React, { createContext } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import UserProvider from "./UserContext";
import dayjs  from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import PreviewProvider from "./PreviewContext";
import detectScrollbars from '../utils/scrollbarDetection';

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(localizedFormat);


export const WeavyContext = createContext<WeavyContextProps>({
  client: null,
  options: {}
});

type WeavyProviderProperties = {
  children: React.ReactNode,
  client: WeavyClient,
  options?: WeavyContextOptions
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
})

const WeavyProvider = ({ children, client, options }: WeavyProviderProperties) => {

  let defaultOptions: WeavyContextOptions = {
    zoomAuthenticationUrl: undefined,
    teamsAuthenticationUrl: undefined,
    enableCloudFiles: true,
    enableScrollbarDetection: true,
    filebrowserUrl: "https://filebrowser.weavycloud.com/index10.html",
    reactions: ['😍', '😎', '😉', '😜', '👍']
  };

  let opts = { ...defaultOptions, ...options }

  if (opts.enableScrollbarDetection) {
    detectScrollbars();
  }

  if(!client){
    queryClient.clear();
  }

  return (
    <>
      {client &&
        <QueryClientProvider client={queryClient}>
          <WeavyContext.Provider value={{ client, options: opts }}>
            <UserProvider client={client}>
              <PreviewProvider client={client}>
                {children}
              </PreviewProvider>              
            </UserProvider>
          </WeavyContext.Provider>
        </QueryClientProvider>
      }
    </>
  )
};

export default WeavyProvider;

