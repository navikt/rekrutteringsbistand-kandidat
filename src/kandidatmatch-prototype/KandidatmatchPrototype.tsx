import React, { FunctionComponent, useEffect, useState } from 'react';
import Prototype from './Prototype';
import './KandidatmatchPrototype.less';

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

    return (
        <div className="prototype">
            <h1>Elitekandidater</h1>
            {kandidat && (
                <>
                    <div>
                        <h2>{kandidat.fornavn}</h2>
                        <p aria-label="fødselsnummer">Fødselsnummer: {kandidat.fodselsnummer}</p>
                        <p aria-label="veileder">Veileder: Dummy Veileder</p>
                        <p aria-label="NAV-kontor">NAV-kontor: Dummy NAV-kontor</p>
                        <p></p>
                    </div>
                    <div>
                        {/* Legg inn score når klarhet i hva som er hva */}
                        <h3>Jobbønsker ({kandidat.score_jobbprofil})</h3>
                        <h4>Stillinger({kandidat.stillinger_jobbprofil.score})</h4>
                        <ul>
                            {kandidat.stillinger_jobbprofil.stillinger.map((stillingØnske) => (
                                <li key={stillingØnske.stilling}>
                                    {stillingØnske.stilling}(stillingØnske.score)
                                </li>
                            ))}
                        </ul>
                        <h4>Arbeidssted({kandidat.geografi_jobbprofil.score})</h4>
                        <ul>
                            {kandidat.geografi_jobbprofil.steder.map((geografiJobbProfil) => (
                                <li key={geografiJobbProfil.kode + kandidat.fodselsnummer}>
                                    {geografiJobbProfil.sted}
                                </li>
                            ))}
                        </ul>
                        <h4>Ansettelsesform)</h4>
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
                        <h3>Arbeidserfaring ({kandidat.arbeidserfaring.score})</h3>
                        <ul>
                            {kandidat.arbeidserfaring.arbeidserfaringer.map(
                                (arbeidserfaring, index) => (
                                    <li key={arbeidserfaring.janzzKonseptid}>
                                        <ul>
                                            {arbeidserfaring.stillingstittel} (
                                            {arbeidserfaring.score})
                                            <li>styrkkode: {arbeidserfaring.styrkkode}</li>
                                            <li>arbeidsgiver: {arbeidserfaring.arbeidsgiver}</li>
                                            <li>sted: {arbeidserfaring.sted}</li>
                                            <li>beskrivelse: {arbeidserfaring.beskrivelse}</li>
                                            <li>
                                                stillingstittelFritekst:{' '}
                                                {arbeidserfaring.stillingstittelFritekst}
                                            </li>
                                            <li>
                                                janzzKonseptid: {arbeidserfaring.janzzKonseptid}
                                            </li>
                                            <li>tilTidspunkt: {arbeidserfaring.tilTidspunkt}</li>
                                            <li>
                                                ikkeAktueltForFremtiden:{' '}
                                                {arbeidserfaring.ikkeAktueltForFremtiden}
                                            </li>
                                            <li>fraTidspunkt: {arbeidserfaring.fraTidspunkt}</li>
                                        </ul>
                                        <br />
                                    </li>
                                )
                            )}
                        </ul>
                        <h3>Utdanning ({kandidat.utdannelse.score})</h3>
                        <ul>
                            {kandidat.utdannelse.utdannelser.map((utdannelse, index) => (
                                <li key={utdannelse.beskrivelse}>
                                    {utdannelse.laerested} ({utdannelse.score})
                                </li>
                            ))}
                        </ul>
                        <h3>Kurs</h3>
                        <ul>
                            {kandidat.kurs.map((kurs, index) => (
                                <li key={kurs.tittel}>
                                    utsteder: {kurs.utsteder}, varighet: {kurs.varighet} -{' '}
                                    {kurs.varighet_enhet}, dato:{' '}
                                    {new Date(kurs.tidspunkt).toDateString()}
                                </li>
                            ))}
                        </ul>
                        <h3>Sertifikater</h3>
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
                                        <li>utloeper: {sertifikat.utloeper}</li>
                                    </ul>
                                    <br />
                                </li>
                            ))}
                        </ul>
                        <h3>Språk</h3>
                        <ul>
                            {kandidat.spraakferdigheter.map((språkferdighet) => (
                                <li key={språkferdighet.iso3kode}>
                                    {språkferdighet.spraaknavn} - muntlig: {språkferdighet.muntlig},
                                    skriftlig: {språkferdighet.skriftlig}
                                </li>
                            ))}
                        </ul>
                        <h3>Førerkort</h3>
                        <ul>
                            {kandidat.foererkort.klasse.map((førerkort) => (
                                <li key={førerkort.klasse}>
                                    <ul>
                                        <li>klasse: {førerkort.klasse}</li>
                                        <li>beskrivelse: {førerkort.klasse_beskrivelse}</li>
                                        <li>fra tidspunkt: {førerkort.fra_tidspunkt}</li>
                                        <li>utløper: {førerkort.utloeper}</li>
                                    </ul>
                                    <br />
                                </li>
                            ))}
                        </ul>
                        <h3>Disponerer bil</h3>
                        <ul>{kandidat.disponererBil === true ? 'Ja' : 'Nei'}</ul>
                        <h3>Kvalifiseringsgruppe</h3>
                        <ul>{kandidat.oppfolgingsinformasjon.kvalifiseringsgruppe}</ul>
                    </div>
                </>
            )}
        </div>
    );
};

export default KandidatmatchPrototype;
