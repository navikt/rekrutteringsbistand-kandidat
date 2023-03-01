import React, { FunctionComponent, useEffect } from 'react';
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
    const { kandidatliste } = useSelector((state: AppState) => state.kandidatliste);

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

    const lastInnKandidatliste = (kandidatlisteId: string | null) => {
        const hentKandidatlisteMedKandidatlisteId = (kandidatlisteId: string) => {
            dispatch({
                type: KandidatlisteActionType.HentKandidatlisteMedKandidatlisteId,
                kandidatlisteId,
            });
        };

        if (kandidatlisteId) {
            if (kandidatliste.kind === Nettstatus.IkkeLastet) {
                hentKandidatlisteMedKandidatlisteId(kandidatlisteId);
            } else if (
                kandidatliste.kind === Nettstatus.Suksess &&
                kandidatliste.data.kandidatlisteId !== kandidatlisteId
            ) {
                hentKandidatlisteMedKandidatlisteId(kandidatlisteId);
            }
        }
    };

    useEffect(onNavigeringTilKandidat, [dispatch, kandidatnr]);

    const kandidatlisteIdFraKontekst =
        kontekst.kontekst === 'finnKandidaterTilKandidatlisteFraNyttKandidatsøk'
            ? kontekst.kandidatlisteId
            : null;

    /*
    const kandidatlisteId =
        kandidatliste.kind === Nettstatus.Suksess ? kandidatliste.data.kandidatlisteId : null;
    */

    /* eslint-disable-next-line react-hooks/exhaustive-deps */
    useEffect(() => lastInnKandidatliste(kandidatlisteIdFraKontekst), [kandidatlisteIdFraKontekst]);

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
