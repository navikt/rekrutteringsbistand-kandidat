import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Feilmelding } from 'nav-frontend-typografi';
import useKandidatmatch from '../useKandidatmatch';
import { booleanTilTekst, tilDato, tilProsent } from '../formatering';
import Personalia from './Personalia';
import { Back } from '@navikt/ds-icons';
import NavFrontendSpinner from 'nav-frontend-spinner';
import Matrise from './Matrise';
import Seksjon from './Seksjon';
import './Matchforklaring.less';
import { Navigeringsstate } from '../AlleMatcher';

type Params = {
    stillingsId: string;
    kandidatNr: string;
};

const Matchforklaring = () => {
    const { stillingsId, kandidatNr } = useParams<Params>();
    const { state } = useLocation();
    const { aktørIder } = (state || {}) as Navigeringsstate;

    const { valgtKandidat: kandidat } = useKandidatmatch(stillingsId, aktørIder, kandidatNr);

    if (stillingsId === undefined || kandidatNr === undefined) {
        return <Feilmelding>Du må oppgi stillingsId og kandidatNr</Feilmelding>;
    }

    if (!kandidat) {
        return <NavFrontendSpinner />;
    }

    return (
        <div className="matchforklaring">
            <Link className="lenke" to={`/prototype/stilling/${stillingsId}`}>
                <Back />
                Tilbake til oversikten
            </Link>
            <h1 className="blokk-l">
                {kandidat?.fornavn} {kandidat?.etternavn} ({tilProsent(kandidat?.score)}) | Nynorsk:
                ({tilProsent(kandidat?.nn_score)})
            </h1>
            <Personalia kandidat={kandidat} />
            <Seksjon
                åpen
                tittel="Sammendrag"
                match={kandidat.sammendrag.score}
                nn_match={kandidat.sammendrag.nn_score}
            >
                <p>{kandidat.sammendrag.tekst}</p>
                <Matrise tittel="Detaljer" erfaring={kandidat.sammendrag} />
            </Seksjon>
            <Seksjon
                tittel="Jobbønsker"
                match={kandidat.stillinger_jobbprofil.score}
                nn_match={kandidat.stillinger_jobbprofil.nn_score}
            >
                {kandidat.stillinger_jobbprofil.erfaringer
                    .sort(
                        (stillingØnske1, stillingØnske2) =>
                            stillingØnske2.score - stillingØnske1.score
                    )
                    .map((stillingØnske, index) => (
                        <Matrise
                            tittel={stillingØnske.tekst}
                            match={stillingØnske.score}
                            erfaring={stillingØnske}
                        />
                    ))}
                <div className="blokk-l" />
                <h3>Arbeidsforhold</h3>
                <h4>Hvor kan du jobbe?</h4>
                <ul>
                    {kandidat.geografi_jobbprofil.map((geografiJobbProfil) => (
                        <li key={geografiJobbProfil.kode + kandidat.fodselsnummer}>
                            {geografiJobbProfil.sted} {geografiJobbProfil.kode}
                        </li>
                    ))}
                </ul>
                <h4>Vil du jobbe heltid eller deltid?</h4>
                <ul>
                    {kandidat.omfang_jobbprofil.map((omfang) => (
                        <li key={omfang + kandidat.fodselsnummer}>{omfang}</li>
                    ))}
                </ul>
                <h4>Når kan du jobbe?</h4>
                <ul>
                    {kandidat.arbeidstider_jobbprofil.map((arbeidstid) => (
                        <li key={arbeidstid + kandidat.fodselsnummer}>{arbeidstid}</li>
                    ))}
                </ul>
                <h4>Når kan du jobbe?</h4>
                <ul>
                    {kandidat.arbeidsdager_jobbprofil.map((arbeidsdag) => (
                        <li key={arbeidsdag + kandidat.fodselsnummer}>{arbeidsdag}</li>
                    ))}
                </ul>
                <h4>Når kan du jobbe?</h4>
                <ul>
                    {kandidat.arbeidstidsordninger_jobbprofil.map((arbeidstidsordning) => (
                        <li key={arbeidstidsordning + kandidat.fodselsnummer}>
                            {arbeidstidsordning}
                        </li>
                    ))}
                </ul>
                <h4>Hva slags ansettelse ønsker du?</h4>
                <ul>
                    {kandidat.ansettelsesformer_jobbprofil.map((ansettelsesform) => (
                        <li key={ansettelsesform + kandidat.fodselsnummer}>{ansettelsesform}</li>
                    ))}
                </ul>
            </Seksjon>
            <Seksjon
                tittel="Utdanninger"
                match={kandidat.utdannelse.score}
                nn_match={kandidat.utdannelse.nn_score}
            >
                {kandidat.utdannelse.erfaringer
                    .sort((utdannelse1, utdannelse2) => utdannelse2.score - utdannelse1.score)
                    .map((utdannelse, index) => (
                        <Matrise
                            tittel={utdannelse.tekst}
                            match={utdannelse.score}
                            erfaring={utdannelse}
                        />
                    ))}
            </Seksjon>
            <Seksjon tittel="Fagbrev">
                {kandidat.fagdokumentasjon.length > 0 ? (
                    <ul>
                        {kandidat.fagdokumentasjon.map((dok) => (
                            <li key={dok.tittel}>
                                <ul>
                                    <li>Type: {dok.type}</li>
                                    <li>Tittel: {dok.tittel}</li>
                                    <li>Beskrivelse: {dok.beskrivelse}</li>
                                </ul>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <IngenData />
                )}
            </Seksjon>
            <Seksjon
                tittel="Arbeidserfaringer"
                match={kandidat.arbeidserfaring.score}
                nn_match={kandidat.arbeidserfaring.nn_score}
            >
                {kandidat.arbeidserfaring.erfaringer
                    .sort(
                        (arbeidserfaring1, arbeidserfaring2) =>
                            arbeidserfaring2.score - arbeidserfaring1.score
                    )
                    .map((arbeidserfaring, index) => (
                        <Matrise
                            tittel={arbeidserfaring.tekst}
                            match={arbeidserfaring.score}
                            erfaring={arbeidserfaring}
                        />
                    ))}
            </Seksjon>
            <Seksjon tittel="Andre erfaringer">
                <ul>
                    {kandidat.annenErfaring.map((erfaring) => (
                        <li key={erfaring.beskrivelse}>
                            <ul>
                                <li>Beskrivelse: {erfaring.beskrivelse}</li>
                                <li>Rolle: {erfaring.rolle}</li>
                                <li>Fra: {tilDato(erfaring.fraTidspunkt)}</li>
                                <li>Til: {tilDato(erfaring.tilTidspunkt)}</li>
                            </ul>
                        </li>
                    ))}
                </ul>
            </Seksjon>
            <Seksjon
                tittel="Kompetanser"
                match={kandidat.kompetanser_jobbprofil.score}
                nn_match={kandidat.kompetanser_jobbprofil.nn_score}
            >
                {kandidat.kompetanser_jobbprofil.erfaringer.map((kompetanse) => (
                    <Matrise
                        tittel={kompetanse.tekst}
                        match={kompetanse.score}
                        erfaring={kompetanse}
                    />
                ))}
            </Seksjon>
            <Seksjon tittel="Offentlige godkjenninger">
                <p>
                    <i>F.eks. autorisasjoner, førerbevis, tjenestebevis</i>
                </p>
                {kandidat.sertifikat.length > 0 ? (
                    <ul>
                        {kandidat.sertifikat.map((sertifikat) => (
                            <li key={sertifikat.tittel}>
                                <ul>
                                    <li>Tittel: {sertifikat.tittel}</li>
                                    <li>Sertifikatnavn: {sertifikat.sertifikatnavn}</li>
                                    <li>
                                        sertifikatnavn_fritekst: {sertifikat.sertifikatnavnFritekst}
                                    </li>
                                    <li>Utsteder: {sertifikat.utsteder}</li>
                                    <li>Fullført: {sertifikat.gjennomfoert}</li>
                                    <li>Utløper: {tilDato(sertifikat.utloeper)}</li>
                                </ul>
                                <br />
                            </li>
                        ))}
                    </ul>
                ) : (
                    <IngenData />
                )}
            </Seksjon>
            <Seksjon tittel="Andre godkjenninger">
                {kandidat.godkjenninger.length > 0 ? (
                    <ul>
                        {kandidat.godkjenninger.map((godkjenning) => (
                            <li key={godkjenning.tittel}>
                                <ul>
                                    <li>Tittel: {godkjenning.tittel} </li>
                                    <li>konseptId: {godkjenning.konseptId} </li>
                                    <li>Utsteder: {godkjenning.utsteder} </li>
                                    <li>Fullført: {godkjenning.gjennomfoert} </li>
                                    <li>Utløper: {tilDato(godkjenning.utloeper)} </li>
                                </ul>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <IngenData />
                )}
            </Seksjon>
            <Seksjon tittel="Språkferdigheter">
                {kandidat.spraakferdigheter.length > 0 ? (
                    <ul>
                        {kandidat.spraakferdigheter.map((språkferdighet) => (
                            <li key={språkferdighet.iso3kode}>
                                {språkferdighet.spraaknavn}
                                <ul>
                                    <li>Muntlig: {språkferdighet.muntlig}</li>
                                    <li>Skriftlig: {språkferdighet.skriftlig}</li>
                                </ul>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <IngenData />
                )}
            </Seksjon>
            <Seksjon tittel="Førerkort">
                {kandidat.foererkort.klasse.length > 0 ? (
                    <ul>
                        {kandidat.foererkort.klasse.map((førerkort) => (
                            <li key={førerkort.klasse}>
                                <ul>
                                    <li>Klasse: {førerkort.klasse}</li>
                                    <li>Beskrivelse: {førerkort.klasseBeskrivelse}</li>
                                    <li>Gyldig fra: {tilDato(førerkort.fraTidspunkt)}</li>
                                    <li>Gyldig til: {tilDato(førerkort.utloeper)}</li>
                                </ul>
                                <br />
                            </li>
                        ))}
                    </ul>
                ) : (
                    <IngenData />
                )}
            </Seksjon>
            <Seksjon tittel="Kurs">
                {kandidat.kurs.length > 0 ? (
                    <ul>
                        {kandidat.kurs.map((kurs) => (
                            <li key={kurs.tittel}>
                                {kurs.tittel}
                                <ul>
                                    <li>Kursholder: {kurs.utsteder}</li>
                                    <li>
                                        Kurslengde {kurs.varighetEnhet}: {kurs.varighet}
                                    </li>
                                    <li>Fullført: {tilDato(kurs.tidspunkt)}</li>
                                </ul>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <IngenData />
                )}
            </Seksjon>
            {/*<Seksjon tittel="Oppfølgingsinformasjon">*/}
            {/*    <ul>*/}
            {/*        <li>Fødselsnummer: {kandidat.oppfolgingsinformasjon.fodselsnummer}</li>*/}
            {/*        <li>Formidlingsgruppe: {kandidat.oppfolgingsinformasjon.formidlingsgruppe}</li>*/}
            {/*        <li>iservFraDato: {tilDato(kandidat.oppfolgingsinformasjon.iservFraDato)}</li>*/}
            {/*        <li>Fornavn: {kandidat.oppfolgingsinformasjon.fornavn}</li>*/}
            {/*        <li>Etternavn: {kandidat.oppfolgingsinformasjon.etternavn}</li>*/}
            {/*        <li>Oppfølgingsenhet: {kandidat.oppfolgingsinformasjon.oppfolgingsenhet}</li>*/}
            {/*        <li>*/}
            {/*            Kvalifiseringsgruppe: {kandidat.oppfolgingsinformasjon.kvalifiseringsgruppe}*/}
            {/*        </li>*/}
            {/*        <li>Rettighetsgruppe: {kandidat.oppfolgingsinformasjon.rettighetsgruppe}</li>*/}
            {/*        <li>Hovedmål: {kandidat.oppfolgingsinformasjon.hovedmaal}</li>*/}
            {/*        <li>*/}
            {/*            SikkerhetstiltakType: {kandidat.oppfolgingsinformasjon.sikkerhetstiltakType}*/}
            {/*        </li>*/}
            {/*        <li>Diskresjonskode: {kandidat.oppfolgingsinformasjon.diskresjonskode}</li>*/}
            {/*        <li>*/}
            {/*            Har oppfølgingssak:{' '}*/}
            {/*            {booleanTilTekst(kandidat.oppfolgingsinformasjon.harOppfolgingssak)}*/}
            {/*        </li>*/}
            {/*        <li>*/}
            {/*            Er sperret ansatt:{' '}*/}
            {/*            {booleanTilTekst(kandidat.oppfolgingsinformasjon.sperretAnsatt)}*/}
            {/*        </li>*/}
            {/*        <li>Er død: {booleanTilTekst(kandidat.oppfolgingsinformasjon.erDoed)}</li>*/}
            {/*        <li>Dødsdato: {tilDato(kandidat.oppfolgingsinformasjon.doedFraDato)}</li>*/}
            {/*        <li>Sist endret: {tilDato(kandidat.oppfolgingsinformasjon.sistEndretDato)}</li>*/}
            {/*    </ul>*/}
            {/*</Seksjon>*/}
            <Seksjon tittel="Oppfølgingsperiode">
                <ul>
                    <li>UUID: {kandidat.oppfolgingsperiode.uuid} </li>
                    <li>Aktør-id: {kandidat.oppfolgingsperiode.aktorId} </li>
                    <li>Start: {tilDato(kandidat.oppfolgingsperiode.startDato)} </li>
                    <li>Slutt: {tilDato(kandidat.oppfolgingsperiode.sluttDato)} </li>
                </ul>
            </Seksjon>
            <Seksjon tittel="Tilretteleggingsbehov">
                {kandidat.tilretteleggingsbehov && kandidat.tilretteleggingsbehov.length > 0 ? (
                    <ul>
                        {kandidat.tilretteleggingsbehov.split(',').map((behov) => (
                            <li key={behov}>{behov}</li>
                        ))}
                    </ul>
                ) : (
                    <p>Kandidaten har ingen tilretteleggingsbehov</p>
                )}
            </Seksjon>
            <Seksjon tittel="Tilleggsinformasjon">
                <p>OppstartKode: {kandidat.oppstartKode}</p>
                <p>SynligForArbeidsgiver: {booleanTilTekst(kandidat.synligForArbeidsgiver)} </p>
                <p>SynligForVeileder: {booleanTilTekst(kandidat.synligForVeileder)} </p>
                <p>ArenaKandidatnr: {kandidat.arenaKandidatnr} </p>
                <p>JobbprofilId: {kandidat.jobbprofilId} </p>
            </Seksjon>
        </div>
    );
};

export const IngenData = () => <p>Ikke oppgitt</p>;

export default Matchforklaring;
