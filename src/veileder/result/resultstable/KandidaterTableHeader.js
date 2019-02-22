import React from 'react';
import PropTypes from 'prop-types';
import './Resultstable.less';

export default class KandidaterTableHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className="NyKandidaterTableRow overskrift">
                <div className="kandidat-content">
                    <div className="kolonne-checkbox">
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
                    <div className="kolonne-navn kolonne-tekst kolonne-overskrift">Navn </div>
                    <div className="kolonne-dato kolonne-tekst kolonne-overskrift">Fødselsnummer</div>
                    <div className="kolonne-innsatsgruppe kolonne-tekst kolonne-overskrift">Innsatsgruppe</div>
                    <div className="kolonne-bosted kolonne-tekst kolonne-overskrift">Bosted</div>
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
    alleKandidaterMarkert: PropTypes.bool,
    onToggleMarkeringAlleKandidater: PropTypes.func
};
