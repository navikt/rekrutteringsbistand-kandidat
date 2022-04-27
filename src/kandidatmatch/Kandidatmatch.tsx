import React, { FunctionComponent, useEffect, useState } from 'react';
import Panel from 'nav-frontend-paneler';
import { Feilmelding, Undertittel } from 'nav-frontend-typografi';
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
        <Panel border className="kandidatmatch">
            <Undertittel>Foreslåtte kandidater</Undertittel>
            <section aria-live="polite" aria-busy={kandidater.kind === Nettstatus.LasterInn}>
                {kandidater.kind === Nettstatus.LasterInn && (
                    <p>Leter etter passende kandidater for stillingen ...</p>
                )}
                {kandidater.kind === Nettstatus.Feil && (
                    <Feilmelding>{kandidater.error.message}</Feilmelding>
                )}
                {kandidater.kind === Nettstatus.Suksess && (
                    <ul>
                        {kandidater.data.map((kandidat) => (
                            <li key={kandidat.arenaKandidatnr}>
                                <VisForeslåttKandidat
                                    kandidat={kandidat}
                                    stillingsId={stillingsId}
                                />
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </Panel>
    );
};

export default Kandidatmatch;
