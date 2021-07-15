import React, { FunctionComponent } from 'react';
import { Row } from 'nav-frontend-grid';
import { Element, Undertekst, Normaltekst } from 'nav-frontend-typografi';
import Tidsperiode from './Tidsperiode';
import { Kurs as KursType, Omfang, Omfangenhet } from '../reducer/cv-typer';

type Props = {
    kurs: KursType;
};

const Kurs: FunctionComponent<Props> = ({ kurs }) => {
    return (
        <Row className="kandidat-cv__row-kategori">
            <Undertekst className="kandidat-cv__tidsperiode">
                <Tidsperiode fradato={kurs.fraDato} tildato={kurs.tilDato} />
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
            return '';
    }
};

export default Kurs;
