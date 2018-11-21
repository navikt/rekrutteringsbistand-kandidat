import React from 'react';
import PropTypes from 'prop-types';
import { Column, Container, Row } from 'nav-frontend-grid';
import { Normaltekst, Sidetittel } from 'nav-frontend-typografi';
import { Link } from 'react-router-dom';
import NavFrontendChevron from 'nav-frontend-chevron';
import { formatISOString } from '../../common/dateUtils';
import cvPropTypes from '../../PropTypes';
import TelefonIkon from '../../common/ikoner/TelefonIkon';
import MailIkon from '../../common/ikoner/MailIkon';
import AdresseIkon from '../../common/ikoner/AdresseIkon';

export default class VisKandidatPersonalia extends React.Component {
    capitalizeFirstLetter = (inputString) => inputString.charAt(0).toUpperCase() + inputString.slice(1);

    formatTelephoneNumber = (inputString) => {
        const inputStringNoWhiteSpace = inputString.replace(/\s/g, '');
        return inputStringNoWhiteSpace.replace(/(\d{2})/g, '$1 ')
            .replace(/(^\s+|\s+$)/, '');
    };

    formatMobileTelephoneNumber = (inputString) => {
        const inputStringNoWhiteSpace = inputString.replace(/\s/g, '');
        const actualNumber = inputStringNoWhiteSpace.slice(-8);
        const countryCode = inputStringNoWhiteSpace.slice(-99, -8);
        const lastString = actualNumber.slice(-3);
        const midString = actualNumber.slice(-5, -3);
        const firstString = actualNumber.slice(-8, -5);

        return `${countryCode} ${firstString} ${midString} ${lastString}`;
    };

    render() {
        const { cv, contextRoot, kandidatListe, stillingsId, forrigeKandidat, nesteKandidat } = this.props;

        let tilbakeLink;
        if (kandidatListe) {
            tilbakeLink = `/${contextRoot}/lister/detaljer/${kandidatListe}`;
        } else if (stillingsId) {
            tilbakeLink = `/${contextRoot}/stilling/${stillingsId}`;
        } else {
            tilbakeLink = `/${contextRoot}`;
        }

        let fornavnStorForbokstav;
        if (cv.fornavn) {
            fornavnStorForbokstav = this.capitalizeFirstLetter(cv.fornavn.toLowerCase());
        }
        let etternavnStorForbokstav;
        if (cv.etternavn) {
            etternavnStorForbokstav = this.capitalizeFirstLetter(cv.etternavn.toLowerCase());
        }

        const lenkeClass = this.props.appContext === 'veileder' ? 'header--personalia__lenke--veileder' : 'header--personalia__lenke';

        return (
            <div className={this.props.appContext === 'arbeidsgiver' ? 'header--bakgrunn__arbeidsgiver' : 'header--bakgrunn__veileder'} id="bakgrunn-personalia">

                <Container className="blokk-s">
                    <Column className="header--personalia__lenker--container">
                        <Link
                            to={tilbakeLink}
                            className={lenkeClass}
                        >
                            <NavFrontendChevron type="venstre" /> Til {kandidatListe ? 'kandidatlisten' : 'kandidatsøket'}
                        </Link>

                        <div className="navigering-forrige-neste">
                            {forrigeKandidat &&
                                <Link
                                    to={stillingsId ? `/${contextRoot}/stilling/${stillingsId}/cv?kandidatNr=${forrigeKandidat}` : `/${contextRoot}/cv?kandidatNr=${forrigeKandidat}`}
                                    className={lenkeClass}
                                >
                                    <NavFrontendChevron type="venstre" /> Forrige kandidat
                                </Link>
                            }
                            {nesteKandidat ? (
                                <Link
                                    to={stillingsId ? `/${contextRoot}/stilling/${stillingsId}/cv?kandidatNr=${nesteKandidat}` : `/${contextRoot}/cv?kandidatNr=${nesteKandidat}`}
                                    className={lenkeClass}
                                >
                                    Neste kandidat <NavFrontendChevron type="høyre" />
                                </Link>) : (<div className="header--personalia__lenke--placeholder" />
                            )
                            }
                        </div>
                    </Column>
                </Container>

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
                                <div className="personalia--icon" >
                                    <MailIkon color={this.props.appContext === 'veileder' ? '#3E3832' : '#FFFFFF'} />
                                </div>
                                <Normaltekst className="header--personalia__tekst">
                                    <a
                                        href={`mailto:${cv.epost}`}
                                        className={this.props.appContext === 'arbeidsgiver' ? 'header--personalia__mail' : 'header--personalia__mail--veileder'}
                                    >
                                        {cv.epost}
                                    </a>
                                </Normaltekst>

                            </div>
                        )}
                        {(cv.telefon || cv.mobiltelefon) && (
                            <div className="personalia--item">
                                <div className="personalia--icon">
                                    <TelefonIkon color={this.props.appContext === 'veileder' ? '#3E3832' : '#FFFFFF'} />
                                </div>
                                <Column>
                                    {cv.mobiltelefon &&
                                        <Normaltekst className="header--personalia__tekst">
                                            <strong>
                                                {this.formatMobileTelephoneNumber(cv.mobiltelefon)}
                                            </strong>
                                        </Normaltekst>
                                    }
                                    {cv.telefon &&
                                        <Normaltekst className="header--personalia__tekst">
                                            <strong>
                                                {this.formatTelephoneNumber(cv.telefon)}
                                            </strong>
                                        </Normaltekst>
                                    }
                                </Column>
                            </div>
                        )}
                        {cv.adresse && cv.adresse.adrlinje1 && <div className="personalia--item">

                            <div className="personalia--icon">
                                <AdresseIkon color={this.props.appContext === 'veileder' ? '#3E3832' : '#FFFFFF'} />
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

VisKandidatPersonalia.defaultProps = {
    kandidatListe: undefined,
    stillingsId: undefined,
    forrigeKandidat: undefined,
    nesteKandidat: undefined
};

VisKandidatPersonalia.propTypes = {
    cv: cvPropTypes.isRequired,
    appContext: PropTypes.string.isRequired,
    contextRoot: PropTypes.string.isRequired,
    kandidatListe: PropTypes.string,
    stillingsId: PropTypes.string,
    forrigeKandidat: PropTypes.string,
    nesteKandidat: PropTypes.string
};
