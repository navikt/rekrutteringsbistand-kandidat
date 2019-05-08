import React from 'react';
import PropTypes from 'prop-types';
import { Column, Container } from 'nav-frontend-grid';
import { Normaltekst } from 'nav-frontend-typografi';
import { formatISOString, formatterDato } from '../../common/dateUtils';
import cvPropTypes from '../../PropTypes';
import TelefonIkon from '../../common/ikoner/TelefonIkon';
import MailIkon from '../../common/ikoner/MailIkon';
import AdresseIkon from '../../common/ikoner/AdresseIkon';
import VisKandidatForrigeNeste from './VisKandidatForrigeNeste';
import { capitalizeFirstLetter, capitalizePoststed } from '../../sok/utils';
import { LenkeMedChevron } from '../../common/lenkeMedChevron/LenkeMedChevron.tsx';
import Sidetittel from '../../common/Sidetittel';

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
        const { cv, appContext, antallKandidater, tilbakeLink, gjeldendeKandidat, forrigeKandidat, nesteKandidat, fantCv, visNavigasjon } = this.props;

        let fornavnStorForbokstav;
        if (cv.fornavn) {
            fornavnStorForbokstav = capitalizeFirstLetter(cv.fornavn);
        }
        let etternavnStorForbokstav;
        if (cv.etternavn) {
            etternavnStorForbokstav = capitalizeFirstLetter(cv.etternavn);
        }

        const lenkeClass = appContext === 'veileder' ? 'header--personalia__lenke--veileder' : 'VisKandidat__ForrigeNeste';

        let lenkeText = 'Til kandidatsøket';
        if (tilbakeLink.includes('kandidater/lister')) {
            lenkeText = 'Til kandidatlisten';
        } else if (tilbakeLink.includes('kandidater-next')) {
            lenkeText = 'Til liste kandidatmatch';
        }
        return (
            <div className={appContext === 'arbeidsgiver' ? 'header--bakgrunn__arbeidsgiver' : 'header--bakgrunn__veileder'} id="bakgrunn-personalia">
                <Container className="blokk-s">
                    <Column className="header--personalia__lenker--container">
                        <LenkeMedChevron
                            type="venstre"
                            to={tilbakeLink}
                            className={lenkeClass}
                            text={lenkeText}
                        />
                        {fantCv && visNavigasjon && (
                            <VisKandidatForrigeNeste
                                lenkeClass={lenkeClass}
                                forrigeKandidat={forrigeKandidat}
                                nesteKandidat={nesteKandidat}
                                gjeldendeKandidat={gjeldendeKandidat}
                                antallKandidater={antallKandidater}
                            />
                        )}
                    </Column>
                </Container>

                <div>
                    <Sidetittel className="header--personalia__overskrift">
                        {fantCv ? `${fornavnStorForbokstav} ${etternavnStorForbokstav}` : 'Informasjonen om kandidaten kan ikke vises'}
                    </Sidetittel>
                    {appContext === 'veileder'
                        ? <Normaltekst className="header--personalia__fodselsdato">{fodselsdatoForVeileder(cv.fodselsdato, cv.fodselsnummer)}</Normaltekst>
                        : cv.fodselsdato && (
                            <Normaltekst className="header--personalia__fodselsdato">Fødselsdato: {formatISOString(cv.fodselsdato, 'D. MMMM YYYY')}</Normaltekst>
                        )
                    }
                </div>
                {fantCv &&
                    <div>
                        <div className="personalia-container">
                            {(cv.epost) && (
                                <div className="personalia--item">
                                    <div className="personalia--icon" >
                                        <MailIkon color={appContext === 'veileder' ? '#3E3832' : '#062140'} />
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
                                        <TelefonIkon color={appContext === 'veileder' ? '#3E3832' : '#062140'} />
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
                                    <AdresseIkon color={appContext === 'veileder' ? '#3E3832' : '#062140'} />
                                </div>
                                <Normaltekst className="header--personalia__tekst">
                                    {this.formatterAdresse(cv.adresse.adrlinje1, cv.adresse.postnr, cv.adresse.poststednavn)}
                                </Normaltekst>
                            </div>}
                        </div>
                    </div>
                }
            </div>

        );
    }
}

VisKandidatPersonalia.defaultProps = {
    antallKandidater: undefined,
    gjeldendeKandidat: undefined,
    forrigeKandidat: undefined,
    nesteKandidat: undefined,
    fantCv: true,
    visNavigasjon: true
};

VisKandidatPersonalia.propTypes = {
    cv: cvPropTypes.isRequired,
    appContext: PropTypes.string.isRequired,
    antallKandidater: PropTypes.number,
    tilbakeLink: PropTypes.string.isRequired,
    gjeldendeKandidat: PropTypes.number,
    forrigeKandidat: PropTypes.string,
    nesteKandidat: PropTypes.string,
    fantCv: PropTypes.bool,
    visNavigasjon: PropTypes.bool
};
