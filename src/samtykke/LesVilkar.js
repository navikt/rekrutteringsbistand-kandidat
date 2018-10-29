import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Column, Container, Row } from 'nav-frontend-grid';
import NavFrontendSpinner from 'nav-frontend-spinner';
import NavFrontendChevron from 'nav-frontend-chevron';
import Vilkar from './Vilkar';
import { SAMTYKKE_API } from '../common/fasitProperties';
import { SearchApiError } from '../sok/api';

export default class LesVilkar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isFetching: true
        };
    }

    componentDidMount() {
        this.props.restApi.get(`${SAMTYKKE_API}`).then(
            (samtykkeResponse) => {
                this.setState({
                    samtykkeTekst: samtykkeResponse.tekst,
                    isFetching: false
                });
            },
            (error) => {
                if (error instanceof SearchApiError) {
                    this.setState({
                        error,
                        isFetching: false
                    });
                } else {
                    throw error;
                }
            }
        );
    }

    render() {
        if (this.state.isFetching) {
            return (
                <Container>
                    <Row>
                        <Column xs="12">
                            <div className="text-center">
                                <NavFrontendSpinner type="M" />
                            </div>
                        </Column>
                    </Row>
                </Container>
            );
        } else if (this.state.error !== undefined) {
            return (
                <Row>
                    <Column xs="12">
                        <div className="text-center">
                            <h1>Det oppstod en feil. Forsøk å laste siden på nytt</h1>
                        </div>
                    </Column>
                </Row>
            );
        } else if (this.state.samtykkeTekst !== undefined) {
            return (
                <Container>
                    <Row className="blokk-xs">
                        <Column xs="12">
                            <Link
                                id="forhandsvis-samtykke-tilbake-lenke"
                                className="lenke typo-normal"
                                to="/pam-cv/innstillinger"
                            >
                                <NavFrontendChevron type="venstre" stor />
                                Gå til innstillinger
                            </Link>
                        </Column>
                    </Row>
                    <div className="panel panel--padding">
                        <Vilkar samtykkeTekst={this.state.samtykkeTekst} />
                    </div>
                </Container>
            );
        }
        return (
            <div />
        );
    }
}

LesVilkar.propTypes = {
    restApi: PropTypes.shape({
        get: PropTypes.func.isRequired,
        add: PropTypes.func.isRequired,
        update: PropTypes.func.isRequired,
        remove: PropTypes.func.isRequired
    }).isRequired
};
