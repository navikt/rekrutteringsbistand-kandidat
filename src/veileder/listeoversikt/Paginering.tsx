import React, { FunctionComponent } from 'react';
import NavFrontendChevron from 'nav-frontend-chevron';
import { Nesteknapp } from 'nav-frontend-ikonknapper';
import { Flatknapp } from 'nav-frontend-knapper';
import { Normaltekst } from 'nav-frontend-typografi';
import { KandidatlisterSøkekriterier } from './Kandidatlisteoversikt';

type Props = {
    kandidatlisterSokeKriterier: KandidatlisterSøkekriterier;
    totaltAntallKandidatlister: number;
    forrigeSide: () => void;
    nesteSide: () => void;
};

const Paginering: FunctionComponent<Props> = ({
    kandidatlisterSokeKriterier,
    totaltAntallKandidatlister,
    forrigeSide,
    nesteSide,
}) => {
    const sisteSide = Math.ceil(totaltAntallKandidatlister / kandidatlisterSokeKriterier.pagesize);
    return (
        <div className="kandidatlister-table--bottom">
            <Normaltekst>{`Viser side ${
                kandidatlisterSokeKriterier.pagenumber + 1
            } av ${sisteSide}`}</Normaltekst>
            <div className="kandidatlister-table--bottom__buttons">
                {kandidatlisterSokeKriterier.pagenumber > 0 && (
                    <Flatknapp onClick={forrigeSide}>
                        <NavFrontendChevron type="venstre" />
                        Forrige
                    </Flatknapp>
                )}
                {kandidatlisterSokeKriterier.pagenumber < sisteSide - 1 && (
                    <Nesteknapp onClick={nesteSide} />
                )}
            </div>
        </div>
    );
};

export default Paginering;
