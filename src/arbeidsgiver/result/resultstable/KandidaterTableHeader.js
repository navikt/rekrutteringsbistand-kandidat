import React from 'react';
import PropTypes from 'prop-types';
import { Column, Row } from 'nav-frontend-grid';
import { Element } from 'nav-frontend-typografi';
import NavFrontendChevron from 'nav-frontend-chevron';
import { Checkbox } from 'nav-frontend-skjema';
import './Resultstable.less';
import { USE_JANZZ } from '../../common/fasitProperties';

export default class KandidaterTableHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    onFilterScoreClick = () => {
        this.props.onFilterScoreClick(this.state.scoreChevronNed, this.props.from, this.props.to);
        this.setState({
            scoreChevronNed: !this.state.scoreChevronNed,
            antallArChevronNed: undefined
        });
    };

    render() {
        return (
            <Row className="kandidater--header">
                <Column xs="1" md="1">
                    <Checkbox
                        id="marker-alle-kandidater-checkbox"
                        className="text-hide"
                        label="."
                        aria-label="Marker alle kandidater"
                        checked={this.props.alleKandidaterMarkert}
                        onChange={this.props.onToggleMarkeringAlleKandidater}
                    />
                </Column>
                <Column className="header--kandidatnr--wrapper" xs="2" md="2" >
                    <Element
                        className="label--resultatvisning"
                        aria-label="Kandidat"
                    >
                            Kandidat
                    </Element>
                </Column>
                {USE_JANZZ ?
                    (<Column xs="3" md="3">
                        <button className="header--aktuelle--kandidater text-overflow" onClick={this.onFilterScoreClick}>
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
                        <Column xs="3" md="3">
                            <div className="header--aktuelle--kandidater text-overflow">
                                <Element
                                    className="label--resultatvisning"
                                    aria-label="Utdanning"
                                >
                                Utdanningsnivå
                                </Element>
                            </div>
                        </Column>
                    )}
                <Column xs="4" md="4">
                    <div className="header--aktuelle--kandidater text-overflow">
                        <Element
                            className="label--resultatvisning"
                            aria-label="Arbeidserfaring"
                        >
                                Relevant arbeidserfaring
                        </Element>
                    </div>
                </Column>
                <Column xs="2" md="2">
                    <div className="header--aktuelle--kandidater text-overflow">
                        <Element
                            className="label--resultatvisning"
                            aria-label="Bosted"
                        >
                            Bosted
                        </Element>
                    </div>
                </Column>
            </Row>
        );
    }
}

KandidaterTableHeader.defaultProps = {
    alleKandidaterMarkert: false,
    onToggleMarkeringAlleKandidater: undefined
};

KandidaterTableHeader.propTypes = {
    onFilterScoreClick: PropTypes.func.isRequired,
    from: PropTypes.number.isRequired,
    to: PropTypes.number.isRequired,
    alleKandidaterMarkert: PropTypes.bool,
    onToggleMarkeringAlleKandidater: PropTypes.func
};
