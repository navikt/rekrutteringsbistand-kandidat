import React, { FunctionComponent, MouseEvent } from 'react';
import { Kandidatliste } from '../../kandidatliste/kandidatlistetyper';
import { KanSletteEnum } from '../Kandidatlisteoversikt';
import { FeilmeldingIMeny } from './KandidatlisterRad';
import ÅrsakTilAtListenIkkeKanSlettes from './ÅrsakTilAtListenIkkeKanSlettes';

type Props = {
    kandidatliste: Kandidatliste;
    markerSomMinModal: (kandidatliste: Kandidatliste) => void;
    slettKandidatliste: () => void;
    setFeilmelding: (feilmeldingIMeny: FeilmeldingIMeny) => void;
};

export const KandidatlisterDropdown: FunctionComponent<Props> = ({
    kandidatliste,
    markerSomMinModal,
    slettKandidatliste,
    setFeilmelding,
}) => {
    const onMarkerClick = () => {
        markerSomMinModal(kandidatliste);
    };

    const onDeaktivertMarkerSomMinClick = (event: MouseEvent<HTMLElement>) => {
        setFeilmelding({
            anker: event.currentTarget,
            feilmelding: 'Du eier allerede kandidatlisten',
        });
    };

    const onDeaktivertSlettClick = (event: MouseEvent<HTMLElement>) => {
        setFeilmelding({
            anker: event.currentTarget,
            feilmelding: <ÅrsakTilAtListenIkkeKanSlettes kandidatliste={kandidatliste} />,
        });
    };

    return (
        <div className="kandidatlister-meny">
            {kandidatliste.kanEditere ? (
                <div
                    id="kandidatliste-meny-kan-ikke-markere-som-min"
                    className="kandidatlister-rad__dropdown-valg"
                    onClick={onDeaktivertMarkerSomMinClick}
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
                    onClick={onDeaktivertSlettClick}
                >
                    Slett
                </div>
            )}
        </div>
    );
};

export default KandidatlisterDropdown;
