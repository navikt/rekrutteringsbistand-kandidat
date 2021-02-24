import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { RemoteData, Nettstatus } from '../../api/remoteData';
import { Kandidatliste } from '../kandidatlistetyper';
import AppState from '../../AppState';

const useScrollTilToppen = (kandidatliste: RemoteData<Kandidatliste>) => {
    const sistValgteKandidat = useSelector(
        (state: AppState) => state.kandidatliste.sistValgteKandidat
    );
    const kandidatlisteId =
        kandidatliste.kind === Nettstatus.Suksess ? kandidatliste.data.kandidatlisteId : undefined;

    useEffect(() => {
        if (kandidatliste.kind === Nettstatus.Suksess) {
            const ingenKandidatHarBlittValgt =
                !sistValgteKandidat || sistValgteKandidat.kandidatlisteId !== kandidatlisteId;

            if (ingenKandidatHarBlittValgt) {
                window.scrollTo(0, 0);
            }
        }
    }, [kandidatliste.kind, kandidatlisteId, sistValgteKandidat]);
};

export default useScrollTilToppen;
