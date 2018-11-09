import React from 'react';
import PropTypes from 'prop-types';
import { Column, Row } from 'nav-frontend-grid';
import { Element } from 'nav-frontend-typografi';
import { Checkbox } from 'nav-frontend-skjema';
import './Resultstable.less';

export default class KandidaterTableHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

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
                <Column className="header--kandidatnr--wrapper" xs="5" md="5" >
                    <Element
                        className="label--resultatvisning"
                        aria-label="Navn"
                    >
                        Navn
                    </Element>
                </Column>
                <Column xs="3" md="3">
                    <div className="header--aktuelle--kandidater text-overflow">
                        <Element
                            className="label--resultatvisning"
                            aria-label="Fødselsdato"
                        >
                            Fødselsdato
                        </Element>
                    </div>
                </Column>
                <Column xs="3" md="3">
                    <div className="header--aktuelle--kandidater text-overflow">
                        <Element
                            className="label--resultatvisning"
                            aria-label="Innsatsgruppe"
                        >
                            Innsatsgruppe
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
    alleKandidaterMarkert: PropTypes.bool,
    onToggleMarkeringAlleKandidater: PropTypes.func
};
