import React, { FunctionComponent, useState } from 'react';
import { Checkbox } from 'nav-frontend-skjema';
import { Element } from 'nav-frontend-typografi';
import { Kandidatliste, Kandidatlistestatus } from '../kandidatlistetyper';
import StatusHjelpetekst from './StatusHjelpetekst';
import { KandidatSorteringsfelt } from '../kandidatsortering';
import { Kandidatsortering } from '../Kandidatliste';
import { nesteSorteringsretning, Retning } from '../../common/sorterbarKolonneheader/Retning';
import './../kandidatrad/Kandidatrad.less';
import SorterbarKolonneheader from '../../common/sorterbarKolonneheader/SorterbarKolonneheader';

interface Props {
    kandidatliste: Kandidatliste;
    alleMarkert: boolean;
    onCheckAlleKandidater: () => void;
    visArkiveringskolonne: boolean;
    sortering: Kandidatsortering;
    setSortering: (sortering: Kandidatsortering) => void;
}

export const modifierTilListeradGrid = (
    visUtfallskolonne: boolean,
    visArkiveringskolonne: boolean
) => {
    if (visUtfallskolonne) {
        return visArkiveringskolonne
            ? ' kandidatliste-kandidat__rad--vis-utfall-og-arkivering'
            : ' kandidatliste-kandidat__rad--vis-utfall';
    } else {
        return visArkiveringskolonne ? ' kandidatliste-kandidat__rad--vis-arkivering' : '';
    }
};

const Kolonne: FunctionComponent<{
    tekst: string;
    className?: string;
}> = ({ tekst, className, children }) => {
    return (
        <Element
            role="columnheader"
            tag="div"
            className={`kandidatliste-kandidat__kolonne-tittel${className ? ' ' + className : ''}`}
        >
            {tekst}
            {children}
        </Element>
    );
};

const ListeHeader: FunctionComponent<Props> = ({
    kandidatliste,
    alleMarkert,
    onCheckAlleKandidater,
    visArkiveringskolonne,
    setSortering,
}) => {
    const klassenavn =
        'kandidatliste-kandidat kandidatliste-kandidat__header' +
        (kandidatliste.status === Kandidatlistestatus.Lukket
            ? ' kandidatliste-kandidat--disabled'
            : '');

    const klassenavnForListerad =
        'kandidatliste-kandidat__rad' +
        modifierTilListeradGrid(kandidatliste.stillingId !== null, visArkiveringskolonne);

    const [aktivtSorteringsfelt, setAktivtSorteringsfelt] = useState<KandidatSorteringsfelt | null>(
        null
    );
    const [aktivSorteringsretning, setAktivSorteringsretning] = useState<Retning | null>(null);

    const endreSortering = (sorteringsfeltIndex: number) => {
        const endringPåAktivtFelt = aktivtSorteringsfelt === sorteringsfeltIndex;

        const felt = KandidatSorteringsfelt[sorteringsfeltIndex];
        const retning = endringPåAktivtFelt
            ? nesteSorteringsretning(aktivSorteringsretning)
            : Retning.Stigende;

        setAktivSorteringsretning(retning);
        setAktivtSorteringsfelt(KandidatSorteringsfelt[felt]);
        setSortering({ felt: KandidatSorteringsfelt[felt], retning: retning! });
    };

    return (
        <div role="rowgroup" className={klassenavn}>
            <div role="row" className={klassenavnForListerad}>
                <Checkbox
                    label="&#8203;" // <- tegnet for tom streng
                    className="text-hide"
                    checked={alleMarkert}
                    disabled={kandidatliste.status === Kandidatlistestatus.Lukket}
                    onChange={() => onCheckAlleKandidater()}
                />
                <div />
                <SorterbarKolonneheader
                    tekst="Navn"
                    sorteringsfelt={KandidatSorteringsfelt.Navn}
                    aktivtSorteringsfelt={aktivtSorteringsfelt}
                    aktivSorteringsretning={aktivSorteringsretning}
                    onClick={endreSortering}
                    className="kolonne-middels"
                />
                <SorterbarKolonneheader
                    tekst="Fødselsnr."
                    sorteringsfelt={KandidatSorteringsfelt.Fødselsnummer}
                    aktivtSorteringsfelt={aktivtSorteringsfelt}
                    aktivSorteringsretning={aktivSorteringsretning}
                    onClick={endreSortering}
                />
                <SorterbarKolonneheader
                    tekst="Lagt til av"
                    sorteringsfelt={KandidatSorteringsfelt.LagtTilAv}
                    aktivtSorteringsfelt={aktivtSorteringsfelt}
                    aktivSorteringsretning={aktivSorteringsretning}
                    onClick={endreSortering}
                />
                <SorterbarKolonneheader
                    tekst="Lagt til"
                    sorteringsfelt={KandidatSorteringsfelt.LagtTilTidspunkt}
                    aktivtSorteringsfelt={aktivtSorteringsfelt}
                    aktivSorteringsretning={aktivSorteringsretning}
                    onClick={endreSortering}
                />
                <SorterbarKolonneheader
                    tekst="Status"
                    sorteringsfelt={KandidatSorteringsfelt.Status}
                    aktivtSorteringsfelt={aktivtSorteringsfelt}
                    aktivSorteringsretning={aktivSorteringsretning}
                    onClick={endreSortering}
                    className="kandidatliste-kandidat__kolonne-med-hjelpetekst"
                >
                    <StatusHjelpetekst />
                </SorterbarKolonneheader>
                {kandidatliste.stillingId && (
                    <SorterbarKolonneheader
                        tekst="Utfall"
                        sorteringsfelt={KandidatSorteringsfelt.Utfall}
                        aktivtSorteringsfelt={aktivtSorteringsfelt}
                        aktivSorteringsretning={aktivSorteringsretning}
                        onClick={endreSortering}
                    />
                )}
                <Kolonne tekst="Notater" />
                <Kolonne tekst="Info" className="kandidatliste-kandidat__kolonne-midtstilt" />
                {visArkiveringskolonne && (
                    <Kolonne tekst="Slett" className="kandidatliste-kandidat__kolonne-høyrestilt" />
                )}
            </div>
        </div>
    );
};

export default ListeHeader;
