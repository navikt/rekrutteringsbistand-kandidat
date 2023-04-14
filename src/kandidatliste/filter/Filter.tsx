import React, { FunctionComponent } from 'react';
import { Checkbox, CheckboxGroup, Label } from '@navikt/ds-react';

import { Kandidatstatus } from '../domene/Kandidat';
import { AntallFiltertreff } from '../hooks/useAntallFiltertreff';
import useVinduErBredereEnn from '../hooks/useVinduErBredereEnn';
import { statusToDisplayName } from '../kandidatrad/status-og-hendelser/etiketter/StatusEtikett';
import { Hendelse } from '../kandidatrad/status-og-hendelser/etiketter/Hendelsesetikett';
import css from './Filter.module.css';
import classNames from 'classnames';
import { Accordion } from '@navikt/ds-react';

type Props = {
    antallTreff: AntallFiltertreff;
    visArkiverte: boolean;
    statusfilter: Record<Kandidatstatus, boolean>;
    hendelsefilter?: Record<Hendelse, boolean>;
    onToggleArkiverte: () => void;
    onToggleStatus: (status: Kandidatstatus) => void;
    onToggleHendelse: (hendelse: Hendelse) => void;
    className: string;
};

const Filter: FunctionComponent<Props> = ({
    antallTreff,
    visArkiverte,
    statusfilter,
    hendelsefilter,
    onToggleArkiverte,
    onToggleStatus,
    onToggleHendelse,
    className,
}) => {
    const harStorSkjerm = useVinduErBredereEnn(1280);

    const statuscheckbokser = Object.values(Kandidatstatus).map((status) => (
        <Checkbox
            key={status}
            value={status}
            checked={statusfilter[status]}
            name="statusfilter"
            className="kandidatliste-filter__checkbox"
            onChange={(e) => onToggleStatus(e.currentTarget.value as Kandidatstatus)}
        >
            {`${statusToDisplayName(status)} (${antallTreff.status[status] ?? 0})`}
        </Checkbox>
    ));

    const filtrerbareHendelser = [
        Hendelse.NyKandidat,
        Hendelse.DeltMedKandidat,
        Hendelse.SvarJa,
        Hendelse.SvarNei,
        Hendelse.CvDelt,
        Hendelse.FåttJobben,
    ];

    const hendelsescheckbokser = hendelsefilter
        ? filtrerbareHendelser.map((hendelse) => (
              <Checkbox
                  key={hendelse}
                  value={hendelse}
                  checked={hendelsefilter[hendelse]}
                  name="hendelsesfilter"
                  className="kandidatliste-filter__checkbox"
                  onChange={(e) => onToggleHendelse(e.currentTarget.value as Hendelse)}
              >
                  {`${hendelseTilLabel(hendelse)} (${antallTreff.hendelse[hendelse] ?? 0})`}
              </Checkbox>
          ))
        : undefined;

    const arkivfilter = (
        <Checkbox checked={visArkiverte} onChange={onToggleArkiverte}>
            {`Vis kun slettede (${antallTreff.arkiverte})`}
        </Checkbox>
    );

    return harStorSkjerm ? (
        <aside className={className}>
            <Accordion className={css.accordionStorSkjerm}>
                <Accordion.Item defaultOpen>
                    <Accordion.Header>Status/hendelser</Accordion.Header>
                    <Accordion.Content className={css.innhold}>
                        <CheckboxGroup legend="Status" size="small">
                            {statuscheckbokser}
                        </CheckboxGroup>
                        {hendelsescheckbokser && (
                            <CheckboxGroup
                                legend="Hendelser"
                                className={css.hendelsesGruppeStorSkjerm}
                                size="small"
                            >
                                {hendelsescheckbokser}
                            </CheckboxGroup>
                        )}
                    </Accordion.Content>
                </Accordion.Item>
                <Accordion.Item defaultOpen>
                    <Accordion.Header>Status/hendelser</Accordion.Header>
                    <Accordion.Content className={css.innhold}>
                        <CheckboxGroup legend="Slettet" size="small">
                            {arkivfilter}
                        </CheckboxGroup>
                    </Accordion.Content>
                </Accordion.Item>
            </Accordion>
        </aside>
    ) : (
        <Accordion className={css.accordionLitenSkjerm}>
            <Accordion.Item>
                <Accordion.Header>Filter</Accordion.Header>
                <Accordion.Content
                    className={classNames(css.innhold, css.kandidatlisteFilterKategoriLitenSkjerm)}
                >
                    <CheckboxGroup legend={<Label>Status</Label>} size="small">
                        {statuscheckbokser}
                    </CheckboxGroup>
                    {hendelsescheckbokser && (
                        <CheckboxGroup legend={<Label>Hendelser</Label>} size="small">
                            {hendelsescheckbokser}
                        </CheckboxGroup>
                    )}
                    <CheckboxGroup legend={<Label>Slettet</Label>} size="small">
                        {arkivfilter}
                    </CheckboxGroup>
                    <div />
                </Accordion.Content>
            </Accordion.Item>
        </Accordion>
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
