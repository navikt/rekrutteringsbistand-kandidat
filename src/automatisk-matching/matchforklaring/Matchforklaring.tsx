import React, { FunctionComponent } from 'react';
import { Link, RouteChildrenProps } from 'react-router-dom';
import { Feilmelding } from 'nav-frontend-typografi';
import useKandidatmatch from '../useKandidatmatch';
import { booleanTilTekst, tilDato, tilProsent } from '../formatering';
import Personalia from './Personalia';
import { Back } from '@navikt/ds-icons';
import NavFrontendSpinner from 'nav-frontend-spinner';
import ForkortetMatrise from './ForkortetMatrise';
import Matrise from './Matrise';
import Seksjon from './Seksjon';
import './Matchforklaring.less';

type Props = RouteChildrenProps<{
    stillingsId: string;
    kandidatNr: string;
}>;

const Matchforklaring: FunctionComponent<Props> = ({ match }) => {
    const stillingsId = match?.params.stillingsId;
    const kandidatNr = match?.params.kandidatNr;

    const { valgtKandidat: kandidat } = useKandidatmatch(stillingsId, kandidatNr);

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
                {kandidat?.fornavn} {kandidat?.etternavn} ({tilProsent(kandidat?.score)})
            </h1>
            <Personalia kandidat={kandidat} />
            <Seksjon åpen tittel="Sammendrag" match={kandidat.sammendrag.score}>
                <p>{kandidat.sammendrag.tekst}</p>
            </Seksjon>
            <Seksjon tittel="Jobbønsker" match={kandidat.stillinger_jobbprofil.score}>
                {kandidat.stillinger_jobbprofil.erfaringer.map((stillingØnske, index) => (
                    <>
                        <h3 key={stillingØnske.tekst}>
                            {stillingØnske.tekst} ({tilProsent(stillingØnske.score)})
                        </h3>
                        <Matrise erfaring={stillingØnske} />
                    </>
                ))}
                <h3>Arbeidsforhold</h3>
                <h4>Hvor kan du jobbe?</h4>
                <ul>
                    {kandidat.geografi_jobbprofil.steder.map((geografiJobbProfil) => (
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
            <Seksjon tittel="Utdanninger" match={kandidat.utdannelse.score}>
                {kandidat.utdannelse.erfaringer.map((utdannelse, index) => (
                    <div key={utdannelse.tekst}>
                        <h3>
                            {utdannelse.tekst} ({tilProsent(utdannelse.score)})
                        </h3>
                        <Matrise erfaring={utdannelse} />
                    </div>
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
            <Seksjon tittel="Arbeidserfaringer" match={kandidat.arbeidserfaring.score}>
                {kandidat.arbeidserfaring.erfaringer.map((arbeidserfaring, index) => (
                    <div key={arbeidserfaring.tekst}>
                        <h3>
                            {arbeidserfaring.tekst} ({tilProsent(arbeidserfaring.score)})
                        </h3>
                        <Matrise erfaring={arbeidserfaring} />
                        <ForkortetMatrise erfaring={arbeidserfaring} />
                    </div>
                ))}
            </Seksjon>
            <Seksjon tittel="Andre erfaringer">
                <ul>
                    {kandidat.annenErfaring.map((erfaring) => (
                        <li key={erfaring.beskrivelse}>
                            <ul>
                                <li>Beskrivelse: {erfaring.beskrivelse}</li>
                                <li>Rolle: {erfaring.rolle}</li>
                                <li>Fra: {tilDato(erfaring.fra_tidspunkt)}</li>
                                <li>Til: {tilDato(erfaring.til_tidspunkt)}</li>
                            </ul>
                        </li>
                    ))}
                </ul>
            </Seksjon>
            <Seksjon tittel="Kompetanser" match={kandidat.kompetanser_jobbprofil.score}>
                {kandidat.kompetanser_jobbprofil.erfaringer.map((kompetanse) => (
                    <div key={kompetanse.tekst}>
                        <h3>
                            {kompetanse.tekst} ({tilProsent(kompetanse.score)})
                        </h3>
                        <Matrise erfaring={kompetanse} />
                    </div>
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
                                        sertifikatnavn_fritekst:{' '}
                                        {sertifikat.sertifikatnavn_fritekst}
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
                                    <li>konsept_id: {godkjenning.konsept_id} </li>
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
                                    <li>Beskrivelse: {førerkort.klasse_beskrivelse}</li>
                                    <li>Gyldig fra: {tilDato(førerkort.fra_tidspunkt)}</li>
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
                                        Kurslengde {kurs.varighet_enhet}: {kurs.varighet}
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
            <Seksjon tittel="Oppfølgingsinformasjon">
                <ul>
                    <li>Fødselsnummer: {kandidat.oppfolgingsinformasjon.fodselsnummer}</li>
                    <li>Formidlingsgruppe: {kandidat.oppfolgingsinformasjon.formidlingsgruppe}</li>
                    <li>iservFraDato: {tilDato(kandidat.oppfolgingsinformasjon.iservFraDato)}</li>
                    <li>Fornavn: {kandidat.oppfolgingsinformasjon.fornavn}</li>
                    <li>Etternavn: {kandidat.oppfolgingsinformasjon.etternavn}</li>
                    <li>Oppfølgingsenhet: {kandidat.oppfolgingsinformasjon.oppfolgingsenhet}</li>
                    <li>
                        Kvalifiseringsgruppe: {kandidat.oppfolgingsinformasjon.kvalifiseringsgruppe}
                    </li>
                    <li>Rettighetsgruppe: {kandidat.oppfolgingsinformasjon.rettighetsgruppe}</li>
                    <li>Hovedmaal: {kandidat.oppfolgingsinformasjon.hovedmaal}</li>
                    <li>
                        SikkerhetstiltakType: {kandidat.oppfolgingsinformasjon.sikkerhetstiltakType}
                    </li>
                    <li>Diskresjonskode: {kandidat.oppfolgingsinformasjon.diskresjonskode}</li>
                    <li>
                        Har oppfolgingssak:{' '}
                        {booleanTilTekst(kandidat.oppfolgingsinformasjon.harOppfolgingssak)}
                    </li>
                    <li>
                        Er sperret ansatt:{' '}
                        {booleanTilTekst(kandidat.oppfolgingsinformasjon.sperretAnsatt)}
                    </li>
                    <li>Er død: {booleanTilTekst(kandidat.oppfolgingsinformasjon.erDoed)}</li>
                    <li>Dødsdato: {tilDato(kandidat.oppfolgingsinformasjon.doedFraDato)}</li>
                    <li>Sist endret: {tilDato(kandidat.oppfolgingsinformasjon.sistEndretDato)}</li>
                </ul>
            </Seksjon>
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
