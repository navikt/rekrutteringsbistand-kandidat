import React, { FunctionComponent } from 'react';
import { Row } from 'nav-frontend-grid';
import { Element, Undertekst, Normaltekst } from 'nav-frontend-typografi';
import { Godkjenning as GodkjenningType } from '../reducer/cv-typer';
import Tidsperiode from './Tidsperiode';

type Props = {
    godkjenning: GodkjenningType;
};

const Godkjenning: FunctionComponent<Props> = ({ godkjenning }) => {
    return (
        <Row className="kandidat-cv__row-kategori">
            <Undertekst className="kandidat-cv__tidsperiode">
                <Tidsperiode fradato={godkjenning.gjennomfoert} />
            </Undertekst>
            {godkjenning.utsteder && <Normaltekst>{godkjenning.utsteder}</Normaltekst>}
            <Element>{godkjenning.tittel}</Element>
            {godkjenning.utloeper && (
                <Normaltekst>
                    Utløper: <Tidsperiode tildato={godkjenning.utloeper} />
                </Normaltekst>
            )}
        </Row>
    );
};

export default Godkjenning;
