import React, { FunctionComponent } from 'react';
import { KandidatlisteView } from '../../kandidatliste/kandidatlistetyper';
import { KanSletteEnum } from '../Kandidatlisteoversikt';

type Props = {
    kandidatliste: KandidatlisteView;
};

const ÅrsakTilAtListenIkkeKanSlettes: FunctionComponent<Props> = ({ kandidatliste }) => {
    switch (kandidatliste.kanSlette) {
        case KanSletteEnum.HAR_STILLING:
            return (
                <span>Denne kandidatlisten er knyttet til en stilling og kan ikke slettes.</span>
            );
        case KanSletteEnum.ER_IKKE_DIN:
            return (
                <span>
                    Denne kandidatlisten tilhører {kandidatliste.opprettetAv.navn}. Du kan bare
                    slette dine egne lister.
                </span>
            );
        case KanSletteEnum.ER_IKKE_DIN_OG_HAR_STILLING:
            return (
                <span>
                    Du kan ikke slette kandidatlisten fordi den tilhører{' '}
                    {kandidatliste.opprettetAv.navn} og er knyttet til en stilling.
                </span>
            );
        default:
            return null;
    }
};

export default ÅrsakTilAtListenIkkeKanSlettes;
