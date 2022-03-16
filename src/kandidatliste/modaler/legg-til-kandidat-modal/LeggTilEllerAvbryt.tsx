import React, { FunctionComponent } from 'react';
import { Flatknapp, Hovedknapp } from 'nav-frontend-knapper';

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
    <div>
        <Hovedknapp onClick={onLeggTilClick} spinner={leggTilSpinner} disabled={leggTilDisabled}>
            Legg til
        </Hovedknapp>
        <Flatknapp
            className="LeggTilKandidatModal__avbryt-knapp"
            onClick={onAvbrytClick}
            disabled={avbrytDisabled}
        >
            Avbryt
        </Flatknapp>
    </div>
);

export default LeggTilEllerAvbryt;
