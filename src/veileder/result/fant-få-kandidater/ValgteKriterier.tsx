import React from 'react';
import { Merkelapp } from 'pam-frontend-merkelapper';

export type Kriterie = {
    value: any;
    label: string;
    onRemove: () => void;
};

const ValgteKriterier = ({ kriterier }: { kriterier: Kriterie[] }) => {
    return (
        <div className="fant-få-kandidater__valgte-kriterier">
            {kriterier.map(kriterie => {
                return (
                    <Merkelapp
                        key={kriterie.label}
                        value={kriterie.value}
                        onRemove={kriterie.onRemove}
                    >
                        {kriterie.label}
                    </Merkelapp>
                );
            })}
        </div>
    );
};

export default ValgteKriterier;
