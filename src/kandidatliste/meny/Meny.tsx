import React, { FunctionComponent } from 'react';
import FinnKandidaterLenke from './FinnKandidaterLenke';
import LeggTilKandidatKnapp from './LeggTilKandidatKnapp';
import css from './Meny.module.css';

interface Props {
    kandidatlisteId: string;
    stillingId: string | null;
    onLeggTilKandidat: () => void;
}

const Meny: FunctionComponent<Props> = ({ kandidatlisteId, stillingId, onLeggTilKandidat }) => {
    return (
        <div className={css.meny}>
            <FinnKandidaterLenke kandidatlisteId={kandidatlisteId} stillingId={stillingId} />
            <LeggTilKandidatKnapp onLeggTilKandidat={onLeggTilKandidat} />
        </div>
    );
};

export default Meny;
