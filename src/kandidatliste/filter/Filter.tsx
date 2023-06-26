import { FunctionComponent } from 'react';
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
                  name="hendelsesfilter"
                  className="kandidatliste-filter__checkbox"
                  onChange={(e) => onToggleHendelse(e.currentTarget.value as Hendelse)}
              >
                  {`${hendelseTilLabel(hendelse)} (${antallTreff.hendelse[hendelse] ?? 0})`}
              </Checkbox>
          ))
        : undefined;

    const arkivfilter = (
        <Checkbox checked={visArkiverte} onChange={onToggleArkiverte} value="">
            {`Vis kun slettede (${antallTreff.arkiverte})`}
        </Checkbox>
    );

    return harStorSkjerm ? (
        <aside className={className}>
            <Accordion className={css.accordionStorSkjerm}>
                <Accordion.Item defaultOpen>
                    <Accordion.Header>Status/hendelser</Accordion.Header>
                    <Accordion.Content className={css.content}>
                        <CheckboxGroup
                            legend="Status"
                            size="small"
                            value={Object.entries(statusfilter)
                                .filter(([_, value]) => value)
                                .map(([key, _]) => key)}
                        >
                            {statuscheckbokser}
                        </CheckboxGroup>
                        {hendelsescheckbokser && (
                            <CheckboxGroup
                                legend="Hendelser"
                                className={css.hendelsesGruppeStorSkjerm}
                                size="small"
                                value={
                                    hendelsefilter
                                        ? Object.entries(hendelsefilter)
                                              .filter(([_, value]) => value)
                                              .map(([key, _]) => key)
                                        : []
                                }
                            >
                                {hendelsescheckbokser}
                            </CheckboxGroup>
                        )}
                        <CheckboxGroup
                            legend="Slettet"
                            size="small"
                            className={css.hendelsesGruppeStorSkjerm}
                        >
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
                    className={classNames(css.content, css.kandidatlisteFilterKategoriLitenSkjerm)}
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
