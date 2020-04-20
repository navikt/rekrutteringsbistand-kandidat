import React from 'react';
import PropTypes from 'prop-types';
import { Column, Container } from 'nav-frontend-grid';
import { Normaltekst } from 'nav-frontend-typografi';
import cvPropTypes from '../../felles/PropTypes';
import TelefonIkon from '../../felles/common/ikoner/TelefonIkon';
import MailIkon from '../../felles/common/ikoner/MailIkon';
import AdresseIkon from '../../felles/common/ikoner/AdresseIkon';
import VisKandidatForrigeNeste from './VisKandidatForrigeNeste';
import { capitalizeFirstLetter } from '../../felles/sok/utils';
import { LenkeMedChevron } from './lenkeMedChevron/LenkeMedChevron.tsx';
import Sidetittel from '../../felles/common/Sidetittel.tsx';
import {
    formaterFødselsdato,
    formatMobileTelephoneNumber,
    formatterAdresse,
} from './personaliaFormattering';

class VisKandidatPersonalia extends React.Component {
    render() {
        const {
            cv,
            antallKandidater,
            tilbakeLink,
            gjeldendeKandidatIndex,
            forrigeKandidat,
            nesteKandidat,
            fantCv,
            visNavigasjon,
        } = this.props;

        let fornavnStorForbokstav;
        if (cv.fornavn) {
            fornavnStorForbokstav = capitalizeFirstLetter(cv.fornavn);
        }
        let etternavnStorForbokstav;
        if (cv.etternavn) {
            etternavnStorForbokstav = capitalizeFirstLetter(cv.etternavn);
        }

        const lenkeClass = 'header--personalia__lenke--veileder';
        let lenkeText = 'Til kandidatsøket';
        if (tilbakeLink.includes('kandidater/lister')) {
            lenkeText = 'Til kandidatlisten';
        } else if (tilbakeLink.includes('kandidater-next')) {
            lenkeText = 'Til liste kandidatmatch';
        }
        return (
            <div className="header--bakgrunn__veileder" id="bakgrunn-personalia">
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
                                gjeldendeKandidatIndex={gjeldendeKandidatIndex}
                                antallKandidater={antallKandidater}
                            />
                        )}
                    </Column>
                </Container>

                <div>
                    <Sidetittel className="header--personalia__overskrift">
                        {fantCv
                            ? `${fornavnStorForbokstav} ${etternavnStorForbokstav}`
                            : 'Informasjonen om kandidaten kan ikke vises'}
                    </Sidetittel>
                    <Normaltekst className="header--personalia__fodselsdato">
                        {formaterFødselsdato(cv.fodselsdato, cv.fodselsnummer)}
                    </Normaltekst>
                </div>
                {fantCv && (
                    <div>
                        <div className="personalia-container">
                            {cv.epost && (
                                <div className="personalia--item">
                                    <div className="personalia--icon">
                                        <MailIkon color="#3E3832" />
                                    </div>
                                    <Normaltekst className="header--personalia__tekst">
                                        <a
                                            href={`mailto:${cv.epost}`}
                                            className="header--personalia__mail--veileder"
                                        >
                                            {cv.epost}
                                        </a>
                                    </Normaltekst>
                                </div>
                            )}
                            {cv.telefon && (
                                <div className="personalia--item">
                                    <div className="personalia--icon">
                                        <TelefonIkon color="#3E3832" />
                                    </div>
                                    <Normaltekst className="header--personalia__tekst">
                                        <strong>{formatMobileTelephoneNumber(cv.telefon)}</strong>
                                    </Normaltekst>
                                </div>
                            )}
                            {cv.adresse && cv.adresse.adrlinje1 && (
                                <div className="personalia--item">
                                    <div className="personalia--icon">
                                        <AdresseIkon color="#3E3832" />
                                    </div>
                                    <Normaltekst className="header--personalia__tekst">
                                        {formatterAdresse(
                                            cv.adresse.adrlinje1,
                                            cv.adresse.postnr,
                                            cv.adresse.poststednavn
                                        )}
                                    </Normaltekst>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

VisKandidatPersonalia.defaultProps = {
    antallKandidater: undefined,
    gjeldendeKandidatIndex: undefined,
    forrigeKandidat: undefined,
    nesteKandidat: undefined,
    fantCv: true,
    visNavigasjon: true,
};

VisKandidatPersonalia.propTypes = {
    cv: cvPropTypes.isRequired,
    antallKandidater: PropTypes.number,
    tilbakeLink: PropTypes.string.isRequired,
    gjeldendeKandidatIndex: PropTypes.number,
    forrigeKandidat: PropTypes.string,
    nesteKandidat: PropTypes.string,
    fantCv: PropTypes.bool,
    visNavigasjon: PropTypes.bool,
};

export default VisKandidatPersonalia;
