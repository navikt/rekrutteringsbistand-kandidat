import React, { FunctionComponent } from 'react';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { Element } from 'nav-frontend-typografi';
import { SkjemaGruppe } from 'nav-frontend-skjema';

type Props = {
    kategori: string;
    desktop: boolean;
};

const Kategori: FunctionComponent<Props> = ({ kategori, desktop, children }) => {
    return desktop ? (
        <Ekspanderbartpanel apen border tittel={<Element>{kategori}</Element>}>
            {children}
        </Ekspanderbartpanel>
    ) : (
        <SkjemaGruppe
            className="kandidatliste-filter__filter"
            legend={<Element>{kategori}</Element>}
        >
            {children}
        </SkjemaGruppe>
    );
};

export default Kategori;
