import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Knapp } from 'nav-frontend-knapper';
import { Column, Row } from 'nav-frontend-grid';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { Element, Normaltekst, Undertittel, Sidetittel } from 'nav-frontend-typografi';
import Tidsperiode from '../../common/Tidsperiode';
import sortByDato from '../../common/SortByDato';
import { cvPropTypes } from '../../PropTypes';
import './Modal.less';
import { formatISOString } from '../../common/dateUtils';
import { FETCH_CV } from '../../sok/cv/cvReducer';

class ShowCv extends React.Component {
    componentWillMount() {
        this.props.hentCvForKandidat(this.props.arenaKandidatnr);
    }

    render() {
        const utdanning = this.props.cv.utdanning.slice();
        const yrkeserfaring = this.props.cv.yrkeserfaring.slice();
        const kurs = this.props.cv.kurs.slice();
        const sertifikat = this.props.cv.sertifikat.slice();
        const sprak = this.props.cv.sprak.slice();

        if (this.props.isFetchingCv) {
            return (
                <div className="text-center">
                    <NavFrontendSpinner type="L" />
                </div>
            );
        }
        return (
            <div className="panel">
                {/* Feature toggle for å skjule knappen "Ta kontakt med kandidat" */}
                {this.props.visTaKontaktKandidat && (
                    <Row>
                        <Column xs="12" md="6">
                            <Knapp
                                type="hoved"
                                onClick={this.props.onTaKontaktClick}
                            >
                                Ta kontakt med kandidat
                            </Knapp>
                        </Column>
                    </Row>
                )}
                <Row className="blokk-s personalia--modal">
                    <Column xs="12">
                        <Sidetittel className="navn--modal">
                            {this.props.cv.fornavn} {this.props.cv.etternavn}
                        </Sidetittel>
                        {this.props.cv.fodselsdato && (
                            <Normaltekst><strong>Fødselsdato:</strong> {formatISOString(this.props.cv.fodselsdato, 'D. MMMM YYYY')}</Normaltekst>
                        )}
                        {this.props.cv.adresselinje1 && (
                            <Normaltekst>
                                <strong>Adresse:</strong> {this.props.cv.adresselinje1}
                                {(this.props.cv.postnummer || this.props.cv.poststed) ?
                                    (', ') : null}
                                {this.props.cv.postnummer} {this.props.cv.poststed}
                            </Normaltekst>
                        )}
                        {this.props.cv.epostadresse && (
                            <div className="kontakt--modal">
                                <Normaltekst>
                                    <i className="mail--icon" />
                                    <strong>E-post:</strong> {this.props.cv.epostadresse}
                                </Normaltekst>
                            </div>
                        )}
                    </Column>
                </Row>
                {this.props.cv.beskrivelse && (
                    <Row className="blokk-s">
                        <Column xs="12">
                            <Undertittel>Nøkkelkvalifikasjoner</Undertittel>
                            <Normaltekst>{this.props.cv.beskrivelse}</Normaltekst>
                        </Column>
                    </Row>
                )}
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
                {this.props.visTaKontaktKandidat && (
                    <Row>
                        <Column xs="12" md="6">
                            <Knapp
                                type="hoved"
                                onClick={this.props.onTaKontaktClick}
                            >
                                Ta kontakt med kandidat
                            </Knapp>
                        </Column>
                    </Row>
                )}
            </div>
        );
    }
}

ShowCv.defaultProps = {
    visTaKontaktKandidat: false
};

ShowCv.propTypes = {
    cv: cvPropTypes.isRequired,
    onTaKontaktClick: PropTypes.func.isRequired,
    arenaKandidatnr: PropTypes.string.isRequired,
    hentCvForKandidat: PropTypes.func.isRequired,
    visTaKontaktKandidat: PropTypes.bool,
    isFetchingCv: PropTypes.bool.isRequired
};

const mapDispatchToProps = (dispatch) => ({
    hentCvForKandidat: (arenaKandidatnr) => dispatch({ type: FETCH_CV, arenaKandidatnr })
});

const mapStateToProps = (state) => ({
    visTaKontaktKandidat: state.search.featureToggles['vis-ta-kontakt-kandidat'],
    cv: state.cv.cv,
    isFetchingCv: state.cv.isFetchingCv
});

export default connect(mapStateToProps, mapDispatchToProps)(ShowCv);
