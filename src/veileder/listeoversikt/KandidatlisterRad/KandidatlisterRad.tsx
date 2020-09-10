import React, { FunctionComponent } from 'react';
import { Hamburgerknapp } from 'nav-frontend-ikonknapper';
import { Link } from 'react-router-dom';
import { Normaltekst } from 'nav-frontend-typografi';
import { formatterDato } from '../../../felles/common/dateUtils';
import { KandidatlisterMenyDropdown } from '../Kandidatlister';
import Lenkeknapp from '../../../felles/common/Lenkeknapp';
import MedPopover from '../../../felles/common/med-popover/MedPopover';

export const KandidatlisterRad: FunctionComponent<any> = ({
    kandidatliste,
    endreKandidatliste,
    markerKandidatlisteSomMin,
    slettKandidatliste,
}) => {
    const lenkeTilStilling = (
        <a
            href={`/stilling/${kandidatliste.stillingId}?redigeringsmodus=true`}
            className="edit-lenke"
        >
            <span className="Edit__icon" />
        </a>
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
        ? lenkeTilStilling
        : lenkeknappTilEndreUtenStilling;

    const visKanIkkeEndre = (
        <MedPopover hjelpetekst="Du kan ikke redigere en kandidatliste som ikke er din.">
            <i className="EditDisabled__icon" />
        </MedPopover>
    );

    return (
        <div className="liste-rad liste-rad-innhold">
            <div className="kolonne-middels">
                <Normaltekst className="tekst">{`${formatterDato(
                    new Date(kandidatliste.opprettetTidspunkt)
                )}`}</Normaltekst>
            </div>
            <div className="kolonne-bred">
                <Link
                    to={`/kandidater/lister/detaljer/${kandidatliste.kandidatlisteId}`}
                    className="tekst lenke"
                >
                    {kandidatliste.tittel}
                </Link>
            </div>
            <div className="kolonne-middels">
                <Normaltekst className="tekst">{kandidatliste.kandidater.length}</Normaltekst>
            </div>
            <div className="kolonne-bred">
                <Normaltekst className="tekst">{`${kandidatliste.opprettetAv.navn} (${kandidatliste.opprettetAv.ident})`}</Normaltekst>
            </div>
            <div className="kolonne-middels__finn-kandidater">
                <Link
                    aria-label={`Finn kandidater til listen ${kandidatliste.tittel}`}
                    to={
                        kandidatliste.stillingId
                            ? `/kandidater/stilling/${kandidatliste.stillingId}`
                            : `/kandidater/kandidatliste/${kandidatliste.kandidatlisteId}`
                    }
                    className="FinnKandidater"
                >
                    <i className="FinnKandidater__icon" />
                </Link>
            </div>
            <div className="kolonne-smal-knapp">
                {kandidatliste.kanEditere ? visKanEndre : visKanIkkeEndre}
            </div>
            <MedPopover
                className="kolonne-smal-knapp"
                hjelpetekst={
                    <KandidatlisterMenyDropdown
                        kandidatliste={kandidatliste}
                        markerSomMinModal={markerKandidatlisteSomMin}
                        slettKandidatliste={slettKandidatliste}
                    />
                }
            >
                <Hamburgerknapp
                    aria-label={`Meny for kandidatlisten ${kandidatliste.tittel}`}
                    className="KandidatlisteMeny"
                />
            </MedPopover>
        </div>
    );
};
