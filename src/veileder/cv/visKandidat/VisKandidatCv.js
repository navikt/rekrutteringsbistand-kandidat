import React from 'react';
import PropTypes from 'prop-types';
import { Column, Row } from 'nav-frontend-grid';
import { Element, Normaltekst, Undertittel, Undertekst } from 'nav-frontend-typografi';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import cvPropTypes from '../../../felles/PropTypes';
import sortByDato from '../../../felles/common/SortByDato';
import Tidsperiode from '../../../felles/common/Tidsperiode';
import './VisKandidat.less';

const VisCvBeskrivelse = ({ beskrivelse }) => {
    window.scrollTo(0, 0);

    if (beskrivelse.includes('¿')) {
        const punktliste = beskrivelse.split('¿');
        if (!punktliste[0]) {
            punktliste.shift();
        }
        return (
            <ul className="nokkelkvalifikasjoner">
                {punktliste.map(punkt => (
                    <li key={punkt.toString()}>{punkt}</li>
                ))}
            </ul>
        );
    }
    return <Normaltekst>{beskrivelse}</Normaltekst>;
};

const fjernDuplikater = forerkortListe => {
    const forerkortAlleredeILista = new Set();
    return forerkortListe.filter(forerkort => {
        const forerkortetErIkkeAlleredeLagtTil = !forerkortAlleredeILista.has(
            forerkort.sertifikatKodeNavn
        );
        forerkortAlleredeILista.add(forerkort.sertifikatKodeNavn);
        return forerkortetErIkkeAlleredeLagtTil;
    });
};

const kursOmfang = omfang => {
    if (omfang.enhet === 'TIME') return `${omfang.verdi} ${omfang.verdi > 1 ? 'timer' : 'time'}`;
    else if (omfang.enhet === 'DAG') return `${omfang.verdi} ${omfang.verdi > 1 ? 'dager' : 'dag'}`;
    else if (omfang.enhet === 'UKE') return `${omfang.verdi} ${omfang.verdi > 1 ? 'uker' : 'uke'}`;
    else if (omfang.enhet === 'MND')
        return `${omfang.verdi} ${omfang.verdi > 1 ? 'måneder' : 'måned'}`;
    return '';
};

const SprakLabels = {
    IKKE_OPPGITT: 'Ikke oppgitt',
    NYBEGYNNER: 'Nybegynner',
    GODT: 'Godt',
    VELDIG_GODT: 'Veldig godt',
    FOERSTESPRAAK: 'Førstespråk (morsmål)',
};

