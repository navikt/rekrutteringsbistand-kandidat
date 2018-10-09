import React from 'react';
import { Column, Row } from 'nav-frontend-grid';
import { Element, Normaltekst, Undertittel, Undertekst } from 'nav-frontend-typografi';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import cvPropTypes from '../../PropTypes';
import sortByDato from '../../common/SortByDato';
import Tidsperiode from '../../common/Tidsperiode';
import './VisKandidat.less';

const VisKandidatCv = ({ cv }) => (
    <div className="panel--cv">
        <Ekspanderbartpanel
            id="ekspanderbartpanel-cv"
            tittel="CV"
            tittelProps="systemtittel"
            apen
        >
            {cv.beskrivelse && (
                <Row className="panel--cv__row">
                    <Column xs="12">
                        <Undertittel className="cv__overskrift">Sammendrag</Undertittel>
                        <Normaltekst>{cv.beskrivelse}</Normaltekst>
                    </Column>
                </Row>
            )}
            {cv.utdanning && cv.utdanning.length !== 0 && (
                <Row className="panel--cv__row">
                    <Column xs="12" sm="5">
                        <Undertittel className="cv__overskrift">Utdanning</Undertittel>
                    </Column>
                    <Column xs="12" sm="7">
                        {sortByDato(cv.utdanning)
                            .map((u, i) => (
                                <Row className="row--kategori" key={JSON.stringify({ ...u, index: i })}>
                                    <Undertekst className="cv--tidsperiode">
                                        <Tidsperiode
                                            fradato={u.fraDato}
                                            tildato={u.tilDato}
                                        />
                                    </Undertekst>
                                    <Element>{u.nusKodeUtdanningsnavn}</Element>
                                    {u.utdannelsessted && (
                                        <Normaltekst>{u.utdannelsessted}</Normaltekst>
                                    )}
                                    {u.alternativtUtdanningsnavn && (
                                        <Normaltekst>{u.alternativtUtdanningsnavn}</Normaltekst>
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
                        {sortByDato(cv.yrkeserfaring)
                            .map((a, i) => (
                                <Row className="row--kategori" key={JSON.stringify({ ...a, index: i })}>
                                    <Undertekst className="cv--tidsperiode">
                                        <Tidsperiode
                                            fradato={a.fraDato}
                                            tildato={a.tilDato}
                                        />
                                    </Undertekst>
                                    <Element>{a.styrkKodeStillingstittel}</Element>
                                    {a.arbeidsgiver && (
                                        <Normaltekst>{a.arbeidsgiver}</Normaltekst>
                                    )}
                                    {a.alternativStillingstittel && (
                                        <Normaltekst>{a.alternativStillingstittel}</Normaltekst>
                                    )}
                                </Row>
                            ))}
                    </Column>
                </Row>
            )}
            {cv.kurs && cv.kurs.length !== 0 && (
                <Row className="panel--cv__row">
                    <Column xs="12" sm="5">
                        <Undertittel className="cv__overskrift">Kurs og sertifiseringer</Undertittel>
                    </Column>
                    <Column xs="12" sm="7">
                        {sortByDato(cv.kurs)
                            .map((k, i) => (
                                <Row className="row--kategori" key={JSON.stringify({ ...k, index: i })}>
                                    <Undertekst className="cv--tidsperiode">
                                        <Tidsperiode
                                            fradato={k.fraDato}
                                            tildato={k.tilDato}
                                        />
                                    </Undertekst>
                                    {k.tittel && (
                                        <Element>{k.tittel}</Element>
                                    )}
                                    {k.arrangor && (
                                        <Normaltekst>{k.arrangor}</Normaltekst>
                                    )}
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
                        {sortByDato(cv.forerkort)
                            .map((s, i) => (
                                <Row className="row--kategori" key={JSON.stringify({ ...s, index: i })}>
                                    <Undertekst className="cv--tidsperiode">
                                        <Tidsperiode
                                            fradato={s.fraDato}
                                            tildato={s.tilDato}
                                        />
                                    </Undertekst>
                                    {s.sertifikatKodeNavn && (
                                        <Element>{s.sertifikatKodeNavn}</Element>
                                    )}
                                    {s.utsteder && (
                                        <Normaltekst>{s.utsteder}</Normaltekst>
                                    )}
                                    {s.alternativtNavn && (
                                        <Normaltekst>{s.alternativtNavn}</Normaltekst>
                                    )}
                                </Row>
                            ))}
                    </Column>
                </Row>
            )}
            {cv.sertifikater && cv.sertifikater.length !== 0 && (
                <Row className="panel--cv__row">
                    <Column xs="12" sm="5">
                        <Undertittel className="cv__overskrift">Sertifikat</Undertittel>
                    </Column>
                    <Column xs="12" sm="7">
                        {sortByDato(cv.sertifikater)
                            .map((s, i) => (
                                <Row className="row--kategori" key={JSON.stringify({ ...s, index: i })}>
                                    <Undertekst className="cv--tidsperiode">
                                        <Tidsperiode
                                            fradato={s.fraDato}
                                            tildato={s.tilDato}
                                        />
                                    </Undertekst>
                                    {s.sertifikatKodeNavn && (
                                        <Element>{s.sertifikatKodeNavn}</Element>
                                    )}
                                    {s.utsteder && (
                                        <Normaltekst>{s.utsteder}</Normaltekst>
                                    )}
                                    {s.alternativtNavn && (
                                        <Normaltekst>{s.alternativtNavn}</Normaltekst>
                                    )}
                                </Row>
                            ))}
                    </Column>
                </Row>
            )}
            {cv.sprak && cv.sprak.length !== 0 && (
                <Row className="panel--cv__row">
                    <Column xs="12" sm="5">
                        <Undertittel className="cv__overskrift">Språk</Undertittel>
                    </Column>
                    <Column xs="12" sm="7">
                        {cv.sprak.map((s) => (
                            <Row className="row--kategori" key={JSON.stringify(s)}>
                                {s.kompetanseKodeTekst && (
                                    <Element>{s.kompetanseKodeTekst}</Element>
                                )}
                                {s.beskrivelse && (
                                    <Normaltekst>{s.beskrivelse}</Normaltekst>
                                )}
                                {s.alternativTekst && (
                                    <Normaltekst>{s.alternativTekst}</Normaltekst>
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
    cv: cvPropTypes.isRequired
};

export default VisKandidatCv;

