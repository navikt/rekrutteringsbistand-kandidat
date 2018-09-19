import { Column, Row } from 'nav-frontend-grid';
import { Element, Normaltekst, Undertittel, Undertekst } from 'nav-frontend-typografi';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import React from 'react';
import cvPropTypes from '../../PropTypes';
import sortByDato from '../../common/SortByDato';
import Tidsperiode from '../../common/Tidsperiode';
import './VisKandidat.less';

const VisKandidatCv = ({ cv }) => {
    const utdanning = cv.utdanning.slice();
    const yrkeserfaring = cv.yrkeserfaring.slice();
    const kurs = cv.kurs.slice();
    const sertifikater = cv.sertifikater.slice();
    const sprak = cv.sprak.slice();

    return (
        <div className="cv-panel">
            <Ekspanderbartpanel
                id="ekspanderbartpanel-cv"
                tittel="CV"
                tittelProps="systemtittel"
                apen
            >
                {cv.beskrivelse && (
                    <Row className="cv-panel-row">
                        <Column xs="12">
                            <Undertittel>Sammendrag</Undertittel>
                            <Normaltekst>{cv.beskrivelse}</Normaltekst>
                        </Column>
                    </Row>
                )}
                {utdanning && utdanning.length !== 0 && (
                    <Row className="cv-panel-row">
                        <Column xs="5">
                            <Undertittel>Utdanning</Undertittel>
                        </Column>
                        <Column xs="7">
                            {sortByDato(utdanning)
                                .map((u) => (
                                    <Row className="cv-panel-row-kategori" key={JSON.stringify(u)}>
                                        <Undertekst className="cv-panel-tidsperiode">
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
                {yrkeserfaring && yrkeserfaring.length !== 0 && (
                    <Row className="cv-panel-row">
                        <Column xs="5">
                            <Undertittel>Arbeidserfaring</Undertittel>
                        </Column>
                        <Column xs="7">
                            {sortByDato(yrkeserfaring)
                                .map((a) => (
                                    <Row className="cv-panel-row-kategori" key={JSON.stringify(a)}>
                                        <Undertekst className="cv-panel-tidsperiode">
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
                {kurs && kurs.length !== 0 && (
                    <Row className="cv-panel-row">
                        <Column xs="5">
                            <Undertittel>Kurs og sertifiseringer</Undertittel>
                        </Column>
                        <Column xs="7">
                            {sortByDato(kurs)
                                .map((k) => (
                                    <Row className="cv-panel-row-kategori" key={JSON.stringify(k)}>
                                        <Undertekst className="cv-panel-tidsperiode">
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
                {sertifikater && sertifikater.length !== 0 && (
                    <Row className="cv-panel-row">
                        <Column xs="5">
                            <Undertittel>Sertifikat</Undertittel>
                        </Column>
                        <Column xs="7">
                            {sortByDato(sertifikater)
                                .map((s) => (
                                    <Row className="cv-panel-row-kategori" key={JSON.stringify(s)}>
                                        <Undertekst className="cv-panel-tidsperiode">
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
                {sprak && sprak.length !== 0 && (
                    <Row className="cv-panel-row">
                        <Column xs="5">
                            <Undertittel>Språk</Undertittel>
                        </Column>
                        <Column xs="7">
                            {sprak.map((s) => (
                                <Row className="cv-panel-row-kategori" key={JSON.stringify(s)}>
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
};


VisKandidatCv.propTypes = {
    cv: cvPropTypes.isRequired
};

export default VisKandidatCv;

