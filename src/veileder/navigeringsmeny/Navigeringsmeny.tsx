import React, { FunctionComponent, useState } from 'react';
import NyttIRekrutteringsbistand from '@navikt/nytt-i-rekrutteringsbistand';

import Tab, { TabConfig } from './Tab';
import Hus from './Hus';

import '../../../node_modules/@navikt/nytt-i-rekrutteringsbistand/lib/nytt.css';
import 'pam-frontend-header/dist/style.css';
import './Navigeringsmeny.less';

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
    {
        tittel: 'Kandidatsøk',
        href: '/kandidater',
        erSammeApp: true,
    },
    {
        tittel: 'Kandidatlister',
        href: '/kandidater/lister',
        erSammeApp: true,
    },
];

const Navigeringsmeny: FunctionComponent = () => {
    const [aktivTabIndeks, setAktivTabIndeks] = useState<number>(-1);
    return (
        <div className="navigeringsmeny">
            <nav className="navigeringsmeny__tabs">
                <Hus
                    href="/"
                    erAktiv={aktivTabIndeks === -1}
                    onClick={() => setAktivTabIndeks(-1)}
                />
                {tabs.map((tab, indeks) => (
                    <Tab
                        key={tab.href}
                        config={tab}
                        erAktiv={indeks === aktivTabIndeks}
                        onClick={() => setAktivTabIndeks(indeks)}
                    />
                ))}
            </nav>
            <div className="navigeringsmeny__nyheter">
                <NyttIRekrutteringsbistand orientering={'under-hoyre' as any} />
            </div>
        </div>
    );
};

export default Navigeringsmeny;
