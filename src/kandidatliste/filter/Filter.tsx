import React, { FunctionComponent } from 'react';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { Checkbox, CheckboxGruppe } from 'nav-frontend-skjema';
import { Undertittel } from 'nav-frontend-typografi';

import { Kandidatstatus, Kandidatutfall } from '../domene/Kandidat';
import { AntallFiltertreff } from '../hooks/useAntallFiltertreff';
import useVinduErBredereEnn from '../hooks/useVinduErBredereEnn';
import { statusToDisplayName } from '../kandidatrad/status-og-hendelser/etiketter/StatusEtikett';
import { KategoriLitenSkjerm, KategoriStorSkjerm } from './Kategori';
import './Filter.less';

interface Props {
    antallTreff: AntallFiltertreff;
    visArkiverte: boolean;
    statusfilter: Record<Kandidatstatus, boolean>;
    utfallsfilter?: Record<Kandidatutfall, boolean>;
    onToggleArkiverte: () => void;
    onToggleStatus: (status: Kandidatstatus) => void;
    onToggleUtfall: (utfall: Kandidatutfall) => void;
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

    const hendelsescheckbokser = utfallsfilter
        ? Object.values(Kandidatutfall).map((utfall) => (
              <Checkbox
                  key={utfall}
                  value={utfall}
                  label={`${utfallTilHendelse(utfall)} (${antallTreff.utfall[utfall] ?? 0})`}
                  checked={utfallsfilter[utfall]}
                  name="hendelsesfilter"
                  className="kandidatliste-filter__checkbox"
                  onChange={(e) => onToggleUtfall(e.currentTarget.value as Kandidatutfall)}
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
            <KategoriStorSkjerm kategori="Status/hendelser">
                <CheckboxGruppe legend="Status">{statuscheckbokser}</CheckboxGruppe>
                {hendelsescheckbokser && (
                    <CheckboxGruppe legend="Hendelser">{hendelsescheckbokser}</CheckboxGruppe>
                )}
            </KategoriStorSkjerm>
            <KategoriStorSkjerm kategori="Slettet">{arkivfilter}</KategoriStorSkjerm>
        </aside>
    ) : (
        <Ekspanderbartpanel
            tittel={<Undertittel>Filter</Undertittel>}
            className="kandidatliste-filter--samlet"
            border
        >
            <KategoriLitenSkjerm kategori="Status">{statuscheckbokser}</KategoriLitenSkjerm>
            {hendelsescheckbokser && (
                <KategoriLitenSkjerm kategori="Hendelser">
                    {hendelsescheckbokser}
                </KategoriLitenSkjerm>
            )}
            <KategoriLitenSkjerm kategori="Slettet">{arkivfilter}</KategoriLitenSkjerm>
        </Ekspanderbartpanel>
    );
};

const utfallTilHendelse = (utfall: Kandidatutfall) => {
    switch (utfall) {
        case Kandidatutfall.FåttJobben:
            return 'Fått jobben';
        case Kandidatutfall.Presentert:
            return 'Delt med arbeidsgiver';
        case Kandidatutfall.IkkePresentert:
            return 'Ikke delt med arbeidsgiver';
    }
};

export default Filter;
