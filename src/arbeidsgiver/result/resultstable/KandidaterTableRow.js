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
import Score from '../matchforklaring/score/Score';

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
            default: return '-';
        }
    };

    render() {
        const { cv, markert, nettoppValgt, setScrollPosition, sisteSokId } = this.props;
        const kandidatnummer = cv.arenaKandidatnr;
        const profilId = cv.profilId;
        const utdanningsNivaa = this.nusKodeTilUtdanningsNivaa(cv.hoyesteUtdanning ? cv.hoyesteUtdanning.nusKode : '-');
        const parametere = USE_JANZZ ? `kandidatNr=${kandidatnummer}&profilId=${profilId}&sisteSokId=${sisteSokId}` : `kandidatNr=${kandidatnummer}`;
        const score = cv.score;
        return (
            <div className={`tr${nettoppValgt ? ' kandidater--row--sett' : ''}`}>
                <Row className="kandidater--row">
                    <Column xs="12" md="6" className="KandidaterTableRow__kandidatnr--wrapper">
                        <div className="td KandidaterTableRow__Checkbox skjemaelement--pink">
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
                        </div>
                        <div className="lenke--kandidatnr--wrapper td">
                            <Link
                                className="lenke--kandidatnr link"
                                to={`/${CONTEXT_ROOT}/cv?${parametere}`}
                                aria-label={`Se CV for ${cv.arenaKandidatnr}`}
                                onClick={() => setScrollPosition(window.pageYOffset)}
                            >
                                <Normaltekst className="text-overflow" aria-hidden="true">{cv.arenaKandidatnr}</Normaltekst>
                            </Link>
                        </div>
                    </Column>
                    {!USE_JANZZ &&
                        <Column xs="12" md="6" className="td">
                            <Normaltekst className="text-overflow utdanning">{utdanningsNivaa}</Normaltekst>
                        </Column>
                    }
                    {USE_JANZZ &&
                        <Column xs="12" md="6" className="td">
                            {!isNaN(score) &&
                                <div className="score">
                                    <Score value={score} isTotalScore />
                                </div>
                            }
                        </Column>
                    }
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
