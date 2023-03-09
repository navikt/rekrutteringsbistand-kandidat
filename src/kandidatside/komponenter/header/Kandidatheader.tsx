import React from 'react';
import Skeleton from 'react-loading-skeleton';

import { capitalizeFirstLetter } from '../../../kandidatsøk/utils';
import { Nettressurs, Nettstatus } from '../../../api/Nettressurs';
import Cv from '../../../cv/reducer/cv-typer';
import ForrigeNeste, { Kandidatnavigering } from './forrige-neste/ForrigeNeste';
import useMaskerFødselsnumre from '../../../app/useMaskerFødselsnumre';
import Personalia from './Personalia';
import css from './Kandidatheader.module.css';
import Fødselsinfo from './Fødselsinfo';
import { Link } from 'react-router-dom';
import { Back } from '@navikt/ds-icons';
import { BodyShort, Heading } from '@navikt/ds-react';

type Props = {
    cv: Nettressurs<Cv>;
    kandidatnavigering: Kandidatnavigering | null;
    tilbakelenkeTekst: string;
    tilbakelenke: {
        to: string;
        state?: object;
    };
};

const Kandidatheader = ({ cv, tilbakelenke, tilbakelenkeTekst, kandidatnavigering }: Props) => {
    useMaskerFødselsnumre();

    return (
        <>
            <nav className={css.navigasjon}>
                <div className={css.column}>
                    <Link className="navds-link" {...tilbakelenke}>
                        <Back />
                        {tilbakelenkeTekst}
                    </Link>
                    {kandidatnavigering && <ForrigeNeste kandidatnavigering={kandidatnavigering} />}
                </div>
            </nav>
            <div className={css.header}>
                <div className={css.column}>
                    {cv.kind === Nettstatus.Feil && (
                        <Heading level="1" size="medium">
                            Informasjonen om kandidaten kan ikke vises
                        </Heading>
                    )}

                    {cv.kind === Nettstatus.LasterInn && (
                        <>
                            <Heading level="1" size="medium">
                                <Skeleton width={200} />
                            </Heading>
                            <div className={css.kontaktinfo}>
                                <Skeleton width={300} />
                            </div>
                            <div className={css.kontaktinfo}>
                                <Skeleton width={600} />
                            </div>
                        </>
                    )}

                    {cv.kind === Nettstatus.Suksess && (
                        <>
                            <Heading level="1" size="medium">
                                {hentNavnFraCv(cv.data)}
                            </Heading>
                            <BodyShort className={css.kontaktinfo}>
                                <Fødselsinfo cv={cv.data} />
                                <BodyShort as="span">
                                    Veileder:{' '}
                                    <strong>
                                        {cv.data.veilederNavn
                                            ? `${cv.data.veilederNavn} (${cv.data.veilederIdent})`
                                            : 'Ikke tildelt'}
                                    </strong>
                                </BodyShort>
                            </BodyShort>
                            <BodyShort className={css.kontaktinfo}>
                                <Personalia cv={cv.data} />
                            </BodyShort>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

const hentNavnFraCv = (cv: Cv) => {
    const fornavn = capitalizeFirstLetter(cv.fornavn);
    const etternavn = capitalizeFirstLetter(cv.etternavn);

    return `${fornavn} ${etternavn}`;
};

export default Kandidatheader;
