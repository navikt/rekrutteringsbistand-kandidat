import React, { FunctionComponent } from 'react';
import { Element } from 'nav-frontend-typografi';
import { SkjemaGruppe } from 'nav-frontend-skjema';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';

type Props = { kategori: string };

export const KategoriStorSkjerm: FunctionComponent<Props> = ({ kategori, children }) => (
    <Ekspanderbartpanel apen border tittel={<Element>{kategori}</Element>}>
        {children}
    </Ekspanderbartpanel>
);

export const KategoriLitenSkjerm: FunctionComponent<Props> = ({ kategori, children }) => (
    <SkjemaGruppe className="kandidatliste-filter__kategori" legend={<Element>{kategori}</Element>}>
        {children}
    </SkjemaGruppe>
);
