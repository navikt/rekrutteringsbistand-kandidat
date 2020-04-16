import React, { ChangeEvent, FunctionComponent } from 'react';
import { Checkbox, SkjemaGruppe } from 'nav-frontend-skjema';
import { Normaltekst } from 'nav-frontend-typografi';
import { SEARCH } from '../../searchReducer';
import { ALERTTYPE } from '../../../../felles/konstanter';
import { CHECK_TOTAL_ERFARING, UNCHECK_TOTAL_ERFARING } from '../arbeidserfaringReducer';
import { connect } from 'react-redux';
import AppState from '../../../AppState';
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
            title="Totalt antall år med arbeidserfaring"
        >
            <Normaltekst>Velg en eller flere</Normaltekst>
            <div className="sokekriterier--kriterier">
                {aarMedErfaringer.map(arbeidserfaring => (
                    <Checkbox
                        className="checkbox--arbeidserfaring skjemaelement--pink"
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
    totalErfaring: state.arbeidserfaring.totalErfaring,
});

const mapDispatchToProps = (dispatch: any) => ({
    search: () => dispatch({ type: SEARCH, alertType: ALERTTYPE.ARBEIDSERFARING }),
    checkTotalErfaring: (value: string) => dispatch({ type: CHECK_TOTAL_ERFARING, value }),
    uncheckTotalErfaring: (value: string) => dispatch({ type: UNCHECK_TOTAL_ERFARING, value }),
});

export default connect(mapStateToProps, mapDispatchToProps)(AntallÅrArbeidserfaring);
