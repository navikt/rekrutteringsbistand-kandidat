import React, { FunctionComponent, ReactNode } from 'react';
import { Systemtittel } from 'nav-frontend-typografi';
import ForrigeNeste from './forrige-neste/ForrigeNeste';
import { capitalizeFirstLetter } from '../../kandidatsøk/utils';
import { LenkeMedChevron } from './lenke-med-chevron/LenkeMedChevron';
import { formatMobileTelephoneNumber, formatterAdresse } from './personaliaFormattering';
import { formatterDato } from '../../utils/dateUtils';
import useMaskerFødselsnumre from '../../app/useMaskerFødselsnumre';
import Cv from '../cv/reducer/cv-typer';
import { Nettressurs, Nettstatus } from '../../api/Nettressurs';
import './Kandidatheader.less';

interface Props {
    cv: Nettressurs<Cv>;
    tilbakeLink: string;
    antallKandidater: number;
    gjeldendeKandidatIndex: number;
    forrigeKandidat?: string;
    nesteKandidat?: string;
}

const Kandidatheader: FunctionComponent<Props> = ({
    cv,
    antallKandidater,
    tilbakeLink,
    gjeldendeKandidatIndex,
    forrigeKandidat,
    nesteKandidat,
}) => {
    useMaskerFødselsnumre();

    const tilbakeLenkeTekst = tilbakeLink.includes('kandidater/lister')
        ? 'Til kandidatlisten'
        : 'Til kandidatsøket';

    let fødselsinfo: ReactNode = '';
    if (cv.kind === Nettstatus.Suksess) {
        fødselsinfo = cv.data.fodselsdato ? (
            <span>
                Fødselsdato:{' '}
                <strong>
                    {formatterDato(new Date(cv.data.fodselsdato))}{' '}
                    {cv.data.fodselsnummer && <>({cv.data.fodselsnummer})</>}
                </strong>
            </span>
        ) : (
            <span>
                Fødselsnummer: <strong>{cv.data.fodselsnummer}</strong>
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
                        {cv.kind === Nettstatus.Suksess && hentNavnFraCv(cv.data)}
                        {cv.kind === Nettstatus.FinnesIkke ||
                            (cv.kind === Nettstatus.Feil &&
                                'Informasjonen om kandidaten kan ikke vises')}
                        {cv.kind === Nettstatus.LasterInn && <span></span>}
                    </Systemtittel>
                    <div className="kandidatheader__kontaktinfo blokk-xxs">
                        {fødselsinfo}
                        {cv.kind === Nettstatus.Suksess ? (
                            <span>
                                Veileder:{' '}
                                <strong>
                                    {cv.data.veilederNavn
                                        ? `${cv.data.veilederNavn} (${cv.data.veilederIdent})`
                                        : 'ikke tildelt'}
                                </strong>
                            </span>
                        ) : (
                            <span></span>
                        )}
                    </div>
                    <div className="kandidatheader__kontaktinfo">
                        {cv.kind === Nettstatus.Suksess ? (
                            <>
                                {cv.data.epost && (
                                    <span>
                                        E-post:{' '}
                                        <a className="lenke" href={`mailto:${cv.data.epost}`}>
                                            {cv.data.epost}
                                        </a>
                                    </span>
                                )}
                                {cv.data.telefon && (
                                    <span>
                                        Telefon:{' '}
                                        <strong>
                                            {formatMobileTelephoneNumber(cv.data.telefon)}
                                        </strong>
                                    </span>
                                )}
                                {cv.data.adresse && cv.data.adresse.adrlinje1 && (
                                    <span>
                                        Adresse:{' '}
                                        <strong>
                                            {formatterAdresse(
                                                cv.data.adresse.adrlinje1,
                                                cv.data.adresse.postnr,
                                                cv.data.adresse.poststednavn
                                            )}
                                        </strong>
                                    </span>
                                )}
                            </>
                        ) : (
                            <span></span>
                        )}
                    </div>
                </div>
                <ForrigeNeste
                    className="kandidatheader__forrige-neste-knapper"
                    lenkeClass=""
                    forrigeKandidat={forrigeKandidat}
                    nesteKandidat={nesteKandidat}
                    gjeldendeKandidatIndex={gjeldendeKandidatIndex}
                    antallKandidater={antallKandidater}
                />
            </div>
        </header>
    );
};

export const hentNavnFraCv = (cv: Cv) => {
    const fornavn = capitalizeFirstLetter(cv.fornavn);
    const etternavn = capitalizeFirstLetter(cv.etternavn);

    return `${fornavn} ${etternavn}`;
};

export default Kandidatheader;
