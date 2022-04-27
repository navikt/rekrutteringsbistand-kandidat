import React, { FunctionComponent, useEffect, useState } from 'react';
import { Feilmelding, Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { Nettressurs, Nettstatus } from '../api/Nettressurs';
import VisForeslåttKandidat, { ForeslåttKandidat } from './VisForeslåttKandidat';
import { hentKandidater, hentStilling } from './kandidatmatchApi';
import './Kandidatmatch.less';

type Props = {
    stillingsId: string;
};

const Kandidatmatch: FunctionComponent<Props> = ({ stillingsId }) => {
    const [kandidater, setKandidater] = useState<Nettressurs<ForeslåttKandidat[]>>({
        kind: Nettstatus.IkkeLastet,
    });

    useEffect(() => {
        const hentAutomatiskeMatcher = async () => {
            setKandidater({
                kind: Nettstatus.LasterInn,
            });

            try {
                const stilling = await hentStilling(stillingsId);
                const kandidater = await hentKandidater(stilling);

                setKandidater({
                    kind: Nettstatus.Suksess,
                    data: kandidater,
                });
            } catch (error) {
                setKandidater({
                    kind: Nettstatus.Feil,
                    error,
                });
            }
        };

        hentAutomatiskeMatcher();
    }, [stillingsId]);

    return (
        <div className="kandidatmatch">
            <Undertittel>Foreslåtte kandidater</Undertittel>
            <Normaltekst>
                Kandidatene som er foreslått av NAV er de som har høyest sannsynlighet for å bli
                stillingen.
            </Normaltekst>
            <section aria-live="polite" aria-busy={kandidater.kind === Nettstatus.LasterInn}>
                {kandidater.kind === Nettstatus.LasterInn && (
                    <p>Leter etter passende kandidater for stillingen ...</p>
                )}
                {kandidater.kind === Nettstatus.Feil && (
                    <Feilmelding>{kandidater.error.message}</Feilmelding>
                )}
                {kandidater.kind === Nettstatus.Suksess && (
                    <ul className="kandidatmatch__liste">
                        {kandidater.data.map((kandidat) => (
                            <VisForeslåttKandidat
                                key={kandidat.arenaKandidatnr}
                                kandidat={kandidat}
                                stillingsId={stillingsId}
                            />
                        ))}
                    </ul>
                )}
            </section>
        </div>
    );
};

export default Kandidatmatch;
