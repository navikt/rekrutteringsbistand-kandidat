import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Nettstatus } from '../../../api/Nettressurs';
import AppState from '../../../state/AppState';
import { Kandidat } from '../../domene/Kandidat';

const useIkkeForespurteKandidater = (markerteKandidater: Kandidat[]): Kandidat[] => {
    const [ikkeForespurteKandidater, setIkkeForespurteKandidater] = useState<Kandidat[]>([]);

    const { forespørslerOmDelingAvCv } = useSelector((state: AppState) => state.kandidatliste);

    useEffect(() => {
        if (forespørslerOmDelingAvCv.kind !== Nettstatus.Suksess) {
            setIkkeForespurteKandidater([]);
        } else {
            if (forespørslerOmDelingAvCv.kind === Nettstatus.Suksess) {
                const ikkeForespurteKandidater = Object.keys(forespørslerOmDelingAvCv.data);
                const markerte = markerteKandidater.filter(
                    (kandidat) => !ikkeForespurteKandidater.includes(kandidat.aktørid!)
                );

                setIkkeForespurteKandidater(markerte);
            }
        }
    }, [markerteKandidater, forespørslerOmDelingAvCv]);

    return ikkeForespurteKandidater;
};

export default useIkkeForespurteKandidater;
