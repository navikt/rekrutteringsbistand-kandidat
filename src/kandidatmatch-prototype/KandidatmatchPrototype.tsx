import React, { FunctionComponent, useEffect, useState } from 'react';
import Prototype from './Prototype';
import './KandidatmatchPrototype.less';
import { instanceOf } from 'prop-types';
import { isNumber } from 'util';

const KandidatmatchPrototype: FunctionComponent = () => {
    const [prototype, setPrototype] = useState<Prototype[] | undefined>(undefined);

    useEffect(() => {
        const hentPrototype = async () => {
            try {
                const proto = await fetch('/api/prototype', {
                    method: 'GET',
                });

                const data = await proto.json();

                setPrototype(data);
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
    function isNumeric(num: string) {
        return !isNaN(parseFloat(num)) && parseFloat(num).toString() == num;
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
                <h1>Elitekandidater</h1>
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
                        <p></p>
                    </section>
                    <section className="blokk-xl">
                        <h3>Sammendrag/Om meg {score(kandidat.sammendrag.score)}</h3>
                        <ul>
                            <li key={kandidat.sammendrag.sammendrag_tekst}>
                                {kandidat.sammendrag.sammendrag_tekst}
                            </li>
                        </ul>
                    </section>
                    <section className="blokk-xl">
                        <h3>Jobbønsker {score(kandidat.score_total)}</h3>
                        <h4>Jobber og yrker {score(kandidat.stillinger_jobbprofil.score)}</h4>
                        <ul>
                            {kandidat.stillinger_jobbprofil.stillinger.map((stillingØnske) => (
                                <li key={stillingØnske.stilling}>
                                    {stillingØnske.stilling} {score(stillingØnske.score)}
                                </li>
                            ))}
                        </ul>
                        <h4>Arbeidssted {score(kandidat.geografi_jobbprofil.score)}</h4>
                        <ul>
                            {kandidat.geografi_jobbprofil.steder.map((geografiJobbProfil) => (
                                <li key={geografiJobbProfil.kode + kandidat.fodselsnummer}>
                                    {geografiJobbProfil.sted} {geografiJobbProfil.kode}{' '}
                                    {score(geografiJobbProfil.score)}
                                </li>
                            ))}
                        </ul>
                        <h4>Ansettelsesform</h4>
                        <ul>
                            {kandidat.ansettelsesformer_jobbprofil.map((ansettelsesform) => (
                                <li key={ansettelsesform + kandidat.fodselsnummer}>
                                    {ansettelsesform}
                                </li>
                            ))}
                        </ul>
                        <h4>Arbeidstider</h4>
                        <ul>
                            {kandidat.arbeidstider_jobbprofil.map((arbeidstid) => (
                                <li key={arbeidstid + kandidat.fodselsnummer}>{arbeidstid}</li>
                            ))}
                        </ul>
                        <h4>Arbeidsdager</h4>
                        <ul>
                            {kandidat.arbeidsdager_jobbprofil.map((arbeidsdag) => (
                                <li key={arbeidsdag + kandidat.fodselsnummer}>{arbeidsdag}</li>
                            ))}
                        </ul>
                        <h4>Arbeidstidsordninger</h4>
                        <ul>
                            {kandidat.arbeidstidsordninger_jobbprofil.map((arbeidstidsordning) => (
                                <li key={arbeidstidsordning + kandidat.fodselsnummer}>
                                    {arbeidstidsordning}
                                </li>
                            ))}
                        </ul>
                        <h4>Arbeidsomfang</h4>
                        <ul>
                            {kandidat.omfang_jobbprofil.map((omfang) => (
                                <li key={omfang + kandidat.fodselsnummer}>{omfang}</li>
                            ))}
                        </ul>
                    </section>
                    <section className="blokk-xl">
                        <h3>Utdanninger {score(kandidat.utdannelse.score)}</h3>
                        <ul>
                            {kandidat.utdannelse.utdannelser.map((utdannelse) => (
                                <li key={utdannelse.nuskodeGrad}>
                                    {utdannelse.laerested} {score(utdannelse.score)}
                                    <ul>
                                        <li>Utdanningsretning: {utdannelse.utdanningsretning}</li>
                                        <li>Autorisasjon: {utdannelse.autorisasjon}</li>
                                        <li>NuskodeGrad: {utdannelse.nuskodeGrad}</li>
                                        <li>
                                            UtdannelseYrkestatus: {utdannelse.utdannelseYrkestatus}
                                        </li>
                                        <li>FraTidspunkt: {tilDato(utdannelse.fraTidspunkt)}</li>
                                        <li>TilTidspunkt: {tilDato(utdannelse.tilTidspunkt)}</li>
                                    </ul>
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
                                        <li>type: {dok.type}</li>
                                        <li>tittel: {dok.tittel}</li>
                                        <li>beskrivelse: {dok.beskrivelse}</li>
                                    </ul>
                                </li>
                            ))}
                        </ul>
                    </section>
                    <section className="blokk-xl">
                        <h3>Arbeidserfaringer {score(kandidat.arbeidserfaring.score)}</h3>
                        <ul>
                            {kandidat.arbeidserfaring.arbeidserfaringer.map(
                                (arbeidserfaring, index) => (
                                    <li key={arbeidserfaring.janzzKonseptid}>
                                        <ul>
                                            {arbeidserfaring.stillingstittel}{' '}
                                            {score(arbeidserfaring.score)}
                                            <li>Styrkkode: {arbeidserfaring.styrkkode}</li>
                                            <li>Arbeidsgiver: {arbeidserfaring.arbeidsgiver}</li>
                                            <li>Sted: {arbeidserfaring.sted}</li>
                                            <li>Beskrivelse: {arbeidserfaring.beskrivelse}</li>
                                            <li>
                                                StillingstittelFritekst:{' '}
                                                {arbeidserfaring.stillingstittelFritekst}
                                            </li>
                                            <li>
                                                JanzzKonseptid: {arbeidserfaring.janzzKonseptid}
                                            </li>
                                            <li>
                                                TilTidspunkt:{' '}
                                                {tilDato(arbeidserfaring.tilTidspunkt)}
                                            </li>
                                            <li>
                                                IkkeAktueltForFremtiden:{' '}
                                                {booleanTilTekst(
                                                    arbeidserfaring.ikkeAktueltForFremtiden
                                                )}
                                            </li>
                                            <li>
                                                FraTidspunkt:{' '}
                                                {tilDato(arbeidserfaring.fraTidspunkt)}
                                            </li>
                                            <li>
                                                Score forklaring:
                                                <ul>
                                                    {arbeidserfaring.ordScore &&
                                                        arbeidserfaring.ordScore.map((ordscore) => {
                                                            const fraKandidat = ordscore[0];
                                                            const ordFraKandidat = fraKandidat[1];
                                                            const fraStilling = ordscore[1];
                                                            const stillingord = fraStilling
                                                                .map(
                                                                    (f) => `${f[1]} ${score(f[2])}`
                                                                )
                                                                .join(' ');
                                                            return (
                                                                <li>
                                                                    Kandidatord: {ordFraKandidat}
                                                                    <ul>
                                                                        <li>
                                                                            Stillingord:{' '}
                                                                            {stillingord}
                                                                        </li>
                                                                    </ul>
                                                                </li>
                                                            );
                                                        })}
                                                </ul>
                                            </li>
                                        </ul>
                                        <br />
                                    </li>
                                )
                            )}
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
                                        <li>Fra_tidspunkt: {tilDato(erfaring.fra_tidspunkt)}</li>
                                        <li>Til_tidspunkt: {tilDato(erfaring.til_tidspunkt)}</li>
                                    </ul>
                                </li>
                            ))}
                        </ul>
                    </section>
                    <section className="blokk-xl">
                        <h3>Kompetanser {score(kandidat.kompetanser_jobbprofil.score)}</h3>
                        <ul>
                            {kandidat.kompetanser_jobbprofil.kompetanser.map((kompetanse) => (
                                <li key={kompetanse.kompetanse}>
                                    {kompetanse.kompetanse} {score(kompetanse.score)}
                                </li>
                            ))}
                        </ul>
                    </section>
                    <section className="blokk-xl">
                        <h3>Offentlige godkjenninger</h3>
                        <ul>
                            {kandidat.sertifikat.map((sertifikat) => (
                                <li key={sertifikat.tittel}>
                                    <ul>
                                        <li>tittel: {sertifikat.tittel}</li>
                                        <li>sertifikatnavn: {sertifikat.sertifikatnavn}</li>
                                        <li>
                                            sertifikatnavn_fritekst:{' '}
                                            {sertifikat.sertifikatnavn_fritekst}
                                        </li>
                                        <li>utsteder: {sertifikat.utsteder}</li>
                                        <li>gjennomfoert: {sertifikat.gjennomfoert}</li>
                                        <li>utloeper: {tilDato(sertifikat.utloeper)}</li>
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
                                        <li>tittel: {godkjenning.tittel} </li>
                                        <li>konsept_id: {godkjenning.konsept_id} </li>
                                        <li>utsteder: {godkjenning.utsteder} </li>
                                        <li>gjennomfoert: {godkjenning.gjennomfoert} </li>
                                        <li>utloeper: {tilDato(godkjenning.utloeper)} </li>
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
                                    {språkferdighet.spraaknavn} - muntlig: {språkferdighet.muntlig},
                                    skriftlig: {språkferdighet.skriftlig}
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
                                        <li>klasse: {førerkort.klasse}</li>
                                        <li>beskrivelse: {førerkort.klasse_beskrivelse}</li>
                                        <li>fra tidspunkt: {tilDato(førerkort.fra_tidspunkt)}</li>
                                        <li>utløper: {tilDato(førerkort.utloeper)}</li>
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
                                        <li>utsteder: {kurs.utsteder}</li>
                                        <li>varighet: {kurs.varighet}</li>
                                        <li>varighet_enhet: {kurs.varighet_enhet}</li>
                                        <li>tidspunkt: {tilDato(kurs.tidspunkt)}</li>
                                    </ul>
                                </li>
                            ))}
                        </ul>
                    </section>
                    <section className="blokk-xl">
                        <h3>Oppfølgingsinformasjon</h3>
                        <ul>
                            <li>fodselsnummer: {kandidat.oppfolgingsinformasjon.fodselsnummer}</li>
                            <li>
                                formidlingsgruppe:{' '}
                                {kandidat.oppfolgingsinformasjon.formidlingsgruppe}
                            </li>
                            <li>
                                iservFraDato:{' '}
                                {tilDato(kandidat.oppfolgingsinformasjon.iservFraDato)}
                            </li>
                            <li>fornavn: {kandidat.oppfolgingsinformasjon.fornavn}</li>
                            <li>etternavn: {kandidat.oppfolgingsinformasjon.etternavn}</li>
                            <li>
                                oppfolgingsenhet: {kandidat.oppfolgingsinformasjon.oppfolgingsenhet}
                            </li>
                            <li>
                                kvalifiseringsgruppe:{' '}
                                {kandidat.oppfolgingsinformasjon.kvalifiseringsgruppe}
                            </li>
                            <li>
                                rettighetsgruppe: {kandidat.oppfolgingsinformasjon.rettighetsgruppe}
                            </li>
                            <li>hovedmaal: {kandidat.oppfolgingsinformasjon.hovedmaal}</li>
                            <li>
                                sikkerhetstiltakType:{' '}
                                {kandidat.oppfolgingsinformasjon.sikkerhetstiltakType}
                            </li>
                            <li>
                                diskresjonskode: {kandidat.oppfolgingsinformasjon.diskresjonskode}
                            </li>
                            <li>
                                harOppfolgingssak:{' '}
                                {booleanTilTekst(kandidat.oppfolgingsinformasjon.harOppfolgingssak)}
                            </li>
                            <li>
                                sperretAnsatt:{' '}
                                {booleanTilTekst(kandidat.oppfolgingsinformasjon.sperretAnsatt)}
                            </li>
                            <li>
                                erDoed: {booleanTilTekst(kandidat.oppfolgingsinformasjon.erDoed)}
                            </li>
                            <li>
                                doedFraDato: {tilDato(kandidat.oppfolgingsinformasjon.doedFraDato)}
                            </li>
                            <li>
                                sistEndretDato:{' '}
                                {tilDato(kandidat.oppfolgingsinformasjon.sistEndretDato)}
                            </li>
                        </ul>
                    </section>
                    <section className="blokk-xl">
                        <h3>Oppfølgingsperiode</h3>
                        <ul>
                            <li>uuid: {kandidat.oppfolgingsperiode.uuid} </li>
                            <li>aktorId: {kandidat.oppfolgingsperiode.aktorId} </li>
                            <li>startDato: {tilDato(kandidat.oppfolgingsperiode.startDato)} </li>
                            <li>sluttDato: {tilDato(kandidat.oppfolgingsperiode.sluttDato)} </li>
                        </ul>
                    </section>
                    <section className="blokk-xl">
                        <h3>Tilretteleggingbehov</h3>
                        <ul>
                            {kandidat.tilretteleggingsbehov.map((behov) => (
                                <li key={behov}>{behov}</li>
                            ))}
                        </ul>
                    </section>
                    <section className="blokk-xl">
                        <p>OppstartKode: {kandidat.oppstartKode}</p>
                        <p>
                            SynligForArbeidsgiver: {booleanTilTekst(kandidat.synligForArbeidsgiver)}{' '}
                        </p>
                        <p>SynligForVeileder: {booleanTilTekst(kandidat.synligForVeileder)} </p>
                        <p>ArenaKandidatnr: {kandidat.arenaKandidatnr} </p>
                        <p>JobbprofilId: {kandidat.jobbprofilId} </p>
                        <p>Disponerer bil: {booleanTilTekst(kandidat.disponererBil === true)}</p>
                    </section>
                </>
            )}
        </div>
    );
};

export default KandidatmatchPrototype;
