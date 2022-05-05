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
                        <h4>Stillinger</h4>
                        <ul>
                            {kandidat.stillinger_jobbprofil.map((stillingØnske) => (
                                <li key={stillingØnske + kandidat.fodselsnummer}>
                                    {stillingØnske}
                                </li>
                            ))}
                        </ul>
                        <h4>Arbeidssted</h4>
                        <ul>
                            {kandidat.geografi_jobbprofil.map((geografiJobbProfil) => (
                                <li key={geografiJobbProfil.kode + kandidat.fodselsnummer}>
                                    {geografiJobbProfil.sted}
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
                        <h3>Arbeidserfaring ({kandidat.score_arbeidserfaring})</h3>
                        <ul>
                            {kandidat.arbeidserfaring.map((arbeidserfaring, index) => (
                                <li key={arbeidserfaring.janzzKonseptid}>
                                    {arbeidserfaring.stillingstittel} (
                                    {kandidat.match_forklaring.arbeidserfaring_forklaring[index]})
                                </li>
                            ))}
                        </ul>
                        <h3>Utdanning ({kandidat.score_utdannelse})</h3>
                        <ul>
                            {kandidat.utdannelse.map((utdannelse, index) => (
                                <li key={utdannelse.beskrivelse}>
                                    {utdannelse.laerested} (
                                    {kandidat.match_forklaring.utdannelse_forklaring[index]})
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
                                            sertifikatnavn_fritekst{' '}
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
                        <ul>{kandidat.disponererBil}</ul>
                        <h3>Kvalifiseringsgruppe</h3>
                        <ul>{kandidat.oppfolgingsinformasjon.kvalifiseringsgruppe}</ul>
                    </div>
                </>
            )}
        </div>
    );
};

export default KandidatmatchPrototype;
