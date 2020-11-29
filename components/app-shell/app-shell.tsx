import React, {FC} from 'react';
import {Toolbar} from "@/components/toolbar/toolbar";
import Head from "next/head";

type AppShellProps = {
    title: string;
    search: (searchTerm: string) => void
};

export const AppShell: FC<AppShellProps> = ({search, children, title}) => {
    return (
        <>
            <Head>
                <title>{title}</title>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <main className="main">
                <div className="toolbar">
                    <Toolbar photoChange={(searchTerm) => search(searchTerm)}/>
                </div>
                {children}
            </main>
        </>
    );
};
