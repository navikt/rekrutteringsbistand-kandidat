import { RemoteData, Nettstatus } from '../../../felles/common/remoteData';
import {
    Kandidatliste,
    Kandidattilstander,
    KandidatIKandidatliste,
    Kandidatnotater,
    Sms,
} from '../kandidatlistetyper';
import { useEffect, useState } from 'react';

const hentMeldingForKandidat = (
    kandidatmeldinger: RemoteData<Sms[]>,
    fnr: string
): Sms | undefined =>
    kandidatmeldinger.kind === Nettstatus.Suksess
        ? kandidatmeldinger.data.find((melding) => melding.fnr === fnr)
        : undefined;

const useKandidaterMedState = (
    kandidatliste: RemoteData<Kandidatliste>,
    kandidattilstander: Kandidattilstander,
    kandidatmeldinger: RemoteData<Sms[]>,
    kandidatnotater: Kandidatnotater
) => {
    const [kandidaterMedState, setKandidaterMedState] = useState<KandidatIKandidatliste[] | undefined>(undefined);

    useEffect(() => {
        if (kandidatliste.kind === Nettstatus.Suksess) {
            const tilstanderErInitialisert =
                kandidatliste.data.kandidater.length === Object.keys(kandidattilstander).length;

            if (tilstanderErInitialisert) {
                const kandidaterMedState: KandidatIKandidatliste[] = kandidatliste.data.kandidater.map(
                    (kandidat) => ({
                        ...kandidat,
                        tilstand: kandidattilstander[kandidat.kandidatnr],
                        notater: kandidatnotater[kandidat.kandidatnr],
                        sms: hentMeldingForKandidat(kandidatmeldinger, kandidat.fodselsnr),
                    })
                );

                setKandidaterMedState(kandidaterMedState);
            }
        }
    }, [kandidatliste, kandidattilstander, kandidatnotater, kandidatmeldinger]);

    return kandidaterMedState;
};

export default useKandidaterMedState;
