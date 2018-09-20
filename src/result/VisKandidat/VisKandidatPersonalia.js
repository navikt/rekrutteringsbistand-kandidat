import { Column, Row } from 'nav-frontend-grid';
import { Normaltekst, Sidetittel } from 'nav-frontend-typografi';
import React from 'react';
import connect from 'react-redux/es/connect/connect';
import { Link } from 'react-router-dom';
import { formatISOString } from '../../common/dateUtils';
import cvPropTypes from '../../PropTypes';

class VisKandidatPersonalia extends React.Component {
    render() {
        const cv = this.props.cv;
        return (
            <div>
                <Row className="blokk-s personalia--modal">
                    <Column xs="12">
                        <Link
                            to={'/pam-kandidatsok'}
                        >
                            Tilbake til sok
                        </Link>
                        <Sidetittel className="navn--modal">
                            {cv.fornavn} {cv.etternavn}
                        </Sidetittel>
                        {cv.fodselsdato && (
                            <Normaltekst><strong>Fødselsdato:</strong> {formatISOString(cv.fodselsdato, 'D. MMMM YYYY')}</Normaltekst>
                        )}
                        {cv.adresse && cv.adresse.adrlinje1 && (
                            <Normaltekst>
                                <strong>Adresse:</strong> {cv.adresse.adrlinje1}
                                {(cv.adresse.postnr || cv.adresse.poststednavn) ?
                                    (', ') : null}
                                {cv.adresse.postnr} {cv.adresse.poststednavn}
                            </Normaltekst>
                        )}
                        {(cv.epost || cv.telefon) && (
                            <div className="kontakt--modal">
                                {cv.epost && (
                                    <Normaltekst>
                                        <i className="mail--icon" />
                                        <strong>E-post:</strong>
                                        <a href={`mailto:${cv.epost}`} className="lenke mail--text">{cv.epost}</a>
                                    </Normaltekst>
                                )}
                                {cv.telefon && (
                                    <Normaltekst>
                                        <i className="telefon--icon" />
                                        <strong>Telefon:</strong> {/* TODO: Telefon er ikke med
                                    fra backend per nå, oppdatere denne når det er med */}
                                        {/* <a href={`tel:${cv.telefon}`} className="lenke telefon--text">{cv.telefon}</a> */}
                                    </Normaltekst>
                                )}
                            </div>
                        )}
                    </Column>
                </Row>
            </div>
        );
    }
}

VisKandidatPersonalia.propTypes = {
    cv: cvPropTypes.isRequired
};

export default connect()(VisKandidatPersonalia);
