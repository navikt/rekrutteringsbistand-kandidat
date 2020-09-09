import React, { FunctionComponent, useState, MouseEvent, ReactNode } from 'react';
import Popover, { PopoverOrientering } from 'nav-frontend-popover';
import { Normaltekst } from 'nav-frontend-typografi';
import './HjelpetekstMedAnker.less';

type Props = {
    id?: string;
    tittel?: string;
    innhold: ReactNode;
    orientering?: PopoverOrientering;
    className?: string;
};

const HjelpetekstMedAnker: FunctionComponent<Props> = ({
    id,
    tittel,
    innhold,
    orientering,
    className,
    children,
}) => {
    const [anker, setAnker] = useState<HTMLElement | undefined>(undefined);

    const toggleAnker = (event: MouseEvent<HTMLElement>) => {
        setAnker(anker ? undefined : event.currentTarget);
    };

    const lukkAnker = () => {
        setAnker(undefined);
    };

    return (
        <div
            id={id}
            role="button"
            title={tittel}
            onClick={toggleAnker}
            className={`hjelpetekst-med-anker${className ? ' ' + className : ''}`}
        >
            {children}
            <Popover
                orientering={orientering || PopoverOrientering.Under}
                ankerEl={anker}
                onRequestClose={lukkAnker}
            >
                <Normaltekst className="hjelpetekst-med-anker__popup">{innhold}</Normaltekst>
            </Popover>
        </div>
    );
};

export default HjelpetekstMedAnker;
