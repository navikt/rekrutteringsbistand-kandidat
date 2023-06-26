import { FunctionComponent, useEffect, useState } from 'react';
import { PlusCircleIcon, MinusCircleIcon } from '@navikt/aksel-icons';
import Hendelse, { Hendelsesstatus } from './Hendelse';
import { hentSisteKandidatutfall, Kandidatutfall, Utfallsendring } from '../../../domene/Kandidat';
import { formaterDatoNaturlig } from '../../../../utils/dateUtils';
import { Button } from '@navikt/ds-react';
import css from './Hendelse.module.css';

type Props = {
    kanEndre?: boolean;
    utfall: Kandidatutfall;
    utfallsendringer: Utfallsendring[];
    navn: string;
    onEndreUtfall: (nyttUtfall: Kandidatutfall) => void;
};

enum Visning {
    Registrer,
    FjernRegistrering,
    BekreftRegistrer,
    BekreftFjernRegistrering,
}

const FåttJobben: FunctionComponent<Props> = ({
    kanEndre,
    utfall,
    utfallsendringer,
    navn,
    onEndreUtfall,
}) => {
    const [visning, setVisning] = useState<Visning>(
        utfall === Kandidatutfall.FåttJobben ? Visning.FjernRegistrering : Visning.Registrer
    );

    useEffect(() => {
        setVisning(
            utfall === Kandidatutfall.FåttJobben ? Visning.FjernRegistrering : Visning.Registrer
        );
    }, [utfall]);

    const onRegistrer = () => setVisning(Visning.BekreftRegistrer);
    const onFjernRegistrering = () => setVisning(Visning.BekreftFjernRegistrering);
    const onAvbrytRegistrering = () => setVisning(Visning.Registrer);
    const onAvbrytFjerningAvRegistrering = () => setVisning(Visning.FjernRegistrering);

    const onBekreftRegistreringClick = () => {
        onEndreUtfall(Kandidatutfall.FåttJobben);
    };

    const onBekreftFjerningAvRegistrering = () => {
        onEndreUtfall(Kandidatutfall.Presentert);
    };

    const hendelsesstatus =
        utfall === Kandidatutfall.FåttJobben ? Hendelsesstatus.Grønn : Hendelsesstatus.Hvit;

    switch (visning) {
        case Visning.Registrer:
            return (
                <Hendelse
                    status={hendelsesstatus}
                    tittel={kanEndre ? undefined : 'Kandidaten har fått jobb'}
                    beskrivelse={kanEndre ? undefined : 'Gjøres av eier av stillingen/listen'}
                >
                    {kanEndre && (
                        <Button
                            size="small"
                            variant="tertiary"
                            onClick={onRegistrer}
                            className={css.flyttLittOpp}
                            icon={<PlusCircleIcon />}
                        >
                            Registrer at kandidaten har fått jobb
                        </Button>
                    )}
                </Hendelse>
            );

        case Visning.FjernRegistrering:
            const utfallsendring = hentSisteKandidatutfall(
                Kandidatutfall.Presentert,
                utfallsendringer
            );
            const utfallsbeskrivelse = utfallsendring
                ? `${formaterDatoNaturlig(utfallsendring.tidspunkt)} av ${
                      utfallsendring.registrertAvIdent
                  }`
                : undefined;

            return (
                <Hendelse
                    status={hendelsesstatus}
                    tittel="Kandidaten har fått jobben"
                    beskrivelse={utfallsbeskrivelse}
                >
                    {kanEndre && (
                        <Button
                            size="small"
                            variant="tertiary"
                            onClick={onFjernRegistrering}
                            icon={<MinusCircleIcon />}
                        >
                            Fjern registreringen
                        </Button>
                    )}
                </Hendelse>
            );

        case Visning.BekreftRegistrer:
            return (
                <Hendelse
                    renderChildrenBelowContent
                    status={hendelsesstatus}
                    tittel={`Registrer at ${navn} har fått jobben`}
                    beskrivelse="Når du registrerer at en kandidat har fått jobb vil resultatet bli telt, og tellingen vil bli brukt til statistikk"
                >
                    {kanEndre && (
                        <div className={css.knapperUnderHendelse}>
                            <Button
                                size="small"
                                variant="primary"
                                onClick={onBekreftRegistreringClick}
                            >
                                Registrere fått jobben
                            </Button>
                            <Button variant="secondary" size="small" onClick={onAvbrytRegistrering}>
                                Avbryt
                            </Button>
                        </div>
                    )}
                </Hendelse>
            );

        case Visning.BekreftFjernRegistrering:
            return (
                <Hendelse
                    renderChildrenBelowContent
                    status={hendelsesstatus}
                    tittel="Fjern registreringen «fått jobben»"
                    beskrivelse="Hvis du fjerner registreringen vil tellingen på «fått jobben» forsvinne."
                >
                    {kanEndre && (
                        <div className={css.knapperUnderHendelse}>
                            <Button
                                size="small"
                                variant="primary"
                                onClick={onBekreftFjerningAvRegistrering}
                            >
                                Fjern registreringen
                            </Button>
                            <Button
                                size="small"
                                variant="secondary"
                                onClick={onAvbrytFjerningAvRegistrering}
                            >
                                Avbryt
                            </Button>
                        </div>
                    )}
                </Hendelse>
            );
    }
};

export default FåttJobben;
