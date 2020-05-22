import React, { FunctionComponent } from 'react';
import { Checkbox, SkjemaGruppe } from 'nav-frontend-skjema';
import { Status } from '../kandidatrad/statusSelect/StatusSelect';

import { statusToDisplayName } from '../../kandidatliste/kandidatrad/statusSelect/StatusSelect';
import { Undertittel } from 'nav-frontend-typografi';
import { Utfall } from '../kandidatrad/KandidatRad';
import { utfallToString } from '../../kandidatliste/kandidatrad/KandidatRad';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import useVinduErBredereEnn from './useVinduErBredereEnn';
import './Filter.less';
import { KategoriLitenSkjerm, KategoriStorSkjerm } from './Kategori';

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
    const harStorSkjerm = useVinduErBredereEnn(1280);

    const statuscheckbokser = Object.values(Status).map((status) => (
        <Checkbox
            key={status}
            value={status}
            label={`${statusToDisplayName(status)} (${antallMedStatus[status] ?? 0})`}
            checked={statusfilter[status]}
            name="statusfilter"
            className="kandidatliste-filter__checkbox"
            onChange={(e) => onToggleStatus(e.currentTarget.value as Status)}
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
            onChange={(e) => onToggleUtfall(e.currentTarget.value as Utfall)}
        />
    ));

    const arkivfilter = (
        <Checkbox
            label={`Vis kun slettede (${antallArkiverte})`}
            checked={visArkiverte}
            onChange={onToggleArkiverte}
        />
    );

    if (harStorSkjerm) {
        return (
            <aside className="kandidatliste-filter">
                <KategoriLitenSkjerm kategori="Status">{statuscheckbokser}</KategoriLitenSkjerm>
                <KategoriLitenSkjerm kategori="Utfall">{utfallscheckbokser}</KategoriLitenSkjerm>
                <KategoriLitenSkjerm kategori="Slettet">{arkivfilter}</KategoriLitenSkjerm>
            </aside>
        );
    }

    return (
        <Ekspanderbartpanel
            tittel={<Undertittel>Filter</Undertittel>}
            className="kandidatliste-filter--samlet"
            border
        >
            <KategoriStorSkjerm kategori="Status">{statuscheckbokser}</KategoriStorSkjerm>
            <KategoriStorSkjerm kategori="Utfall">{utfallscheckbokser}</KategoriStorSkjerm>
            <KategoriStorSkjerm kategori="Slettet">{arkivfilter}</KategoriStorSkjerm>
        </Ekspanderbartpanel>
    );
};

export default Filter;
