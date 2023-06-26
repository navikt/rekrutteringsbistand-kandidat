import { FunctionComponent } from 'react';
import { Dropdown, Tooltip } from '@navikt/ds-react';
import {
    KandidatlisteSammendrag,
    KanSletteKandidatliste,
} from '../../kandidatliste/domene/Kandidatliste';
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
    const kanSlette = kandidatliste.kanSlette === KanSletteKandidatliste.KanSlettes;

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
        case KanSletteKandidatliste.HarStilling:
            return 'Denne kandidatlisten er knyttet til en stilling og kan ikke slettes.';
        case KanSletteKandidatliste.ErIkkeDin:
            return `Denne kandidatlisten tilhører ${kandidatliste.opprettetAv.navn}. Du kan bare slette dine egne lister.`;
        case KanSletteKandidatliste.ErIkkeDinOgHarStilling:
            return `Du kan ikke slette kandidatlisten fordi den tilhører ${kandidatliste.opprettetAv.navn} og er knyttet til en stilling.`;
        default:
            return '';
    }
};

export default Dropdownmeny;
