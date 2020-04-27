import React, { ChangeEvent, FunctionComponent } from 'react';
import SokekriteriePanel from '../../../../felles/common/sokekriteriePanel/SokekriteriePanel';
import { Checkbox, SkjemaGruppe } from 'nav-frontend-skjema';

import './OppstartstidspunktSearch.less';
import { connect } from 'react-redux';
import { OppstartstidspunktActionType, OppstartstidspunktState } from './oppstartstidspunktReducer';
import NyttFilterIkon from '../../nytt-filter-ikon/NyttFilterIkon';
import AppState from '../../../AppState';
import MidlertidigUtilgjengeligSearch from '../midlertidig-utilgjengelig/MidlertidigUtilgjengeligSearch';
import { SEARCH } from '../../searchReducer';

export enum Oppstartstidspunkt {
    LEDIG_NAA = 'LEDIG_NAA',
    ETTER_TRE_MND = 'ETTER_TRE_MND',
    ETTER_AVTALE = 'ETTER_AVTALE',
}

interface Props {
    oppstartstidspunktState: OppstartstidspunktState;
    checkOppstartstidspunkt: (tidspunkt: Oppstartstidspunkt) => void;
    uncheckOppstartstidspunkt: (tidspunkt: Oppstartstidspunkt) => void;
    toggleOppstartstidspunktOpen: () => void;
    search: () => void;
}

const OppstartstidspunktSearch: FunctionComponent<Props> = (props) => {
    const { oppstartstidspunkter } = props.oppstartstidspunktState;

    const alleOppstartstidspunkter = [
        { label: 'Ledig nå', value: Oppstartstidspunkt.LEDIG_NAA },
        { label: 'Ledig om 3 måneder', value: Oppstartstidspunkt.ETTER_TRE_MND },
        { label: 'Ledig etter avtale', value: Oppstartstidspunkt.ETTER_AVTALE },
    ];

    const onOppstartstidspunktChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            props.checkOppstartstidspunkt(e.target.value as Oppstartstidspunkt);
        } else {
            props.uncheckOppstartstidspunkt(e.target.value as Oppstartstidspunkt);
        }
        props.search();
    };

    return (
        <SkjemaGruppe title="Registrert i kandidatens jobbprofil">
            {alleOppstartstidspunkter.map((tidspunkt) => (
                <Checkbox
                    key={tidspunkt.value}
                    id={`oppstartstidspunkt-${tidspunkt.value.toLowerCase()}-checkbox`}
                    className="oppstartstidspunkt-search__checkbox"
                    label={tidspunkt.label}
                    value={tidspunkt.value}
                    checked={oppstartstidspunkter.includes(tidspunkt.value)}
                    onChange={onOppstartstidspunktChange}
                />
            ))}
        </SkjemaGruppe>
    );
};

export default connect(
    (state: AppState) => ({
        oppstartstidspunktState: state.oppstartstidspunkter,
    }),
    (dispatch: (action: any) => void) => ({
        search: () => dispatch({ type: SEARCH }),
        checkOppstartstidspunkt: (tidspunkt: Oppstartstidspunkt) =>
            dispatch({
                type: OppstartstidspunktActionType.CHECK_OPPSTARTSTIDSPUNKT,
                value: tidspunkt,
            }),
        uncheckOppstartstidspunkt: (tidspunkt: Oppstartstidspunkt) =>
            dispatch({
                type: OppstartstidspunktActionType.UNCHECK_OPPSTARTSTIDSPUNKT,
                value: tidspunkt,
            }),
        toggleOppstartstidspunktOpen: () =>
            dispatch({
                type: OppstartstidspunktActionType.TOGGLE_OPPSTARTSTIDSPUNKT_OPEN,
            }),
    })
)(OppstartstidspunktSearch);
