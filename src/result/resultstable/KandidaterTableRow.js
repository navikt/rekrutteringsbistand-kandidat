import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Column, Row } from 'nav-frontend-grid';
import { Normaltekst } from 'nav-frontend-typografi';
import { Checkbox } from 'nav-frontend-skjema';
import { Link } from 'react-router-dom';
import cvPropTypes from '../../PropTypes';
import { UTDANNING } from '../../konstanter';
import { CONTEXT_ROOT, USE_JANZZ } from '../../common/fasitProperties';
import './Resultstable.less';

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
    }

    render() {
        const cv = this.props.cv;
        const kandidatnummer = this.props.cv.arenaKandidatnr;
        const yrkeserfaring = cv.mestRelevanteYrkeserfaring ? cv.mestRelevanteYrkeserfaring.styrkKodeStillingstittel : '';
        const utdanningsNivaa = this.nusKodeTilUtdanningsNivaa(cv.hoyesteUtdanning ? cv.hoyesteUtdanning.nusKode : '-');

        const score = cv.score;
        const lengdeYrkeserfaring = Math.floor(cv.totalLengdeYrkeserfaring / 12);
        let lengdeYrkeserfaringTekst;
        if (lengdeYrkeserfaring === 0) {
            lengdeYrkeserfaringTekst = 'Under 1 år';
        } else if (lengdeYrkeserfaring > 10) {
            lengdeYrkeserfaringTekst = 'Over 10 år';
        } else {
            lengdeYrkeserfaringTekst = `${lengdeYrkeserfaring} år`;
        }

        return (

            <Row className="kandidater--row">

                {this.props.visKandidatlister &&
                    <Column xs="1" md="1">
                        <Checkbox className="text-hide" label="" checked={this.props.markert} onChange={() => { this.onCheck(cv.arenaKandidatnr); }} />
                    </Column>
                }

                <Column className="lenke--kandidatnr--wrapper" xs="2" md="2">
                    <Link
                        className="lenke--kandidatnr"
                        to={`/${CONTEXT_ROOT}/cv?kandidatNr=${kandidatnummer}`}

                        aria-label={`Se CV for ${cv.arenaKandidatnr}`}
                    >

                        <Normaltekst className="break-word">{cv.arenaKandidatnr}</Normaltekst>

                    </Link>
                </Column>

                {USE_JANZZ ? (
                    <Column className="no-padding" xs="3" md="3">
                        <Normaltekst className="break-word score">{score >= 10 ? `${score} %` : ''}</Normaltekst>
                    </Column>
                ) : (
                    <Column className="no-padding" xs="3" md="3">
                        <Normaltekst className="break-word utdanning">{utdanningsNivaa}</Normaltekst>
                    </Column>
                )}
                <Column className="no-padding" xs="4" md="4">
                    <Normaltekst className="break-word yrkeserfaring">{yrkeserfaring}</Normaltekst>
                </Column>
                <Column xs="2" md="2" className="text-center no-padding">
                    <Normaltekst className="inline lengdeYrkeserfaringTekst">{lengdeYrkeserfaringTekst}</Normaltekst>
                </Column>


            </Row>


        );
    }
}

KandidaterTableRow.propTypes = {
    cv: cvPropTypes.isRequired,
    onKandidatValgt: PropTypes.func.isRequired,
    visKandidatlister: PropTypes.bool.isRequired,
    markert: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
    query: state.query,
    visKandidatlister: state.search.featureToggles['vis-kandidatlister']
});

export default connect(mapStateToProps)(KandidaterTableRow);
