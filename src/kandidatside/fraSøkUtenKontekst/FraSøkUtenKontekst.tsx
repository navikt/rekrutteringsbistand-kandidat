import React, { FunctionComponent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from 'redux';
import { sendEvent } from '../../amplitude/amplitude';
import { Nettstatus } from '../../api/Nettressurs';
import KandidatlisteAction from '../../kandidatliste/reducer/KandidatlisteAction';
import KandidatlisteActionType from '../../kandidatliste/reducer/KandidatlisteActionType';
import { KandidatsøkAction } from '../../kandidatsøk/reducer/searchReducer';
import { CvAction } from '../../cv/reducer/cvReducer';
import { FraNyttkandidatsøk, NyttKandidatsøkØkt, Søkekontekst } from '../søkekontekst';
import KandidatsideFraSøkInner from './KandidatsideFraSøkInner';
import useScrollTilToppen from '../../common/useScrollTilToppen';
import useCv from './useCv';
import { lenkeTilNyttKandidatsøk } from '../../app/paths';
import AppState from '../../AppState';
import Kandidatheader from '../komponenter/header/Kandidatheader';
import useNavigerbareKandidaterFraSøk from './useNavigerbareKandidaterFraSøk';
import Kandidatmeny from '../komponenter/meny/Kandidatmeny';
import { Button } from '@navikt/ds-react';
import LagreKandidaterModal from '../../kandidatsøk/modaler/LagreKandidaterModal';

type Props = {
    kandidatnr: string;
    søkeøkt: NyttKandidatsøkØkt;
};

const FraSøkUtenKontekst: FunctionComponent<Props> = ({ kandidatnr, søkeøkt, children }) => {
    useScrollTilToppen(kandidatnr);

    const cv = useCv(kandidatnr);
    const kandidatnavigering = useNavigerbareKandidaterFraSøk(kandidatnr, søkeøkt);

    const [visKandidatlisterModal, setVisKandidatlisterModal] = useState<boolean>(false);

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
