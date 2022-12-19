import React, { useEffect } from 'react';
import { FunctionComponent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from 'redux';
import { sendEvent } from '../../amplitude/amplitude';
import { Nettstatus } from '../../api/Nettressurs';
import AppState from '../../AppState';
import KandidatlisteAction from '../../kandidatliste/reducer/KandidatlisteAction';
import KandidatlisteActionType from '../../kandidatliste/reducer/KandidatlisteActionType';
import { KandidatsøkAction } from '../../kandidatsøk/reducer/searchReducer';
import { CvAction, CvActionType } from '../cv/reducer/cvReducer';
import { Søkekontekst } from '../søkekontekst';
import KandidatsideFraSøkInner from './KandidatsideFraSøkInner';

type Props = {
    kandidatnr: string;
    kontekst: Søkekontekst;
};

const KandidatsideFraSøk: FunctionComponent<Props> = ({ kandidatnr, kontekst, children }) => {
    const dispatch: Dispatch<KandidatlisteAction | KandidatsøkAction | CvAction> = useDispatch();

    // TODO: Vi henter kandidatliste fra state, men har aldri satt den nye fra URL-en i state
    const { kandidatliste } = useSelector((state: AppState) => state.kandidatliste);

    console.log('Kandidatliste fra useSelector', kandidatliste);

    const scrollTilToppen = () => {
        window.scrollTo(0, 0);
    };

    const onNavigeringTilKandidat = () => {
        const hentKandidatensCv = () => {
            dispatch({ type: CvActionType.FetchCv, arenaKandidatnr: kandidatnr });
        };

        scrollTilToppen();
        hentKandidatensCv();
        sendEvent('cv', 'visning');
    };

    const onFørsteSidelast = () => {
        console.log('Kaller onFørsteSideLast');
        const hentKandidatlisteMedKandidatlisteId = (kandidatlisteId: string) => {
            console.log('Henter kandidatliste med kandidatlisteId: ', kandidatlisteId);
            dispatch({
                type: KandidatlisteActionType.HentKandidatlisteMedKandidatlisteId,
                kandidatlisteId,
            });
        };

        if (kandidatliste.kind === Nettstatus.IkkeLastet) {
            if (kontekst.kontekst === 'finnKandidaterTilKandidatlisteFraNyttKandidatsøk') {
                hentKandidatlisteMedKandidatlisteId(kontekst.kandidatlisteId);
            }
        }
    };

    useEffect(onNavigeringTilKandidat, [dispatch, kandidatnr]);
    useEffect(onFørsteSidelast, [dispatch, kandidatliste.kind, kontekst]);

    return (
        <KandidatsideFraSøkInner
            kandidatnr={kandidatnr}
            kandidatliste={kandidatliste}
            kontekst={kontekst}
        >
            {children}
        </KandidatsideFraSøkInner>
    );
};

export default KandidatsideFraSøk;
