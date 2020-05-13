import React, { FunctionComponent } from 'react';
import { Column, Container } from 'nav-frontend-grid';
import { Normaltekst } from 'nav-frontend-typografi';
import TelefonIkon from './ikon/TelefonIkon';
import MailIkon from './ikon/MailIkon';
import AdresseIkon from './ikon/AdresseIkon';
import VisKandidatForrigeNeste from './VisKandidatForrigeNeste';
import { capitalizeFirstLetter } from '../../felles/sok/utils';
import { LenkeMedChevron } from './lenkeMedChevron/LenkeMedChevron';
import Sidetittel from '../../felles/common/Sidetittel';
import {
    formaterFødselsdato,
    formatMobileTelephoneNumber,
    formatterAdresse,
} from './personaliaFormattering';
import './VisKandidatPersonalia.less';

interface Props {
    cv: any;
    tilbakeLink: string;
    antallKandidater: number;
    gjeldendeKandidatIndex: number;
    forrigeKandidat: string;
    nesteKandidat: string;
    fantCv: boolean;
}

const VisKandidatPersonalia: FunctionComponent<Props> = ({
    cv,
    antallKandidater,
    tilbakeLink,
    gjeldendeKandidatIndex,
    forrigeKandidat,
    nesteKandidat,
    fantCv,
}) => {
    let fornavnStorForbokstav;
    if (cv.fornavn) {
        fornavnStorForbokstav = capitalizeFirstLetter(cv.fornavn);
    }
    let etternavnStorForbokstav;
    if (cv.etternavn) {
        etternavnStorForbokstav = capitalizeFirstLetter(cv.etternavn);
    }

    const tilbakeLenkeTekst = tilbakeLink.includes('kandidater/lister')
        ? 'Til kandidatlisten'
        : 'Til kandidatsøket';
    const veilederinfo = cv.veilederNavn
        ? `${cv.veilederNavn} (${cv.veilederIdent})`
        : 'ikke tildelt';
    const lenkeClass = 'header--personalia__lenke--veileder';

    return (
        <div className="header--bakgrunn__veileder" id="bakgrunn-personalia">
            <Container className="blokk-s">
                <Column className="header--personalia__lenker--container">
                    <LenkeMedChevron
                        type="venstre"
                        to={tilbakeLink}
                        className={lenkeClass}
                        text={tilbakeLenkeTekst}
                    />
                    {fantCv && (
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
            <Sidetittel className="header--personalia__overskrift">
                {fantCv
                    ? `${fornavnStorForbokstav} ${etternavnStorForbokstav}`
                    : 'Informasjonen om kandidaten kan ikke vises'}
            </Sidetittel>
            <Normaltekst className="header--personalia__fodselsdato">
                {formaterFødselsdato(cv.fodselsdato, cv.fodselsnummer)}
                <span>&nbsp;&nbsp;|&nbsp;&nbsp;Veileder: {veilederinfo}</span>
            </Normaltekst>
            {fantCv && (
                <div className="personalia-container">
                    {cv.epost && (
                        <div className="personalia--item">
                            <div className="personalia--icon">
                                <MailIkon />
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
                                <TelefonIkon />
                            </div>
                            <Normaltekst className="header--personalia__tekst">
                                <strong>{formatMobileTelephoneNumber(cv.telefon)}</strong>
                            </Normaltekst>
                        </div>
                    )}
                    {cv.adresse && cv.adresse.adrlinje1 && (
                        <div className="personalia--item">
                            <div className="personalia--icon">
                                <AdresseIkon />
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
            )}
        </div>
    );
};

export default VisKandidatPersonalia;
