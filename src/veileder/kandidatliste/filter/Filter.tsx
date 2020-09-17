import React, { FunctionComponent } from 'react';
import { Checkbox } from 'nav-frontend-skjema';
import { Undertittel } from 'nav-frontend-typografi';
import { AntallFiltertreff } from '../hooks/useAntallFiltertreff';
import { KategoriLitenSkjerm, KategoriStorSkjerm } from './Kategori';
import { statusToDisplayName } from '../kandidatrad/statusSelect/StatusSelect';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import useVinduErBredereEnn from '../hooks/useVinduErBredereEnn';
import { utfallToDisplayName } from '../kandidatrad/utfall-select/UtfallVisning';
import { Utfall } from '../kandidatrad/utfall-select/UtfallSelect';
import './Filter.less';
import { Kandidatstatus } from '../kandidatlistetyper';

interface Props {
    antallTreff: AntallFiltertreff;
    visArkiverte: boolean;
    statusfilter: Record<Kandidatstatus, boolean>;
    utfallsfilter?: Record<Utfall, boolean>;
    onToggleArkiverte: () => void;
    onToggleStatus: (status: Kandidatstatus) => void;
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

    const statuscheckbokser = Object.values(Kandidatstatus).map((status) => (
        <Checkbox
            key={status}
            value={status}
            label={`${statusToDisplayName(status)} (${antallTreff.status[status] ?? 0})`}
            checked={statusfilter[status]}
            name="statusfilter"
            className="kandidatliste-filter__checkbox"
            onChange={(e) => onToggleStatus(e.currentTarget.value as Kandidatstatus)}
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
