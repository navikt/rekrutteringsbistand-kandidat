import { Row } from 'nav-frontend-grid';
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
    render() {
        const cv = this.props.cv;
        return (
            <div className="header--bakgrunn">
                <Link
                    to={'/pam-kandidatsok'}
                    className="header--personalia__lenke"
                >
                    <NavFrontendChevron type="venstre" /> Til kandidatsøk
                </Link>

                <Row xs="12">

                    <Sidetittel className="header--personalia">
                        {cv.fornavn} {cv.etternavn}
                    </Sidetittel>
                    {cv.fodselsdato && (
                        <Normaltekst className="header--personalia__fodselsdato">Fødselsdato: {formatISOString(cv.fodselsdato, 'D. MMMM YYYY')}</Normaltekst>
                    )}
                </Row>
                <div className="personalia-container" >
                    {(cv.epost) && (
                        <div className="personalia--item">
                            <MailIkon />
                            <Normaltekst className="header--personalia">
                                <a href={`mailto:${cv.epost}`} className="header--personalia__mail">{cv.epost}</a>
                            </Normaltekst>

                        </div>
                    )}
                    {cv.telefon && (
                        <div className="personalia--item">
                            <TelefonIkon />
                            <Normaltekst className="header--personalia">
                                <strong>{cv.telefon}</strong>
                            </Normaltekst>

                        </div>
                    )}
                    {cv.adresse && cv.adresse.adrlinje1 && (
                        <div className="personalia--item">

                            <AdresseIkon />
                            <Normaltekst className="header--personalia">
                                {cv.adresse.adrlinje1}
                                {(cv.adresse.postnr || cv.adresse.poststednavn) ?
                                    (', ') : null}
                                {cv.adresse.postnr} {cv.adresse.poststednavn}
                            </Normaltekst>

                        </div>
                    )}

                </div>

            </div>
        );
    }
}

VisKandidatPersonalia.propTypes = {
    cv: cvPropTypes.isRequired
};

export default connect()(VisKandidatPersonalia);
