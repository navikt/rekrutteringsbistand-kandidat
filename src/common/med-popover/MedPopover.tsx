import React, { FunctionComponent, useState, MouseEvent, ReactNode } from 'react';
import css from './MedPopover.module.css';
import { BodyShort, Popover } from '@navikt/ds-react';

type Props = {
    id?: string;
    tittel?: string;
    hjelpetekst: ReactNode;
    className?: string;
};

const MedPopover: FunctionComponent<Props> = ({ id, tittel, hjelpetekst, className, children }) => {
    const [anker, setAnker] = useState<Element | null>(null);

    const toggleAnker = (event: MouseEvent<HTMLElement>) => {
        setAnker(anker ? null : event.currentTarget);
    };

    const lukkAnker = () => {
        setAnker(null);
    };

    return (
        <div
            id={id}
            role="button"
            title={tittel}
            onClick={toggleAnker}
            className={`med-popover${className ? ' ' + className : ''}`}
        >
            {children}
            <Popover
                open
                anchorEl={anker}
                onClose={lukkAnker}
                placement="bottom"
                className={css.ingenValgtPopover}
            >
                <Popover.Content>
                    <BodyShort size="small" as="div">
                        {hjelpetekst}
                    </BodyShort>
                </Popover.Content>
            </Popover>
        </div>
    );
};

export default MedPopover;
