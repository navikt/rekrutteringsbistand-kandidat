import React from 'react';
import { Systemtittel } from 'nav-frontend-typografi';
import Skeleton from 'react-loading-skeleton';

import { capitalizeFirstLetter } from '../../kandidatsøk/utils';
import { Kandidatnavigering } from '../fra-søk/useNavigerbareKandidaterFraSøk';
import { LenkeMedChevron } from './lenke-med-chevron/LenkeMedChevron';
import { Nettressurs, Nettstatus } from '../../api/Nettressurs';
import { Søkekontekst } from '../søkekontekst';
import Cv from '../cv/reducer/cv-typer';
import ForrigeNeste from './forrige-neste/ForrigeNeste';
import useMaskerFødselsnumre from '../../app/useMaskerFødselsnumre';
import Personalia from './Personalia';
import css from './Kandidatheader.module.css';
import Fødselsinfo from './Fødselsinfo';

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
                                <Fødselsinfo cv={cv.data} />
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

const hentNavnFraCv = (cv: Cv) => {
    const fornavn = capitalizeFirstLetter(cv.fornavn);
    const etternavn = capitalizeFirstLetter(cv.etternavn);

    return `${fornavn} ${etternavn}`;
};

export default Kandidatheader;
