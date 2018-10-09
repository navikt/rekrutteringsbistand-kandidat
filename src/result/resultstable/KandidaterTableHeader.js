import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Column, Row } from 'nav-frontend-grid';
import { Element } from 'nav-frontend-typografi';
import NavFrontendChevron from 'nav-frontend-chevron';
import { Checkbox } from 'nav-frontend-skjema';
import './Resultstable.less';
import { USE_JANZZ } from '../../common/fasitProperties';

class KandidaterTableHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    onFilterAntallArClick = () => {
        this.props.onFilterAntallArClick(this.state.antallArChevronNed, this.props.from, this.props.to);
        this.setState({
            scoreChevronNed: undefined,
            antallArChevronNed: !this.state.antallArChevronNed
        });
    };

    onFilterScoreClick = () => {
        this.props.onFilterScoreClick(this.state.scoreChevronNed, this.props.from, this.props.to);
        this.setState({
            scoreChevronNed: !this.state.scoreChevronNed,
            antallArChevronNed: undefined
        });
    };

    render() {
        return (
            <div className="panel border--bottom--medium">
                <Row>
                    {this.props.visKandidatlister &&
                        <Column xs="1" md="1">
                            <Checkbox className="text-hide" label="" checked={this.props.alleKandidaterMarkert} onChange={this.props.onToggleMarkeringAlleKandidater} />
                        </Column>
                    }
                    <Column xs="3" md="3" >
                        <Element className="label--resultatvisning">
                            Kandidat
                        </Element>
                    </Column>
                    {USE_JANZZ ?
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
                        </Column>)
                        : (
                            <Column xs="4" md="4">
                                <div className="filter--aktuelle--kandidater">
                                    <Element
                                        className="label--resultatvisning"
                                        aria-label="Sorter på utdanning"
                                    >
                                Utdanning
                                    </Element>
                                </div>
                            </Column>
                        )}
                    <Column xs="4" md="4">
                        <div className="filter--aktuelle--kandidater">
                            <Element
                                className="label--resultatvisning"
                                aria-label="Sorter på arbeidserfaring"
                            >
                                Arbeidserfaring
                            </Element>
                        </div>
                    </Column>
                </Row>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    visKandidatlister: state.search.featureToggles['vis-kandidatlister']
});

KandidaterTableHeader.defaultProps = {
    alleKandidaterMarkert: false,
    onToggleMarkeringAlleKandidater: undefined
};

KandidaterTableHeader.propTypes = {
    onFilterAntallArClick: PropTypes.func.isRequired,
    onFilterScoreClick: PropTypes.func.isRequired,
    from: PropTypes.number.isRequired,
    to: PropTypes.number.isRequired,
    alleKandidaterMarkert: PropTypes.bool,
    onToggleMarkeringAlleKandidater: PropTypes.func,
    visKandidatlister: PropTypes.bool.isRequired
};

export default connect(mapStateToProps)(KandidaterTableHeader);
