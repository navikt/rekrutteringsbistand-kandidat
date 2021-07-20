import React from 'react';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { FunctionComponent, Dispatch, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Nettstatus } from '../api/Nettressurs';
import AppState from '../AppState';
import KandidatlisteAction from '../kandidatliste/reducer/KandidatlisteAction';
import KandidatlisteActionType from '../kandidatliste/reducer/KandidatlisteActionType';
import { CvAction, CvActionType } from './cv/reducer/cvReducer';
import VisKandidatFraLister from './VisKandidatFraLister';

type Props = {
    kandidatnr: string;
    kandidatlisteId: string;
};

const VisKandidatMedKandidatliste: FunctionComponent<Props> = ({
    kandidatnr,
    kandidatlisteId,
    children,
}) => {
    const dispatch: Dispatch<KandidatlisteAction | CvAction> = useDispatch();
    const { kandidatliste } = useSelector((state: AppState) => state.kandidatliste);

    useEffect(() => {
        window.scrollTo(0, 0);

        const hentCvForKandidat = (arenaKandidatnr: string) => {
            dispatch({ type: CvActionType.FetchCv, arenaKandidatnr });
        };

        const settValgtKandidat = (kandidatlisteId: string, kandidatnr: string) => {
            dispatch({
                type: KandidatlisteActionType.VelgKandidat,
                kandidatlisteId,
                kandidatnr,
            });
        };

        hentCvForKandidat(kandidatnr);
        settValgtKandidat(kandidatlisteId, kandidatnr);
    }, [kandidatnr, kandidatlisteId, dispatch]);

    useEffect(() => {
        const hentKandidatliste = (kandidatlisteId: string) => {
            dispatch({
                type: KandidatlisteActionType.HentKandidatlisteMedKandidatlisteId,
                kandidatlisteId,
            });
        };

        hentKandidatliste(kandidatlisteId);
    }, [kandidatlisteId, dispatch]);

    if (
        kandidatliste.kind === Nettstatus.IkkeLastet ||
        kandidatliste.kind === Nettstatus.LasterInn
    ) {
        return (
            <div className="text-center">
                <NavFrontendSpinner type="L" />
            </div>
        );
    }

    if (kandidatliste.kind === Nettstatus.Suksess) {
        const kandidat = kandidatliste.data.kandidater.find(
            (kandidat) => kandidat.kandidatnr === kandidatnr
        );

        if (kandidat === undefined) {
            throw Error('Fant ikke kandidaten i kandidatlisten.');
        }

        return (
            <VisKandidatFraLister kandidat={kandidat} kandidatliste={kandidatliste.data}>
                {children}
            </VisKandidatFraLister>
        );
    }

    return null;
};

export default VisKandidatMedKandidatliste;
