import React, { FunctionComponent } from 'react';
import { BodyShort } from '@navikt/ds-react';
import Cv from '../reducer/cv-typer';
import Informasjonspanel from '../Informasjonspanel';
import css from './Jobbprofil.module.css';

const oppstartskoder = {
    LEDIG_NAA: { key: 'LEDIG_NAA', label: 'Kandidaten er ledig nå' },
    ETTER_TRE_MND: { key: 'ETTER_TRE_MND', label: 'Kandidaten har 3 måneder oppsigelse' },
    ETTER_AVTALE: { key: 'ETTER_AVTALE', label: 'Kandidaten er ledig etter avtale' },
};

type Props = {
    cv: Cv;
};

const Jobbønsker: FunctionComponent<Props> = ({ cv }) => (
    <Informasjonspanel tittel="Jobbprofil">
        {cv.yrkeJobbonsker?.length > 0 && (
            <dl className={css.liste}>
                <Description
                    label="Ønsket yrke"
                    items={cv.yrkeJobbonsker.map((j) => j.styrkBeskrivelse)}
                />

                <Description
                    label="Kompetanse"
                    items={cv.kompetanse.map((u) => u.kompetanseKodeTekst)}
                />

                <Description
                    label="Ønsket sted"
                    items={cv.geografiJobbonsker.map((u) => u.geografiKodeTekst)}
                />

                <Description
                    label="Heltid/deltid"
                    items={cv.omfangJobbprofil.map((u) => u.heltidDeltidKodeTekst)}
                />

                <Description
                    label="Arbeidstid"
                    items={cv.arbeidstidJobbprofil.map((u) => u.arbeidstidKodeTekst)}
                />

                <Description
                    label="Arbeidsforhold"
                    items={cv.ansettelsesformJobbprofil.map((u) => u.ansettelsesformKodeTekst)}
                />

                {cv.oppstartKode && (
                    <Description
                        label="Ledighet"
                        items={[oppstartskoder[cv.oppstartKode.toUpperCase()]?.label]}
                    />
                )}
            </dl>
        )}
    </Informasjonspanel>
);

const Description = ({ label, items }: { label: string; items: Array<string | null> }) => (
    <>
        <BodyShort as="dt">{label}</BodyShort>
        <BodyShort as="dd">
            <MangeTekstelementer elementer={items} />
        </BodyShort>
    </>
);

const MangeTekstelementer = ({ elementer }: { elementer: Array<string | null> }) => {
    return (
        <span>
            {elementer
                .filter((e) => e !== null)
                .map((element) => element)
                .join(', ')}
        </span>
    );
};

export default Jobbønsker;
