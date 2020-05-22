import React, { FunctionComponent, ChangeEvent } from 'react';
import { Checkbox, SkjemaGruppe } from 'nav-frontend-skjema';
import { Status } from '../kandidatrad/statusSelect/StatusSelect';

import { Undertittel, Element } from 'nav-frontend-typografi';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import useVinduErBredereEnn from './useVinduErBredereEnn';
import './Filter.less';
import { Utfall } from '../kandidatrad/KandidatRad';
import { statusToDisplayName } from '../../kandidatliste/kandidatrad/statusSelect/StatusSelect';
import { utfallToString } from '../../kandidatliste/kandidatrad/KandidatRad';

interface Props {
    antallArkiverte: number;
    antallMedStatus: Record<Status, number>;
    antallMedUtfall: Record<Utfall, number>;
    visArkiverte: boolean;
    statusfilter: Record<Status, boolean>;
    utfallsfilter: Record<Utfall, boolean>;
    onToggleArkiverte: () => void;
    onToggleStatus: (status: Status) => void;
    onToggleUtfall: (utfall: Utfall) => void;
}

const Filter: FunctionComponent<Props> = ({
    antallArkiverte,
    antallMedStatus,
    antallMedUtfall,
    visArkiverte,
    statusfilter,
    utfallsfilter,
    onToggleArkiverte,
    onToggleStatus,
    onToggleUtfall,
}) => {
    const onStatusChange = (e: ChangeEvent<HTMLInputElement>) => {
        onToggleStatus(e.currentTarget.value as Status);
    };

    const onUtfallChange = (e: ChangeEvent<HTMLInputElement>) => {
        onToggleUtfall(e.currentTarget.value as Utfall);
    };

    const desktop = useVinduErBredereEnn(1280);

    const statuscheckbokser = Object.values(Status).map((status) => (
        <Checkbox
            key={status}
            value={status}
            label={`${statusToDisplayName(status)} (${antallMedStatus[status] ?? 0})`}
            checked={statusfilter[status]}
            name="statusfilter"
            className="kandidatliste-filter__checkbox"
            onChange={onStatusChange}
        />
    ));

    const utfallscheckbokser = Object.values(Utfall).map((utfall) => (
        <Checkbox
            key={utfall}
            value={utfall}
            label={`${utfallToString(utfall)} (${antallMedUtfall[utfall] ?? 0})`}
            checked={utfallsfilter[utfall]}
            name="utfallsfilter"
            className="kandidatliste-filter__checkbox"
            onChange={onUtfallChange}
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
                <Ekspanderbartpanel apen border tittel={<Element>Utfall</Element>}>
                    {utfallscheckbokser}
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
                legend={<Element>Utfall</Element>}
            >
                {utfallscheckbokser}
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
