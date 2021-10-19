import React, { FunctionComponent } from 'react';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { Checkbox, CheckboxGruppe } from 'nav-frontend-skjema';
import { Undertittel } from 'nav-frontend-typografi';

import { Kandidatstatus } from '../domene/Kandidat';
import { AntallFiltertreff } from '../hooks/useAntallFiltertreff';
import useVinduErBredereEnn from '../hooks/useVinduErBredereEnn';
import { statusToDisplayName } from '../kandidatrad/status-og-hendelser/etiketter/StatusEtikett';
import { KategoriLitenSkjerm, KategoriStorSkjerm } from './Kategori';
import { Hendelse } from '../kandidatrad/status-og-hendelser/etiketter/Hendelsesetikett';
import './Filter.less';

interface Props {
    antallTreff: AntallFiltertreff;
    visArkiverte: boolean;
    statusfilter: Record<Kandidatstatus, boolean>;
    hendelsefilter?: Record<Hendelse, boolean>;
    onToggleArkiverte: () => void;
    onToggleStatus: (status: Kandidatstatus) => void;
    onToggleHendelse: (hendelse: Hendelse) => void;
}

const Filter: FunctionComponent<Props> = ({
    antallTreff,
    visArkiverte,
    statusfilter,
    hendelsefilter,
    onToggleArkiverte,
    onToggleStatus,
    onToggleHendelse,
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

    const filtrerbareHendelser = Object.values(Hendelse);

    const hendelsescheckbokser = hendelsefilter
        ? filtrerbareHendelser.map((hendelse) => (
              <Checkbox
                  key={hendelse}
                  value={hendelse}
                  label={`${hendelseTilLabel(hendelse)} (${antallTreff.hendelse[hendelse] ?? 0})`}
                  checked={hendelsefilter[hendelse]}
                  name="hendelsesfilter"
                  className="kandidatliste-filter__checkbox"
                  onChange={(e) => onToggleHendelse(e.currentTarget.value as Hendelse)}
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

const hendelseTilLabel = (hendelse: Hendelse) => {
    switch (hendelse) {
        case Hendelse.NyKandidat:
            return 'Ny kandidat';
        case Hendelse.DeltMedKandidat:
            return 'Stilling delt med kandidat';
        case Hendelse.SvarJa:
            return 'Svar: Ja';
        case Hendelse.SvarNei:
            return 'Svar: Nei';
        case Hendelse.CvDelt:
            return 'CV delt med arbeidsgiver';
        case Hendelse.FåttJobben:
            return 'Fått jobben';
    }
};

export default Filter;
