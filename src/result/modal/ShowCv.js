import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Column, Row } from 'nav-frontend-grid';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { Element, Normaltekst, Undertittel, Sidetittel } from 'nav-frontend-typografi';
import Tidsperiode from '../../common/Tidsperiode';
import sortByDato from '../../common/SortByDato';
import { cvPropTypes } from '../../PropTypes';
import './Modal.less';
import { formatISOString } from '../../common/dateUtils';

const ShowCv = ({ cv, isFetchingCv }) => {
    const utdanning = cv.utdanning.slice();
    const yrkeserfaring = cv.yrkeserfaring.slice();
    const kurs = cv.kurs.slice();
    const sertifikater = cv.sertifikater.slice();
    const sprak = cv.sprak.slice();

    if (isFetchingCv) {
        return (
            <div className="text-center">
                <NavFrontendSpinner type="L" />
            </div>
        );
    }
    return (
        <div className="panel">
            <Row className="blokk-s personalia--modal">
                <Column xs="12">
                    <Sidetittel className="navn--modal">
                        {cv.fornavn} {cv.etternavn}
                    </Sidetittel>
                    {cv.fodselsdato && (
                        <Normaltekst><strong>Fødselsdato:</strong> {formatISOString(cv.fodselsdato, 'D. MMMM YYYY')}</Normaltekst>
                    )}
                    {cv.adresse && cv.adresse.adrlinje1 && (
                        <Normaltekst>
                            <strong>Adresse:</strong> {cv.adresse.adrlinje1}
                            {(cv.adresse.postnr || cv.adresse.poststednavn) ?
                                (', ') : null}
                            {cv.adresse.postnr} {cv.adresse.poststednavn}
                        </Normaltekst>
                    )}
                    {(cv.epost || cv.telefon) && (
                        <div className="kontakt--modal">
                            {cv.epost && (
                                <Normaltekst>
                                    <i className="mail--icon" />
                                    <strong>E-post:</strong>
                                    <a href={`mailto:${cv.epost}`} className="lenke mail--text">{cv.epost}</a>
                                </Normaltekst>
                            )}
                            {cv.telefon && (
                                <Normaltekst>
                                    <i className="telefon--icon" />
                                    <strong>Telefon:</strong> {/* TODO: Telefon er ikke med
                                    fra backend per nå, oppdatere denne når det er med */}
                                    {/* <a href={`tel:${cv.telefon}`} className="lenke telefon--text">{cv.telefon}</a> */}
                                </Normaltekst>
                            )}
                        </div>
                    )}
                </Column>
            </Row>
            {cv.beskrivelse && (
                <Row className="blokk-s">
                    <Column xs="12">
                        <Undertittel>Nøkkelkvalifikasjoner</Undertittel>
                        <Normaltekst>{cv.beskrivelse}</Normaltekst>
                    </Column>
                </Row>
            )}
            {utdanning && utdanning.length !== 0 && (
                <Row className="blokk-s">
                    <Column xs="12">
                        <Undertittel>Utdanning</Undertittel>
                        {sortByDato(utdanning).map((u) => (
                            <Row className="blokk-xs" key={JSON.stringify(u)}>
                                <Column xs="4">
                                    <Normaltekst>
                                        <Tidsperiode
                                            fradato={u.fraDato}
                                            tildato={u.tilDato}
                                        />
                                    </Normaltekst>
                                </Column>
                                <Column xs="8">
                                    <Element>{u.nusKodeUtdanningsnavn}</Element>
                                    {u.utdannelsessted && (
                                        <Normaltekst>{u.utdannelsessted}</Normaltekst>
                                    )}
                                    {u.alternativtUtdanningsnavn && (
                                        <Normaltekst><i>{u.alternativtUtdanningsnavn}</i></Normaltekst>
                                    )}
                                </Column>
                            </Row>
                        ))}
                    </Column>
                </Row>
            )}
            {yrkeserfaring && yrkeserfaring.length !== 0 && (
                <Row className="blokk-s">
                    <Column xs="12">
                        <Undertittel>Arbeidserfaring</Undertittel>
                        {sortByDato(yrkeserfaring).map((a) => (
                            <Row className="blokk-xs" key={JSON.stringify(a)}>
                                <Column xs="4">
                                    <Normaltekst>
                                        <Tidsperiode
                                            fradato={a.fraDato}
                                            tildato={a.tilDato}
                                        />
                                    </Normaltekst>
                                </Column>
                                <Column xs="8">
                                    <Element>{a.styrkKodeStillingstittel}</Element>
                                    {a.arbeidsgiver && (
                                        <Normaltekst>{a.arbeidsgiver}</Normaltekst>
                                    )}
                                    {a.alternativStillingstittel && (
                                        <Normaltekst><i>{a.alternativStillingstittel}</i></Normaltekst>
                                    )}
                                </Column>
                            </Row>
                        ))}
                    </Column>
                </Row>
            )}
            {kurs && kurs.length !== 0 && (
                <Row className="blokk-s">
                    <Column xs="12">
                        <Undertittel>Kurs og sertifiseringer</Undertittel>
                        {sortByDato(kurs).map((k) => (
                            <Row className="blokk-xs" key={JSON.stringify(k)}>
                                <Column xs="4">
                                    <Normaltekst>
                                        <Tidsperiode
                                            fradato={k.fraDato}
                                            tildato={k.tilDato}
                                        />
                                    </Normaltekst>
                                </Column>
                                <Column xs="8">
                                    {k.tittel && (
                                        <Element>{k.tittel}</Element>
                                    )}
                                    {k.arrangor && (
                                        <Normaltekst>{k.arrangor}</Normaltekst>
                                    )}
                                </Column>
                            </Row>
                        ))}
                    </Column>
                </Row>
            )}
            {sertifikater && sertifikater.length !== 0 && (
                <Row className="blokk-s">
                    <Column xs="12">
                        <Undertittel>Sertifikater</Undertittel>
                        {sortByDato(sertifikater).map((s) => (
                            <Row className="blokk-xs" key={JSON.stringify(s)}>
                                <Column xs="4">
                                    <Normaltekst>
                                        <Tidsperiode
                                            fradato={s.fraDato}
                                            tildato={s.tilDato}
                                        />
                                    </Normaltekst>
                                </Column>
                                <Column xs="8">
                                    {s.sertifikatKodeNavn && (
                                        <Element>{s.sertifikatKodeNavn}</Element>
                                    )}
                                    {s.utsteder && (
                                        <Normaltekst>{s.utsteder}</Normaltekst>
                                    )}
                                    {s.alternativtNavn && (
                                        <Normaltekst><i>{s.alternativtNavn}</i></Normaltekst>
                                    )}
                                </Column>
                            </Row>
                        ))}
                    </Column>
                </Row>
            )}
            {sprak && sprak.length !== 0 && (
                <Row className="blokk-s">
                    <Column xs="12">
                        <Undertittel>Språkkunnskaper</Undertittel>
                        {sprak.map((s) => (
                            <Row className="blokk-xs" key={JSON.stringify(s)}>
                                <Column xs="8">
                                    {s.kompetanseKodeTekst && (
                                        <Element>{s.kompetanseKodeTekst}</Element>
                                    )}
                                    {s.beskrivelse && (
                                        <Normaltekst>{s.beskrivelse}</Normaltekst>
                                    )}
                                    {s.alternativTekst && (
                                        <Normaltekst><i>{s.alternativTekst}</i></Normaltekst>
                                    )}
                                </Column>
                            </Row>
                        ))}
                    </Column>
                </Row>
            )}
        </div>
    );
};

ShowCv.propTypes = {
    cv: cvPropTypes.isRequired,
    isFetchingCv: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
    isFetchingCv: state.cvReducer.isFetchingCv,
    cv: state.cvReducer.cv
});

export default connect(mapStateToProps)(ShowCv);
