import React, { ChangeEvent, FunctionComponent } from 'react';
import { Checkbox, SkjemaGruppe } from 'nav-frontend-skjema';
import './MidlertidigUtilgjengeligSearch.less';
import AppState from '../../../AppState';
import { connect } from 'react-redux';
import { SEARCH } from '../../searchReducer';
import { TilgjengelighetAction } from '../tilgjengelighetReducer';
import TilgjengelighetIkon, {
    Tilgjengelighet,
} from '../../../cv/midlertidig-utilgjengelig/tilgjengelighet-ikon/TilgjengelighetIkon';

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
            <Checkbox
                key={MidlertidigUtilgjengelig.Tilgjengelig}
                id={`midlertidigUtilgjengelig-${MidlertidigUtilgjengelig.Tilgjengelig.toLowerCase()}-checkbox`}
                className="midlertidig-utilgjengelig-search__checkbox"
                label="Tilgjengelig"
                value={MidlertidigUtilgjengelig.Tilgjengelig}
                checked={props.midlertidigUtilgjengelig.includes(
                    MidlertidigUtilgjengelig.Tilgjengelig
                )}
                onChange={onMidlertidigUtilgjengeligChange}
            />
            <Checkbox
                key={MidlertidigUtilgjengelig.TilgjengeligInnen1Uke}
                id={`midlertidigUtilgjengelig-${MidlertidigUtilgjengelig.TilgjengeligInnen1Uke.toLowerCase()}-checkbox`}
                className="midlertidig-utilgjengelig-search__checkbox"
                label={
                    <>
                        Tilgjengelig innen 1 uke
                        <TilgjengelighetIkon
                            tilgjengelighet={Tilgjengelighet.SNART_TILGJENGELIG}
                            className="midlertidig-utilgjengelig-search__flagg--snart-tilgjengelig"
                        />
                    </>
                }
                value={MidlertidigUtilgjengelig.TilgjengeligInnen1Uke}
                checked={props.midlertidigUtilgjengelig.includes(
                    MidlertidigUtilgjengelig.TilgjengeligInnen1Uke
                )}
                onChange={onMidlertidigUtilgjengeligChange}
            />
            <Checkbox
                key={MidlertidigUtilgjengelig.MidlertidigUtilgjengelig}
                id={`midlertidigUtilgjengelig-${MidlertidigUtilgjengelig.MidlertidigUtilgjengelig.toLowerCase()}-checkbox`}
                className="midlertidig-utilgjengelig-search__checkbox"
                label={
                    <>
                        Midlertidig utilgjengelig
                        <TilgjengelighetIkon
                            tilgjengelighet={Tilgjengelighet.UTILGJENGELIG}
                            className="midlertidig-utilgjengelig-search__flagg--utilgjengelig"
                        />
                    </>
                }
                value={MidlertidigUtilgjengelig.MidlertidigUtilgjengelig}
                checked={props.midlertidigUtilgjengelig.includes(
                    MidlertidigUtilgjengelig.MidlertidigUtilgjengelig
                )}
                onChange={onMidlertidigUtilgjengeligChange}
            />
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
