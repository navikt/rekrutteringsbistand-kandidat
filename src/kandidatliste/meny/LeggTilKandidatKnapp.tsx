import React, { FunctionComponent } from 'react';
import { Flatknapp } from 'nav-frontend-knapper';

type Props = {
    onLeggTilKandidat: () => void;
};

const LeggTilKandidatKnapp: FunctionComponent<Props> = ({ onLeggTilKandidat }) => (
    <Flatknapp mini onClick={onLeggTilKandidat} className="LeggTilKandidat">
        <i className="LeggTilKandidat__icon" />
        <span>Legg til kandidat</span>
    </Flatknapp>
);

export default LeggTilKandidatKnapp;
