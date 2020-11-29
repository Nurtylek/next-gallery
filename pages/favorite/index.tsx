import React, {FC} from 'react';
import {AppShell} from "@/components/app-shell/app-shell";

type FavoriteProps = {};

export default function Favorite() {
    return (
        <AppShell title={'Favorite'} search={(searchTerm) => {}} >
            <section style={{height: '100vh'}}>
                Favorite page
            </section>
        </AppShell>
    );
};
