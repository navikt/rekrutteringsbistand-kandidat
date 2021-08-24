import { Dispatch } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Nettressurs, Nettstatus } from '../../api/Nettressurs';
import AppState from '../../AppState';
import { Kandidat } from '../domene/Kandidat';
import { Kandidatforespørsler } from '../domene/Kandidatressurser';
import { sorteringsalgoritmer } from '../kandidatsortering';
import { ForespørselOmDelingAvCv } from '../knappe-rad/forespørsel-om-deling-av-cv/Forespørsel';
import KandidatlisteAction from '../reducer/KandidatlisteAction';
import KandidatlisteActionType from '../reducer/KandidatlisteActionType';
import { Kandidatsortering } from '../reducer/kandidatlisteReducer';

type Returverdi = {
    sorterteKandidater: Kandidat[];
    sortering: Kandidatsortering;
    setSortering: (sortering: Kandidatsortering) => void;
};

export type KandidatMedForespørsel = {
    kandidat: Kandidat;
    forespørselOmDelingAvCv?: ForespørselOmDelingAvCv;
};

const useSorterteKandidater = (
    kandidater: Kandidat[],
    forespørslerOmDelingAvCv: Nettressurs<Kandidatforespørsler>
): Returverdi => {
    const dispatch: Dispatch<KandidatlisteAction> = useDispatch();
    const { sortering } = useSelector((state: AppState) => state.kandidatliste);

    const setSortering = (sortering: Kandidatsortering) => {
        dispatch({
            type: KandidatlisteActionType.EndreSortering,
            sortering,
        });
    };

    let sorterteKandidater = kandidater;
    if (sortering !== null && sortering.retning !== null) {
        const kandidaterMedForespørsler: KandidatMedForespørsel[] = kandidater.map((kandidat) => ({
            kandidat,
            forespørselOmDelingAvCv:
                forespørslerOmDelingAvCv.kind === Nettstatus.Suksess
                    ? forespørslerOmDelingAvCv.data[kandidat.aktørid!]
                    : undefined,
        }));

        sorterteKandidater = kandidaterMedForespørsler
            .sort(sorteringsalgoritmer[sortering.felt][sortering.retning])
            .map((k) => k.kandidat);
    }

    return {
        sorterteKandidater,
        sortering,
        setSortering,
    };
};

export default useSorterteKandidater;
