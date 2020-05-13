import React, { FunctionComponent } from 'react';
import { Systemtittel } from 'nav-frontend-typografi';
import VisKandidatForrigeNeste from '../VisKandidatForrigeNeste';
import { capitalizeFirstLetter } from '../../../felles/sok/utils';
import { LenkeMedChevron } from '../lenkeMedChevron/LenkeMedChevron';
import {
    formaterFødselsdato,
    formatMobileTelephoneNumber,
    formatterAdresse,
} from './personaliaFormattering';
import './CvHeader.less';

interface Props {
    cv: any;
    tilbakeLink: string;
    antallKandidater: number;
    gjeldendeKandidatIndex: number;
    forrigeKandidat: string;
    nesteKandidat: string;
    fantCv: boolean;
}

const CvHeader: FunctionComponent<Props> = ({
    cv,
    antallKandidater,
    tilbakeLink,
    gjeldendeKandidatIndex,
    forrigeKandidat,
    nesteKandidat,
    fantCv,
}) => {
    let fornavn;
    if (cv.fornavn) {
        fornavn = capitalizeFirstLetter(cv.fornavn);
    }
    let etternavn;
    if (cv.etternavn) {
        etternavn = capitalizeFirstLetter(cv.etternavn);
    }

    const tilbakeLenkeTekst = tilbakeLink.includes('kandidater/lister')
        ? 'Til kandidatlisten'
        : 'Til kandidatsøket';
    const veilederinfo = cv.veilederNavn
        ? `${cv.veilederNavn} (${cv.veilederIdent})`
        : 'ikke tildelt';

    return (
        <header className="cv-header">
            <div className="cv-header__inner">
                <LenkeMedChevron type="venstre" to={tilbakeLink} text={tilbakeLenkeTekst} />
                <div className="cv-header__info-wrapper">
                    <Systemtittel>
                        {fantCv
                            ? `${fornavn} ${etternavn}`
                            : 'Informasjonen om kandidaten kan ikke vises'}
                    </Systemtittel>
                    <div className="cv-header__kontaktinfo">
                        <span>{formaterFødselsdato(cv.fodselsdato, cv.fodselsnummer)}</span>
                        <span>
                            Veileder: <strong>{veilederinfo}</strong>
                        </span>
                    </div>
                    <div className="cv-header__kontaktinfo">
                        {cv.epost && (
                            <span>
                                E-post: <a href={`mailto:${cv.epost}`}>{cv.epost}</a>
                            </span>
                        )}
                        {cv.telefon && (
                            <span>
                                Telefon: <strong>{formatMobileTelephoneNumber(cv.telefon)}</strong>
                            </span>
                        )}
                        {cv.adresse && cv.adresse.adrlinje1 && (
                            <span>
                                Adresse:{' '}
                                <strong>
                                    {formatterAdresse(
                                        cv.adresse.adrlinje1,
                                        cv.adresse.postnr,
                                        cv.adresse.poststednavn
                                    )}
                                </strong>
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </header>
        //             {fantCv && (
        //                 <VisKandidatForrigeNeste
        //                     lenkeClass={lenkeClass}
        //                     forrigeKandidat={forrigeKandidat}
        //                     nesteKandidat={nesteKandidat}
        //                     gjeldendeKandidatIndex={gjeldendeKandidatIndex}
        //                     antallKandidater={antallKandidater}
        //                 />
        //             )}
    );
};

export default CvHeader;
