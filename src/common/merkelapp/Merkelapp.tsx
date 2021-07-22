import React, { FunctionComponent } from 'react';

type Props = {
    value: string;
    onRemove: (value: string) => void;
};

const Merkelapp: FunctionComponent<Props> = ({ value, onRemove, children }) => {
    return (
        <div>
            {children}
            <button onClick={() => onRemove(value)}>X</button>
        </div>
    );
};

export default Merkelapp;
