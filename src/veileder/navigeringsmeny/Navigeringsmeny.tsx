import React, { FunctionComponent } from 'react';
import { Location } from 'history';
import { useLocation } from 'react-router-dom';
import NyttIRekrutteringsbistand from '@navikt/nytt-i-rekrutteringsbistand';

import Tab, { TabConfig } from './Tab';
import Hus from './Hus';
import { useSelector, useDispatch } from 'react-redux';

import '../../node_modules/@navikt/nytt-i-rekrutteringsbistand/lib/nytt.css';
import 'pam-frontend-header/dist/style.css';
import './Navigeringsmeny.less';

const tabs: TabConfig[] = [
    {
        tittel: 'Søk etter stilling',
        href: '/stillinger',
        erSammeApp: true,
    },
    {
        tittel: 'Mine stillinger',
        href: '/minestillinger',
        erSammeApp: true,
    },
    {
        tittel: 'Kandidatsøk',
        href: '/kandidater',
        erSammeApp: false,
    },
    {
        tittel: 'Kandidatlister',
        href: '/kandidater/lister',
        erSammeApp: false,
    },
];

const Navigeringsmeny: FunctionComponent = () => {
    const { pathname }: Location = useLocation();
    const { hasChanges } = useSelector((state: any) => state.ad);
    const dispatch = useDispatch();

    const visForlatSidenModal = (leaveUrl: String) =>
        dispatch({ type: SHOW_HAS_CHANGES_MODAL, leaveUrl });

    const onClickTab = (href: string) => (event: React.MouseEvent<HTMLElement>) => {
        if (hasChanges) {
            event.preventDefault();
            visForlatSidenModal(href);
        }
    };

    return (
        <div className="navigeringsmeny">
            <nav className="navigeringsmeny__tabs">
                <Hus href="/" erAktiv={pathname === '/'} onClick={onClickTab('/')} />
                {tabs.map(tab => (
                    <Tab
                        key={tab.href}
                        config={tab}
                        erAktiv={pathname.startsWith(tab.href)}
                        onClick={onClickTab(tab.href)}
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
