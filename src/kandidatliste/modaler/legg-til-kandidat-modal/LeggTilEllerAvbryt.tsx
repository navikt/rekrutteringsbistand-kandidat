import React, { FunctionComponent } from 'react';
import { Flatknapp, Hovedknapp } from 'nav-frontend-knapper';
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
        <Hovedknapp onClick={onLeggTilClick} spinner={leggTilSpinner} disabled={leggTilDisabled}>
            Legg til
        </Hovedknapp>
        <Flatknapp onClick={onAvbrytClick} disabled={avbrytDisabled}>
            Avbryt
        </Flatknapp>
    </div>
);

export default LeggTilEllerAvbryt;
