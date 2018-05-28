import React from 'react';
import PropTypes from 'prop-types';
import { Column, Row } from 'nav-frontend-grid';
import { Element } from 'nav-frontend-typografi';
import NavFrontendChevron from 'nav-frontend-chevron';

export default class KandidaterTableHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    onFilterUtdanningClick = () => {
        this.props.onFilterUtdanningClick(this.state.utdanningChevronNed, this.props.from, this.props.to);
        this.setState({
            utdanningChevronNed: !this.state.utdanningChevronNed,
            jobberfaringChevronNed: undefined,
            antallArChevronNed: undefined
        });
    };

    onFilterJobberfaringClick = () => {
        this.props.onFilterJobberfaringClick(this.state.jobberfaringChevronNed, this.props.from, this.props.to);
        this.setState({
            utdanningChevronNed: undefined,
            jobberfaringChevronNed: !this.state.jobberfaringChevronNed,
            antallArChevronNed: undefined
        });
    };

    onFilterAntallArClick = () => {
        this.props.onFilterAntallArClick(this.state.antallArChevronNed, this.props.from, this.props.to);
        this.setState({
            utdanningChevronNed: undefined,
            jobberfaringChevronNed: undefined,
            antallArChevronNed: !this.state.antallArChevronNed
        });
    };

    render() {
        return (
            <div className="panel border--bottom--medium">
                <Row>
                    <Column xs="2" md="2" />
                    <Column xs="4" md="4">
                        <button className="filter--aktuelle--kandidater" onClick={this.onFilterUtdanningClick}>
                            <Element className="label--resultatvisning">Utdanning</Element>
                            <NavFrontendChevron
                                type={this.state.utdanningChevronNed === undefined || this.state.utdanningChevronNed ? 'ned' : 'opp'}
                            />
                        </button>
                    </Column>
                    <Column xs="3" md="3">
                        <button className="filter--aktuelle--kandidater" onClick={this.onFilterJobberfaringClick}>
                            <Element className="label--resultatvisning">Jobberfaring</Element>
                            <NavFrontendChevron
                                type={this.state.jobberfaringChevronNed === undefined || this.state.jobberfaringChevronNed ? 'ned' : 'opp'}
                            />
                        </button>
                    </Column>
                    <Column xs="3" md="3">
                        <button className="filter--aktuelle--kandidater" onClick={this.onFilterAntallArClick}>
                            <Element className="label--resultatvisning">År med erfaring</Element>
                            <NavFrontendChevron
                                type={this.state.antallArChevronNed === undefined || this.state.antallArChevronNed ? 'ned' : 'opp'}
                            />
                        </button>
                    </Column>
                </Row>
            </div>
        );
    }
}

KandidaterTableHeader.propTypes = {
    onFilterUtdanningClick: PropTypes.func.isRequired,
    onFilterJobberfaringClick: PropTypes.func.isRequired,
    onFilterAntallArClick: PropTypes.func.isRequired,
    from: PropTypes.number.isRequired,
    to: PropTypes.number.isRequired
};
