import { PencilIcon } from '@navikt/aksel-icons';
import { Button, Tooltip } from '@navikt/ds-react';
import { Link } from 'react-router-dom';
import { lenkeTilStilling } from '../../app/paths';
import {
    erKobletTilStilling,
    KandidatlisteSammendrag,
} from '../../kandidatliste/domene/Kandidatliste';
import css from './Kandidatlistetabell.module.css';

type Props = {
    kandidatliste: KandidatlisteSammendrag;
    onClick: () => void;
};

const Redigerknapp = ({ kandidatliste, onClick }: Props) => {
    if (kandidatliste.kanEditere) {
        if (erKobletTilStilling(kandidatliste)) {
            return (
                <Link to={lenkeTilStilling(kandidatliste.stillingId!)}>
                    <Button variant="tertiary" as="div" icon={<PencilIcon />} />
                </Link>
            );
        } else {
            return (
                <Button
                    variant="tertiary"
                    aria-label={`Endre kandidatlisten «${kandidatliste.tittel}»`}
                    onClick={onClick}
                    icon={<PencilIcon />}
                />
            );
        }
    } else {
        return (
            <Tooltip content="Du kan ikke redigere en kandidatliste som ikke er din.">
                <Button variant="tertiary" className={css.disabledValg} icon={<PencilIcon />} />
            </Tooltip>
        );
    }
};

export default Redigerknapp;
