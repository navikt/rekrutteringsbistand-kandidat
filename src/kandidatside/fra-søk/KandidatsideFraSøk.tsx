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
    kontekst: Søkekontekst;
};

export type Søkekontekst =
    | {
          kontekst: 'fraAutomatiskMatching';
          stillingsId: string;
      }
    | {
          kontekst: 'fraKandidatsøk';
          søk?: string;
      }
    | {
          kontekst: 'finnKandidaterTilKandidatlisteMedStilling';
          stillingsId: string;
          søk?: string;
      }
    | {
          kontekst: 'finnKandidaterTilKandidatlisteUtenStilling';
          kandidatlisteId: string;
          søk?: string;
      }
    | {
          kontekst: 'fraNyttKandidatsøk';
          søk?: string;
          markerteKandidater?: string[];
      }
    | {
          kontekst: 'finnKandidaterTilKandidatlisteFraNyttKandidatsøk';
          kandidatlisteId: string;
          søk?: string;
          markerteKandidater?: string[];
      };

const KandidatsideFraSøk: FunctionComponent<Props> = ({ kandidatnr, kontekst, children }) => {
    const dispatch: Dispatch<KandidatlisteAction | KandidatsøkAction | CvAction> = useDispatch();
    const { kandidatliste } = useSelector((state: AppState) => state.kandidatliste);

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
        const hentKandidatlisteMedStillingsId = (stillingsId: string) => {
            dispatch({
                type: KandidatlisteActionType.HentKandidatlisteMedStillingsId,
                stillingsId,
            });
        };

        const hentKandidatlisteMedKandidatlisteId = (kandidatlisteId: string) => {
            dispatch({
                type: KandidatlisteActionType.HentKandidatlisteMedKandidatlisteId,
                kandidatlisteId,
            });
        };

        if (kandidatliste.kind === Nettstatus.IkkeLastet) {
            if (kontekst.kontekst === 'finnKandidaterTilKandidatlisteMedStilling') {
                hentKandidatlisteMedStillingsId(kontekst.stillingsId);
            } else if (
                kontekst.kontekst === 'finnKandidaterTilKandidatlisteFraNyttKandidatsøk' ||
                kontekst.kontekst === 'finnKandidaterTilKandidatlisteUtenStilling'
            ) {
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
