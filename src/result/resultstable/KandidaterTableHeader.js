import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Column, Row } from 'nav-frontend-grid';
import { Element } from 'nav-frontend-typografi';
import NavFrontendChevron from 'nav-frontend-chevron';
import './Resultstable.less';

class KandidaterTableHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    onFilterUtdanningClick = () => {
        this.props.onFilterUtdanningClick(this.state.utdanningChevronNed, this.props.from, this.props.to);
        this.setState({
            utdanningChevronNed: !this.state.utdanningChevronNed,
            scoreChevronNed: undefined,
            jobberfaringChevronNed: undefined,
            antallArChevronNed: undefined
        });
    };

    onFilterScoreClick = () => {
        this.props.onFilterScoreClick(this.state.scoreChevronNed, this.props.from, this.props.to);
        this.setState({
            scoreChevronNed: !this.state.scoreChevronNed,
            utdanningChevronNed: undefined,
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
                    {this.props.janzzEnabled ?
                    (<Column xs="4" md="4">
                        <button className="filter--aktuelle--kandidater" onClick={this.onFilterScoreClick}>
                            <Element
                                className="label--resultatvisning"
                                aria-label="Sorter på matchscore"
                                aria-selected={this.state.scoreChevronNed !== undefined}
                            >
                                Matchscore
                            </Element>
                            <NavFrontendChevron
                                type={this.state.scoreChevronNed === undefined || this.state.scoreChevronNed ? 'ned' : 'opp'}
                            />
                        </button>
                    </Column>) :
                    (<Column xs="4" md="4">
                        <button className="filter--aktuelle--kandidater" onClick={this.onFilterUtdanningClick}>
                            <Element
                                className="label--resultatvisning"
                                aria-label="Sorter på utdanning"
                                aria-selected={this.state.scoreChevronNed !== undefined}
                            >
                                Utdanning
                            </Element>
                            <NavFrontendChevron
                                type={this.state.utdanningChevronNed === undefined || this.state.utdanningChevronNed ? 'ned' : 'opp'}
                            />
                        </button>
                    </Column>)}
                    
                    <Column xs="3" md="3">
                        <button className="filter--aktuelle--kandidater" onClick={this.onFilterJobberfaringClick}>
                            <Element
                                className="label--resultatvisning"
                                aria-label="Sorter på arbeidserfaring"
                                aria-selected={this.state.jobberfaringChevronNed !== undefined}
                            >
                                Arbeidserfaring
                            </Element>
                            <NavFrontendChevron
                                type={this.state.jobberfaringChevronNed === undefined || this.state.jobberfaringChevronNed ? 'ned' : 'opp'}
                            />
                        </button>
                    </Column>
                    <Column className="filter--lengde--erfaring" xs="3" md="3">
                        <button className="filter--aktuelle--kandidater" onClick={this.onFilterAntallArClick}>
                            <Element
                                className="label--resultatvisning"
                                aria-label="Sorter på antall år med arbeidserfaring"
                                aria-selected={this.state.antallArChevronNed !== undefined}
                            >
                                År med erfaring
                            </Element>
                            <NavFrontendChevron
                                type={this.state.antallArChevronNed === undefined ||  antallArChevronNed ? 'ned' : 'opp'}
                            />
                        </button>
                    </Column>
                </Row>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    janzzEnabled: state.search.featureToggles['janzz-enabled'],
});

KandidaterTableHeader.propTypes = {
    onFilterUtdanningClick: PropTypes.func.isRequired,
    onFilterScoreClick: PropTypes.func.isRequired,
    onFilterJobberfaringClick: PropTypes.func.isRequired,
    onFilterAntallArClick: PropTypes.func.isRequired,
    from: PropTypes.number.isRequired,
    to: PropTypes.number.isRequired
};

export default connect(mapStateToProps)(KandidaterTableHeader);