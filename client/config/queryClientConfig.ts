import { QueryClientConfig } from "react-query";

const queryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
};

export default queryClientConfig;
