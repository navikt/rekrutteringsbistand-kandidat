import React from 'react';
import PropTypes from 'prop-types';
import { Column, Row } from 'nav-frontend-grid';
import { Element } from 'nav-frontend-typografi';
import NavFrontendChevron from 'nav-frontend-chevron';

export default function KandidaterTableHeader({ onFilterUtdanningClick, onFilterJobberfaringClick,
    onFilterAntallArClick, utdanningNed, jobberfaringNed, antallArNed }) {
    return (
        <div className="panel border--bottom--medium">
            <Row>
                <Column xs="2" md="2" />
                <Column xs="4" md="4">
                    <button className="filter--aktuelle--kandidater" onClick={onFilterUtdanningClick}>
                        <Element className="label--resultatvisning">Utdanning</Element>
                        <NavFrontendChevron type={utdanningNed ? 'ned' : 'opp'} />
                    </button>
                </Column>
                <Column xs="3" md="3">
                    <button className="filter--aktuelle--kandidater" onClick={onFilterJobberfaringClick}>
                        <Element className="label--resultatvisning">Jobberfaring</Element>
                        <NavFrontendChevron type={jobberfaringNed ? 'ned' : 'opp'} />
                    </button>
                </Column>
                <Column xs="3" md="3">
                    <button className="filter--aktuelle--kandidater" onClick={onFilterAntallArClick}>
                        <Element className="label--resultatvisning">År med erfaring</Element>
                        <NavFrontendChevron type={antallArNed ? 'ned' : 'opp'} />
                    </button>
                </Column>
            </Row>
        </div>
    );
}

KandidaterTableHeader.defaultProps = {
    utdanningNed: true,
    jobberfaringNed: true,
    antallArNed: true
};

KandidaterTableHeader.propTypes = {
    onFilterUtdanningClick: PropTypes.func.isRequired,
    onFilterJobberfaringClick: PropTypes.func.isRequired,
    onFilterAntallArClick: PropTypes.func.isRequired,
    utdanningNed: PropTypes.bool.isRequired,
    jobberfaringNed: PropTypes.bool.isRequired,
    antallArNed: PropTypes.bool.isRequired
};
