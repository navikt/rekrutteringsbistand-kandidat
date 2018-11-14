import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Column, Row } from 'nav-frontend-grid';
import { Normaltekst } from 'nav-frontend-typografi';
import { Checkbox } from 'nav-frontend-skjema';
import { Link } from 'react-router-dom';
import cvPropTypes from '../../../felles/PropTypes';
import { UTDANNING } from '../../../felles/konstanter';
import { CONTEXT_ROOT, USE_JANZZ } from '../../common/fasitProperties';
import './Resultstable.less';
import { SET_SCROLL_POSITION } from '../../sok/searchReducer';

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
        const cv = this.props.cv;
        const kandidatnummer = this.props.cv.arenaKandidatnr;
        const yrkeserfaring = cv.mestRelevanteYrkeserfaring ? cv.mestRelevanteYrkeserfaring.styrkKodeStillingstittel : '';
        const utdanningsNivaa = this.nusKodeTilUtdanningsNivaa(cv.hoyesteUtdanning ? cv.hoyesteUtdanning.nusKode : '-');

        const score = cv.score;
        return (
            <Row className={`kandidater--row${this.props.markert ? ' kandidater--row--checked' : ''}${this.props.nettoppValgt ? ' kandidater--row--sett' : ''}`}>
                <Column xs="1" md="1">
                    <Checkbox
                        id={`marker-kandidat-${kandidatnummer}-checkbox`}
                        className="text-hide"
                        label="."
                        aria-label={`Marker kandidat med nummer ${kandidatnummer}`}
                        checked={this.props.markert}
                        onChange={() => { this.onCheck(cv.arenaKandidatnr); }}
                    />
                </Column>
                <Column className="lenke--kandidatnr--wrapper" xs="2" md="2">
                    <Link
                        className="lenke--kandidatnr"
                        to={`/${CONTEXT_ROOT}/cv?kandidatNr=${kandidatnummer}`}
                        aria-label={`Se CV for ${cv.arenaKandidatnr}`}
                        onClick={() => this.props.setScrollPosition(window.pageYOffset)}
                    >
                        <Normaltekst className="text-overflow" aria-hidden="true">{cv.arenaKandidatnr}</Normaltekst>
                    </Link>
                </Column>

                {USE_JANZZ ? (
                    <Column xs="5" md="5">
                        <Normaltekst className="text-overflow score">{score >= 10 ? `${score} %` : ''}</Normaltekst>
                    </Column>
                ) : (
                    <Column xs="5" md="5">
                        <Normaltekst className="text-overflow utdanning">{utdanningsNivaa}</Normaltekst>
                    </Column>
                )}
                <Column xs="4" md="4">
                    <Normaltekst className="text-overflow yrkeserfaring">{yrkeserfaring}</Normaltekst>
                </Column>
            </Row>
        );
    }
}

KandidaterTableRow.defaultProps = {
    markert: false
};

KandidaterTableRow.propTypes = {
    cv: cvPropTypes.isRequired,
    onKandidatValgt: PropTypes.func.isRequired,
    markert: PropTypes.bool,
    nettoppValgt: PropTypes.bool.isRequired,
    setScrollPosition: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    query: state.query
});

const mapDispatchToProps = (dispatch) => ({
    setScrollPosition: (scrollPosisjon) => dispatch({ type: SET_SCROLL_POSITION, scrolletFraToppen: scrollPosisjon })
});


export default connect(mapStateToProps, mapDispatchToProps)(KandidaterTableRow);
