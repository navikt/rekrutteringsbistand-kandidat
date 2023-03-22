import React, { FunctionComponent } from 'react';
import { BodyLong } from '@navikt/ds-react';

import { KandidatlisteSammendrag } from '../../kandidatliste/domene/Kandidatliste';
import { Nettstatus } from '../../api/Nettressurs';
import Sidelaster from '../../common/sidelaster/Sidelaster';
import Rad from './rad/Rad';
import css from './TabellBody.module.css';

type Props = {
    fetching: Nettstatus;
    kandidatlister: KandidatlisteSammendrag[];
    endreKandidatliste: (kandidatliste: KandidatlisteSammendrag) => void;
    markerKandidatlisteSomMin: (kandidatliste: KandidatlisteSammendrag) => void;
    slettKandidatliste: (kandidatliste: KandidatlisteSammendrag) => void;
};

const TabellBody: FunctionComponent<Props> = ({
    fetching,
    kandidatlister,
    endreKandidatliste,
    markerKandidatlisteSomMin,
    slettKandidatliste,
}) => {
    if (fetching !== Nettstatus.Suksess) {
        return <Sidelaster />;
    } else if (kandidatlister.length === 0) {
        return (
            <div className={css.fantIngenKandidater}>
                <BodyLong size="medium">Fant ingen kandidatlister som matcher søket ditt.</BodyLong>
            </div>
        );
    }

    return (
        <>
            {kandidatlister.map((kandidatliste) => (
                <Rad
                    key={kandidatliste.kandidatlisteId}
                    kandidatlisteSammendrag={kandidatliste}
                    endreKandidatliste={endreKandidatliste}
                    markerKandidatlisteSomMin={markerKandidatlisteSomMin}
                    slettKandidatliste={() => {
                        slettKandidatliste(kandidatliste);
                    }}
                />
            ))}
        </>
    );
};

export default TabellBody;
