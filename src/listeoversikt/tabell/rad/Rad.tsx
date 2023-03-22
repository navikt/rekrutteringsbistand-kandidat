import React, { FunctionComponent, MouseEvent, ReactNode, useState } from 'react';
import { Hamburgerknapp } from 'nav-frontend-ikonknapper';
import { Link } from 'react-router-dom';
import { formaterDato } from '../../../utils/dateUtils';
import MedPopover from '../../../common/med-popover/MedPopover';
import {
    erKobletTilStilling,
    KandidatlisteSammendrag,
} from '../../../kandidatliste/domene/Kandidatliste';
import Dropdownmeny from './Dropdownmeny';
import Popover, { PopoverOrientering } from 'nav-frontend-popover';
import ÅrsakTilAtListenIkkeKanSlettes from './ÅrsakTilAtListenIkkeKanSlettes';
import {
    lenkeTilFinnKandidater,
    lenkeTilKandidatliste,
    lenkeTilStilling,
} from '../../../app/paths';
import './Rad.less';
import { PencilIcon, PersonPlusIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, Table } from '@navikt/ds-react';

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
    const [disabledMarkerSomMinAnker, setDisabledMarkerSomMinAnker] = useState<
        HTMLElement | undefined
    >(undefined);
    const [disabledSlettknappAnker, setDisabledSlettknappAnker] = useState<HTMLElement | undefined>(
        undefined
    );

    const toggleDisabledMarkerSomMinAnker = (event: MouseEvent<HTMLElement>) => {
        setDisabledMarkerSomMinAnker(disabledMarkerSomMinAnker ? undefined : event.currentTarget);
    };

    const toggleDisabledSlettknappAnker = (event: MouseEvent<HTMLElement>) => {
        setDisabledSlettknappAnker(disabledSlettknappAnker ? undefined : event.currentTarget);
    };

    const onDropdownPopoverClick = () => {
        if (disabledMarkerSomMinAnker) {
            setDisabledMarkerSomMinAnker(undefined);
        }

        if (disabledSlettknappAnker) {
            setDisabledSlettknappAnker(undefined);
        }
    };

    const lenkeTilStillingElement = (stillingId: string) => (
        <Link to={lenkeTilStilling(stillingId, true)}>
            <PencilIcon />
        </Link>
    );

    const lenkeknappTilEndreUtenStilling = (
        <Button
            variant="tertiary"
            className="powerknapp"
            aria-label={`Endre kandidatlisten ${kandidatlisteSammendrag.tittel}`}
            onClick={() => endreKandidatliste(kandidatlisteSammendrag)}
        >
            <PencilIcon />
        </Button>
    );

    const visKanEndre = erKobletTilStilling(kandidatlisteSammendrag)
        ? lenkeTilStillingElement(kandidatlisteSammendrag.stillingId!)
        : lenkeknappTilEndreUtenStilling;

    const visKanIkkeEndre = (
        <MedPopover hjelpetekst="Du kan ikke redigere en kandidatliste som ikke er din.">
            <PencilIcon />
        </MedPopover>
    );

    return (
        <Table.Row>
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
                    className="navds-link"
                    aria-label={`Finn kandidater til listen ${kandidatlisteSammendrag.tittel}`}
                    to={lenkeTilFinnKandidater(
                        kandidatlisteSammendrag.stillingId,
                        kandidatlisteSammendrag.kandidatlisteId
                    )}
                >
                    <PersonPlusIcon />
                </Link>
            </Table.DataCell>
            <Table.DataCell>
                {kandidatlisteSammendrag.kanEditere ? visKanEndre : visKanIkkeEndre}
            </Table.DataCell>
            <Table.DataCell>
                <MedPopover
                    className="kolonne-smal-knapp kandidatlister-rad__popover"
                    onPopoverClick={onDropdownPopoverClick}
                    hjelpetekst={
                        <Dropdownmeny
                            kandidatliste={kandidatlisteSammendrag}
                            markerSomMinModal={markerKandidatlisteSomMin}
                            slettKandidatliste={slettKandidatliste}
                            toggleDisabledMarkerSomMinAnker={toggleDisabledMarkerSomMinAnker}
                            toggleDisabledSlettknappAnker={toggleDisabledSlettknappAnker}
                        />
                    }
                >
                    <Hamburgerknapp
                        aria-label={`Meny for kandidatlisten ${kandidatlisteSammendrag.tittel}`}
                        className="KandidatlisteMeny"
                    />
                </MedPopover>
            </Table.DataCell>
            <Popover
                ankerEl={disabledMarkerSomMinAnker}
                orientering={PopoverOrientering.Venstre}
                onRequestClose={() => {
                    setDisabledMarkerSomMinAnker(undefined);
                }}
            >
                <div className="kandidatlister-rad__feilmelding">
                    Du eier allerede kandidatlisten
                </div>
            </Popover>
            <Popover
                ankerEl={disabledSlettknappAnker}
                orientering={PopoverOrientering.Venstre}
                onRequestClose={() => {
                    setDisabledSlettknappAnker(undefined);
                }}
            >
                <div className="kandidatlister-rad__feilmelding">
                    <ÅrsakTilAtListenIkkeKanSlettes
                        kandidatlisteSammendrag={kandidatlisteSammendrag}
                    />
                </div>
            </Popover>
        </Table.Row>
    );
};

export default Rad;
