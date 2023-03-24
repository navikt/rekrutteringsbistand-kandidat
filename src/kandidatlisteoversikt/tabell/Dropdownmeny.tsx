import React, { FunctionComponent } from 'react';
import { Tooltip } from '@navikt/ds-react';
import { Dropdown } from '@navikt/ds-react-internal';
import { KandidatlisteSammendrag } from '../../kandidatliste/domene/Kandidatliste';
import { KanSletteEnum } from '../Kandidatlisteoversikt';
import css from './Kandidatlistetabell.module.css';

type Props = {
    kandidatliste: KandidatlisteSammendrag;
    onMarkerSomMinClick: () => void;
    onSlettClick: () => void;
};

const Dropdownmeny: FunctionComponent<Props> = ({
    kandidatliste,
    onMarkerSomMinClick,
    onSlettClick,
}) => {
    const kanMarkereSomMin = !kandidatliste.kanEditere;
    const kanSlette = kandidatliste.kanSlette === KanSletteEnum.KAN_SLETTES;

    return (
        <Dropdown.Menu.GroupedList>
            {kanMarkereSomMin ? (
                <Dropdown.Menu.GroupedList.Item onClick={onMarkerSomMinClick}>
                    Marker som min
                </Dropdown.Menu.GroupedList.Item>
            ) : (
                <Tooltip content="Du eier allerede kandidatlisten">
                    <Dropdown.Menu.GroupedList.Item className={css.disabledValg}>
                        Marker som min
                    </Dropdown.Menu.GroupedList.Item>
                </Tooltip>
            )}

            {kanSlette ? (
                <Dropdown.Menu.GroupedList.Item onClick={onSlettClick}>
                    Slett
                </Dropdown.Menu.GroupedList.Item>
            ) : (
                <Tooltip content={byggÅrsakTilAtListenIkkeKanSlettes(kandidatliste)}>
                    <Dropdown.Menu.GroupedList.Item className={css.disabledValg}>
                        Slett
                    </Dropdown.Menu.GroupedList.Item>
                </Tooltip>
            )}
        </Dropdown.Menu.GroupedList>
    );
};

const byggÅrsakTilAtListenIkkeKanSlettes = (kandidatliste: KandidatlisteSammendrag) => {
    switch (kandidatliste.kanSlette) {
        case KanSletteEnum.HAR_STILLING:
            return 'Denne kandidatlisten er knyttet til en stilling og kan ikke slettes.';
        case KanSletteEnum.ER_IKKE_DIN:
            return `Denne kandidatlisten tilhører ${kandidatliste.opprettetAv.navn}. Du kan bare slette dine egne lister.`;
        case KanSletteEnum.ER_IKKE_DIN_OG_HAR_STILLING:
            return `Du kan ikke slette kandidatlisten fordi den tilhører ${kandidatliste.opprettetAv.navn} og er knyttet til en stilling.`;
        default:
            return '';
    }
};

export default Dropdownmeny;
