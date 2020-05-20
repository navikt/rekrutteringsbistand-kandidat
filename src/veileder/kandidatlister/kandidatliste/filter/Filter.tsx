import React, { FunctionComponent, ChangeEvent } from 'react';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { Element } from 'nav-frontend-typografi';
import { Checkbox } from 'nav-frontend-skjema';
import { Status } from '../kandidatrad/statusSelect/StatusSelect';
import './Filter.less';

interface Props {
    antallArkiverte: number;
    antallMedStatus: Record<Status, number>;

    visArkiverte: boolean;
    statusfilter: Record<Status, boolean>;

    onToggleArkiverte: () => void;
    onToggleStatus: (status: Status) => void;
}

const Filter: FunctionComponent<Props> = ({
    antallArkiverte,
    antallMedStatus,
    visArkiverte,
    statusfilter,
    onToggleArkiverte,
    onToggleStatus,
}) => {
    const onStatusChange = (e: ChangeEvent<HTMLInputElement>) => {
        onToggleStatus(e.currentTarget.value as Status);
    };

    const erPåStorSkjerm = window.innerWidth > 1280;

    return (
        <aside className="kandidatliste-filter">
            <Ekspanderbartpanel border apen={erPåStorSkjerm} tittel={<Element>Status</Element>}>
                {Object.entries(Status).map(([enumKey, enumValue]) => (
                    <Checkbox
                        key={enumValue}
                        value={enumValue}
                        label={`${enumKey} (${antallMedStatus[enumValue] ?? 0})`}
                        checked={statusfilter[enumValue]}
                        name="statusfilter"
                        className="kandidatliste-filter__checkbox"
                        onChange={onStatusChange}
                    />
                ))}
            </Ekspanderbartpanel>
            <Ekspanderbartpanel border apen={erPåStorSkjerm} tittel={<Element>Slettet</Element>}>
                <Checkbox
                    label={`Vis kun slettede (${antallArkiverte})`}
                    checked={visArkiverte}
                    onChange={onToggleArkiverte}
                />
            </Ekspanderbartpanel>
        </aside>
    );
};

export default Filter;
