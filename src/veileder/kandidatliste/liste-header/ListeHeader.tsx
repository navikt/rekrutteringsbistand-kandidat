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
    sortering,
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

    const hentSorteringsretning = (felt: KandidatSorteringsfelt | null): null | Retning => {
        if (felt === aktivtSorteringsfelt) {
            return aktivSorteringsretning;
        } else {
            return null;
        }
    };

    const endreSortering = (sorteringsfelt: string) => {
        const endringPåAktivtFelt = aktivtSorteringsfelt === sorteringsfelt;

        const felt = KandidatSorteringsfelt[sorteringsfelt];
        const retning = endringPåAktivtFelt
            ? nesteSorteringsretning(aktivSorteringsretning)
            : Retning.Stigende;

        setAktivSorteringsretning(retning);
        setAktivtSorteringsfelt(felt);
        setSortering({ felt: felt, retning: retning! });
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
                    sorteringsretning={hentSorteringsretning(KandidatSorteringsfelt.Navn)}
                    onClick={endreSortering}
                    className="kolonne-middels"
                />
                <SorterbarKolonneheader
                    tekst="Fødselsnr."
                    sorteringsfelt={KandidatSorteringsfelt.Fødselsnummer}
                    sorteringsretning={hentSorteringsretning(KandidatSorteringsfelt.Fødselsnummer)}
                    onClick={endreSortering}
                />
                <SorterbarKolonneheader
                    tekst="Lagt til av"
                    sorteringsfelt={KandidatSorteringsfelt.LagtTilAv}
                    sorteringsretning={hentSorteringsretning(KandidatSorteringsfelt.LagtTilAv)}
                    onClick={endreSortering}
                />
                <SorterbarKolonneheader
                    tekst="Lagt til"
                    sorteringsfelt={KandidatSorteringsfelt.LagtTilTidspunkt}
                    sorteringsretning={hentSorteringsretning(
                        KandidatSorteringsfelt.LagtTilTidspunkt
                    )}
                    onClick={endreSortering}
                />
                <SorterbarKolonneheader
                    tekst="Status"
                    sorteringsfelt={KandidatSorteringsfelt.Status}
                    sorteringsretning={hentSorteringsretning(KandidatSorteringsfelt.Status)}
                    onClick={endreSortering}
                    className="kandidatliste-kandidat__kolonne-med-hjelpetekst"
                >
                    <StatusHjelpetekst />
                </SorterbarKolonneheader>
                {kandidatliste.stillingId && (
                    <SorterbarKolonneheader
                        tekst="Utfall"
                        sorteringsfelt={KandidatSorteringsfelt.Utfall}
                        sorteringsretning={hentSorteringsretning(KandidatSorteringsfelt.Utfall)}
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
