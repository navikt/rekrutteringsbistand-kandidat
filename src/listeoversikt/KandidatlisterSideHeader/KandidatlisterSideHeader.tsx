import React, { FunctionComponent } from 'react';
import { Button, Search } from '@navikt/ds-react';
import css from './KandidatlisterSideHeader.module.css';

interface Props {
    søkeOrd?: string;
    onSøkeOrdChange: (event: string) => void;
    onSubmitSøkKandidatlister?: any;
    nullstillSøk: () => void;
    opprettListe: () => void;
}

export const KandidatlisterSideHeader: FunctionComponent<Props> = ({
    søkeOrd,
    onSøkeOrdChange,
    onSubmitSøkKandidatlister,
    nullstillSøk,
    opprettListe,
}) => (
    <div className={css.header}>
        <div className={css.innhold}>
            <form className={css.søkeskjema} onSubmit={onSubmitSøkKandidatlister}>
                <Search
                    label="Søk på kandidatlister med navn"
                    placeholder="Skriv inn navn på kandidatliste"
                    onChange={onSøkeOrdChange}
                    value={søkeOrd}
                    onClear={nullstillSøk}
                />
            </form>
            <Button className={css.opprettNyKnapp} onClick={opprettListe}>
                Opprett ny
            </Button>
        </div>
    </div>
);
