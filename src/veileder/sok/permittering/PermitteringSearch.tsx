import React, { FunctionComponent, useState, ChangeEvent } from 'react';
import SokekriteriePanel from '../../../felles/common/sokekriteriePanel/SokekriteriePanel';
import { Checkbox, SkjemaGruppe } from 'nav-frontend-skjema';
import AppState from '../../AppState';
import { connect } from 'react-redux';
import { SEARCH, SET_PERMITTERT } from '../searchReducer';

interface Props {
    permittert: boolean;
    ikkePermittert: boolean;
    setPermittert: (permittert: boolean, ikkePermittert: boolean) => void;
    search: () => void;
}

enum Permitteringsverdi {
    Permittert = 'Permittert',
    IkkePermittert = 'IkkePermittert',
}

const PermitteringSearch: FunctionComponent<Props> = ({
    permittert,
    ikkePermittert,
    setPermittert,
    search,
}) => {
    const [åpen, setÅpen] = useState<boolean>(false);

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const verdi = e.currentTarget.value as Permitteringsverdi;

        setPermittert(
            verdi === Permitteringsverdi.Permittert ? !permittert : permittert,
            verdi === Permitteringsverdi.IkkePermittert ? !ikkePermittert : ikkePermittert
        );

        search();
    };

    return (
        <SokekriteriePanel
            apen={åpen}
            id="Permittering__SokekriteriePanel"
            tittel="Permittert"
            onClick={() => setÅpen(!åpen)}
        >
            <SkjemaGruppe title="Brukere som har oppgitt at de er permittert i registreringen.">
                <Checkbox
                    id="permittering-permittert-checkbox"
                    className="skjemaelement--pink"
                    label="Permittert"
                    value={Permitteringsverdi.Permittert}
                    checked={permittert}
                    onChange={onChange}
                />
                <Checkbox
                    id="permittering-ikke-permittert-checkbox"
                    className="skjemaelement--pink"
                    label="Ikke permittert"
                    value={Permitteringsverdi.IkkePermittert}
                    checked={ikkePermittert}
                    onChange={onChange}
                />
            </SkjemaGruppe>
        </SokekriteriePanel>
    );
};

export default connect(
    (state: AppState) => ({
        permittert: state.search.permittering.permittert,
        ikkePermittert: state.search.permittering.ikkePermittert,
    }),
    (dispatch: (action: any) => void) => ({
        search: () => dispatch({ type: SEARCH }),
        setPermittert: (permittert: boolean, ikkePermittert: boolean) =>
            dispatch({
                type: SET_PERMITTERT,
                permittert,
                ikkePermittert,
            }),
    })
)(PermitteringSearch);
