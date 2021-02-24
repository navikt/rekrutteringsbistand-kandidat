import React, { ChangeEvent, FunctionComponent } from 'react';
import { Søkeknapp } from 'nav-frontend-ikonknapper';

type Props = {
    søkeOrd: string;
    onSøkeOrdChange: (event: ChangeEvent<HTMLInputElement>) => void;
    onSubmitSøkKandidatlister: () => void;
};

export const SøkKandidatlisterInput: FunctionComponent<Props> = ({
    søkeOrd,
    onSøkeOrdChange,
    onSubmitSøkKandidatlister,
}) => (
    <form className="kandidatlister__sok" onSubmit={onSubmitSøkKandidatlister}>
        <input
            id={'sok-kandidatlister-input'}
            value={søkeOrd}
            onChange={onSøkeOrdChange}
            className="skjemaelement__input"
            placeholder="Skriv inn navn på kandidatliste"
        />
        <Søkeknapp
            type="flat"
            aria-label="sok-kandidatlister-knapp"
            className="kandidatlister__søkeknapp"
            id="sok-kandidatlister-knapp"
            onClick={onSubmitSøkKandidatlister}
        />
    </form>
);

export default SøkKandidatlisterInput;
