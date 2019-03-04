import React from 'react';
import PropTypes from 'prop-types';
import { Column, Container, Row } from 'nav-frontend-grid';
import { Normaltekst, Sidetittel } from 'nav-frontend-typografi';
import { Link } from 'react-router-dom';
import NavFrontendChevron from 'nav-frontend-chevron';
import { formatISOString, formatterDato } from '../../common/dateUtils';
import cvPropTypes from '../../PropTypes';
import TelefonIkon from '../../common/ikoner/TelefonIkon';
import MailIkon from '../../common/ikoner/MailIkon';
import AdresseIkon from '../../common/ikoner/AdresseIkon';
import VisKandidatForrigeNeste from './VisKandidatForrigeNeste';
import { capitalizeFirstLetter, capitalizePoststed } from '../../sok/utils';

const fodselsdatoForVeileder = (fodselsdato, fodselsnummer) => {
    if (fodselsdato) {
        return `Fødselsdato: ${formatterDato(new Date(fodselsdato))}${fodselsnummer && ` (${fodselsnummer})`}`;
    } else if (fodselsnummer) {
        return `Fødselsnummer: ${fodselsnummer}`;
    }
    return '';
};

export default class VisKandidatPersonalia extends React.Component {
    formatMobileTelephoneNumber = (inputString) => {
        const inputStringNoWhiteSpace = inputString.replace(/\s/g, '');
        const actualNumber = inputStringNoWhiteSpace.slice(-8);
        const countryCode = inputStringNoWhiteSpace.slice(-99, -8);
        const lastString = actualNumber.slice(-3);
        const midString = actualNumber.slice(-5, -3);
        const firstString = actualNumber.slice(-8, -5);

        return `${countryCode} ${firstString} ${midString} ${lastString}`;
    };

    formatterAdresse = (gate, postnummer, poststed) => {
        const sisteDel = [postnummer, poststed ? capitalizePoststed(poststed) : null]
            .filter((string) => string)
            .join(' ');
        return [gate, sisteDel]
            .filter((string) => string)
            .join(', ');
    };

    render() {
        const { cv, contextRoot, appContext, kandidatListe, antallKandidater, stillingsId, gjeldendeKandidat, forrigeKandidat, nesteKandidat, fantCv } = this.props;

        let tilbakeLink;
        if (kandidatListe && appContext === 'veileder') {
            tilbakeLink = `/${contextRoot}/detaljer/${kandidatListe}`;
        } else if (kandidatListe) {
            tilbakeLink = `/${contextRoot}/lister/detaljer/${kandidatListe}`;
        } else if (stillingsId && (contextRoot !== 'kandidater/lister')) {
            tilbakeLink = `/${contextRoot}/stilling/${stillingsId}`;
        } else {
            tilbakeLink = `/${contextRoot}`;
        }

        let fornavnStorForbokstav;
        if (cv.fornavn) {
            fornavnStorForbokstav = capitalizeFirstLetter(cv.fornavn);
        }
        let etternavnStorForbokstav;
        if (cv.etternavn) {
            etternavnStorForbokstav = capitalizeFirstLetter(cv.etternavn);
        }

        const lenkeClass = appContext === 'veileder' ? 'header--personalia__lenke--veileder' : 'header--personalia__lenke';

        return (
            <div className={appContext === 'arbeidsgiver' ? 'header--bakgrunn__arbeidsgiver' : 'header--bakgrunn__veileder'} id="bakgrunn-personalia">

                <Container className="blokk-s">
                    <Column className="header--personalia__lenker--container">
                        <Link
                            to={tilbakeLink}
                            className={lenkeClass}
                        >
                            <NavFrontendChevron type="venstre" /> Til {kandidatListe || (contextRoot === 'kandidater/lister') ? 'kandidatlisten' : 'kandidatsøket'}
                        </Link>
                        <VisKandidatForrigeNeste
                            lenkeClass={lenkeClass}
                            forrigeKandidat={forrigeKandidat}
                            nesteKandidat={nesteKandidat}
                            gjeldendeKandidat={gjeldendeKandidat}
                            antallKandidater={antallKandidater}
                        />
                    </Column>
                </Container>

                <Row>
                    <Sidetittel className="header--personalia__overskrift">
                        {fantCv ? `${fornavnStorForbokstav} ${etternavnStorForbokstav}` : 'Informasjonen om kandidaten kan ikke vises'}
                    </Sidetittel>
                    {appContext === 'veileder'
                        ? <Normaltekst className="header--personalia__fodselsdato">{fodselsdatoForVeileder(cv.fodselsdato, cv.fodselsnummer)}</Normaltekst>
                        : cv.fodselsdato && (
                            <Normaltekst className="header--personalia__fodselsdato">Fødselsdato: {formatISOString(cv.fodselsdato, 'D. MMMM YYYY')}</Normaltekst>
                        )
                    }
                </Row>
                {fantCv &&
                    <Row>
                        <div className="personalia-container">
                            {(cv.epost) && (
                                <div className="personalia--item">
                                    <div className="personalia--icon" >
                                        <MailIkon color={appContext === 'veileder' ? '#3E3832' : '#FFFFFF'} />
                                    </div>
                                    <Normaltekst className="header--personalia__tekst">
                                        <a
                                            href={`mailto:${cv.epost}`}
                                            className={appContext === 'arbeidsgiver' ? 'header--personalia__mail' : 'header--personalia__mail--veileder'}
                                        >
                                            {cv.epost}
                                        </a>
                                    </Normaltekst>
                                </div>
                            )}
                            {cv.telefon && (
                                <div className="personalia--item">
                                    <div className="personalia--icon">
                                        <TelefonIkon color={appContext === 'veileder' ? '#3E3832' : '#FFFFFF'} />
                                    </div>
                                    <Normaltekst className="header--personalia__tekst">
                                        <strong>
                                            {this.formatMobileTelephoneNumber(cv.telefon)}
                                        </strong>
                                    </Normaltekst>
                                </div>
                            )}
                            {cv.adresse && cv.adresse.adrlinje1 && <div className="personalia--item">

                                <div className="personalia--icon">
                                    <AdresseIkon color={appContext === 'veileder' ? '#3E3832' : '#FFFFFF'} />
                                </div>
                                <Normaltekst className="header--personalia__tekst">
                                    {this.formatterAdresse(cv.adresse.adrlinje1, cv.adresse.postnr, cv.adresse.poststednavn)}
                                </Normaltekst>
                            </div>}
                        </div>
                    </Row>
                }
            </div>

        );
    }
}

VisKandidatPersonalia.defaultProps = {
    kandidatListe: undefined,
    antallKandidater: undefined,
    stillingsId: undefined,
    gjeldendeKandidat: undefined,
    forrigeKandidat: undefined,
    nesteKandidat: undefined,
    fantCv: true
};

VisKandidatPersonalia.propTypes = {
    cv: cvPropTypes.isRequired,
    appContext: PropTypes.string.isRequired,
    contextRoot: PropTypes.string.isRequired,
    kandidatListe: PropTypes.string,
    antallKandidater: PropTypes.number,
    stillingsId: PropTypes.string,
    gjeldendeKandidat: PropTypes.number,
    forrigeKandidat: PropTypes.string,
    nesteKandidat: PropTypes.string,
    fantCv: PropTypes.bool
};
