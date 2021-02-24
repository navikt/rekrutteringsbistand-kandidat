import React, { ChangeEvent, FunctionComponent } from 'react';
import { Checkbox, SkjemaGruppe } from 'nav-frontend-skjema';
import { Element } from 'nav-frontend-typografi';
import { connect } from 'react-redux';

import AppState from '../../../../AppState';
import { SEARCH } from '../../../reducer/searchReducer';
import { TilgjengelighetAction } from '../tilgjengelighetReducer';
import './OppstartstidspunktSearch.less';
import { sendEvent } from '../../../../amplitude/amplitude';

export enum Oppstartstidspunkt {
    LedigNå = 'LEDIG_NAA',
    EtterTreMåneder = 'ETTER_TRE_MND',
    EtterAvtale = 'ETTER_AVTALE',
}

interface Props {
    oppstartstidspunkter: Oppstartstidspunkt[];
    checkOppstartstidspunkt: (tidspunkt: Oppstartstidspunkt) => void;
    uncheckOppstartstidspunkt: (tidspunkt: Oppstartstidspunkt) => void;
    search: () => void;
}

const alleOppstartstidspunkter = [
    { label: 'Ledig nå', value: Oppstartstidspunkt.LedigNå },
    { label: 'Ledig om 3 måneder', value: Oppstartstidspunkt.EtterTreMåneder },
    { label: 'Ledig etter avtale', value: Oppstartstidspunkt.EtterAvtale },
];

const OppstartstidspunktSearch: FunctionComponent<Props> = (props) => {
    const onOppstartstidspunktChange = (e: ChangeEvent<HTMLInputElement>) => {
        const oppstartstidspunkt = e.target.value as Oppstartstidspunkt;

        if (e.target.checked) {
            sendEvent('kandidatsøk', 'filtrer-på-oppstartstidspunkt', {
                oppstartstidspunkt,
            });
            props.checkOppstartstidspunkt(oppstartstidspunkt);
        } else {
            props.uncheckOppstartstidspunkt(oppstartstidspunkt);
        }
        props.search();
    };

    return (
        <SkjemaGruppe
            legend={<Element>Registrert i kandidatens jobbprofil</Element>}
            className="registrert-i-jobbprofil-search"
        >
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
    oppstartstidspunkter: state.søkefilter.tilgjengelighet.oppstartstidspunkter,
});

const mapDispatchToProps = (dispatch: any) => ({
    checkOppstartstidspunkt: (tidspunkt: Oppstartstidspunkt) =>
        dispatch({ type: TilgjengelighetAction.CheckOppstartstidspunkt, value: tidspunkt }),
    uncheckOppstartstidspunkt: (tidspunkt: Oppstartstidspunkt) =>
        dispatch({ type: TilgjengelighetAction.UncheckOppstartstidspunkt, value: tidspunkt }),
    search: () => dispatch({ type: SEARCH }),
});

export default connect(mapStateToProps, mapDispatchToProps)(OppstartstidspunktSearch);
