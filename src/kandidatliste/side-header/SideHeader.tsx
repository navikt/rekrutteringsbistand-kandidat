import React, { FunctionComponent, useState } from 'react';
import { Element, Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import { Link } from 'react-router-dom';
import NavFrontendChevron from 'nav-frontend-chevron';

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
import Lenkeknapp from '../../common/lenkeknapp/Lenkeknapp';
import Kandidatlistestatus from './rekrutteringsstatus/Kandidatlistestatus';
import './SideHeader.less';
import { Back } from '@navikt/ds-icons';

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

    const [beskrivelseSkalVises, setBeskrivelseSkalVises] = useState(false);
    const oppsummeringTekst = `${
        kandidatliste.kandidater.length
    } kandidater (${antallAktuelleKandidater} er aktuelle${
        erKobletTilStilling(kandidatliste) ? ` / ${antallPresenterteKandidater} er presentert` : ''
    })`;

    return (
        <header className="side-header">
            <div className="side-header__inner">
                <div className="side-header__tilbake">
                    <Link className="navds-link" to={lenkeTilKandidatlisteoversikt}>
                        <Back />
                        Til kandidatlister
                    </Link>
                </div>
                <div className="side-header__informasjon">
                    <Systemtittel className="side-header__tittel">
                        {kandidatliste.tittel}
                    </Systemtittel>
                    <Element className="side-header__antall-kandidater">
                        {oppsummeringTekst}
                    </Element>
                    <div className="side-header__om-kandidatlisten">
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
                                    className="lenke"
                                >
                                    Se stillingsannonse
                                </Link>
                            </span>
                        )}
                        {kandidatliste.beskrivelse && (
                            <Lenkeknapp
                                onClick={() => setBeskrivelseSkalVises(!beskrivelseSkalVises)}
                            >
                                {beskrivelseSkalVises ? 'Skjul beskrivelse' : 'Vis beskrivelse'}
                                <NavFrontendChevron type={beskrivelseSkalVises ? 'opp' : 'ned'} />
                            </Lenkeknapp>
                        )}
                    </div>
                    {beskrivelseSkalVises && (
                        <>
                            <Element className="side-header__beskrivelse-tittel">
                                Beskrivelse
                            </Element>
                            <Normaltekst className="side-header__beskrivelse">
                                {kandidatliste.beskrivelse}
                            </Normaltekst>
                        </>
                    )}
                </div>
                <Kandidatlistestatus
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
