import React, { useEffect } from 'react';
import { FunctionComponent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from 'redux';
import { sendEvent } from '../../amplitude/amplitude';
import { Nettstatus } from '../../api/Nettressurs';
import AppState from '../../AppState';
import KandidatlisteAction from '../../kandidatliste/reducer/KandidatlisteAction';
import KandidatlisteActionType from '../../kandidatliste/reducer/KandidatlisteActionType';
import { KandidatsøkAction, KandidatsøkActionType } from '../../kandidatsøk/reducer/searchActions';
import { CvAction, CvActionType } from '../cv/reducer/cvReducer';
import KandidatsideFraSøkInner from './KandidatsideFraSøkInner';

type Props = {
    kandidatnr: string;
    stillingsId?: string;
    kandidatlisteId?: string;
    fraKandidatmatch: boolean;
};

const KandidatsideFraSøk: FunctionComponent<Props> = ({
    kandidatnr,
    stillingsId,
    kandidatlisteId,
    fraKandidatmatch,
    children,
}) => {
    const dispatch: Dispatch<KandidatlisteAction | KandidatsøkAction | CvAction> = useDispatch();

    const { kandidatliste } = useSelector((state: AppState) => state.kandidatliste);
    const kommerFraKandidatliste = kandidatlisteId !== undefined || stillingsId !== undefined;
    const kandidatlisteKontekst = kommerFraKandidatliste
        ? {
              stillingsId,
              kandidatlisteId,
              kandidatliste,
          }
        : undefined;

    const scrollTilToppen = () => {
        window.scrollTo(0, 0);
    };

    const onNavigeringTilKandidat = () => {
        const markerKandidatISøket = () => {
            dispatch({ type: KandidatsøkActionType.SettKandidatnummer, kandidatnr });
        };

        const hentKandidatensCv = () => {
            dispatch({ type: CvActionType.FetchCv, arenaKandidatnr: kandidatnr });
        };

        scrollTilToppen();
        markerKandidatISøket();
        hentKandidatensCv();
        sendEvent('cv', 'visning');
    };

    const onFørsteSidelast = () => {
        const hentKandidatlisteMedKandidatlisteId = (kandidatlisteId: string) => {
            dispatch({
                type: KandidatlisteActionType.HentKandidatlisteMedKandidatlisteId,
                kandidatlisteId,
            });
        };

        const hentKandidatlisteMedStillingsId = (stillingsId: string) => {
            dispatch({
                type: KandidatlisteActionType.HentKandidatlisteMedStillingsId,
                stillingsId,
            });
        };

        if (kommerFraKandidatliste && kandidatliste.kind === Nettstatus.IkkeLastet) {
            if (kandidatlisteId) {
                hentKandidatlisteMedKandidatlisteId(kandidatlisteId);
            } else if (stillingsId) {
                hentKandidatlisteMedStillingsId(stillingsId);
            }
        }
    };

    useEffect(onNavigeringTilKandidat, [dispatch, kandidatnr]);
    useEffect(onFørsteSidelast, [
        dispatch,
        kandidatliste,
        stillingsId,
        kandidatlisteId,
        kommerFraKandidatliste,
    ]);

    return (
        <KandidatsideFraSøkInner
            kandidatnr={kandidatnr}
            kandidatlisteKontekst={kandidatlisteKontekst}
            fraKandidatmatch={fraKandidatmatch}
        >
            {children}
        </KandidatsideFraSøkInner>
    );
};

export default KandidatsideFraSøk;
