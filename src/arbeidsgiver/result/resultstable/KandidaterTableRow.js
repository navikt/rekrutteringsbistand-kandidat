import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Column, Row } from 'nav-frontend-grid';
import { Normaltekst } from 'nav-frontend-typografi';
import { Link } from 'react-router-dom';
import cvPropTypes from '../../../felles/PropTypes';
import { UTDANNING } from '../../../felles/konstanter';
import { CONTEXT_ROOT, USE_JANZZ } from '../../common/fasitProperties';
import './Resultstable.less';
import { SET_SCROLL_POSITION } from '../../sok/searchReducer';
import { capitalizePoststed } from '../../../felles/sok/utils';

class KandidaterTableRow extends React.Component {
    onCheck = (kandidatnr) => {
        this.props.onKandidatValgt(!this.props.markert, kandidatnr);
    };

    nusKodeTilUtdanningsNivaa = (nusKode) => {
        switch (nusKode.charAt(0)) {
            case '0':
            case '1':
            case '2':
            case '3':
            case '4': return UTDANNING.VIDEREGAAENDE.label;
            case '5': return UTDANNING.FAGSKOLE.label;
            case '6': return UTDANNING.BACHELOR.label;
            case '7': return UTDANNING.MASTER.label;
            case '8': return UTDANNING.DOKTORGRAD.label;
            default: return 'Ukjent';
        }
    };

    render() {
        const { cv, markert, nettoppValgt, setScrollPosition, sisteSokId } = this.props;
        const kandidatnummer = cv.arenaKandidatnr;
        const profilId = cv.profilId;
        const yrkeserfaring = cv.mestRelevanteYrkeserfaring ? cv.mestRelevanteYrkeserfaring.styrkKodeStillingstittel : '-';
        const utdanningsNivaa = this.nusKodeTilUtdanningsNivaa(cv.hoyesteUtdanning ? cv.hoyesteUtdanning.nusKode : '-');
        const parametere = USE_JANZZ ? `kandidatNr=${kandidatnummer}&profilId=${profilId}&sisteSokId=${sisteSokId}` : `kandidatNr=${kandidatnummer}`;
        const bosted = cv.poststed ? capitalizePoststed(cv.poststed) : '-';
        const score = cv.score;
        return (
            <div className="tr">
                <Row className={`kandidater--row${markert ? ' kandidater--row--checked' : ''}${nettoppValgt ? ' kandidater--row--sett' : ''}`}>
                    <Column xs="1" md="1" className="td">
                        <div className="skjemaelement skjemaelement--horisontal text-hide">
                            <input
                                type="checkbox"
                                id={`marker-kandidat-${kandidatnummer}-checkbox`}
                                className="skjemaelement__input checkboks"
                                aria-label={`Marker kandidat med nummer ${kandidatnummer}`}
                                checked={markert}
                                onChange={() => { this.onCheck(cv.arenaKandidatnr); }}
                            />
                            <label
                                className="skjemaelement__label"
                                htmlFor={`marker-kandidat-${kandidatnummer}-checkbox`}
                                aria-hidden="true"
                            >
                                .
                            </label>
                        </div>
                    </Column>
                    <Column className="lenke--kandidatnr--wrapper td" xs="2" md="2">
                        <Link
                            className="lenke--kandidatnr link"
                            to={`/${CONTEXT_ROOT}/cv?${parametere}`}
                            aria-label={`Se CV for ${cv.arenaKandidatnr}`}
                            onClick={() => setScrollPosition(window.pageYOffset)}
                        >
                            <Normaltekst className="text-overflow" aria-hidden="true">{cv.arenaKandidatnr}</Normaltekst>
                        </Link>
                    </Column>

                    {USE_JANZZ ? (
                        <Column xs="3" md="3" className="td">
                            <Normaltekst className="text-overflow score">{score >= 10 ? `${score} %` : ''}</Normaltekst>
                        </Column>
                    ) : (
                        <Column xs="3" md="3" className="td">
                            <Normaltekst className="text-overflow utdanning">{utdanningsNivaa}</Normaltekst>
                        </Column>
                    )}
                    <Column xs="4" md="4" className="td">
                        <Normaltekst className="text-overflow yrkeserfaring">{yrkeserfaring}</Normaltekst>
                    </Column>
                    <Column xs="2" md="2" className="td">
                        <Normaltekst className="text-overflow bosted">{bosted}</Normaltekst>
                    </Column>
                </Row>
            </div>
        );
    }
}

KandidaterTableRow.defaultProps = {
    markert: false,
    sisteSokId: undefined
};

KandidaterTableRow.propTypes = {
    cv: cvPropTypes.isRequired,
    onKandidatValgt: PropTypes.func.isRequired,
    markert: PropTypes.bool,
    nettoppValgt: PropTypes.bool.isRequired,
    setScrollPosition: PropTypes.func.isRequired,
    sisteSokId: PropTypes.string
};

const mapStateToProps = (state) => ({
    query: state.query,
    sisteSokId: state.cvReducer.sisteSokId
});

const mapDispatchToProps = (dispatch) => ({
    setScrollPosition: (scrollPosisjon) => dispatch({ type: SET_SCROLL_POSITION, scrolletFraToppen: scrollPosisjon })
});


export default connect(mapStateToProps, mapDispatchToProps)(KandidaterTableRow);
