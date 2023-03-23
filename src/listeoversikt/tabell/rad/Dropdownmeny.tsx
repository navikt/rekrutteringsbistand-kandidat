import React, { FunctionComponent } from 'react';
import { Tooltip } from '@navikt/ds-react';
import { Dropdown } from '@navikt/ds-react-internal';
import { KandidatlisteSammendrag } from '../../../kandidatliste/domene/Kandidatliste';
import { KanSletteEnum } from '../../Kandidatlisteoversikt';
import css from './Dropdownmeny.module.css';

type Props = {
    kandidatliste: KandidatlisteSammendrag;
    onMarkerSomMin: (kandidatliste: KandidatlisteSammendrag) => void;
    onSlett: () => void;
};

const Dropdownmeny: FunctionComponent<Props> = ({ kandidatliste, onMarkerSomMin, onSlett }) => {
    const handleMarkerSomMinClick = () => {
        onMarkerSomMin(kandidatliste);
    };

    const kanMarkereSomMin = !kandidatliste.kanEditere;
    const kanSlette = kandidatliste.kanSlette === KanSletteEnum.KAN_SLETTES;

    return (
        <Dropdown.Menu.GroupedList>
            <Dropdown.Menu.GroupedList.Heading>Handlinger</Dropdown.Menu.GroupedList.Heading>
            {kanMarkereSomMin ? (
                <Dropdown.Menu.GroupedList.Item onClick={handleMarkerSomMinClick}>
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
                <Dropdown.Menu.GroupedList.Item onClick={onSlett}>
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

    /*
    return (
        <div className={css.dropdown}>
            <Button
                size="small"
                variant="tertiary"
                onClick={onMarkerClick}
                disabled={kandidatliste.kanEditere}
            >
                Marker som min
            </Button>

            {kandidatliste.kanSlette === KanSletteEnum.KAN_SLETTES ? (
                <Button size="small" variant="tertiary" onClick={slettKandidatliste}>
                    Slett
                </Button>
            ) : (
                <Button
                    disabled
                    size="small"
                    variant="tertiary"
                    onClick={toggleDisabledSlettknappAnker}
                >
                    Slett
                </Button>
            )}
        </div>
    );
    */
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
