import React, { FunctionComponent, ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { formaterDato } from '../../utils/dateUtils';
import {
    erKobletTilStilling,
    KandidatlisteSammendrag,
} from '../../kandidatliste/domene/Kandidatliste';
import Dropdownmeny from './Dropdownmeny';
import { lenkeTilFinnKandidater, lenkeTilKandidatliste, lenkeTilStilling } from '../../app/paths';
import { PencilIcon, PersonPlusIcon, MenuHamburgerIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, Table, Tooltip } from '@navikt/ds-react';
import { Dropdown } from '@navikt/ds-react-internal';
import css from './Kandidatlistetabell.module.css';

export type FeilmeldingIMeny = {
    anker?: HTMLElement;
    feilmelding?: ReactNode;
};

type Props = {
    kandidatlisteSammendrag: KandidatlisteSammendrag;
    endreKandidatliste: (kandidatlisteSammendrag: KandidatlisteSammendrag) => void;
    markerKandidatlisteSomMin: (kandidatlisteSammendrag: KandidatlisteSammendrag) => void;
    slettKandidatliste: () => void;
};

const Rad: FunctionComponent<Props> = ({
    kandidatlisteSammendrag,
    endreKandidatliste,
    markerKandidatlisteSomMin,
    slettKandidatliste,
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
            <Table.DataCell>
                <BodyShort>{kandidatlisteSammendrag.antallKandidater}</BodyShort>
            </Table.DataCell>
            <Table.DataCell>
                <BodyShort>{`${kandidatlisteSammendrag.opprettetAv.navn} (${kandidatlisteSammendrag.opprettetAv.ident})`}</BodyShort>
            </Table.DataCell>
            <Table.DataCell>
                <Link
                    aria-label={`Finn kandidater til listen «${kandidatlisteSammendrag.tittel}»`}
                    to={lenkeTilFinnKandidater(
                        kandidatlisteSammendrag.stillingId,
                        kandidatlisteSammendrag.kandidatlisteId
                    )}
                >
                    <Button variant="tertiary" as="div" icon={<PersonPlusIcon />} />
                </Link>
            </Table.DataCell>
            <Table.DataCell>
                {kandidatlisteSammendrag.kanEditere && (
                    <>
                        {erKobletTilStilling(kandidatlisteSammendrag) ? (
                            <Link to={lenkeTilStilling(kandidatlisteSammendrag.stillingId!)}>
                                <Button variant="tertiary" as="div" icon={<PencilIcon />} />
                            </Link>
                        ) : (
                            <Button
                                variant="tertiary"
                                aria-label={`Endre kandidatlisten «${kandidatlisteSammendrag.tittel}»`}
                                onClick={() => endreKandidatliste(kandidatlisteSammendrag)}
                                icon={<PencilIcon />}
                            />
                        )}
                    </>
                )}

                {!kandidatlisteSammendrag.kanEditere && (
                    <Tooltip content="Du kan ikke redigere en kandidatliste som ikke er din.">
                        <Button
                            variant="tertiary"
                            className={css.disabledValg}
                            icon={<PencilIcon />}
                        />
                    </Tooltip>
                )}
            </Table.DataCell>
            <Table.DataCell>
                <Dropdown closeOnSelect={false}>
                    <Button
                        as={Dropdown.Toggle}
                        variant="tertiary"
                        icon={<MenuHamburgerIcon />}
                        aria-label={`Meny for kandidatlisten ${kandidatlisteSammendrag.tittel}`}
                    />
                    <Dropdown.Menu placement="left">
                        <Dropdownmeny
                            kandidatliste={kandidatlisteSammendrag}
                            onMarkerSomMin={markerKandidatlisteSomMin}
                            onSlett={slettKandidatliste}
                        />
                    </Dropdown.Menu>
                </Dropdown>
            </Table.DataCell>
        </Table.Row>
    );
};

export default Rad;