const VisKandidatCv = ({ cv }) => (
    <div className="panel--cv">
        <Ekspanderbartpanel
            className="ekspanderbartPanel--green"
            id="ekspanderbartpanel-cv"
            tittel="CV"
            tittelProps="systemtittel"
            apen
        >
            {cv.beskrivelse && (
                <Row className="panel--cv__row">
                    <Column xs="12">
                        <Undertittel className="cv__overskrift">Sammendrag</Undertittel>
                        <VisCvBeskrivelse beskrivelse={cv.beskrivelse} />
                    </Column>
                </Row>
            )}
            {cv.utdanning && cv.utdanning.length !== 0 && (
                <Row className="panel--cv__row">
                    <Column xs="12" sm="5">
                        <Undertittel className="cv__overskrift">Utdanning</Undertittel>
                    </Column>
                    <Column xs="12" sm="7">
                        {sortByDato(cv.utdanning).map((u, i) => (
                            <Row className="row--kategori" key={JSON.stringify({ ...u, index: i })}>
                                <Undertekst className="cv--tidsperiode">
                                    <Tidsperiode fradato={u.fraDato} tildato={u.tilDato} />
                                </Undertekst>
                                {u.utdannelsessted && (
                                    <Normaltekst>{u.utdannelsessted}</Normaltekst>
                                )}
                                <Element>
                                    {u.alternativtUtdanningsnavn
                                        ? u.alternativtUtdanningsnavn
                                        : u.nusKodeUtdanningsnavn}
                                </Element>
                                {u.beskrivelse && <Normaltekst>{u.beskrivelse}</Normaltekst>}
                            </Row>
                        ))}
                    </Column>
                </Row>
            )}
            {cv.fagdokumentasjon && cv.fagdokumentasjon.length !== 0 && (
                <Row className="panel--cv__row">
                    <Column xs="12" sm="5">
                        <Undertittel className="cv__overskrift">
                            Fagbrev/svennebrev, mesterbrev og autorisasjon
                        </Undertittel>
                    </Column>
                    <Column xs="12" sm="7">
                        {cv.fagdokumentasjon.map((f, i) => (
                            <Row className="row--kategori" key={JSON.stringify({ ...f, index: i })}>
                                {(f.tittel || f.type) && (
                                    <Element>{f.tittel ? f.tittel : f.type}</Element>
                                )}
                            </Row>
                        ))}
                    </Column>
                </Row>
            )}
            {cv.yrkeserfaring && cv.yrkeserfaring.length !== 0 && (
                <Row className="panel--cv__row">
                    <Column xs="12" sm="5">
                        <Undertittel className="cv__overskrift">Arbeidserfaring</Undertittel>
                    </Column>
                    <Column xs="12" sm="7">
                        {sortByDato(cv.yrkeserfaring).map((a, i) => (
                            <Row className="row--kategori" key={JSON.stringify({ ...a, index: i })}>
                                <Undertekst className="cv--tidsperiode">
                                    <Tidsperiode
                                        fradato={a.fraDato}
                                        tildato={a.tilDato}
                                        navarende={!a.tilDato}
                                    />
                                </Undertekst>
                                {a.arbeidsgiver && !a.sted && (
                                    <Normaltekst>{a.arbeidsgiver}</Normaltekst>
                                )}
                                {a.arbeidsgiver && a.sted && (
                                    <Normaltekst>{`${a.arbeidsgiver} | ${a.sted}`}</Normaltekst>
                                )}
                                {!a.arbeidsgiver && a.sted && <Normaltekst>{a.sted}</Normaltekst>}
                                {
                                    <Element>
                                        {a.alternativStillingstittel
                                            ? a.alternativStillingstittel
                                            : a.styrkKodeStillingstittel}
                                    </Element>
                                }
                                {a.beskrivelse && <Normaltekst>{a.beskrivelse}</Normaltekst>}
                            </Row>
                        ))}
                    </Column>
                </Row>
            )}
            {cv.annenErfaring && cv.annenErfaring.length !== 0 && (
                <Row className="panel--cv__row">
                    <Column xs="12" sm="5">
                        <Undertittel className="cv__overskrift">Annen erfaring</Undertittel>
                    </Column>
                    <Column xs="12" sm="7">
                        {sortByDato(cv.annenErfaring).map((a, i) => (
                            <Row className="row--kategori" key={JSON.stringify({ ...a, index: i })}>
                                <Undertekst className="cv--tidsperiode">
                                    <Tidsperiode
                                        fradato={a.fraDato}
                                        tildato={a.tilDato}
                                        navarende={!a.tilDato}
                                    />
                                </Undertekst>
                                {a.rolle && <Element>{a.rolle}</Element>}
                                {a.beskrivelse && <Normaltekst>{a.beskrivelse}</Normaltekst>}
                            </Row>
                        ))}
                    </Column>
                </Row>
            )}
            {cv.forerkort && cv.forerkort.length !== 0 && (
                <Row className="panel--cv__row">
                    <Column xs="12" sm="5">
                        <Undertittel className="cv__overskrift">Førerkort</Undertittel>
                    </Column>
                    <Column xs="12" sm="7">
                        {fjernDuplikater(sortByDato(cv.forerkort)).map((s, i) => (
                            <Row className="row--kategori" key={JSON.stringify({ ...s, index: i })}>
                                <Undertekst className="cv--tidsperiode">
                                    <Tidsperiode fradato={s.fraDato} tildato={s.tilDato} />
                                </Undertekst>
                                <Normaltekst>
                                    {s.alternativtNavn ? s.alternativtNavn : s.sertifikatKodeNavn}
                                </Normaltekst>
                            </Row>
                        ))}
                    </Column>
                </Row>
            )}
            {cv.kurs && cv.kurs.length !== 0 && (
                <Row className="panel--cv__row">
                    <Column xs="12" sm="5">
                        <Undertittel className="cv__overskrift">Kurs</Undertittel>
                    </Column>
                    <Column xs="12" sm="7">
                        {sortByDato(cv.kurs).map((k, i) => (
                            <Row className="row--kategori" key={JSON.stringify({ ...k, index: i })}>
                                <Undertekst className="cv--tidsperiode">
                                    <Tidsperiode fradato={k.fraDato} tildato={k.tilDato} />
                                </Undertekst>
                                {k.arrangor && <Normaltekst>{k.arrangor}</Normaltekst>}
                                {k.tittel && <Element>{k.tittel}</Element>}
                                {kursOmfang(k.omfang) && (
                                    <Normaltekst>{`Varighet: ${kursOmfang(k.omfang)}`}</Normaltekst>
                                )}
                            </Row>
                        ))}
                    </Column>
                </Row>
            )}
            {cv.sertifikater && cv.sertifikater.length !== 0 && (
                <Row className="panel--cv__row">
                    <Column xs="12" sm="5">
                        <Undertittel className="cv__overskrift">
                            Sertifiseringer og sertifikater
                        </Undertittel>
                    </Column>
                    <Column xs="12" sm="7">
                        {sortByDato(cv.sertifikater).map((s, i) => (
                            <Row className="row--kategori" key={JSON.stringify({ ...s, index: i })}>
                                <Undertekst className="cv--tidsperiode">
                                    <Tidsperiode fradato={s.fraDato} />
                                </Undertekst>
                                {s.utsteder && <Normaltekst>{s.utsteder}</Normaltekst>}
                                <Element>
                                    {s.alternativtNavn ? s.alternativtNavn : s.sertifikatKodeNavn}
                                </Element>
                                {s.tilDato && (
                                    <Normaltekst>
                                        Utløper: <Tidsperiode tildato={s.tilDato} />
                                    </Normaltekst>
                                )}
                            </Row>
                        ))}
                    </Column>
                </Row>
            )}
            {cv.sprakferdigheter && cv.sprakferdigheter.length !== 0 && (
                <Row className="panel--cv__row">
                    <Column xs="12" sm="5">
                        <Undertittel className="cv__overskrift">Språk</Undertittel>
                    </Column>
                    <Column xs="12" sm="7">
                        {cv.sprakferdigheter.map(s => (
                            <Row className="row--kategori" key={JSON.stringify(s)}>
                                <Element>{s.sprak}</Element>
                                {s.ferdighetSkriftlig && (
                                    <Normaltekst>
                                        Skriftlig: {SprakLabels[s.ferdighetSkriftlig]}
                                    </Normaltekst>
                                )}
                                {s.ferdighetMuntlig && (
                                    <Normaltekst>
                                        Muntlig: {SprakLabels[s.ferdighetMuntlig]}
                                    </Normaltekst>
                                )}
                            </Row>
                        ))}
                    </Column>
                </Row>
            )}
        </Ekspanderbartpanel>
    </div>
);

VisKandidatCv.propTypes = {
    cv: cvPropTypes.isRequired,
};

VisCvBeskrivelse.propTypes = {
    beskrivelse: PropTypes.string.isRequired,
};

export default VisKandidatCv;
