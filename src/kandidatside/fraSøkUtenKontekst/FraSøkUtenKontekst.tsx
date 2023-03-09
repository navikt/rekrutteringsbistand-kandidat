import React, { FunctionComponent, ReactNode, useEffect, useState } from 'react';
import { Button, Tabs } from '@navikt/ds-react';

import { lenkeTilNyttKandidatsøk } from '../../app/paths';
import { NyttKandidatsøkØkt, skrivKandidatnrTilNyttKandidatsøkØkt } from '../søkekontekst';
import Kandidatheader from '../komponenter/header/Kandidatheader';
import Kandidatmeny from '../komponenter/meny/Kandidatmeny';
import LagreKandidaterModal from '../../kandidatsøk/modaler/LagreKandidaterModal';
import useCv from '../hooks/useCv';
import useNavigerbareKandidaterFraSøk from './useNavigerbareKandidaterFraSøk';
import useScrollTilToppen from '../../common/useScrollTilToppen';
import useFaner from '../hooks/useFaner';
import { AddPeople } from '@navikt/ds-icons';

type Props = {
    tabs: ReactNode;
    kandidatnr: string;
    søkeøkt: NyttKandidatsøkØkt;
};

const FraSøkUtenKontekst: FunctionComponent<Props> = ({ tabs, kandidatnr, søkeøkt, children }) => {
    useScrollTilToppen(kandidatnr);

    const [fane, setFane] = useFaner();
    const cv = useCv(kandidatnr);
    const kandidatnavigering = useNavigerbareKandidaterFraSøk(kandidatnr, søkeøkt);
    const [visKandidatlisterModal, setVisKandidatlisterModal] = useState<boolean>(false);

    useEffect(() => {
        skrivKandidatnrTilNyttKandidatsøkØkt(kandidatnr);
    }, [kandidatnr]);

    const tilbakelenke = {
        to: lenkeTilNyttKandidatsøk(søkeøkt.searchParams),
        state: { scrollTilKandidat: true },
    };

    return (
        <>
            <Kandidatheader
                cv={cv}
                kandidatnavigering={kandidatnavigering}
                tilbakelenkeTekst="Til kandidatsøket"
                tilbakelenke={tilbakelenke}
            />
            <Tabs value={fane} onChange={setFane}>
                <Kandidatmeny tabs={tabs} cv={cv}>
                    {/*<Button
                        size="small"
                        icon={<AddPeople aria-hidden />}
                        onClick={() => setVisKandidatlisterModal(true)}
                    >
                        Velg kandidatlister
                    </Button>*/}
                </Kandidatmeny>
                <Tabs.Panel value={fane}>{children}</Tabs.Panel>
            </Tabs>
            <LagreKandidaterModal
                vis={visKandidatlisterModal}
                onRequestClose={() => setVisKandidatlisterModal(false)}
                onLagre={() => {
                    console.log('Lagret?');
                }}
            />
        </>
    );
};

export default FraSøkUtenKontekst;
