import React, { FunctionComponent, useState, ChangeEvent } from 'react';
import SokekriteriePanel from '../../../felles/common/sokekriteriePanel/SokekriteriePanel';
import { Checkbox, SkjemaGruppe } from 'nav-frontend-skjema';
import AppState from '../../AppState';
import { connect } from 'react-redux';
import { SEARCH } from '../searchReducer';
import { PermitteringActionType } from './permitteringReducer';
import './PermitteringSearch.less';
import NyttFilterIkon from '../nytt-filter-ikon/NyttFilterIkon';
import { Normaltekst } from 'nav-frontend-typografi';

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
            tittel={
                <div className="permittering-search__tittel">
                    Permittert
                    <NyttFilterIkon />
                </div>
            }
            onClick={togglePanel}
        >
            <Normaltekst id="permittering-ingress" className="permittering-search__ingress">
                Brukere som har oppgitt at de er permittert i registreringen.
            </Normaltekst>
            <SkjemaGruppe aria-labelledby="permittering-ingress">
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
            </SkjemaGruppe>
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
