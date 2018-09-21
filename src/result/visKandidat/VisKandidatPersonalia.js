import { Column, Row, Container } from 'nav-frontend-grid';
import { Normaltekst, Sidetittel } from 'nav-frontend-typografi';
import React from 'react';
import connect from 'react-redux/es/connect/connect';
import { Link } from 'react-router-dom';
import NavFrontendChevron from 'nav-frontend-chevron';
import { formatISOString } from '../../common/dateUtils';
import cvPropTypes from '../../PropTypes';

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

                <Container>

                    <Column sm="4" >
                        {(cv.epost) && (
                            <Normaltekst>
                                <a href={`mailto:${cv.epost}`} className="lenke header--personalia__mail">{cv.epost}</a>
                            </Normaltekst>
                        )}
                    </Column>
                    <Column sm="4" className="header--personalia">
                        {cv.telefon && (
                            <Normaltekst>
                                <strong>Telefon: {cv.telefon}</strong>
                            </Normaltekst>
                        )}
                    </Column>
                    <Column sm="4" >
                        {cv.adresse && cv.adresse.adrlinje1 && (
                            <Normaltekst className="header--personalia">
                                {cv.adresse.adrlinje1}
                                {(cv.adresse.postnr || cv.adresse.poststednavn) ?
                                    (', ') : null}
                                {cv.adresse.postnr} {cv.adresse.poststednavn}
                            </Normaltekst>
                        )}
                    </Column>

                </Container>

            </div>
        );
    }
}

VisKandidatPersonalia.propTypes = {
    cv: cvPropTypes.isRequired
};

export default connect()(VisKandidatPersonalia);
