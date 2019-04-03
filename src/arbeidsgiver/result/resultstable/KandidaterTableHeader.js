import React from 'react';
import PropTypes from 'prop-types';
import { Column, Row } from 'nav-frontend-grid';
import { Element } from 'nav-frontend-typografi';
import NavFrontendChevron from 'nav-frontend-chevron';
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
            <div className="thead">
                <div className="th">
                    <Row className="kandidater--header">
                        <Column xs="3" md="3" className="KandidaterTableHeader__kandidatnr--wrapper">
                            <div className="td KandidaterTableHeader__Checkbox">
                                <div className="skjemaelement skjemaelement--horisontal text-hide">
                                    <input
                                        type="checkbox"
                                        id="marker-alle-kandidater-checkbox"
                                        className="skjemaelement__input checkboks"
                                        aria-label="Marker alle kandidater"
                                        checked={this.props.alleKandidaterMarkert}
                                        onChange={this.props.onToggleMarkeringAlleKandidater}
                                    />
                                    <label
                                        className="skjemaelement__label"
                                        htmlFor="marker-alle-kandidater-checkbox"
                                        aria-hidden="true"
                                    >
                                        .
                                    </label>
                                </div>
                            </div>
                            <div className="td KandidaterTableHeader__Checkbox-label">
                                <Element
                                    className="label--resultatvisning hidden-mobile"
                                    aria-label="Kandidat"
                                >
                                    Kandidat
                                </Element>
                                <Element
                                    className="label--resultatvisning-mobile hidden-desktop"
                                    aria-label="Kandidat"
                                >
                                    Marker alle kandidater
                                </Element>
                            </div>
                        </Column>
                        {USE_JANZZ ?
                            (<Column xs="3" md="3" className="td hidden-mobile">
                                <button className="text-overflow" onClick={this.onFilterScoreClick}>
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
                                <Column xs="3" md="3" className="td hidden-mobile">
                                    <div className="text-overflow">
                                        <Element
                                            className="label--resultatvisning"
                                            aria-label="Utdanning"
                                        >
                                            Utdanningsnivå
                                        </Element>
                                    </div>
                                </Column>
                            )}
                        <Column xs="4" md="4" className="td hidden-mobile">
                            <div className="text-overflow">
                                <Element
                                    className="label--resultatvisning"
                                    aria-label="Arbeidserfaring"
                                >
                                    {USE_JANZZ && 'Siste arbeidserfaring'}
                                    {!USE_JANZZ && 'Relevant arbeidserfaring'}
                                </Element>
                            </div>
                        </Column>
                        <Column xs="2" md="2" className="td hidden-mobile">
                            <div className="text-overflow">
                                <Element
                                    className="label--resultatvisning"
                                    aria-label="Bosted"
                                >
                                    Bosted
                                </Element>
                            </div>
                        </Column>
                    </Row>
                </div>
            </div>
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
