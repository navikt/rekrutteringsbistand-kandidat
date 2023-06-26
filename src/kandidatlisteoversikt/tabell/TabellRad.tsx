import { FunctionComponent, ReactNode } from 'react';
import { BodyShort, Button, Table } from '@navikt/ds-react';
import { Dropdown } from '@navikt/ds-react-internal';
import { Link } from 'react-router-dom';
import { PersonPlusIcon, MenuElipsisHorizontalCircleIcon } from '@navikt/aksel-icons';

import { formaterDato } from '../../utils/dateUtils';
import { KandidatlisteSammendrag } from '../../kandidatliste/domene/Kandidatliste';
import { lenkeTilFinnKandidater, lenkeTilKandidatliste } from '../../app/paths';
import Dropdownmeny from './Dropdownmeny';
import Redigerknapp from './Redigerknapp';
import css from './Kandidatlistetabell.module.css';

export type FeilmeldingIMeny = {
    anker?: HTMLElement;
    feilmelding?: ReactNode;
};

type Props = {
    kandidatlisteSammendrag: KandidatlisteSammendrag;
    onRedigerClick: () => void;
    onMarkerSomMinClick: () => void;
    onSlettClick: () => void;
};

const TabellRad: FunctionComponent<Props> = ({
    kandidatlisteSammendrag,
    onRedigerClick,
    onMarkerSomMinClick,
    onSlettClick,
}) => {
    return (
        <Table.Row shadeOnHover={false} className={css.rad}>
            <Table.DataCell>
                <BodyShort>{`${formaterDato(
                    kandidatlisteSammendrag.opprettetTidspunkt,
                    'numeric'
                )}`}</BodyShort>
            </Table.DataCell>
            <Table.DataCell>
                <Link
                    to={lenkeTilKandidatliste(kandidatlisteSammendrag.kandidatlisteId)}
                    className="navds-link"
                >
                    {kandidatlisteSammendrag.tittel}
                </Link>
            </Table.DataCell>
            <Table.DataCell align="right" className={css.antallKandidater}>
                <BodyShort>{kandidatlisteSammendrag.antallKandidater}</BodyShort>
            </Table.DataCell>
            <Table.DataCell>
                <BodyShort>{`${kandidatlisteSammendrag.opprettetAv.navn} (${kandidatlisteSammendrag.opprettetAv.ident})`}</BodyShort>
            </Table.DataCell>
            <Table.DataCell align="center">
                <Link
                    aria-label={`Finn kandidater til listen «${kandidatlisteSammendrag.tittel}»`}
                    to={lenkeTilFinnKandidater(
                        kandidatlisteSammendrag.stillingId,
                        kandidatlisteSammendrag.kandidatlisteId,
                        true
                    )}
                >
                    <Button variant="tertiary" as="div" icon={<PersonPlusIcon />} />
                </Link>
            </Table.DataCell>
            <Table.DataCell align="center">
                <Redigerknapp kandidatliste={kandidatlisteSammendrag} onClick={onRedigerClick} />
            </Table.DataCell>
            <Table.DataCell align="center">
                <Dropdown closeOnSelect={false}>
                    <Button
                        as={Dropdown.Toggle}
                        variant="tertiary"
                        icon={<MenuElipsisHorizontalCircleIcon />}
                        aria-label={`Meny for kandidatlisten ${kandidatlisteSammendrag.tittel}`}
                    />
                    <Dropdown.Menu>
                        <Dropdownmeny
                            kandidatliste={kandidatlisteSammendrag}
                            onMarkerSomMinClick={onMarkerSomMinClick}
                            onSlettClick={onSlettClick}
                        />
                    </Dropdown.Menu>
                </Dropdown>
            </Table.DataCell>
        </Table.Row>
    );
};

export default TabellRad;
