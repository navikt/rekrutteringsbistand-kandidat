import { Button } from '@navikt/ds-react';
import React, { FunctionComponent, MouseEvent } from 'react';
import { KandidatlisteSammendrag } from '../../../kandidatliste/domene/Kandidatliste';
import { KanSletteEnum } from '../../Kandidatlisteoversikt';
import css from './Dropdownmeny.module.css';

type Props = {
    kandidatliste: KandidatlisteSammendrag;
    markerSomMinModal: (kandidatliste: KandidatlisteSammendrag) => void;
    slettKandidatliste: () => void;
    toggleDisabledSlettknappAnker: (e: MouseEvent<HTMLElement>) => void;
};

const Dropdownmeny: FunctionComponent<Props> = ({
    kandidatliste,
    markerSomMinModal,
    slettKandidatliste,
    toggleDisabledSlettknappAnker,
}) => {
    const onMarkerClick = () => {
        markerSomMinModal(kandidatliste);
    };

    return (
        <div className={css.dropdown}>
            <Button variant="secondary" onClick={onMarkerClick} disabled={kandidatliste.kanEditere}>
                Marker som min
            </Button>

            {kandidatliste.kanSlette !== KanSletteEnum.KAN_SLETTES ? (
                <Button variant="secondary" onClick={slettKandidatliste}>
                    Slett
                </Button>
            ) : (
                <Button variant="secondary" disabled onClick={toggleDisabledSlettknappAnker}>
                    Slett
                </Button>
            )}
        </div>
    );
};

export default Dropdownmeny;
