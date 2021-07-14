import React, { ChangeEvent, FunctionComponent } from 'react';
import SokekriteriePanel from '../sokekriteriePanel/SokekriteriePanel';
import { Checkbox } from 'nav-frontend-skjema';
import AppState from '../../../AppState';
import { connect } from 'react-redux';
import { PermitteringActionType } from './permitteringReducer';
import './PermitteringSearch.less';
import { KandidatsøkActionType } from '../../reducer/searchActions';

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
        </SokekriteriePanel>
    );
};

export default connect(
    (state: AppState) => ({
        permittert: state.søkefilter.permittering.permittert,
        ikkePermittert: state.søkefilter.permittering.ikkePermittert,
        panelOpen: state.søkefilter.permittering.panelOpen,
    }),
    (dispatch: (action: any) => void) => ({
        search: () => dispatch({ type: KandidatsøkActionType.Search }),
        setPermittert: (permittert: boolean, ikkePermittert: boolean) =>
            dispatch({
                type: PermitteringActionType.SET_PERMITTERT,
                permittert,
                ikkePermittert,
            }),
        togglePanel: () => dispatch({ type: PermitteringActionType.TOGGLE_PERMITTERING_PANEL }),
    })
)(PermitteringSearch);
