import React, { FunctionComponent } from 'react';
import { BodyLong, BodyShort, Heading, Label, ReadMore } from '@navikt/ds-react';
import { ChevronLeftIcon } from '@navikt/aksel-icons';
import { Link } from 'react-router-dom';

import { capitalizeEmployerName } from '../../kandidatsøk/utils';
import { lenkeTilKandidatlisteoversikt, lenkeTilStilling } from '../../app/paths';
import {
    erKobletTilArbeidsgiver,
    erKobletTilStilling,
    Kandidatliste,
} from '../domene/Kandidatliste';
import {
    FormidlingAvUsynligKandidat,
    Kandidat,
    Kandidatstatus,
    Kandidatutfall,
} from '../domene/Kandidat';
import Kandidatlistestatus from './kandidatlistestatus/Kandidatlistestatus';
import css from './SideHeader.module.css';

type Props = {
    kandidatliste: Kandidatliste;
};

const erIkkeArkivert = (k: Kandidat) => !k.arkivert;
const erAktuell = (k: Kandidat) => k.status === Kandidatstatus.Aktuell;
const erPresentert = (k: Kandidat) => k.utfall === Kandidatutfall.Presentert;
const harFåttJobb = (k: Kandidat) => k.utfall === Kandidatutfall.FåttJobben;
const usynligKandidatHarFåttJobb = (f: FormidlingAvUsynligKandidat) =>
    f.utfall === Kandidatutfall.FåttJobben;

const SideHeader: FunctionComponent<Props> = ({ kandidatliste }) => {
    const ikkeArkiverteKandidater = kandidatliste.kandidater.filter(erIkkeArkivert);
    const antallAktuelleKandidater = ikkeArkiverteKandidater.filter(erAktuell).length;
    const antallPresenterteKandidater = ikkeArkiverteKandidater.filter(erPresentert).length;
    const antallKandidaterSomHarFåttJobb =
        ikkeArkiverteKandidater.filter(harFåttJobb).length +
        kandidatliste.formidlingerAvUsynligKandidat.filter(usynligKandidatHarFåttJobb).length;

    const oppsummeringTekst = `${
        kandidatliste.kandidater.length
    } kandidater (${antallAktuelleKandidater} er aktuelle${
        erKobletTilStilling(kandidatliste) ? ` / ${antallPresenterteKandidater} er presentert` : ''
    })`;

    return (
        <header className={css.header}>
            <div className={css.inner}>
                <div className={css.tilbake}>
                    <Link className="navds-link" to={lenkeTilKandidatlisteoversikt}>
                        <ChevronLeftIcon />
                        Til kandidatlister
                    </Link>
                </div>
                <div>
                    <Heading spacing level="2" size="medium">
                        {kandidatliste.tittel}
                    </Heading>

                    <Label spacing as="p">
                        {oppsummeringTekst}
                    </Label>
                    <BodyShort spacing className={css.omKandidatlisten}>
                        {erKobletTilArbeidsgiver(kandidatliste) && (
                            <span>
                                Arbeidsgiver:{' '}
                                {capitalizeEmployerName(kandidatliste.organisasjonNavn)}
                            </span>
                        )}
                        <span>
                            Registrert av: {kandidatliste.opprettetAv.navn} (
                            {kandidatliste.opprettetAv.ident})
                        </span>
                        {erKobletTilStilling(kandidatliste) && (
                            <span>
                                <Link
                                    to={lenkeTilStilling(kandidatliste.stillingId!)}
                                    className="navds-link"
                                >
                                    Se stillingsannonse
                                </Link>
                            </span>
                        )}
                    </BodyShort>

                    {kandidatliste.beskrivelse && (
                        <ReadMore header="Vis beskrivelse">
                            <Heading spacing level="3" size="small">
                                Beskrivelse
                            </Heading>
                            <BodyLong>{kandidatliste.beskrivelse}</BodyLong>
                        </ReadMore>
                    )}
                </div>
                <Kandidatlistestatus
                    className={css.status}
                    status={kandidatliste.status}
                    erKnyttetTilStilling={erKobletTilStilling(kandidatliste)}
                    kanEditere={kandidatliste.kanEditere}
                    besatteStillinger={antallKandidaterSomHarFåttJobb}
                    antallStillinger={kandidatliste.antallStillinger}
                    kandidatlisteId={kandidatliste.kandidatlisteId}
                />
            </div>
        </header>
    );
};

export default SideHeader;
