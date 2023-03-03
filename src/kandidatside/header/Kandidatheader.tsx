import React, { ReactNode } from 'react';
import { Systemtittel } from 'nav-frontend-typografi';
import Skeleton from 'react-loading-skeleton';

import { capitalizeFirstLetter } from '../../kandidatsøk/utils';
import { formaterDato } from '../../utils/dateUtils';
import { formatMobileTelephoneNumber, formatterAdresse } from './personaliaFormattering';
import { Kandidatnavigering } from '../fra-søk/useNavigerbareKandidaterFraSøk';
import { LenkeMedChevron } from './lenke-med-chevron/LenkeMedChevron';
import { Nettressurs, Nettstatus } from '../../api/Nettressurs';
import { Søkekontekst } from '../søkekontekst';
import Cv from '../cv/reducer/cv-typer';
import ForrigeNeste from './forrige-neste/ForrigeNeste';
import useMaskerFødselsnumre from '../../app/useMaskerFødselsnumre';
import css from './Kandidatheader.module.css';

type Props = {
    cv: Nettressurs<Cv>;
    søkekontekst?: Søkekontekst;
    kandidatnavigering: Kandidatnavigering | null;
    tilbakelenke: {
        to: string;
        state?: object;
    };
};

const Kandidatheader = ({ cv, tilbakelenke, søkekontekst, kandidatnavigering }: Props) => {
    useMaskerFødselsnumre();

    const tilbakeLenkeTekst = søkekontekst ? 'Til kandidatsøket' : 'Til kandidatlisten';

    let fødselsinfo: ReactNode;
    if (cv.kind === Nettstatus.Suksess) {
        fødselsinfo = cv.data.fodselsdato ? (
            <span>
                Fødselsdato:{' '}
                <strong>
                    {formaterDato(cv.data.fodselsdato)}{' '}
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
        <header className={css.header}>
            <div className={css.inner}>
                <div className={css.tilbakeknapp}>
                    <LenkeMedChevron
                        type="venstre"
                        to={tilbakelenke.to}
                        state={tilbakelenke.state}
                        text={tilbakeLenkeTekst}
                    />
                </div>
                <div>
                    <Systemtittel className="blokk-xs">
                        {cv.kind === Nettstatus.Suksess && hentNavnFraCv(cv.data)}
                        {cv.kind === Nettstatus.FinnesIkke ||
                            (cv.kind === Nettstatus.Feil &&
                                'Informasjonen om kandidaten kan ikke vises')}
                        {cv.kind === Nettstatus.LasterInn && <Skeleton width={200} />}
                    </Systemtittel>
                    <div className={css.kontaktinfo + ' blokk-xxs'}>
                        {cv.kind === Nettstatus.LasterInn && <Skeleton width={300} />}
                        {cv.kind === Nettstatus.Suksess && (
                            <>
                                {fødselsinfo}
                                <span>
                                    Veileder:{' '}
                                    <strong>
                                        {cv.data.veilederNavn
                                            ? `${cv.data.veilederNavn} (${cv.data.veilederIdent})`
                                            : 'ikke tildelt'}
                                    </strong>
                                </span>
                            </>
                        )}
                    </div>
                    <div className={css.kontaktinfo}>
                        {cv.kind === Nettstatus.LasterInn && <Skeleton width={600} />}
                        {cv.kind === Nettstatus.Suksess && <Personalia cv={cv.data} />}
                    </div>
                </div>
                {kandidatnavigering && (
                    <ForrigeNeste
                        className={css.forrigeNesteKnapper}
                        kandidatnavigering={kandidatnavigering}
                        lenkeClass=""
                    />
                )}
            </div>
        </header>
    );
};

const Personalia = ({ cv }: { cv: Cv }) => (
    <>
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
    </>
);

const hentNavnFraCv = (cv: Cv) => {
    const fornavn = capitalizeFirstLetter(cv.fornavn);
    const etternavn = capitalizeFirstLetter(cv.etternavn);

    return `${fornavn} ${etternavn}`;
};

export default Kandidatheader;
