import React, { ChangeEvent, FormEvent, FunctionComponent, useState } from 'react';
import { CheckboxGroup, Loader, Search } from '@navikt/ds-react';
import { Nettressurs, Nettstatus } from '../../../api/Nettressurs';
import { Kandidatliste } from '../../../kandidatliste/domene/Kandidatliste';
import { fetchKandidatlisteMedAnnonsenummer } from '../../../api/api';
import VelgbarKandidatliste from './VelgbarKandidatliste';
import css from './SøkPåKandidatliste.module.css';

type Props = {
    markerteLister: Set<string>;
    lagredeLister: Set<string>;
    onKandidatlisteMarkert: (event: ChangeEvent<HTMLInputElement>) => void;
};

const SøkPåKandidatliste: FunctionComponent<Props> = ({
    markerteLister,
    lagredeLister,
    onKandidatlisteMarkert,
}) => {
    const [annonsenummer, setAnnonsenummer] = useState<string>('');
    const [søkeresultat, setSøkeresultat] = useState<Nettressurs<Kandidatliste>>({
        kind: Nettstatus.IkkeLastet,
    });

    const søkPåAnnonsenummer = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setSøkeresultat({
            kind: Nettstatus.LasterInn,
        });

        try {
            const kandidatliste = await fetchKandidatlisteMedAnnonsenummer(annonsenummer);

            setSøkeresultat({
                kind: Nettstatus.Suksess,
                data: kandidatliste,
            });
        } catch (e) {
            setSøkeresultat({
                kind: Nettstatus.Feil,
                error: e,
            });
        }
    };

    return (
        <div className={css.søkPåKandidatliste}>
            <form role="search" onSubmit={søkPåAnnonsenummer}>
                <Search
                    clearButton
                    size="small"
                    label="Søk på annonsenummer"
                    description="Hvis du ikke finner kandidatlisten du leter etter"
                    variant="secondary"
                    hideLabel={false}
                    value={annonsenummer}
                    onChange={setAnnonsenummer}
                />
            </form>
            {søkeresultat.kind === Nettstatus.LasterInn && <Loader />}
            {søkeresultat.kind === Nettstatus.Suksess && (
                <CheckboxGroup
                    hideLegend
                    legend="Velg kandidatlister"
                    value={Array.from(markerteLister)}
                >
                    <VelgbarKandidatliste
                        kandidatliste={søkeresultat.data}
                        onKandidatlisteMarkert={onKandidatlisteMarkert}
                        lagredeLister={lagredeLister}
                    />
                </CheckboxGroup>
            )}
        </div>
    );
};

export default SøkPåKandidatliste;
