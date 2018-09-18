import React from 'react';
import connect from 'react-redux/es/connect/connect';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { Column, Row } from 'nav-frontend-grid';
import { Element, Normaltekst, Undertittel } from 'nav-frontend-typografi';
import PropTypes from 'prop-types';
import sortByDato from '../../common/SortByDato';
import Tidsperiode from '../../common/Tidsperiode';
import Matchdetaljer from '../modal/Matchdetaljer';
import cvPropTypes from '../../PropTypes';
import { MatchexplainProptypesGrouped } from '../modal/Proptypes';
import { FETCH_CV, OPEN_CV_MODAL } from '../../sok/cv/cvReducer';
import { getUrlParameterByName } from '../../sok/utils';
import VisKandidatPersonalia from './VisKandidatPersonalia';

class VisKandidat extends React.Component {
    componentDidMount() {
        const kandidatnummer = getUrlParameterByName('kandidatNr', window.location.href);
        this.props.hentCvForKandidat(kandidatnummer);
    }

    render() {
        const { cv, isFetchingCv, matchforklaring } = this.props;

        const utdanning = cv.utdanning.slice();
        const yrkeserfaring = cv.yrkeserfaring.slice();
        const kurs = cv.kurs.slice();
        const sertifikater = cv.sertifikater.slice();
        const sprak = cv.sprak.slice();
        const geografiJobbonsker = cv.geografiJobbonsker ? cv.geografiJobbonsker
            .slice()
            .filter((sted, index, self) => !sted.geografiKodeTekst.includes('/Bydel') &&
                self.indexOf(sted) === index) : [];

        if (isFetchingCv) {
            return (
                <div className="text-center">
                    <NavFrontendSpinner type="L" />
                </div>
            );
        }
        return (
            <div className="panel">
                <VisKandidatPersonalia cv={cv} />
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
                            {sortByDato(utdanning)
                                .map((u) => (
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
                            {sortByDato(yrkeserfaring)
                                .map((a) => (
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
                            {sortByDato(kurs)
                                .map((k) => (
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
                            {sortByDato(sertifikater)
                                .map((s) => (
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
                {geografiJobbonsker && geografiJobbonsker.length !== 0 && (
                    <Row className="blokk-s">
                        <Column xs="12">
                            <Undertittel>Ønsket arbeidssted</Undertittel>
                            {geografiJobbonsker.map((s) => (
                                <Row className="blokk-xs" key={JSON.stringify(s)}>
                                    <Column xs="8">
                                        {s.geografiKodeTekst && (
                                            <Element>{s.geografiKodeTekst}</Element>
                                        )}
                                    </Column>
                                </Row>
                            ))}
                        </Column>
                    </Row>
                )}
                {matchforklaring && (
                    <Row className="blokk-s">
                        <Column xs="12">
                            <Matchdetaljer matchforklaring={matchforklaring} />
                        </Column>
                    </Row>
                )}
            </div>
        );
    }
}

VisKandidat.defaultProps = {
    matchforklaring: undefined
};

VisKandidat.propTypes = {
    cv: cvPropTypes.isRequired,
    isFetchingCv: PropTypes.bool.isRequired,
    matchforklaring: MatchexplainProptypesGrouped,
    hentCvForKandidat: PropTypes.func.isRequired

};

const mapStateToProps = (state) => ({
    isFetchingCv: state.cvReducer.isFetchingCv,
    cv: state.cvReducer.cv,
    matchforklaring: state.cvReducer.matchforklaring
});

const mapDispatchToProps = (dispatch) => ({
    openCvModal: () => dispatch({ type: OPEN_CV_MODAL }),
    hentCvForKandidat: (arenaKandidatnr) => dispatch({ type: FETCH_CV, arenaKandidatnr })
});


export default connect(mapStateToProps, mapDispatchToProps)(VisKandidat);
