import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Ikon from 'nav-frontend-ikoner-assets';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { Column, Container, Row } from 'nav-frontend-grid';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';

class Resultat extends React.Component {

    render() {
        if (this.props.isSearching) {
            return (
                <Row>
                    <Column xs="12">
                        <div className="text-center">
                            <NavFrontendSpinner type="L" />
                        </div>
                    </Column>
                </Row>
            );
        }
        return (
            <Container>
                <Undertittel>
                    Resultat, {this.props.treff} treff
                </Undertittel>
                <ul className="resultat">
                    {this.props.kandidater.map((kandidat) =>
                        (<li>
                            <Row className="search-result-item">
                                <Column xs="12" md="4" className="search-result-item__arbeidsgiver">
                                    <Ikon kind="nav-ansatt" size="200" />
                                </Column>
                                <Column xs="12" md="8">
                                    <Normaltekst className="blokk-s break-word muted">
                                        {kandidat.id}
                                    </Normaltekst>

                                    <h3 className="typo-ingress blokk-s break-word">{kandidat.title}</h3>

                                </Column>
                            </Row>
                        </li>)
                    )}
                </ul>
            </Container>
        );
    }
}

Resultat.propTypes = {
    kandidater: PropTypes.arrayOf(PropTypes.object).isRequired,
    treff: PropTypes.number.isRequired,
    isSearching: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
    isSearching: state.isSearching,
    treff: state.kandidatResultat.total,
    kandidater: state.kandidatResultat.kandidater
});

export default connect(mapStateToProps)(Resultat);
