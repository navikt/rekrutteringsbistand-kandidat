import React, { FunctionComponent } from 'react';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { Undertittel } from 'nav-frontend-typografi';

type Props = {
    desktop: boolean;
};

const Wrapper: FunctionComponent<Props> = ({ desktop, children }) => {
    return desktop ? (
        <aside className="kandidatliste-filter">{children}</aside>
    ) : (
        <Ekspanderbartpanel
            tittel={<Undertittel>Filter</Undertittel>}
            className="kandidatliste-filter"
            border
        >
            {children}
        </Ekspanderbartpanel>
    );
};

export default Wrapper;
