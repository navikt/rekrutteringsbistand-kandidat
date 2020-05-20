import React, { FunctionComponent, ChangeEvent } from 'react';
import { Checkbox } from 'nav-frontend-skjema';
import { Status } from '../kandidatrad/statusSelect/StatusSelect';

import Kategori from './Kategori';
import useVinduErBredereEnn from './useVinduErBredereEnn';
import Wrapper from './Wrapper';
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

    const desktop = useVinduErBredereEnn(1280);

    return (
        <Wrapper desktop={desktop}>
            <Kategori desktop={desktop} kategori="Status">
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
            </Kategori>
            <Kategori desktop={desktop} kategori="Slettet">
                <Checkbox
                    label={`Vis kun slettede (${antallArkiverte})`}
                    checked={visArkiverte}
                    onChange={onToggleArkiverte}
                />
            </Kategori>
        </Wrapper>
    );
};

export default Filter;
