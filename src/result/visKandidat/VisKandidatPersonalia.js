import { Column, Row } from 'nav-frontend-grid';
import { Normaltekst, Sidetittel } from 'nav-frontend-typografi';
import React from 'react';
import connect from 'react-redux/es/connect/connect';
import { Link } from 'react-router-dom';
import NavFrontendChevron from 'nav-frontend-chevron';
import { formatISOString } from '../../common/dateUtils';
import cvPropTypes from '../../PropTypes';
import TelefonIkon from '../../common/ikoner/TelefonIkon';
import MailIkon from '../../common/ikoner/MailIkon';
import AdresseIkon from '../../common/ikoner/AdresseIkon';

class VisKandidatPersonalia extends React.Component {
    capitalizeFirstLetter = (inputString) => inputString.charAt(0).toUpperCase() + inputString.slice(1);

    render() {
        const cv = this.props.cv;
        cv.telefon = '12312312';

        let fornavnStorForbokstav;
        if (cv.fornavn) {
            fornavnStorForbokstav = this.capitalizeFirstLetter(cv.fornavn.toLowerCase());
        }
        let etternavnStorForbokstav;
        if (cv.etternavn) {
            etternavnStorForbokstav = this.capitalizeFirstLetter(cv.etternavn.toLowerCase());
        }

        return (
            <div className="header--bakgrunn">

                <Row>
                    <Link
                        to={'/pam-kandidatsok'}
                        className="header--personalia__lenke"
                    >
                        <NavFrontendChevron type="venstre" /> Til kandidatsøk
                    </Link>
                </Row>

                <Row>
                    <Sidetittel className="header--personalia__overskrift">
                        {fornavnStorForbokstav} {etternavnStorForbokstav}
                    </Sidetittel>
                    {cv.fodselsdato && (
                        <Normaltekst className="header--personalia__fodselsdato">Fødselsdato: {formatISOString(cv.fodselsdato, 'D. MMMM YYYY')}</Normaltekst>
                    )}
                </Row>
                <Row>
                    <div className="personalia-container">
                        {(cv.epost) && (
                            <div className="personalia--item">
                                <div>
                                    <MailIkon />
                                </div>
                                <Normaltekst className="header--personalia__tekst">
                                    <a href={`mailto:${cv.epost}`} className="header--personalia__mail">{cv.epost}</a>
                                </Normaltekst>

                            </div>
                        )}
                        {cv.telefon && (
                            <div className="personalia--item">
                                <div>
                                    <TelefonIkon />
                                </div>

                                <Normaltekst className="header--personalia__tekst">
                                    <strong>{cv.telefon}</strong>
                                </Normaltekst>

                            </div>
                        )}
                        {cv.adresse && cv.adresse.adrlinje1 && <div className="personalia--item">

                            <div>
                                <AdresseIkon />
                            </div>
                            <Normaltekst className="header--personalia__tekst">
                                {cv.adresse.adrlinje1}
                                {(cv.adresse.postnr || cv.adresse.poststednavn) ?
                                    (', ') : null}

                                {cv.adresse.postnr} {cv.adresse.poststednavn}
                            </Normaltekst>
                        </div>}
                    </div>
                </Row>
            </div>

        );
    }
}

VisKandidatPersonalia.propTypes = {
    cv: cvPropTypes.isRequired
};

export default connect()(VisKandidatPersonalia);
