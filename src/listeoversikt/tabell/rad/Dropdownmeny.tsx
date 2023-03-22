import React, { FunctionComponent, MouseEvent } from 'react';
import { KandidatlisteSammendrag } from '../../../kandidatliste/domene/Kandidatliste';
import { KanSletteEnum } from '../../Kandidatlisteoversikt';

type Props = {
    kandidatliste: KandidatlisteSammendrag;
    markerSomMinModal: (kandidatliste: KandidatlisteSammendrag) => void;
    slettKandidatliste: () => void;
    toggleDisabledMarkerSomMinAnker: (e: MouseEvent<HTMLElement>) => void;
    toggleDisabledSlettknappAnker: (e: MouseEvent<HTMLElement>) => void;
};

const Dropdownmeny: FunctionComponent<Props> = ({
    kandidatliste,
    markerSomMinModal,
    slettKandidatliste,
    toggleDisabledMarkerSomMinAnker,
    toggleDisabledSlettknappAnker,
}) => {
    const onMarkerClick = () => {
        markerSomMinModal(kandidatliste);
    };

    return (
        <div className="kandidatlister-meny">
            {kandidatliste.kanEditere ? (
                <div
                    id="kandidatliste-meny-kan-ikke-markere-som-min"
                    className="kandidatlister-rad__dropdown-valg"
                    onClick={toggleDisabledMarkerSomMinAnker}
                >
                    Marker som min
                </div>
            ) : (
                <button
                    className="kandidatlister-rad__dropdown-valg-meny__valg"
                    onClick={onMarkerClick}
                >
                    Marker som min
                </button>
            )}
            {kandidatliste.kanSlette === KanSletteEnum.KAN_SLETTES ? (
                <button className="kandidatlister-rad__dropdown-valg" onClick={slettKandidatliste}>
                    Slett
                </button>
            ) : (
                <div
                    className="kandidatlister-rad__dropdown-valg"
                    id="kandidatliste-meny-kan-ikke-slette"
                    onClick={toggleDisabledSlettknappAnker}
                >
                    Slett
                </div>
            )}
        </div>
    );
};

export default Dropdownmeny;
