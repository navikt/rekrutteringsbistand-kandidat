import React, { FunctionComponent } from 'react';
import { Button } from '@navikt/ds-react';
import css from './LeggTilKandidatModal.module.css';

type Props = {
    onLeggTilClick?: () => void;
    onAvbrytClick: () => void;
    leggTilSpinner?: boolean;
    leggTilDisabled?: boolean;
    avbrytDisabled?: boolean;
};

const LeggTilEllerAvbryt: FunctionComponent<Props> = ({
    onLeggTilClick,
    onAvbrytClick,
    leggTilSpinner,
    leggTilDisabled,
    avbrytDisabled,
}) => (
    <div className={css.knapper}>
        <Button onClick={onLeggTilClick} loading={leggTilSpinner} disabled={leggTilDisabled}>
            Legg til
        </Button>
        <Button variant="secondary" onClick={onAvbrytClick} disabled={avbrytDisabled}>
            Avbryt
        </Button>
    </div>
);

export default LeggTilEllerAvbryt;
