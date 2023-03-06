import React, { FunctionComponent } from 'react';
import { Row } from 'nav-frontend-grid';
import { Element, Undertekst, Normaltekst } from 'nav-frontend-typografi';
import { Kurs as KursType, Omfang, Omfangenhet } from '../reducer/cv-typer';
import TidspunktMedLabel from './TidspunktMedLabel';
import { toDate } from './SortByDato';

type Props = {
    kurs: KursType;
};

const Kurs: FunctionComponent<Props> = ({ kurs }) => {
    let gjeldendeDato = kurs.tilDato ? kurs.tilDato : kurs.fraDato;
    let dato = gjeldendeDato == null ? null : toDate(gjeldendeDato);
    return (
        <Row className="kandidat-cv__row-kategori">
            <Undertekst className="kandidat-cv__tidsperiode">
                <TidspunktMedLabel tidspunkt={dato} labelTekst="Fullført:" />
            </Undertekst>
            {kurs.arrangor && <Normaltekst>{kurs.arrangor}</Normaltekst>}
            {kurs.tittel && <Element>{kurs.tittel}</Element>}
            {hentKursvarighet(kurs.omfang) && (
                <Normaltekst>{`Varighet: ${hentKursvarighet(kurs.omfang)}`}</Normaltekst>
            )}
        </Row>
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
