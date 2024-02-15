import "@/src/styles/globals.scss";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "@/src/styles/globals.css";

import { appWithTranslation } from "next-i18next";
import { QueryClient, QueryClientProvider } from "react-query";
import { GlobalStateProvider } from "@/context/globalStateContext";
import { useState } from "react";
import { POPUP_CONTACTUS } from "/consts/popup";
import CommonLayout from "/layouts/commonLayout";

const queryClient = new QueryClient();

function App({ Component, pageProps }) {
    return (
        <QueryClientProvider client={queryClient}>
            <GlobalStateProvider>
                <CommonLayout>
                    <Component {...pageProps} />
                </CommonLayout>
            </GlobalStateProvider>
        </QueryClientProvider>
    );
}

export default appWithTranslation(App);