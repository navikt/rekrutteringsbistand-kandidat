import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Knapp } from 'nav-frontend-knapper';
import { Column, Row } from 'nav-frontend-grid';
import { Element, Normaltekst, Systemtittel, Undertittel } from 'nav-frontend-typografi';
import Tidsperiode from '../../common/Tidsperiode';
import sortByDato from '../../common/SortByDato';
import { cvPropTypes } from '../../PropTypes';
import './Modal.less';

function ShowCv({ cv, onTaKontaktClick, visTaKontaktKandidat }) {
    const utdanning = cv.utdanning.slice();
    const yrkeserfaring = cv.yrkeserfaring.slice();
    const kurs = cv.kurs.slice();
    const sertifikat = cv.sertifikat.slice();
    const sprak = cv.sprak.slice();
    return (
        <div className="panel">
            {/* Feature toggle for å skjule knappen "Ta kontakt med kandidat" */}
            {visTaKontaktKandidat && (
                <Row>
                    <Column xs="12" md="6">
                        <Knapp
                            type="hoved"
                            onClick={onTaKontaktClick}
                        >
                            Ta kontakt med kandidat
                        </Knapp>
                    </Column>
                </Row>
            )}
            <Row>
                <Column xs="12">
                    <div className="text-center">
                        <Systemtittel className="modal--systemtittel">
                            CV
                        </Systemtittel>
                        <Normaltekst>
                            {cv.fornavn} {cv.etternavn}
                        </Normaltekst>
                        {cv.adresselinje1 !== '' && (
                            <Normaltekst>
                                {cv.adresselinje1}
                                {cv.adresselinje1 !== '' &&
                                (cv.postnummer !== '' || cv.poststed !== '') ?
                                    (', ') : null}
                                {cv.postnummer} {cv.poststed}
                            </Normaltekst>
                        )}
                        {cv.epostadresse !== '' && (
                            <Normaltekst>
                                E-post: {cv.epostadresse}
                            </Normaltekst>
                        )}
                        {cv.fodselsdato !== '' && (
                            <Normaltekst>
                                Fødselsdato: {cv.fodselsdato.substring(0, 10)}
                            </Normaltekst>
                        )}
                    </div>
                </Column>
            </Row>
            {utdanning && utdanning.length !== 0 && (
                <Row className="blokk-s">
                    <Column xs="12">
                        <Undertittel>Utdanning</Undertittel>
                        {sortByDato(utdanning).map((u) => (
                            <Row className="blokk-xs" key={`${u.fraDato}-${u.alternativGrad}`}>
                                <Column xs="4">
                                    <Normaltekst>
                                        <Tidsperiode
                                            fradato={u.fraDato}
                                            tildato={u.tilDato}
                                        />
                                    </Normaltekst>
                                </Column>
                                <Column xs="8">
                                    <Element>{u.nusKodeGrad}</Element>
                                    <Normaltekst>
                                        {u.utdannelsessted}
                                    </Normaltekst>
                                    <Normaltekst><i>{u.alternativGrad}</i></Normaltekst>
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
                            <Row className="blokk-xs" key={`${a.fraDato}-${a.alternativStillingstittel}`}>
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
                                    <Normaltekst>
                                        {a.arbeidsgiver}
                                    </Normaltekst>
                                    <Normaltekst><i>{a.alternativStillingstittel}</i></Normaltekst>
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
                            <Row className="blokk-xs" key={`${k.fraDato}-${k.arrangor}`}>
                                <Column xs="4">
                                    <Normaltekst>
                                        <Tidsperiode
                                            fradato={k.fraDato}
                                            tildato={k.tilDato}
                                        />
                                    </Normaltekst>
                                </Column>
                                <Column xs="8">
                                    <Element>{k.tittel}</Element>
                                    <Normaltekst>{k.arrangor}</Normaltekst>
                                </Column>
                            </Row>
                        ))}
                    </Column>
                </Row>
            )}
            {sertifikat && sertifikat.length !== 0 && (
                <Row className="blokk-s">
                    <Column xs="12">
                        <Undertittel>Sertifikater</Undertittel>
                        {sortByDato(sertifikat).map((s) => (
                            <Row className="blokk-xs" key={`${s.fraDato}-${s.alternativtNavn}`}>
                                <Column xs="4">
                                    <Normaltekst>
                                        <Tidsperiode
                                            fradato={s.fraDato}
                                            tildato={s.tilDato}
                                        />
                                    </Normaltekst>
                                </Column>
                                <Column xs="8">
                                    <Element>{s.sertifikatKodeNavn}</Element>
                                    <Normaltekst>{s.utsteder}</Normaltekst>
                                    <Normaltekst><i>{s.alternativtNavn}</i></Normaltekst>
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
                            <Row className="blokk-xs" key={`${s.fraDato}-${s.alternativTekst}`}>
                                <Column xs="8">
                                    <Element>{s.sprakKodeTekst}</Element>
                                    <Normaltekst>{s.beskrivelse}</Normaltekst>
                                    <Normaltekst><i>{s.alternativTekst}</i></Normaltekst>
                                </Column>
                            </Row>
                        ))}
                    </Column>
                </Row>
            )}
            {/* Feature toggle for å skjule knappen "Ta kontakt med kandidat" */}
            {visTaKontaktKandidat && (
                <Row>
                    <Column xs="12" md="6">
                        <Knapp
                            type="hoved"
                            onClick={onTaKontaktClick}
                        >
                            Ta kontakt med kandidat
                        </Knapp>
                    </Column>
                </Row>
            )}
        </div>
    );
}

ShowCv.defaultProps = {
    visTaKontaktKandidat: false
};

ShowCv.propTypes = {
    cv: cvPropTypes.isRequired,
    onTaKontaktClick: PropTypes.func.isRequired,
    visTaKontaktKandidat: PropTypes.bool
};

const mapStateToProps = (state) => ({
    visTaKontaktKandidat: state.search.featureToggles['vis-ta-kontakt-kandidat']
});

export default connect(mapStateToProps)(ShowCv);
