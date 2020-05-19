import React, { ChangeEvent, FunctionComponent } from 'react';
import { Checkbox, SkjemaGruppe } from 'nav-frontend-skjema';
import { connect } from 'react-redux';

import AppState from '../../../AppState';
import { SEARCH } from '../../searchReducer';
import { TilgjengelighetAction } from '../tilgjengelighetReducer';
import './OppstartstidspunktSearch.less';

export enum Oppstartstidspunkt {
    LEDIG_NAA = 'LEDIG_NAA',
    ETTER_TRE_MND = 'ETTER_TRE_MND',
    ETTER_AVTALE = 'ETTER_AVTALE',
}

interface Props {
    oppstartstidspunkter: Oppstartstidspunkt[];
    checkOppstartstidspunkt: (tidspunkt: Oppstartstidspunkt) => void;
    uncheckOppstartstidspunkt: (tidspunkt: Oppstartstidspunkt) => void;
    search: () => void;
}

const alleOppstartstidspunkter = [
    { label: 'Ledig nå', value: Oppstartstidspunkt.LEDIG_NAA },
    { label: 'Ledig om 3 måneder', value: Oppstartstidspunkt.ETTER_TRE_MND },
    { label: 'Ledig etter avtale', value: Oppstartstidspunkt.ETTER_AVTALE },
];

const OppstartstidspunktSearch: FunctionComponent<Props> = (props) => {
    const onOppstartstidspunktChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            props.checkOppstartstidspunkt(e.target.value as Oppstartstidspunkt);
        } else {
            props.uncheckOppstartstidspunkt(e.target.value as Oppstartstidspunkt);
        }
        props.search();
    };

    return (
        <SkjemaGruppe legend="Registrert i kandidatens jobbprofil">
            {alleOppstartstidspunkter.map((tidspunkt) => (
                <Checkbox
                    key={tidspunkt.value}
                    id={`oppstartstidspunkt-${tidspunkt.value.toLowerCase()}-checkbox`}
                    className="oppstartstidspunkt-search__checkbox"
                    label={tidspunkt.label}
                    value={tidspunkt.value}
                    checked={props.oppstartstidspunkter.includes(tidspunkt.value)}
                    onChange={onOppstartstidspunktChange}
                />
            ))}
        </SkjemaGruppe>
    );
};

const mapStateToProps = (state: AppState) => ({
    oppstartstidspunkter: state.tilgjengelighet.oppstartstidspunkter,
});

const mapDispatchToProps = (dispatch: any) => ({
    checkOppstartstidspunkt: (tidspunkt: Oppstartstidspunkt) =>
        dispatch({ type: TilgjengelighetAction.CheckOppstartstidspunkt, value: tidspunkt }),
    uncheckOppstartstidspunkt: (tidspunkt: Oppstartstidspunkt) =>
        dispatch({ type: TilgjengelighetAction.UncheckOppstartstidspunkt, value: tidspunkt }),
    search: () => dispatch({ type: SEARCH }),
});

export default connect(mapStateToProps, mapDispatchToProps)(OppstartstidspunktSearch);
