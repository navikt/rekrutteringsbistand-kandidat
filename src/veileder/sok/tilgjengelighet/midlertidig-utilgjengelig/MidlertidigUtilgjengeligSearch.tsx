import React, { ChangeEvent, FunctionComponent } from 'react';
import { Checkbox, SkjemaGruppe } from 'nav-frontend-skjema';
import { connect } from 'react-redux';

import { SEARCH } from '../../searchReducer';
import { Tilgjengelighet } from '../../Søkeresultat';
import { TilgjengelighetAction } from '../tilgjengelighetReducer';
import AppState from '../../../AppState';
import './MidlertidigUtilgjengeligSearch.less';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import TilgjengelighetIkon from '../../../kandidatside/midlertidig-utilgjengelig/tilgjengelighet-ikon/TilgjengelighetIkon';

interface Props {
    midlertidigUtilgjengelig: Tilgjengelighet[];
    checkMidlertidigUtilgjengelig: (midlertidigUtilgjengelig: Tilgjengelighet) => void;
    uncheckMidlertidigUtilgjengelig: (midlertidigUtilgjengelig: Tilgjengelighet) => void;
    search: () => void;
}

const MidlertidigUtilgjengeligSearch: FunctionComponent<Props> = (props) => {
    const onMidlertidigUtilgjengeligChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            props.checkMidlertidigUtilgjengelig(e.target.value as Tilgjengelighet);
        } else {
            props.uncheckMidlertidigUtilgjengelig(e.target.value as Tilgjengelighet);
        }
        props.search();
    };

    return (
        <SkjemaGruppe
            legend={<Element>Midlertidig utilgjengelig, registrert av NAV</Element>}
            className="midlertidig-utilgjengelig-search"
        >
            <Normaltekst className="midlertidig-utilgjengelig-search__undertittel">
                Ikke vis kandidater som er:
            </Normaltekst>
            <Checkbox
                key={Tilgjengelighet.TilgjengeligInnen1Uke}
                id={`midlertidigUtilgjengelig-${Tilgjengelighet.TilgjengeligInnen1Uke.toLowerCase()}-checkbox`}
                className="midlertidig-utilgjengelig-search__checkbox"
                label={
                    <>
                        Tilgjengelig innen 1 uke
                        <TilgjengelighetIkon
                            tilgjengelighet={Tilgjengelighet.TilgjengeligInnen1Uke}
                            className="midlertidig-utilgjengelig-search__flagg--snart-tilgjengelig"
                        />
                    </>
                }
                value={Tilgjengelighet.TilgjengeligInnen1Uke}
                checked={props.midlertidigUtilgjengelig.includes(
                    Tilgjengelighet.TilgjengeligInnen1Uke
                )}
                onChange={onMidlertidigUtilgjengeligChange}
            />
            <Checkbox
                key={Tilgjengelighet.MidlertidigUtilgjengelig}
                id={`midlertidigUtilgjengelig-${Tilgjengelighet.MidlertidigUtilgjengelig.toLowerCase()}-checkbox`}
                className="midlertidig-utilgjengelig-search__checkbox"
                label={
                    <>
                        Midlertidig utilgjengelig
                        <TilgjengelighetIkon
                            tilgjengelighet={Tilgjengelighet.MidlertidigUtilgjengelig}
                            className="midlertidig-utilgjengelig-search__flagg--utilgjengelig"
                        />
                    </>
                }
                value={Tilgjengelighet.MidlertidigUtilgjengelig}
                checked={props.midlertidigUtilgjengelig.includes(
                    Tilgjengelighet.MidlertidigUtilgjengelig
                )}
                onChange={onMidlertidigUtilgjengeligChange}
            />
        </SkjemaGruppe>
    );
};

const mapStateToProps = (state: AppState) => ({
    midlertidigUtilgjengelig: state.søkefilter.tilgjengelighet.midlertidigUtilgjengelig,
});

const mapDispatchToProps = (dispatch: (action: any) => void) => ({
    checkMidlertidigUtilgjengelig: (midlertidigUtilgjengelig: Tilgjengelighet) =>
        dispatch({
            type: TilgjengelighetAction.CheckMidlertidigUtilgjengelig,
            value: midlertidigUtilgjengelig,
        }),
    uncheckMidlertidigUtilgjengelig: (midlertidigUtilgjengelig: Tilgjengelighet) =>
        dispatch({
            type: TilgjengelighetAction.UncheckMidlertidigUtilgjengelig,
            value: midlertidigUtilgjengelig,
        }),
    search: () => dispatch({ type: SEARCH }),
});

export default connect(mapStateToProps, mapDispatchToProps)(MidlertidigUtilgjengeligSearch);
