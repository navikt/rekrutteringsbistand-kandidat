import React, { FunctionComponent, useState, ChangeEvent } from 'react';
import SokekriteriePanel from '../../../felles/common/sokekriteriePanel/SokekriteriePanel';
import { Checkbox, SkjemaGruppe } from 'nav-frontend-skjema';
import AppState from '../../AppState';
import { connect } from 'react-redux';
import { SEARCH } from '../searchReducer';
import { PermitteringActionType } from './permitteringReducer';
import './PermitteringSearch.less';
import { Normaltekst } from 'nav-frontend-typografi';

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
            <SkjemaGruppe>
                <Checkbox
                    id="permittering-permittert-checkbox"
                    className="permittering-search__checkbox skjemaelement--pink"
                    label="Permittert"
                    value={Permitteringsverdi.Permittert}
                    checked={permittert}
                    onChange={onChange}
                />
                <Checkbox
                    id="permittering-ikke-permittert-checkbox"
                    className="permittering-search__checkbox skjemaelement--pink"
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
        permittert: state.permittering.permittert,
        ikkePermittert: state.permittering.ikkePermittert,
    }),
    (dispatch: (action: any) => void) => ({
        search: () => dispatch({ type: SEARCH }),
        setPermittert: (permittert: boolean, ikkePermittert: boolean) =>
            dispatch({
                type: PermitteringActionType.SET_PERMITTERT,
                permittert,
                ikkePermittert,
            }),
    })
)(PermitteringSearch);
