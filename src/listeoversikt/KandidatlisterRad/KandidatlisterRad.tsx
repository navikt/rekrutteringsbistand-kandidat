import React, { FunctionComponent, MouseEvent, ReactNode, useState } from 'react';
import { Hamburgerknapp } from 'nav-frontend-ikonknapper';
import { Link } from 'react-router-dom';
import { Normaltekst } from 'nav-frontend-typografi';
import { formatterDato } from '../../utils/dateUtils';
import Lenkeknapp from '../../common/lenkeknapp/Lenkeknapp';
import MedPopover from '../../common/med-popover/MedPopover';
import {
    erKobletTilStilling,
    KandidatlisteSammendrag,
} from '../../kandidatliste/kandidatlistetyper';
import KandidatlisterMenyDropdown from './KandidatlisterDropdown';
import Popover, { PopoverOrientering } from 'nav-frontend-popover';
import ÅrsakTilAtListenIkkeKanSlettes from './ÅrsakTilAtListenIkkeKanSlettes';
import {
    lenkeTilFinnKandidaterMedStilling,
    lenkeTilFinnKandidaterUtenStilling,
    lenkeTilKandidatliste,
    lenkeTilStilling,
} from '../../app/paths';
import './KandidatlisterRad.less';

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

export const KandidatlisterRad: FunctionComponent<Props> = ({
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
        <Link to={lenkeTilStilling(stillingId, true)} className="edit-lenke">
            <span className="Edit__icon" />
        </Link>
    );

    const lenkeknappTilEndreUtenStilling = (
        <Lenkeknapp
            aria-label={`Endre kandidatlisten ${kandidatlisteSammendrag.tittel}`}
            onClick={() => endreKandidatliste(kandidatlisteSammendrag)}
            className="Edit"
        >
            <i className="Edit__icon" />
        </Lenkeknapp>
    );

    const visKanEndre = erKobletTilStilling(kandidatlisteSammendrag)
        ? lenkeTilStillingElement(kandidatlisteSammendrag.stillingId!)
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
                    new Date(kandidatlisteSammendrag.opprettetTidspunkt)
                )}`}</Normaltekst>
            </div>
            <div className="kolonne-bred kandidatlister-rad__sorterbar-kolonne">
                <Link
                    to={lenkeTilKandidatliste(kandidatlisteSammendrag.kandidatlisteId)}
                    className="tekst lenke"
                >
                    {kandidatlisteSammendrag.tittel}
                </Link>
            </div>
            <div className="kolonne-middels kandidatlister-rad__sorterbar-kolonne">
                <Normaltekst className="tekst">
                    {kandidatlisteSammendrag.antallKandidater}
                </Normaltekst>
            </div>
            <div className="kolonne-bred kandidatlister-rad__sorterbar-kolonne__last">
                <Normaltekst className="tekst">{`${kandidatlisteSammendrag.opprettetAv.navn} (${kandidatlisteSammendrag.opprettetAv.ident})`}</Normaltekst>
            </div>
            <div className="kolonne-middels__finn-kandidater">
                <Link
                    className="FinnKandidater"
                    aria-label={`Finn kandidater til listen ${kandidatlisteSammendrag.tittel}`}
                    to={
                        erKobletTilStilling(kandidatlisteSammendrag)
                            ? lenkeTilFinnKandidaterMedStilling(kandidatlisteSammendrag.stillingId!)
                            : lenkeTilFinnKandidaterUtenStilling(
                                  kandidatlisteSammendrag.kandidatlisteId
                              )
                    }
                >
                    <i className="FinnKandidater__icon" />
                </Link>
            </div>
            <div className="kolonne-smal-knapp">
                {kandidatlisteSammendrag.kanEditere ? visKanEndre : visKanIkkeEndre}
            </div>
            <MedPopover
                className="kolonne-smal-knapp kandidatlister-rad__popover"
                onPopoverClick={onDropdownPopoverClick}
                hjelpetekst={
                    <KandidatlisterMenyDropdown
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
        </div>
    );
};
