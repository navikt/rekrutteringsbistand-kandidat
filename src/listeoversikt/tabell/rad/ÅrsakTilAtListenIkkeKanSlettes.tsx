import React, { FunctionComponent } from 'react';
import { KandidatlisteSammendrag } from '../../../kandidatliste/domene/Kandidatliste';
import { KanSletteEnum } from '../../Kandidatlisteoversikt';

type Props = {
    kandidatlisteSammendrag: KandidatlisteSammendrag;
};

const ÅrsakTilAtListenIkkeKanSlettes: FunctionComponent<Props> = ({ kandidatlisteSammendrag }) => {
    switch (kandidatlisteSammendrag.kanSlette) {
        case KanSletteEnum.HAR_STILLING:
            return (
                <span>Denne kandidatlisten er knyttet til en stilling og kan ikke slettes.</span>
            );
        case KanSletteEnum.ER_IKKE_DIN:
            return (
                <span>
                    Denne kandidatlisten tilhører {kandidatlisteSammendrag.opprettetAv.navn}. Du kan
                    bare slette dine egne lister.
                </span>
            );
        case KanSletteEnum.ER_IKKE_DIN_OG_HAR_STILLING:
            return (
                <span>
                    Du kan ikke slette kandidatlisten fordi den tilhører{' '}
                    {kandidatlisteSammendrag.opprettetAv.navn} og er knyttet til en stilling.
                </span>
            );
        default:
            return null;
    }
};

export default ÅrsakTilAtListenIkkeKanSlettes;
