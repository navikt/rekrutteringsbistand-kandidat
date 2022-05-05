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
                        <h3>Sertifikater</h3>
                        <h3>Språk</h3>

                        <h3>Disponerer bil</h3>
                        <h3>Kvalifiseringsgruppe</h3>
                    </div>
                </>
            )}
        </div>
    );
};

export default KandidatmatchPrototype;
