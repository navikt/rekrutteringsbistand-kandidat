import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Ikon from 'nav-frontend-ikoner-assets';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { Column, Container, Row } from 'nav-frontend-grid';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import Feilmelding from './Feilmelding';

function Resultat({ kandidater, treff, isSearching, error }) {
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
        <Container>
            <Undertittel>
                    Resultat, {treff} treff
            </Undertittel>
            <ul className="resultat">
                {kandidater.map((kandidat) =>
                    (<li key={kandidat.id}>
                        <Row className="search-result-item">
                            <Column xs="12" md="4" className="search-result-item__arbeidstaker">
                                <Ikon kind="nav-ansatt" size="200" />
                            </Column>
                            <Column xs="12" md="8">
                                <Normaltekst className="blokk-s break-word muted">
                                    {kandidat.id}
                                </Normaltekst>

                                <Undertittel className="typo-ingress blokk-s break-word">{kandidat.occupation}</Undertittel>

                                <Normaltekst className="blokk-s break-word muted">
                                        Treffprosent: {kandidat.score}
                                </Normaltekst>
                                <Normaltekst className="blokk-s break-word muted">
                                    {kandidat.title}
                                </Normaltekst>
                                <Normaltekst className="blokk-s break-word muted">
                                    {kandidat.description}
                                </Normaltekst>
                            </Column>
                        </Row>
                    </li>)
                )}
            </ul>
        </Container>
    );
}

Resultat.defaultProps = {
    error: undefined
};

Resultat.propTypes = {
    kandidater: PropTypes.arrayOf(PropTypes.object).isRequired,
    treff: PropTypes.number.isRequired,
    isSearching: PropTypes.bool.isRequired,
    error: PropTypes.node
};

const mapStateToProps = (state) => ({
    isSearching: state.isSearching,
    treff: state.kandidatResultat.total,
    kandidater: state.kandidatResultat.kandidater
});

export default connect(mapStateToProps)(Resultat);
