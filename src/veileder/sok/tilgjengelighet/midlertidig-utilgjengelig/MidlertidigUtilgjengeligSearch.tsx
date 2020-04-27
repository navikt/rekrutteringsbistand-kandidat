import React, { ChangeEvent, FunctionComponent } from 'react';
import { Checkbox, SkjemaGruppe } from 'nav-frontend-skjema';
import './MidlertidigUtilgjengeligSearch.less';
import AppState from '../../../AppState';
import { connect } from 'react-redux';
import { SEARCH } from '../../searchReducer';
import { TilgjengelighetAction } from '../tilgjengelighetReducer';

export enum MidlertidigUtilgjengelig {
    Tilgjengelig = 'tilgjengelig',
    TilgjengeligInnen1Uke = 'tilgjengeliginnen1uke',
    MidlertidigUtilgjengelig = 'midlertidigutilgjengelig',
}

interface Props {
    midlertidigUtilgjengelig: MidlertidigUtilgjengelig[];
    checkMidlertidigUtilgjengelig: (midlertidigUtilgjengelig: MidlertidigUtilgjengelig) => void;
    uncheckMidlertidigUtilgjengelig: (midlertidigUtilgjengelig: MidlertidigUtilgjengelig) => void;
    search: () => void;
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
            {midlertidigUtilgjengeligStatuser.map((status) => (
                <Checkbox
                    key={status.value}
                    id={`midlertidigUtilgjengelig-${status.value.toLowerCase()}-checkbox`}
                    className="midlertidig-utilgjengelig-search__checkbox"
                    label={status.label}
                    value={status.value}
                    checked={props.midlertidigUtilgjengelig.includes(status.value)}
                    onChange={onMidlertidigUtilgjengeligChange}
                />
            ))}
        </SkjemaGruppe>
    );
};

const mapStateToProps = (state: AppState) => ({
    midlertidigUtilgjengelig: state.tilgjengelighet.midlertidigUtilgjengelig,
});

const mapDispatchToProps = (dispatch: (action: any) => void) => ({
    checkMidlertidigUtilgjengelig: (midlertidigUtilgjengelig: MidlertidigUtilgjengelig) =>
        dispatch({
            type: TilgjengelighetAction.CheckMidlertidigUtilgjengelig,
            value: midlertidigUtilgjengelig,
        }),
    uncheckMidlertidigUtilgjengelig: (midlertidigUtilgjengelig: MidlertidigUtilgjengelig) =>
        dispatch({
            type: TilgjengelighetAction.UncheckMidlertidigUtilgjengelig,
            value: midlertidigUtilgjengelig,
        }),
    search: () => dispatch({ type: SEARCH }),
});

export default connect(mapStateToProps, mapDispatchToProps)(MidlertidigUtilgjengeligSearch);
