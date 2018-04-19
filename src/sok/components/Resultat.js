import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { Column, Row } from 'nav-frontend-grid';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { Link } from 'react-router-dom';
import Feilmelding from './Feilmelding';

function Resultat({ sokeResultat, isSearching, error }) {
    if (isSearching) {
        return (
            <Row>
                <Column xs="12">
                    <div className="text-center">
                        <NavFrontendSpinner type="L" />
                    </div>
                </Column>
            </Row>
        );
    } else if (error !== undefined) {
        return (<Feilmelding />);
    }
    return (
        <ul className="resultat">
            {console.log(sokeResultat)}
            {sokeResultat.cver.map((kandidat) =>
                (<Link
                    className="search-result-item-link"
                    key={kandidat.arenaPersonId}
                    to={{ pathname: `pam-kandidatsok/showcv/${kandidat.arenaPersonId}`, kandidatInfo: kandidat }}
                >
                    <Row className="search-result-item">
                        <Column>
                            <Normaltekst className="blokk-s break-word muted">
                                    Kandidat: {kandidat.arenaPersonId}
                            </Normaltekst>

                            <Undertittel className="typo-ingress blokk-s break-word">
                                {kandidat.yrkeserfaring[kandidat.yrkeserfaring.length - 1].styrkKodeStillingstittel}
                            </Undertittel>

                            <Normaltekst className="blokk-s break-word muted">
                                        Beskrivelse: {kandidat.beskrivelse}
                            </Normaltekst>

                            <Normaltekst className="blokk-s break-word muted">
                                Utdanning: {kandidat.utdanning[kandidat.utdanning.length - 1].nusKodeGrad}
                            </Normaltekst>
                        </Column>
                    </Row>
                </Link>)
            )}
        </ul>
    );
}

Resultat.defaultProps = {
    error: undefined
};

Resultat.propTypes = {
    sokeResultat: PropTypes.shape(
        PropTypes.arrayOf(PropTypes.object).isRequired,
        PropTypes.arrayOf(PropTypes.object)
    ).isRequired,
    isSearching: PropTypes.bool.isRequired,
    error: PropTypes.node
};

const mapStateToProps = (state) => ({
    isSearching: state.isSearching,
    sokeResultat: state.elasticSearchResultat.resultat
});

export default connect(mapStateToProps)(Resultat);
