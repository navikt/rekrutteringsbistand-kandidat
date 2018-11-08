import React from 'react';
import PropTypes from 'prop-types';
import { Column, Row } from 'nav-frontend-grid';
import { Element } from 'nav-frontend-typografi';
import NavFrontendChevron from 'nav-frontend-chevron';
import './Resultstable.less';

export default class KandidaterTableHeader extends React.Component {
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

    render() {
        return (
            <div className="panel border--bottom--medium">
                <Row>
                    <Column xs="2" md="2" />
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
                    <Column xs="3" md="3">
                        <div className="filter--aktuelle--kandidater">
                            <Element
                                className="label--resultatvisning"
                                aria-label="Sorter på arbeidserfaring"
                            >
                                Arbeidserfaring
                            </Element>
                        </div>
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
    onFilterAntallArClick: PropTypes.func.isRequired,
    from: PropTypes.number.isRequired,
    to: PropTypes.number.isRequired
};
