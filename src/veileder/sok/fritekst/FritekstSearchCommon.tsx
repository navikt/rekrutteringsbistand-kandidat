import React, { FunctionComponent } from 'react';
import { Knapp } from 'pam-frontend-knapper';
import './Fritekst.less';

interface Props {
    search: () => void;
    fritekstSøkeord: string;
    setFritekstSøkeord: (søkeord) => void;
    placeholderTekst: string;
}

const FritekstSearchCommon: FunctionComponent<Props> = ({
    search,
    fritekstSøkeord,
    setFritekstSøkeord,
    placeholderTekst,
}) => {
    const onFritekstChange = (e) => {
        setFritekstSøkeord(e.target.value);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        search();
    };

    return (
        <form className="fritekst__search" onSubmit={onSubmit}>
            <input
                id={'fritekstsok-input'}
                value={fritekstSøkeord}
                onChange={onFritekstChange}
                className="skjemaelement__input"
                placeholder={placeholderTekst}
            />
            <Knapp
                aria-label="fritekstsøk"
                className="search-button"
                id="fritekstsok-knapp"
                htmlType="submit"
                title="Søk"
            >
                <i className="search-button__icon" />
            </Knapp>
        </form>
    );
};

export default FritekstSearchCommon;
