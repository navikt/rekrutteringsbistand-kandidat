import React, { FunctionComponent } from 'react';
import { Checkbox } from 'nav-frontend-skjema';
import { Status } from '../kandidatrad/statusSelect/StatusSelect';

import { AntallFiltertreff } from './useAntallFiltertreff';
import { KategoriLitenSkjerm, KategoriStorSkjerm } from './Kategori';
import { statusToDisplayName } from '../../kandidatliste/kandidatrad/statusSelect/StatusSelect';
import { Undertittel } from 'nav-frontend-typografi';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import useVinduErBredereEnn from './useVinduErBredereEnn';
import { utfallToDisplayName } from '../kandidatrad/utfall-select/UtfallVisning';
import { Utfall } from '../kandidatrad/utfall-select/UtfallSelect';
import './Filter.less';

interface Props {
    antallTreff: AntallFiltertreff;
    visArkiverte: boolean;
    statusfilter: Record<Status, boolean>;
    utfallsfilter?: Record<Utfall, boolean>;
    onToggleArkiverte: () => void;
    onToggleStatus: (status: Status) => void;
    onToggleUtfall: (utfall: Utfall) => void;
}

const Filter: FunctionComponent<Props> = ({
    antallTreff,
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
            label={`${statusToDisplayName(status)} (${antallTreff.status[status] ?? 0})`}
            checked={statusfilter[status]}
            name="statusfilter"
            className="kandidatliste-filter__checkbox"
            onChange={(e) => onToggleStatus(e.currentTarget.value as Status)}
        />
    ));

    const utfallscheckbokser = utfallsfilter
        ? Object.values(Utfall).map((utfall) => (
              <Checkbox
                  key={utfall}
                  value={utfall}
                  label={`${utfallToDisplayName(utfall)} (${antallTreff.utfall[utfall] ?? 0})`}
                  checked={utfallsfilter[utfall]}
                  name="utfallsfilter"
                  className="kandidatliste-filter__checkbox"
                  onChange={(e) => onToggleUtfall(e.currentTarget.value as Utfall)}
              />
          ))
        : undefined;

    const arkivfilter = (
        <Checkbox
            label={`Vis kun slettede (${antallTreff.arkiverte})`}
            checked={visArkiverte}
            onChange={onToggleArkiverte}
        />
    );

    return harStorSkjerm ? (
        <aside className="kandidatliste-filter">
            <KategoriStorSkjerm kategori="Status">{statuscheckbokser}</KategoriStorSkjerm>
            {utfallsfilter && (
                <KategoriStorSkjerm kategori="Utfall">{utfallscheckbokser}</KategoriStorSkjerm>
            )}
            <KategoriStorSkjerm kategori="Slettet">{arkivfilter}</KategoriStorSkjerm>
        </aside>
    ) : (
        <Ekspanderbartpanel
            tittel={<Undertittel>Filter</Undertittel>}
            className="kandidatliste-filter--samlet"
            border
        >
            <KategoriLitenSkjerm kategori="Status">{statuscheckbokser}</KategoriLitenSkjerm>
            {utfallsfilter && (
                <KategoriLitenSkjerm kategori="Utfall">{utfallscheckbokser}</KategoriLitenSkjerm>
            )}
            <KategoriLitenSkjerm kategori="Slettet">{arkivfilter}</KategoriLitenSkjerm>
        </Ekspanderbartpanel>
    );
};

export default Filter;
