import React, { FunctionComponent, MouseEvent, ReactNode, useState } from 'react';
import { Hamburgerknapp } from 'nav-frontend-ikonknapper';
import { Link } from 'react-router-dom';
import { Normaltekst } from 'nav-frontend-typografi';
import { formatterDato } from '../../../felles/common/dateUtils';
import Lenkeknapp from '../../../felles/common/Lenkeknapp';
import MedPopover from '../../../felles/common/med-popover/MedPopover';
import { Kandidatliste, KandidatlisteView } from '../../kandidatliste/kandidatlistetyper';
import KandidatlisterMenyDropdown from './KandidatlisterDropdown';
import Popover, { PopoverOrientering } from 'nav-frontend-popover';
import ÅrsakTilAtListenIkkeKanSlettes from './ÅrsakTilAtListenIkkeKanSlettes';
import {
    lenkeTilFinnKandidaterMedStilling,
    lenkeTilFinnKandidaterUtenStilling,
    lenkeTilKandidatliste,
    lenkeTilStilling,
} from '../../application/paths';
import './KandidatlisterRad.less';

export type FeilmeldingIMeny = {
    anker?: HTMLElement;
    feilmelding?: ReactNode;
};

type Props = {
    kandidatliste: KandidatlisteView;
    endreKandidatliste: (kandidatliste: KandidatlisteView) => void;
    markerKandidatlisteSomMin: (kandidatliste: KandidatlisteView) => void;
    slettKandidatliste: () => void;
};

export const KandidatlisterRad: FunctionComponent<Props> = ({
    kandidatliste,
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
        <Link to={lenkeTilStilling(stillingId, true)} className="edit-lenke">
            <span className="Edit__icon" />
        </Link>
    );

    const lenkeknappTilEndreUtenStilling = (
        <Lenkeknapp
            aria-label={`Endre kandidatlisten ${kandidatliste.tittel}`}
            onClick={() => endreKandidatliste(kandidatliste)}
            className="Edit"
        >
            <i className="Edit__icon" />
        </Lenkeknapp>
    );

    const visKanEndre = kandidatliste.stillingId
        ? lenkeTilStillingElement(kandidatliste.stillingId)
        : lenkeknappTilEndreUtenStilling;

    const visKanIkkeEndre = (
        <MedPopover hjelpetekst="Du kan ikke redigere en kandidatliste som ikke er din.">
            <i className="EditDisabled__icon" />
        </MedPopover>
    );

    return (
        <div className="liste-rad liste-rad-innhold">
            <div className="kolonne-middels kandidatlister-rad__sorterbar-kolonne">
                <Normaltekst className="tekst">{`${formatterDato(
                    new Date(kandidatliste.opprettetTidspunkt)
                )}`}</Normaltekst>
            </div>
            <div className="kolonne-bred kandidatlister-rad__sorterbar-kolonne">
                <Link
                    to={lenkeTilKandidatliste(kandidatliste.kandidatlisteId)}
                    className="tekst lenke"
                >
                    {kandidatliste.tittel}
                </Link>
            </div>
            <div className="kolonne-middels">
                <Normaltekst className="tekst">{kandidatliste.antallKandidater}</Normaltekst>
            </div>
            <div className="kolonne-bred kandidatlister-rad__sorterbar-kolonne">
                <Normaltekst className="tekst">{`${kandidatliste.opprettetAv.navn} (${kandidatliste.opprettetAv.ident})`}</Normaltekst>
            </div>
            <div className="kolonne-middels__finn-kandidater">
                <Link
                    className="FinnKandidater"
                    aria-label={`Finn kandidater til listen ${kandidatliste.tittel}`}
                    to={
                        kandidatliste.stillingId
                            ? lenkeTilFinnKandidaterMedStilling(kandidatliste.stillingId)
                            : lenkeTilFinnKandidaterUtenStilling(kandidatliste.kandidatlisteId)
                    }
                >
                    <i className="FinnKandidater__icon" />
                </Link>
            </div>
            <div className="kolonne-smal-knapp">
                {kandidatliste.kanEditere ? visKanEndre : visKanIkkeEndre}
            </div>
            <MedPopover
                className="kolonne-smal-knapp kandidatlister-rad__popover"
                onPopoverClick={onDropdownPopoverClick}
                hjelpetekst={
                    <KandidatlisterMenyDropdown
                        kandidatliste={kandidatliste}
                        markerSomMinModal={markerKandidatlisteSomMin}
                        slettKandidatliste={slettKandidatliste}
                        toggleDisabledMarkerSomMinAnker={toggleDisabledMarkerSomMinAnker}
                        toggleDisabledSlettknappAnker={toggleDisabledSlettknappAnker}
                    />
                }
            >
                <Hamburgerknapp
                    aria-label={`Meny for kandidatlisten ${kandidatliste.tittel}`}
                    className="KandidatlisteMeny"
                />
            </MedPopover>
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
                    <ÅrsakTilAtListenIkkeKanSlettes kandidatliste={kandidatliste} />
                </div>
            </Popover>
        </div>
    );
};
