import React, { FunctionComponent } from 'react';
import { Normaltekst } from 'nav-frontend-typografi';
import './Merkelapp.less';

type Props = {
    value: string;
    onRemove: (value: string) => void;
};

const Merkelapp: FunctionComponent<Props> = ({ value, onRemove, children }) => {
    return (
        <button
            title="Fjern"
            aria-label="Fjern"
            className="merkelapp"
            onClick={() => onRemove(value)}
        >
            <Normaltekst className="merkelapp__tekst">{children}</Normaltekst>
            <div className="merkelapp__ikon">✕</div>
        </button>
    );
};

export default Merkelapp;
