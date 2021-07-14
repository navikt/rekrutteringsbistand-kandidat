import React, { ChangeEvent, FunctionComponent } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Checkbox, SkjemaGruppe } from 'nav-frontend-skjema';
import { Element, Normaltekst } from 'nav-frontend-typografi';

import { ALERTTYPE } from '../../../../common/konstanter';
import { ArbeidserfaringAction, ArbeidserfaringActionType } from '../arbeidserfaringReducer';
import AppState from '../../../../AppState';
import { KandidatsøkAction, KandidatsøkActionType } from '../../../reducer/searchActions';
import './AntallÅrArbeidserfaring.less';

const aarMedErfaringer = [
    { label: 'Under 1 år', value: '0-11' },
    { label: '1-3 år', value: '12-47' },
    { label: '4-9 år', value: '48-119' },
    { label: 'Over 10 år', value: '120-' },
];

interface Props {
    totalErfaring: string[];
    search: () => void;
    checkTotalErfaring: (value: string) => void;
    uncheckTotalErfaring: (value: string) => void;
}

const AntallÅrArbeidserfaring: FunctionComponent<Props> = ({
    totalErfaring,
    search,
    checkTotalErfaring,
    uncheckTotalErfaring,
}) => {
    const onTotalErfaringChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            checkTotalErfaring(e.target.value);
        } else {
            uncheckTotalErfaring(e.target.value);
        }
        search();
    };

    return (
        <SkjemaGruppe
            className="ar-med-arbeidserfaring__header"
            legend={<Element>Totalt antall år med arbeidserfaring</Element>}
        >
            <Normaltekst>Velg en eller flere</Normaltekst>
            <div className="sokekriterier--kriterier">
                {aarMedErfaringer.map((arbeidserfaring) => (
                    <Checkbox
                        className="checkbox--arbeidserfaring"
                        id={`arbeidserfaring-${arbeidserfaring.value.toLowerCase()}-checkbox`}
                        label={arbeidserfaring.label}
                        key={arbeidserfaring.value}
                        value={arbeidserfaring.value}
                        checked={totalErfaring.includes(arbeidserfaring.value)}
                        onChange={onTotalErfaringChange}
                    />
                ))}
            </div>
        </SkjemaGruppe>
    );
};

const mapStateToProps = (state: AppState) => ({
    totalErfaring: state.søkefilter.arbeidserfaring.totalErfaring,
});

const mapDispatchToProps = (dispatch: Dispatch<KandidatsøkAction | ArbeidserfaringAction>) => ({
    search: () =>
        dispatch({ type: KandidatsøkActionType.Search, alertType: ALERTTYPE.ARBEIDSERFARING }),
    checkTotalErfaring: (value: string) =>
        dispatch({ type: ArbeidserfaringActionType.CheckTotalErfaring, value }),
    uncheckTotalErfaring: (value: string) =>
        dispatch({ type: ArbeidserfaringActionType.UncheckTotalErfaring, value }),
});

export default connect(mapStateToProps, mapDispatchToProps)(AntallÅrArbeidserfaring);
