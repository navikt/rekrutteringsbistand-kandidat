import * as React from 'react';
import { Link } from 'react-router-dom';
import Chevron from 'nav-frontend-chevron';
import './LenkeMedChevron.less';

interface LenkeMedChevronProps {
    to: string;
    text: string;
    className?: string;
    type?: string;
}

export const LenkeMedChevron = ({ to, text, className, type }: LenkeMedChevronProps) => (
    <Link to={to} className={`typo-normal LenkeMedChevron__lenke ${className}`}>
        {type === 'venstre' && (
            <Chevron className="LenkeMedChevron__lenke__chevron" type="venstre" />
        )}
        <span className="LenkeMedChevron__lenke__text">{text}</span>
        {type !== 'venstre' && <Chevron className="LenkeMedChevron__lenke__chevron" />}
    </Link>
);
