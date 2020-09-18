import React, { FunctionComponent, useState } from 'react';
import { Element, Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import { useSelector } from 'react-redux';
import Lenke from 'nav-frontend-lenker';
import NavFrontendChevron from 'nav-frontend-chevron';

import { capitalizeEmployerName } from '../../../felles/sok/utils';
import { LenkeMedChevron } from '../../kandidatside/header/lenke-med-chevron/LenkeMedChevron';
import { lenkeTilStilling } from '../../application/paths';
import {
    FormidlingAvUsynligKandidat,
    KandidatIKandidatliste,
    Kandidatliste,
    Kandidatstatus,
} from '../kandidatlistetyper';
import { Utfall } from '../kandidatrad/utfall-select/UtfallSelect';
import AppState from '../../AppState';
import Lenkeknapp from '../../../felles/common/Lenkeknapp';
import Kandidatlistestatus from './rekrutteringsstatus/Kandidatlistestatus';
import './SideHeader.less';

type Props = {
    kandidater: KandidatIKandidatliste[];
    kandidatliste: Kandidatliste;
};

const erIkkeArkivert = (k: KandidatIKandidatliste) => !k.arkivert;
const erAktuell = (k: KandidatIKandidatliste) => k.status === Kandidatstatus.Aktuell;
const erPresentert = (k: KandidatIKandidatliste) => k.utfall === Utfall.Presentert;
const harFåttJobb = (k: KandidatIKandidatliste) => k.utfall === Utfall.FåttJobben;
const usynligKandidatHarFåttJobb = (f: FormidlingAvUsynligKandidat) =>
    f.utfall === Utfall.FåttJobben;

const SideHeader: FunctionComponent<Props> = ({ kandidater, kandidatliste }) => {
    const visRekrutteringsstatus = useSelector(
        (state: AppState) => state.søk.featureToggles['vis-rekrutteringsstatus']
    );

    const ikkeArkiverteKandidater = kandidater.filter(erIkkeArkivert);
    const antallAktuelleKandidater = ikkeArkiverteKandidater.filter(erAktuell).length;
    const antallPresenterteKandidater = ikkeArkiverteKandidater.filter(erPresentert).length;
    const antallKandidaterSomHarFåttJobb =
        ikkeArkiverteKandidater.filter(harFåttJobb).length +
        kandidatliste.formidlingerAvUsynligKandidat.filter(usynligKandidatHarFåttJobb).length;

    const [beskrivelseSkalVises, setBeskrivelseSkalVises] = useState(false);
    const oppsummeringTekst = `${
        kandidater.length
    } kandidater (${antallAktuelleKandidater} er aktuelle${
        kandidatliste.stillingId ? ` / ${antallPresenterteKandidater} er presentert` : ''
    })`;

    return (
        <header className="side-header">
            <div className="side-header__inner">
                <div className="side-header__tilbake">
                    <LenkeMedChevron
                        to="/kandidater/lister"
                        text="Til kandidatlister"
                        type="venstre"
                    />
                </div>
                <div className="side-header__informasjon">
                    <Systemtittel className="side-header__tittel">
                        {kandidatliste.tittel}
                    </Systemtittel>
                    <Element className="side-header__antall-kandidater">
                        {oppsummeringTekst}
                    </Element>
                    <div className="side-header__om-kandidatlisten">
                        {kandidatliste.organisasjonNavn && (
                            <span>
                                Arbeidsgiver:{' '}
                                {capitalizeEmployerName(kandidatliste.organisasjonNavn)}
                            </span>
                        )}
                        <span>
                            Registrert av: {kandidatliste.opprettetAv.navn} (
                            {kandidatliste.opprettetAv.ident})
                        </span>
                        {kandidatliste.stillingId && (
                            <span>
                                <Lenke href={lenkeTilStilling(kandidatliste.stillingId)}>
                                    Se stillingsannonse
                                </Lenke>
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
                {visRekrutteringsstatus && (
                    <Kandidatlistestatus
                        status={kandidatliste.status}
                        erKnyttetTilStilling={kandidatliste.stillingId !== null}
                        kanEditere={kandidatliste.kanEditere}
                        besatteStillinger={antallKandidaterSomHarFåttJobb}
                        kandidatlisteId={kandidatliste.kandidatlisteId}
                    />
                )}
            </div>
        </header>
    );
};

export default SideHeader;
