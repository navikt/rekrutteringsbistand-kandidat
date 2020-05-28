import React, { ChangeEvent, FunctionComponent } from 'react';
import SokekriteriePanel from '../../../felles/common/sokekriteriePanel/SokekriteriePanel';
import { Checkbox, CheckboxGruppe } from 'nav-frontend-skjema';
import AppState from '../../AppState';
import { connect } from 'react-redux';
import { SEARCH } from '../searchReducer';
import { PermitteringActionType } from './permitteringReducer';
import './PermitteringSearch.less';

interface Props {
    permittert: boolean;
    ikkePermittert: boolean;
    setPermittert: (permittert: boolean, ikkePermittert: boolean) => void;
    search: () => void;
    panelOpen: boolean;
    togglePanel: () => void;
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
    panelOpen,
    togglePanel,
}) => {
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
            apen={panelOpen}
            id="Permittering__SokekriteriePanel"
            fane="permittering"
            tittel="Permittert"
            onClick={togglePanel}
        >
            <CheckboxGruppe>
                <Checkbox
                    id="permittering-permittert-checkbox"
                    className="permittering-search__checkbox"
                    label="Permittert"
                    value={Permitteringsverdi.Permittert}
                    checked={permittert}
                    onChange={onChange}
                />
                <Checkbox
                    id="permittering-ikke-permittert-checkbox"
                    className="permittering-search__checkbox"
                    label="Ikke permittert"
                    value={Permitteringsverdi.IkkePermittert}
                    checked={ikkePermittert}
                    onChange={onChange}
                />
            </CheckboxGruppe>
        </SokekriteriePanel>
    );
};

export default connect(
    (state: AppState) => ({
        permittert: state.permittering.permittert,
        ikkePermittert: state.permittering.ikkePermittert,
        panelOpen: state.permittering.panelOpen,
    }),
    (dispatch: (action: any) => void) => ({
        search: () => dispatch({ type: SEARCH }),
        setPermittert: (permittert: boolean, ikkePermittert: boolean) =>
            dispatch({
                type: PermitteringActionType.SET_PERMITTERT,
                permittert,
                ikkePermittert,
            }),
        togglePanel: () => dispatch({ type: PermitteringActionType.TOGGLE_PERMITTERING_PANEL }),
    })
)(PermitteringSearch);
