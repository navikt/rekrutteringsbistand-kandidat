import React from 'react';
import PropTypes from 'prop-types';
import { Undertittel } from 'nav-frontend-typografi';
import { Textarea } from 'nav-frontend-skjema';
import { Knapp } from 'nav-frontend-knapper';

export default class SendBeskjedKandidat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 'Bedriften AS vil snakke med deg om en ledig stilling',
            textareaValue: 'Hei,\n\nDu mottar denne mailen fordi Bedriften AS er interessert i å snakke ' +
            'med deg om en ledig stilling. Se stillingsannonse\n\nBedriften AS vil gjerne at du tar kontakt.' +
            '\n\nKontaktinformasjonen er:\nKontaktperson: Kari Normann\nTelefon: 22 22 34 51 \n' +
            'Mail: kari.normann@bedriftenas.no\n\nMed vennlig hilsen\nKari Normann, Bedriften AS'
        };
    }

    onInputChange = (e) => {
        this.setState({
            value: e.target.value
        });
    };

    onTextareaChange = (e) => {
        this.setState({
            textareaValue: e.target.value
        });
    };

    render() {
        return (
            <div className="panel panel--padding">
                <Undertittel>Send beskjed til kandidaten</Undertittel>
                <input
                    value={this.state.value}
                    onChange={this.onInputChange}
                    className="input input--fullbredde input--resultat"
                />
                <Textarea
                    value={this.state.textareaValue}
                    onChange={this.onTextareaChange}
                    label=""
                />
                <div className="row cv--button--row">
                    <Knapp
                        className="knapp knapp--hoved"
                        onClick={this.props.onSendClick}
                    >
                        Send beskjed
                    </Knapp>
                    <Knapp
                        className="knapp"
                        onClick={this.props.toggleModalOpen}
                    >
                        Avbryt
                    </Knapp>
                </div>
            </div>
        );
    }
}

SendBeskjedKandidat.propTypes = {
    toggleModalOpen: PropTypes.func.isRequired,
    onSendClick: PropTypes.func.isRequired
};
