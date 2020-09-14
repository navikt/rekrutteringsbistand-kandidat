import React, { FunctionComponent } from 'react';
import { Kandidatliste } from '../../kandidatliste/kandidatlistetyper';
import { KanSletteEnum } from '../Kandidatlisteoversikt';

type Props = {
    kandidatliste: Kandidatliste;
    slettKandidatliste: () => void;
};

const SlettKandidatlisteMenyValg: FunctionComponent<Props> = ({
    kandidatliste,
    slettKandidatliste,
}) => {
    if (kandidatliste.kanSlette === KanSletteEnum.KAN_SLETTES) {
        return (
            <button className="kandidatlister-meny__valg" onClick={slettKandidatliste}>
                Slett
            </button>
        );
    } else {
        let årsak = '';
        if (kandidatliste.kanSlette === KanSletteEnum.HAR_STILLING) {
            årsak = 'Denne kandidatlisten er knyttet til en stilling og kan ikke slettes.';
        } else if (kandidatliste.kanSlette === KanSletteEnum.ER_IKKE_DIN) {
            årsak = `Denne kandidatlisten tilhører: ${kandidatliste.opprettetAv.navn}. Du kan bare slette dine egne lister.`;
        } else if (kandidatliste.kanSlette === KanSletteEnum.ER_IKKE_DIN_OG_HAR_STILLING) {
            årsak =
                'Du kan ikke slette kandidatlisten fordi den enten tilhører en annen kandidat, eller er knyttet til en stilling.';
        }

        return (
            <button className="kandidatlister-meny__valg" title={årsak} disabled>
                Slett
            </button>
        );
    }
};

export default SlettKandidatlisteMenyValg;
