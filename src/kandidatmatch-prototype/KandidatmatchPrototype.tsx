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
                    </div>
                    <div>
                        <h3>Sammendrag({kandidat.sammendrag.score})</h3>
                        <ul>
                            <li>{kandidat.sammendrag.sammendrag_tekst}</li>
                        </ul>
                        <h3>Jobbønsker ({kandidat.score_total})</h3>
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
                        <h3>Annen erfaring</h3>
                        <ul>
                            {kandidat.annenErfaring.map((erfaring) => (
                                <li>
                                    <ul>
                                        <li>Beskrivelse: {erfaring.beskrivelse}</li>
                                        <li>Rolle: {erfaring.rolle}</li>
                                        <li>
                                            Fra_tidspunkt:{' '}
                                            {new Date(erfaring.fra_tidspunkt).toDateString()}
                                        </li>
                                        <li>
                                            Til_tidspunkt:{' '}
                                            {new Date(erfaring.til_tidspunkt).toDateString()}
                                        </li>
                                    </ul>
                                </li>
                            ))}
                        </ul>
                        <h3>Utdanning ({kandidat.utdannelse.score})</h3>
                        <ul>
                            {kandidat.utdannelse.utdannelser.map((utdannelse, index) => (
                                <li key={utdannelse.beskrivelse}>
                                    {utdannelse.laerested} ({utdannelse.score})
                                    <ul>
                                        <li>Utdanningsretning: {utdannelse.utdanningsretning}</li>
                                        <li>Autorisasjon: {utdannelse.autorisasjon}</li>
                                        <li>NuskodeGrad: {utdannelse.nuskodeGrad}</li>
                                        <li>
                                            UtdannelseYrkestatus: {utdannelse.utdannelseYrkestatus}
                                        </li>
                                        <li>FraTidspunkt: {utdannelse.fraTidspunkt}</li>
                                        <li>TilTidspunkt: {utdannelse.tilTidspunkt}</li>
                                    </ul>
                                </li>
                            ))}
                        </ul>
                        <h3>Fagdokumentasjon</h3>
                        <ul>
                            {kandidat.fagdokumentasjon.map((dok) => (
                                <li>
                                    <ul>
                                        <li>type: {dok.type}</li>
                                        <li>tittel: {dok.tittel}</li>
                                        <li>beskrivelse: {dok.beskrivelse}</li>
                                    </ul>
                                </li>
                            ))}
                        </ul>
                        <h3>Godkjennionger</h3>
                        <ul>
                            {kandidat.godkjenninger.map((godkjenning) => (
                                <li>
                                    <ul>
                                        <li>tittel: {godkjenning.tittel} </li>
                                        <li>konsept_id: {godkjenning.konsept_id} </li>
                                        <li>utsteder: {godkjenning.utsteder} </li>
                                        <li>gjennomfoert: {godkjenning.gjennomfoert} </li>
                                        <li>utloeper: {godkjenning.utloeper} </li>
                                    </ul>
                                </li>
                            ))}
                        </ul>
                        <h3>Kurs</h3>
                        <ul>
                            {kandidat.kurs.map((kurs, index) => (
                                <li key={kurs.tittel}>
                                    {kurs.tittel}
                                    <ul>
                                        <li>utsteder: {kurs.utsteder}</li>
                                        <li>varighet: {kurs.varighet}</li>
                                        <li>varighet_enhet: {kurs.varighet_enhet}</li>
                                        <li>
                                            tidspunkt: {new Date(kurs.tidspunkt).toDateString()}
                                        </li>
                                    </ul>
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
                        <h3>Oppfølgingsinformasjon</h3>
                        <ul>
                            <li>fodselsnummer: {kandidat.oppfolgingsinformasjon.fodselsnummer}</li>
                            <li>
                                formidlingsgruppe:{' '}
                                {kandidat.oppfolgingsinformasjon.formidlingsgruppe}
                            </li>
                            <li>iservFraDato: {kandidat.oppfolgingsinformasjon.iservFraDato}</li>
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
                                {kandidat.oppfolgingsinformasjon.harOppfolgingssak}
                            </li>
                            <li>sperretAnsatt: {kandidat.oppfolgingsinformasjon.sperretAnsatt}</li>
                            <li>erDoed: {kandidat.oppfolgingsinformasjon.erDoed}</li>
                            <li>doedFraDato: {kandidat.oppfolgingsinformasjon.doedFraDato}</li>
                            <li>
                                sistEndretDato: {kandidat.oppfolgingsinformasjon.sistEndretDato}
                            </li>
                        </ul>
                        <h3>Tilretteleggingbehov</h3>
                        <ul>
                            {kandidat.tilretteleggingsbehov.map((behov) => (
                                <li key={behov}>{behov}</li>
                            ))}
                        </ul>
                        <p>OppstartKode: {kandidat.oppstartKode}</p>
                        <p>synligForArbeidsgiver: {kandidat.synligForArbeidsgiver} </p>
                        <p>synligForVeileder: {kandidat.synligForVeileder} </p>
                        <p>arenaKandidatnr: {kandidat.arenaKandidatnr} </p>
                        <p>jobbprofilId: {kandidat.jobbprofilId} </p>
                    </div>
                </>
            )}
        </div>
    );
};

export default KandidatmatchPrototype;
