import * as React from 'react';
import { Link } from 'react-router-dom';
import { HoyreChevron, VenstreChevron } from 'nav-frontend-chevron';
import './LenkeMedChevron.less';

interface LenkeMedChevronProps {
    to: string;
    state?: object;
    text: string;
    className?: string;
    type?: string;
}

export const LenkeMedChevron = ({ to, state, text, className, type }: LenkeMedChevronProps) => {
    return (
        <>
            {type === 'venstre' ? (
                <Link
                    to={to}
                    state={state}
                    className={`lenke-med-chevron--venstre lenke ${className}`}
                >
                    <VenstreChevron />
                    <span>{text}</span>
                </Link>
            ) : (
                <Link
                    to={to}
                    state={state}
                    className={`lenke-med-chevron--hoyre lenke ${className}`}
                >
                    <span>{text}</span>
                    <HoyreChevron />
                </Link>
            )}
        </>
    );
};
