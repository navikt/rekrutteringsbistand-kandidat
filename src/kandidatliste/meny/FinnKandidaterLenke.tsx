import React, { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import { lenkeTilFinnKandidater } from '../../app/paths';
import { MagnifyingGlassIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';

type Props = {
    stillingId: string | null;
    kandidatlisteId: string;
};

const FinnKandidaterLenke: FunctionComponent<Props> = ({ stillingId, kandidatlisteId }) => (
    <Link
        to={lenkeTilFinnKandidater(stillingId, kandidatlisteId)}
        state={{
            brukKriterierFraStillingen: true,
        }}
    >
        <Button variant="tertiary" as="div" icon={<MagnifyingGlassIcon aria-hidden />}>
            Finn kandidater
        </Button>
    </Link>
);

export default FinnKandidaterLenke;
