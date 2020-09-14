import React, { FunctionComponent } from 'react';
import { Kandidatliste } from '../../kandidatliste/kandidatlistetyper';
import SlettKandidatlisteMenyValg from './SlettKandidatlisteMenyValg';

type Props = {
    kandidatliste: Kandidatliste;
    markerSomMinModal: (kandidatliste: Kandidatliste) => void;
    slettKandidatliste: () => void;
};

export const KandidatlisterMenyDropdown: FunctionComponent<Props> = ({
    kandidatliste,
    markerSomMinModal,
    slettKandidatliste,
}) => {
    const onMarkerClick = () => {
        markerSomMinModal(kandidatliste);
    };

    return (
        <div className="kandidatlister-meny">
            {kandidatliste.kanEditere ? (
                <button
                    disabled
                    title="Du eier allerede kandidatlisten"
                    className="kandidatlister-meny__valg"
                >
                    Marker som min
                </button>
            ) : (
                <button className="kandidatlister-meny__valg" onClick={onMarkerClick}>
                    Marker som min
                </button>
            )}
            <SlettKandidatlisteMenyValg
                kandidatliste={kandidatliste}
                slettKandidatliste={slettKandidatliste}
            />
        </div>
    );
};

export default KandidatlisterMenyDropdown;
