import React, { ChangeEvent, FunctionComponent } from 'react';
import { Checkbox, SkjemaGruppe } from 'nav-frontend-skjema';
import './MidlertidigUtilgjengeligSearch.less';
import AppState from '../../../AppState';
import {
    MidlertidigUtilgjengeligActionType,
    MidlertidigUtilgjengeligSearchState,
} from './midlertidigUtilgjengeligSearchReducer';
import { connect } from 'react-redux';
import { SEARCH } from '../../searchReducer';

interface Props {
    midlertidigUtilgjengeligState: MidlertidigUtilgjengeligSearchState;
    checkMidlertidigUtilgjengelig: (midlertidigUtilgjengelig: MidlertidigUtilgjengelig) => void;
    uncheckMidlertidigUtilgjengelig: (midlertidigUtilgjengelig: MidlertidigUtilgjengelig) => void;
    search: () => void;
}

export enum MidlertidigUtilgjengelig {
    Tilgjengelig = 'tilgjengelig',
    TilgjengeligInnen1Uke = 'tilgjengeliginnen1uke',
    MidlertidigUtilgjengelig = 'midlertidigutilgjengelig',
}

const MidlertidigUtilgjengeligSearch: FunctionComponent<Props> = (props) => {
    const midlertidigUtilgjengeligStatuser = [
        { label: 'Tilgjengelig', value: MidlertidigUtilgjengelig.Tilgjengelig },
        {
            label: 'Tilgjengelig innen 1 uke',
            value: MidlertidigUtilgjengelig.TilgjengeligInnen1Uke,
        },
        {
            label: 'Midlertidig utilgjengelig',
            value: MidlertidigUtilgjengelig.MidlertidigUtilgjengelig,
        },
    ];

    const onMidlertidigUtilgjengeligChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            props.checkMidlertidigUtilgjengelig(e.target.value as MidlertidigUtilgjengelig);
        } else {
            props.uncheckMidlertidigUtilgjengelig(e.target.value as MidlertidigUtilgjengelig);
        }
        props.search();
    };

    return (
        <SkjemaGruppe title="Registrert av NAV" className="midlertidig-utilgjengelig-search">
            {midlertidigUtilgjengeligStatuser.map((tidspunkt) => (
                <Checkbox
                    key={tidspunkt.value}
                    // id={`oppstartstidspunkt-${tidspunkt.value.toLowerCase()}-checkbox`}
                    className="midlertidig-utilgjengelig-search__checkbox"
                    label={tidspunkt.label}
                    value={tidspunkt.value}
                    // checked={oppstartstidspunkter.includes(tidspunkt.value)}
                    onChange={onMidlertidigUtilgjengeligChange}
                />
            ))}
        </SkjemaGruppe>
    );
};

const mapStateToProps = (state: AppState) => ({
    midlertidigUtilgjengeligState: state.midlertidigUtilgjengeligSearch,
});

const mapDispatchToProps = (dispatch: (action: any) => void) => ({
    search: () => dispatch({ type: SEARCH }),
    checkMidlertidigUtilgjengelig: (midlertidigUtilgjengelig: MidlertidigUtilgjengelig) =>
        dispatch({
            type: MidlertidigUtilgjengeligActionType.CheckMidlertidigUtilgjengelig,
            value: midlertidigUtilgjengelig,
        }),
    uncheckMidlertidigUtilgjengelig: (midlertidigUtilgjengelig: MidlertidigUtilgjengelig) =>
        dispatch({
            type: MidlertidigUtilgjengeligActionType.UncheckMidlertidigUtilgjengelig,
            value: midlertidigUtilgjengelig,
        }),
});

export default connect(mapStateToProps, mapDispatchToProps)(MidlertidigUtilgjengeligSearch);
