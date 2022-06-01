import React, { FunctionComponent, ReactNode } from 'react';
import { Link, RouteChildrenProps } from 'react-router-dom';
import { Feilmelding } from 'nav-frontend-typografi';
import useKandidatmatch from '../useKandidatmatch';
import { ErfaringPrototype } from '../Kandidatmatch';
import { booleanTilTekst, tilProsent, tilProsentpoeng } from '../formatering';
import Personalia from './Personalia';
import { Back } from '@navikt/ds-icons';
import NavFrontendSpinner from 'nav-frontend-spinner';
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
            <Seksjon tittel="Sammendrag" match={kandidat.sammendrag.score}>
                <p>{kandidat.sammendrag.tekst}</p>
            </Seksjon>
            <Seksjon tittel="Jobbønsker">
                <h3>Jobber og yrker ({tilProsent(kandidat.stillinger_jobbprofil.score)})</h3>
                <ul>
                    {kandidat.stillinger_jobbprofil.erfaringer.map((stillingØnske, index) => (
                        <li key={stillingØnske.tekst}>
                            <h3>
                                {stillingØnske.tekst} ({tilProsent(stillingØnske.score)})
                            </h3>
                            <Matchmatrise erfaring={stillingØnske} />
                        </li>
                    ))}
                </ul>
                <h3>Hvor kan du jobbe?</h3>
                <ul>
                    {kandidat.geografi_jobbprofil.steder.map((geografiJobbProfil) => (
                        <li key={geografiJobbProfil.kode + kandidat.fodselsnummer}>
                            {geografiJobbProfil.sted} {geografiJobbProfil.kode}
                        </li>
                    ))}
                </ul>
                <h3>Vil du jobbe heltid eller deltid?</h3>
                <ul>
                    {kandidat.omfang_jobbprofil.map((omfang) => (
                        <li key={omfang + kandidat.fodselsnummer}>{omfang}</li>
                    ))}
                </ul>
                <h3>Når kan du jobbe?</h3>
                <ul>
                    {kandidat.arbeidstider_jobbprofil.map((arbeidstid) => (
                        <li key={arbeidstid + kandidat.fodselsnummer}>{arbeidstid}</li>
                    ))}
                </ul>
                <h3>Når kan du jobbe?</h3>
                <ul>
                    {kandidat.arbeidsdager_jobbprofil.map((arbeidsdag) => (
                        <li key={arbeidsdag + kandidat.fodselsnummer}>{arbeidsdag}</li>
                    ))}
                </ul>
                <h3>Når kan du jobbe?</h3>
                <ul>
                    {kandidat.arbeidstidsordninger_jobbprofil.map((arbeidstidsordning) => (
                        <li key={arbeidstidsordning + kandidat.fodselsnummer}>
                            {arbeidstidsordning}
                        </li>
                    ))}
                </ul>
                <h3>Hva slags ansettelse ønsker du?</h3>
                <ul>
                    {kandidat.ansettelsesformer_jobbprofil.map((ansettelsesform) => (
                        <li key={ansettelsesform + kandidat.fodselsnummer}>{ansettelsesform}</li>
                    ))}
                </ul>
            </Seksjon>
            <Seksjon tittel="Utdanninger" match={kandidat.utdannelse.score}>
                <ul>
                    {kandidat.utdannelse.erfaringer.map((utdannelse, index) => (
                        <li key={utdannelse.tekst}>
                            <h3>
                                {utdannelse.tekst} ({tilProsent(utdannelse.score)})
                            </h3>
                            <Matchmatrise erfaring={utdannelse} />
                        </li>
                    ))}
                </ul>
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
                <ul>
                    {kandidat.arbeidserfaring.erfaringer.map((arbeidserfaring, index) => (
                        <li key={arbeidserfaring.tekst}>
                            <ul>
                                <h3>
                                    {arbeidserfaring.tekst} ({tilProsent(arbeidserfaring.score)})
                                </h3>
                                <Matchmatrise erfaring={arbeidserfaring} />
                                <ForkortetMatchmatrise erfaring={arbeidserfaring} />
                            </ul>
                        </li>
                    ))}
                </ul>
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
                <ul>
                    {kandidat.kompetanser_jobbprofil.erfaringer.map((kompetanse, index) => (
                        <li key={kompetanse.tekst}>
                            <h3>
                                {kompetanse.tekst} ({tilProsent(kompetanse.score)})
                            </h3>
                            <Matchmatrise erfaring={kompetanse} />
                        </li>
                    ))}
                </ul>
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

const Matchmatrise = ({ erfaring }: { erfaring: ErfaringPrototype }) => {
    if (erfaring.ordScore.length === 0) {
        return <IngenData />;
    }

    const [, matchedeOrdFraKandidat] = erfaring.ordScore[0];
    const alleOrdFraKandidat = matchedeOrdFraKandidat.map(([, ord]) => ord);

    return (
        <div className="blokk-m">
            <h4>Hvor godt matcher hvert ord i stillingsannonsen med ord fra kandidaten?</h4>
            <table>
                <thead>
                    <tr>
                        <th>Ord fra stilling</th>
                        <th colSpan={alleOrdFraKandidat.length}>
                            Ord fra kandidaten og relasjon (%)
                        </th>
                    </tr>
                </thead>
                <thead>
                    <tr>
                        <th />
                        {alleOrdFraKandidat.map((ord) => (
                            <th key={`th-${ord}`}>{ord}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {erfaring.ordScore.map(([[, ordFraStilling], matchedeOrdFraKandidaten], i) => {
                        return (
                            <tr key={ordFraStilling}>
                                <td>{ordFraStilling}</td>
                                {matchedeOrdFraKandidaten.map(([, ord, score]) => (
                                    <td key={ord}>{tilProsentpoeng(score)}</td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

const ForkortetMatchmatrise = ({ erfaring }: { erfaring: ErfaringPrototype }) => {
    return (
        <div className="blokk-m">
            <h4>Hvilke ord hos kandidaten er mest relatert til ord fra stillingsannonsen?</h4>
            <table>
                <thead>
                    <tr>
                        <th>Ord fra stilling</th>
                        <th colSpan={2}>Relatert ord fra kandidaten</th>
                    </tr>
                </thead>
                <thead>
                    <tr>
                        <th />
                        <th>Mest relatert</th>
                        <th>Nest mest relatert</th>
                    </tr>
                </thead>
                <tbody>
                    {erfaring.ordScore.map((ordscore, k) => {
                        const [ordFraStilling, matchedeOrdFraKandidat] = ordscore;
                        const toBesteMatcherFraKandidat = matchedeOrdFraKandidat
                            .sort(([, , score1], [, , score2]) => score2 - score1)
                            .slice(0, 2);

                        return (
                            <tr key={k}>
                                <td>{ordFraStilling[1]}</td>
                                {toBesteMatcherFraKandidat.map(([, ord, score], index) => {
                                    return (
                                        <td key={index}>
                                            <span>{ord}</span>
                                            <span> ({tilProsent(score)})</span>
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

const IngenData = () => <p>Ikke oppgitt</p>;

export const Seksjon = ({
    tittel,
    match,
    className,
    children,
}: {
    tittel: string;
    match?: number;
    className?: string;
    children?: ReactNode;
}) => (
    <section className={`blokk-m${className === undefined ? '' : ' ' + className}`}>
        <h2>
            {tittel}
            {match ? <> ({tilProsent(match)})</> : ''}
        </h2>
        {children}
    </section>
);

export default Matchforklaring;
