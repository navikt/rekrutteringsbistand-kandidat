import React, { FunctionComponent } from 'react';
import { Systemtittel } from 'nav-frontend-typografi';
import ForrigeNeste from './forrige-neste/ForrigeNeste';
import { capitalizeFirstLetter } from '../../kandidatsøk/utils';
import { LenkeMedChevron } from './lenke-med-chevron/LenkeMedChevron';
import { formatMobileTelephoneNumber, formatterAdresse } from './personaliaFormattering';
import { formatterDato } from '../../utils/dateUtils';
import './Kandidatheader.less';
import useMaskerFødselsnumre from '../../application/useMaskerFødselsnumre';

interface Props {
    cv: any;
    tilbakeLink: string;
    antallKandidater: number;
    gjeldendeKandidatIndex: number;
    forrigeKandidat: string;
    nesteKandidat: string;
    fantCv: boolean;
}

const Kandidatheader: FunctionComponent<Props> = ({
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

    useMaskerFødselsnumre();

    const tilbakeLenkeTekst = tilbakeLink.includes('kandidater/lister')
        ? 'Til kandidatlisten'
        : 'Til kandidatsøket';
    const veilederinfo = cv.veilederNavn
        ? `${cv.veilederNavn} (${cv.veilederIdent})`
        : 'ikke tildelt';

    let fødselsinfo;
    if (cv.fodselsdato) {
        fødselsinfo = (
            <span>
                Fødselsdato:{' '}
                <strong>
                    {formatterDato(new Date(cv.fodselsdato))}{' '}
                    {cv.fodselsnummer && <>({cv.fodselsnummer})</>}
                </strong>
            </span>
        );
    } else if (cv.fodselsnummer) {
        fødselsinfo = (
            <span>
                Fødselsnummer: <strong>{cv.fodselsnummer}</strong>
            </span>
        );
    }

    return (
        <header className="kandidatheader">
            <div className="kandidatheader__inner">
                <div className="kandidatheader__tilbakeknapp">
                    <LenkeMedChevron type="venstre" to={tilbakeLink} text={tilbakeLenkeTekst} />
                </div>
                <div>
                    <Systemtittel className="blokk-xs">
                        {fantCv
                            ? `${fornavn} ${etternavn}`
                            : 'Informasjonen om kandidaten kan ikke vises'}
                    </Systemtittel>
                    <div className="kandidatheader__kontaktinfo blokk-xxs">
                        {fødselsinfo}
                        <span>
                            Veileder: <strong>{veilederinfo}</strong>
                        </span>
                    </div>
                    <div className="kandidatheader__kontaktinfo">
                        {cv.epost && (
                            <span>
                                E-post:{' '}
                                <a className="lenke" href={`mailto:${cv.epost}`}>
                                    {cv.epost}
                                </a>
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
                {fantCv && (
                    <ForrigeNeste
                        className="kandidatheader__forrige-neste-knapper"
                        lenkeClass=""
                        forrigeKandidat={forrigeKandidat}
                        nesteKandidat={nesteKandidat}
                        gjeldendeKandidatIndex={gjeldendeKandidatIndex}
                        antallKandidater={antallKandidater}
                    />
                )}
            </div>
        </header>
    );
};

export default Kandidatheader;
