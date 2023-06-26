import { FunctionComponent } from 'react';
import { BodyShort, Detail } from '@navikt/ds-react';
import { Kurs as KursType, Omfang, Omfangenhet } from '../reducer/cv-typer';
import TidspunktMedLabel from './TidspunktMedLabel';
import { toDate } from './sortByDato';
import css from './Cv.module.css';

type Props = {
    kurs: KursType;
};

const Kurs: FunctionComponent<Props> = ({ kurs }) => {
    const gjeldendeDato = kurs.tilDato ? kurs.tilDato : kurs.fraDato;
    const dato = gjeldendeDato == null ? null : toDate(gjeldendeDato);
    const varighet = hentKursvarighet(kurs.omfang);

    return (
        <>
            <Detail className={css.tidsperiode}>
                <TidspunktMedLabel tidspunkt={dato} labelTekst="fullført" />
            </Detail>
            <div className={css.erfaring}>
                {kurs.tittel && <BodyShort className={css.bold}>{kurs.tittel}</BodyShort>}
                {kurs.arrangor && <BodyShort>{kurs.arrangor}</BodyShort>}
                {varighet && <BodyShort>{`Varighet: ${varighet}`}</BodyShort>}
            </div>
        </>
    );
};

const hentKursvarighet = (omfang: Omfang) => {
    switch (omfang.enhet) {
        case Omfangenhet.Time:
            return `${omfang.verdi} ${omfang.verdi > 1 ? 'timer' : 'time'}`;
        case Omfangenhet.Dag:
            return `${omfang.verdi} ${omfang.verdi > 1 ? 'dager' : 'dag'}`;
        case Omfangenhet.Uke:
            return `${omfang.verdi} ${omfang.verdi > 1 ? 'uker' : 'uke'}`;
        case Omfangenhet.Måned:
            return `${omfang.verdi} ${omfang.verdi > 1 ? 'måneder' : 'måned'}`;
        default:
            return `${omfang.verdi} (mangler tidsenhet)`;
    }
};

export default Kurs;
