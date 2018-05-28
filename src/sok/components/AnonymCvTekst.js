import React from 'react';
import PropTypes from 'prop-types';
import { Knapp } from 'nav-frontend-knapper';
import { Row } from 'nav-frontend-grid';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';

export default function AnonymCvTekst({ onTaKontaktClick, toggleModalOpen }) {
    return (
        <div className="panel panel--padding">
            <Row>
                <Undertittel>Kandidaten har ikke synlig CV</Undertittel>
                <br />
                <Normaltekst>
                    Kandidaten har valgt å ikke ha synlig CV for arbeidsgivere. Du kan sende
                    kontaktinformasjon til kandidaten slik at personen kan kontakte deg.
                </Normaltekst>
            </Row>
            <Row>
                <div className="row cv--button--row">
                    <Knapp
                        className="knapp knapp--hoved"
                        onClick={onTaKontaktClick}
                    >
                        Kontakt kandidat
                    </Knapp>
                    <Knapp
                        className="knapp"
                        onClick={toggleModalOpen}
                    >
                        Avbryt
                    </Knapp>
                </div>
            </Row>
        </div>
    );
}

AnonymCvTekst.propTypes = {
    onTaKontaktClick: PropTypes.func.isRequired,
    toggleModalOpen: PropTypes.func.isRequired
};
