import React, { FunctionComponent, useEffect, useState } from 'react';
import { Button } from '@navikt/ds-react';

import { lenkeTilNyttKandidatsøk } from '../../app/paths';
import { NyttKandidatsøkØkt, skrivKandidatnrTilNyttKandidatsøkØkt } from '../søkekontekst';
import Kandidatheader from '../komponenter/header/Kandidatheader';
import Kandidatmeny from '../komponenter/meny/Kandidatmeny';
import LagreKandidaterModal from '../../kandidatsøk/modaler/LagreKandidaterModal';
import useCv from '../hooks/useCv';
import useNavigerbareKandidaterFraSøk from './useNavigerbareKandidaterFraSøk';
import useScrollTilToppen from '../../common/useScrollTilToppen';

type Props = {
    kandidatnr: string;
    søkeøkt: NyttKandidatsøkØkt;
};

const FraSøkUtenKontekst: FunctionComponent<Props> = ({ kandidatnr, søkeøkt, children }) => {
    useScrollTilToppen(kandidatnr);
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
            <Kandidatmeny cv={cv}>
                <Button variant="primary" onClick={() => setVisKandidatlisterModal(true)}>
                    Lagre kandidat i kandidatlister
                </Button>
            </Kandidatmeny>
            {children}
            <LagreKandidaterModal
                vis={visKandidatlisterModal}
                onRequestClose={() => setVisKandidatlisterModal(false)}
                onLagre={() => {
                    setVisKandidatlisterModal(false);
                }}
            />
        </>
    );
};

export default FraSøkUtenKontekst;
