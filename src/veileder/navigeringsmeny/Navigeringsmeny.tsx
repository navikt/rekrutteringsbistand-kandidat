import React, { FunctionComponent, useState } from 'react';
import NyttIRekrutteringsbistand from '@navikt/nytt-i-rekrutteringsbistand';
import { useLocation } from 'react-router-dom';

import Tab, { TabConfig } from './Tab';
import Hus from './Hus';

import '../../../node_modules/@navikt/nytt-i-rekrutteringsbistand/lib/nytt.css';
import 'pam-frontend-header/dist/style.css';
import './Navigeringsmeny.less';

const kandidatsøkTab = {
    tittel: 'Kandidatsøk',
    href: '/kandidater',
    erSammeApp: true,
};

const kandidatlisterTab = {
    tittel: 'Kandidatlister',
    href: '/kandidater/lister',
    erSammeApp: true,
};

const tabs: TabConfig[] = [
    {
        tittel: 'Søk etter stilling',
        href: '/stillinger',
        erSammeApp: false,
    },
    {
        tittel: 'Mine stillinger',
        href: '/minestillinger',
        erSammeApp: false,
    },
    kandidatsøkTab,
    kandidatlisterTab,
];

const aktivTab = (pathname: string): TabConfig => {
    if (pathname.startsWith('/kandidater/lister')) {
        return kandidatlisterTab;
    } else {
        return kandidatsøkTab;
    }
};

const Navigeringsmeny: FunctionComponent = () => {
    const { pathname }: Location = useLocation();
    return (
        <div className="navigeringsmeny">
            <nav className="navigeringsmeny__tabs">
                <Hus href="/" />
                {tabs.map((tab) => (
                    <Tab key={tab.href} config={tab} erAktiv={tab === aktivTab(pathname)} />
                ))}
            </nav>
            <div className="navigeringsmeny__nyheter">
                <NyttIRekrutteringsbistand orientering={'under-hoyre' as any} />
            </div>
        </div>
    );
};

export default Navigeringsmeny;
