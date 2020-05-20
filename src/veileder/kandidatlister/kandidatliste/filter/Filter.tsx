import React, { FunctionComponent, ChangeEvent } from 'react';
import { Checkbox, SkjemaGruppe } from 'nav-frontend-skjema';
import { Status } from '../kandidatrad/statusSelect/StatusSelect';

import { Undertittel, Element } from 'nav-frontend-typografi';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import useVinduErBredereEnn from './useVinduErBredereEnn';
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

    const statuscheckbokser = Object.entries(Status).map(([enumKey, enumValue]) => (
        <Checkbox
            key={enumValue}
            value={enumValue}
            label={`${enumKey} (${antallMedStatus[enumValue] ?? 0})`}
            checked={statusfilter[enumValue]}
            name="statusfilter"
            className="kandidatliste-filter__checkbox"
            onChange={onStatusChange}
        />
    ));

    const arkivfilter = (
        <Checkbox
            label={`Vis kun slettede (${antallArkiverte})`}
            checked={visArkiverte}
            onChange={onToggleArkiverte}
        />
    );

    if (desktop) {
        return (
            <aside className="kandidatliste-filter">
                <Ekspanderbartpanel apen border tittel={<Element>Status</Element>}>
                    {statuscheckbokser}
                </Ekspanderbartpanel>
                <Ekspanderbartpanel apen border tittel={<Element>Slettet</Element>}>
                    {arkivfilter}
                </Ekspanderbartpanel>
            </aside>
        );
    }

    return (
        <Ekspanderbartpanel
            tittel={<Undertittel>Filter</Undertittel>}
            className="kandidatliste-filter--samlet"
            border
        >
            <SkjemaGruppe
                className="kandidatliste-filter__kategori"
                legend={<Element>Status</Element>}
            >
                {statuscheckbokser}
            </SkjemaGruppe>
            <SkjemaGruppe
                className="kandidatliste-filter__kategori"
                legend={<Element>Slettet</Element>}
            >
                {arkivfilter}
            </SkjemaGruppe>
        </Ekspanderbartpanel>
    );
};

export default Filter;
