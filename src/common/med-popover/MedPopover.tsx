import React, { FunctionComponent, useState, MouseEvent, ReactNode } from 'react';
import Popover, { PopoverOrientering } from 'nav-frontend-popover';
import { Normaltekst } from 'nav-frontend-typografi';
import './MedPopover.less';

type Props = {
    id?: string;
    tittel?: string;
    hjelpetekst: FunctionComponent;
    orientering?: PopoverOrientering;
    hvit?: boolean;
    onPopoverClick?: () => void;
    className?: string;
    hjelpetekstProps?: any;
};

const MedPopover: FunctionComponent<Props> = ({
    id,
    hvit,
    tittel,
    hjelpetekst,
    orientering,
    onPopoverClick,
    className,
    children,
    hjelpetekstProps,
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
            className={`med-popover${hvit ? ' med-popover--hvit' : ''}${
                className ? ' ' + className : ''
            }`}
        >
            {children}
            <Popover
                orientering={orientering || PopoverOrientering.Under}
                ankerEl={anker}
                onRequestClose={lukkAnker}
            >
                <Normaltekst onClick={onPopoverClick} tag="div" className="med-popover__popup">
                    {React.createElement(hjelpetekst, { ...hjelpetekstProps, lukkAnker }) || ''}
                </Normaltekst>
            </Popover>
        </div>
    );
};

export default MedPopover;
