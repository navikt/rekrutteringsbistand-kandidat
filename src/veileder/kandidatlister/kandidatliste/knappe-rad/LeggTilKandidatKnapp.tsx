import React, { FunctionComponent } from 'react';
import Lenkeknapp from '../../../../felles/common/Lenkeknapp';

type Props = {
    onLeggTilKandidat: () => void;
};

const LeggTilKandidatKnapp: FunctionComponent<Props> = ({ onLeggTilKandidat }) => (
    <Lenkeknapp
        tittel="Legg til kandidat"
        onClick={onLeggTilKandidat}
        className="legg-til-kandidat LeggTilKandidat lenke"
    >
        <i className="LeggTilKandidat__icon" />
        Legg til kandidat
    </Lenkeknapp>
);

export default LeggTilKandidatKnapp;
