import React from 'react';
import PropTypes from 'prop-types';
import { Undertittel } from 'nav-frontend-typografi';
import RichTextEditor from 'react-rte';
import { Knapp } from 'nav-frontend-knapper';

export default class SendBeskjedKandidat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 'Bedriften AS vil snakke med deg om en ledig stilling',
            textareaValue: RichTextEditor.createValueFromString(`<p>Hei,<br/></p><p>Du mottar denne mailen fordi Bedriften AS er interessert i å snakke
            med deg om en ledig stilling. <a href="#">Se stillingsannonse</a><br/></p><p>Bedriften AS vil gjerne at du tar kontakt.<br/></p>
            <p><strong>Kontaktinformasjonen er:</strong><br/>Kontaktperson: Kari Normann<br/>Telefon: 22 22 34 51<br/>
            Mail: <a href="#">kari.normann@bedriftenas.no</a><br/></p><p>Med vennlig hilsen<br/>Kari Normann, Bedriften AS<br/></p>`, 'html')
        };
    }

    onInputChange = (e) => {
        this.setState({
            value: e.target.value
        });
    };

    onTextareaChange = (e) => {
        this.setState({
            textareaValue: e
        });
    };

    render() {
        const toolbarConfig = {
            display: ['INLINE_STYLE_BUTTONS', 'BLOCK_TYPE_BUTTONS', 'LINK_BUTTONS', 'HISTORY_BUTTONS'],
            INLINE_STYLE_BUTTONS: [
                { label: 'Bold', style: 'BOLD' },
                { label: 'Italic', style: 'ITALIC' },
                { label: 'Underline', style: 'UNDERLINE' }
            ],
            BLOCK_TYPE_BUTTONS: [
                { label: 'UL', style: 'unordered-list-item' },
                { label: 'OL', style: 'ordered-list-item' }
            ]
        };
        return (
            <div className="panel panel--padding">
                <Undertittel>Send beskjed til kandidaten</Undertittel>
                <input
                    value={this.state.value}
                    onChange={this.onInputChange}
                    className="input input--fullbredde input--resultat"
                />
                <RichTextEditor
                    value={this.state.textareaValue}
                    onChange={this.onTextareaChange}
                    toolbarConfig={toolbarConfig}
                    className="editor--send--beskjed"
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
