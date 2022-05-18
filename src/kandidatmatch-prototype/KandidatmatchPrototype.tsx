import React, { FunctionComponent, useEffect, useState } from 'react';
import Prototype from './Prototype';
import { hentStilling } from '../kandidatmatch/kandidatmatchApi';
import './KandidatmatchPrototype.less';

const KandidatmatchPrototype: FunctionComponent = () => {
    const [prototype, setPrototype] = useState<Prototype[] | undefined>(undefined);

    useEffect(() => {
        console.log('Henter ai data');
        const hentPrototype = async () => {
            try {
                const stillingsId = 'ecaac27c-de33-4fb2-a0ed-c22436bfe611';
                const stilling = await hentStilling(stillingsId);

                const response = await fetch('/kandidatmatch-api/match', {
                    method: 'POST',
                    body: JSON.stringify({
                        stilling,
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('Returnerer ai data', data);
                    setPrototype(data);
                } else {
                    console.log('Kall mot ai feilet, status', response.status);
                    throw await response.text();
                }
            } catch (e) {
                console.log(e);
            }
        };

        hentPrototype();
    }, []);

    const kandidat = prototype ? prototype[0] : undefined;

    const score = (scoreDesimal) => {
        return `(${Math.round(scoreDesimal * 100)}% Match)`;
    };

    const scoreProsentpoeng = (scoreDesimal) => {
        return Math.round(scoreDesimal * 100);
    };

    function isNumeric(num: string) {
        return !isNaN(parseFloat(num)) && parseFloat(num).toString() === num;
    }

    function tilDato(dato: number | Date | number[] | string) {
        if (dato == null) return '';
        else if (typeof dato === 'number') return new Date(dato).toDateString();
        else if (Array.isArray(dato)) return dato.join('.');
        else if (dato instanceof Date) return dato.toDateString();
        else if (isNumeric(dato)) return new Date(+dato).toDateString();
        else return new Date(dato).toDateString();
    }

    function booleanTilTekst(verdi: boolean) {
        return verdi ? 'Ja' : 'Nei';
    }

    return (
        <div className="prototype">
            <div className="blokk-xl">
                <h1>
                    {kandidat?.fornavn} {kandidat?.etternavn}
                </h1>
            </div>
            {kandidat && (
                <>
                    <section className="blokk-xl">
                        <h3>Personalia</h3>
                        <p>fornavn: {kandidat.fornavn}</p>
                        <p>etternavn: {kandidat.etternavn}</p>
                        <p>epost: {kandidat.epost}</p>
                        <p>telefon: {kandidat.telefon}</p>
                        <p>gateadresse: {kandidat.gateadresse}</p>
                        <p>postnummer: {kandidat.postnummer}</p>
                        <p>poststed: {kandidat.poststed}</p>
                        <p>kommunenr: {kandidat.kommunenr}</p>
                        <p>land: {kandidat.land}</p>
                        <p>nasjonalitet: {kandidat.nasjonalitet}</p>
                        <p>Fødselsnummer: {kandidat.fodselsnummer}</p>
                        <p>Fødselsdato: {kandidat.foedselsdato}</p>
                        <p>Aktørid: {kandidat.aktoerId}</p>
                        <p>Cvid: {kandidat.cvId}</p>
                        <p>
                            Veileder: {kandidat.veileder.veilederId} {kandidat.veileder.tilordnet}{' '}
                            {kandidat.veileder.aktorId}
                        </p>
                        <p aria-label="NAV-kontor">NAV-kontor: Dummy NAV-kontor</p>
                        <p>Disponerer bil: {booleanTilTekst(kandidat.disponererBil === true)}</p>
                    </section>
                    <section className="blokk-xl">
                        <h3>Sammendrag/Om meg {score(kandidat.sammendrag.score)}</h3>
                        <p>{kandidat.sammendrag.tekst}</p>
                    </section>
                    <section className="blokk-xl">
                        <h3>Jobbønsker</h3>
                        <h4>Jobber og yrker {score(kandidat.stillinger_jobbprofil.score)}</h4>
                        <ul>
                            {kandidat.stillinger_jobbprofil.erfaringer.map((stillingØnske) => (
                                <li key={stillingØnske.tekst}>
                                    {stillingØnske.tekst} {score(stillingØnske.score)}
                                </li>
                            ))}
                        </ul>
                        <h4>Hvor kan du jobbe? (score todo)</h4>
                        <ul>
                            {kandidat.geografi_jobbprofil.steder.map((geografiJobbProfil) => (
                                <li key={geografiJobbProfil.kode + kandidat.fodselsnummer}>
                                    {geografiJobbProfil.sted} {geografiJobbProfil.kode}{' '}
                                    {score(geografiJobbProfil.score)}
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
                                <li key={ansettelsesform + kandidat.fodselsnummer}>
                                    {ansettelsesform}
                                </li>
                            ))}
                        </ul>
                    </section>
                    <section className="blokk-xl">
                        <h3>Utdanninger {score(kandidat.utdannelse.score)}</h3>
                        <ul>
                            {kandidat.utdannelse.erfaringer.map((utdannelse) => (
                                <li key={utdannelse.tekst}>
                                    {utdannelse.tekst} {score(utdannelse.score)}
                                </li>
                            ))}
                        </ul>
                    </section>
                    <section className="blokk-xl">
                        <h3>Fagbrev</h3>
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
                    </section>
                    <section className="blokk-xl">
                        <h3>Arbeidserfaringer {score(kandidat.arbeidserfaring.score)}</h3>
                        <ul>
                            {kandidat.arbeidserfaring.erfaringer.map((arbeidserfaring, index) => (
                                <li key={arbeidserfaring.tekst}>
                                    <ul>
                                        {arbeidserfaring.tekst} {score(arbeidserfaring.score)}
                                        <li className="blokk-xl">
                                            Score forklaring:
                                            <table>
                                                {arbeidserfaring.ordScore && (
                                                    <tr>
                                                        {<th></th>}
                                                        {arbeidserfaring.ordScore.map(
                                                            (ordscore, index) => (
                                                                <th key={index}>
                                                                    {ordscore[0][1]}
                                                                </th>
                                                            )
                                                        )}
                                                    </tr>
                                                )}
                                                {arbeidserfaring.ordScore &&
                                                    arbeidserfaring.ordScore.map((ordscore) => {
                                                        const fraKandidat = ordscore[0];
                                                        const ordFraKandidat = fraKandidat[1];
                                                        const fraStilling = ordscore[1];
                                                        const stillingord = fraStilling.map(
                                                            (f, i) => (
                                                                <td key={i}>
                                                                    {scoreProsentpoeng(f[2])}
                                                                </td>
                                                            )
                                                        );
                                                        return (
                                                            <tr>
                                                                <td>{ordFraKandidat}</td>
                                                                {stillingord}
                                                            </tr>
                                                        );
                                                    })}
                                            </table>
                                        </li>
                                        <li>
                                            Score forklaring alternativ:
                                            <table>
                                                <th>Ord fra kandidat</th>
                                                <th>Ord fra stilling</th>
                                                <th>Ord fra stilling</th>
                                                {arbeidserfaring.ordScore &&
                                                    arbeidserfaring.ordScore.map((ordscore) => {
                                                        const fraKandidat = ordscore[0];
                                                        const ordFraKandidat = fraKandidat[1];
                                                        const fraStilling = ordscore[1];

                                                        const stillingord = fraStilling
                                                            .sort(
                                                                (s1, s2) =>
                                                                    scoreProsentpoeng(s2[2]) -
                                                                    scoreProsentpoeng(s1[2])
                                                            )
                                                            .slice(0, 2)
                                                            .map((f, i) => (
                                                                <td key={i}>
                                                                    {scoreProsentpoeng(f[2]) > 50 &&
                                                                        scoreProsentpoeng(f[2]) +
                                                                            '%' +
                                                                            ' ' +
                                                                            f[1]}
                                                                </td>
                                                            ));
                                                        return (
                                                            <tr>
                                                                <td>{ordFraKandidat}</td>
                                                                {stillingord}
                                                            </tr>
                                                        );
                                                    })}
                                            </table>
                                        </li>
                                    </ul>
                                    <br />
                                </li>
                            ))}
                        </ul>
                    </section>
                    <section className="blokk-xl">
                        <h3>Andre erfaringer</h3>
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
                    </section>
                    <section className="blokk-xl">
                        <h3>Kompetanser {score(kandidat.kompetanser_jobbprofil.score)}</h3>
                        <ul>
                            {kandidat.kompetanser_jobbprofil.erfaringer.map((kompetanse) => (
                                <li key={kompetanse.tekst}>
                                    {kompetanse.tekst} {score(kompetanse.score)}
                                </li>
                            ))}
                        </ul>
                    </section>
                    <section className="blokk-xl">
                        <h3>Offentlige godkjenninger</h3>
                        <h4>Autorisasjoner, førerbevis, tjenestebevis</h4>
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
                    </section>
                    <section className="blokk-xl">
                        <h3>Andre godkjenninger</h3>
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
                    </section>
                    <section className="blokk-xl">
                        <h3>Språk</h3>
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
                    </section>
                    <section className="blokk-xl">
                        <h3>Førerkort</h3>
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
                    </section>
                    <section className="blokk-xl">
                        <h3>Kurs</h3>
                        <ul>
                            {kandidat.kurs.map((kurs, index) => (
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
                    </section>
                    <section className="blokk-xl">
                        <h3>Oppfølgingsinformasjon</h3>
                        <ul>
                            <li>Fødselsnummer: {kandidat.oppfolgingsinformasjon.fodselsnummer}</li>
                            <li>
                                Formidlingsgruppe:{' '}
                                {kandidat.oppfolgingsinformasjon.formidlingsgruppe}
                            </li>
                            <li>
                                iservFraDato:{' '}
                                {tilDato(kandidat.oppfolgingsinformasjon.iservFraDato)}
                            </li>
                            <li>Fornavn: {kandidat.oppfolgingsinformasjon.fornavn}</li>
                            <li>Etternavn: {kandidat.oppfolgingsinformasjon.etternavn}</li>
                            <li>
                                Oppfølgingsenhet: {kandidat.oppfolgingsinformasjon.oppfolgingsenhet}
                            </li>
                            <li>
                                Kvalifiseringsgruppe:{' '}
                                {kandidat.oppfolgingsinformasjon.kvalifiseringsgruppe}
                            </li>
                            <li>
                                Rettighetsgruppe: {kandidat.oppfolgingsinformasjon.rettighetsgruppe}
                            </li>
                            <li>Hovedmaal: {kandidat.oppfolgingsinformasjon.hovedmaal}</li>
                            <li>
                                SikkerhetstiltakType:{' '}
                                {kandidat.oppfolgingsinformasjon.sikkerhetstiltakType}
                            </li>
                            <li>
                                Diskresjonskode: {kandidat.oppfolgingsinformasjon.diskresjonskode}
                            </li>
                            <li>
                                Har oppfolgingssak:{' '}
                                {booleanTilTekst(kandidat.oppfolgingsinformasjon.harOppfolgingssak)}
                            </li>
                            <li>
                                Er sperret ansatt:{' '}
                                {booleanTilTekst(kandidat.oppfolgingsinformasjon.sperretAnsatt)}
                            </li>
                            <li>
                                Er død: {booleanTilTekst(kandidat.oppfolgingsinformasjon.erDoed)}
                            </li>
                            <li>
                                Dødsdato: {tilDato(kandidat.oppfolgingsinformasjon.doedFraDato)}
                            </li>
                            <li>
                                Sist endret:{' '}
                                {tilDato(kandidat.oppfolgingsinformasjon.sistEndretDato)}
                            </li>
                        </ul>
                    </section>
                    <section className="blokk-xl">
                        <h3>Oppfølgingsperiode</h3>
                        <ul>
                            <li>UUID: {kandidat.oppfolgingsperiode.uuid} </li>
                            <li>Aktør-id: {kandidat.oppfolgingsperiode.aktorId} </li>
                            <li>Start: {tilDato(kandidat.oppfolgingsperiode.startDato)} </li>
                            <li>Slutt: {tilDato(kandidat.oppfolgingsperiode.sluttDato)} </li>
                        </ul>
                    </section>
                    <section className="blokk-xl">
                        <h3>Tilretteleggingbehov</h3>
                        {kandidat.tilretteleggingsbehov &&
                        kandidat.tilretteleggingsbehov.length > 0 ? (
                            <ul>
                                {kandidat.tilretteleggingsbehov.split(',').map((behov) => (
                                    <li key={behov}>{behov}</li>
                                ))}
                            </ul>
                        ) : (
                            <p>Kandidaten har ingen tilretteleggingsbehov</p>
                        )}
                    </section>
                    <section className="blokk-xl">
                        <h3>Tilleggsinformasjon</h3>
                        <p>OppstartKode: {kandidat.oppstartKode}</p>
                        <p>
                            SynligForArbeidsgiver: {booleanTilTekst(kandidat.synligForArbeidsgiver)}{' '}
                        </p>
                        <p>SynligForVeileder: {booleanTilTekst(kandidat.synligForVeileder)} </p>
                        <p>ArenaKandidatnr: {kandidat.arenaKandidatnr} </p>
                        <p>JobbprofilId: {kandidat.jobbprofilId} </p>
                    </section>
                </>
            )}
        </div>
    );
};

export default KandidatmatchPrototype;
