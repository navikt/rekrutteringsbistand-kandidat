import { RemoteData, Nettstatus, Nettressurs } from '../../api/remoteData';
import {
    Kandidatliste,
    Kandidattilstander,
    KandidatIKandidatliste,
    Kandidatnotater,
    Sms,
} from '../kandidatlistetyper';
import { useEffect, useState } from 'react';
import { ForespørselOmDelingAvCv } from '../knappe-rad/forespørsel-om-deling-av-cv/Forespørsel';

const hentMeldingForKandidat = (
    kandidatmeldinger: RemoteData<Sms[]>,
    fnr: string
): Sms | undefined => {
    return kandidatmeldinger.kind === Nettstatus.Suksess
        ? kandidatmeldinger.data.find((melding) => melding.fnr === fnr)
        : undefined;
};

const hentForespørselOmDelingAvCvForKandidat = (
    forespørslerOmDelingAvCv: Nettressurs<ForespørselOmDelingAvCv[]>,
    aktørId: string
): ForespørselOmDelingAvCv | undefined => {
    return forespørslerOmDelingAvCv.kind === Nettstatus.Suksess
        ? forespørslerOmDelingAvCv.data.find((forespørsel) => forespørsel.aktørId === aktørId)
        : undefined;
};

const useKandidaterMedState = (
    kandidatliste: RemoteData<Kandidatliste>,
    kandidattilstander: Kandidattilstander,
    kandidatmeldinger: RemoteData<Sms[]>,
    kandidatnotater: Kandidatnotater,
    forespørslerOmDelingAvCv: Nettressurs<ForespørselOmDelingAvCv[]>
) => {
    const [kandidaterMedState, setKandidaterMedState] = useState<
        KandidatIKandidatliste[] | undefined
    >(undefined);

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
                        sms: kandidat.fodselsnr
                            ? hentMeldingForKandidat(kandidatmeldinger, kandidat.fodselsnr)
                            : undefined,
                        forespørselOmDelingAvCv: kandidat.aktørid
                            ? hentForespørselOmDelingAvCvForKandidat(
                                  forespørslerOmDelingAvCv,
                                  kandidat.aktørid
                              )
                            : undefined,
                    })
                );

                setKandidaterMedState(kandidaterMedState);
            }
        }
    }, [
        kandidatliste,
        kandidattilstander,
        kandidatnotater,
        kandidatmeldinger,
        forespørslerOmDelingAvCv,
    ]);

    return kandidaterMedState;
};

export default useKandidaterMedState;
