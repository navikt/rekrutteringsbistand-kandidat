import React, { FunctionComponent, ReactNode } from 'react';
import { Checkbox } from 'nav-frontend-skjema';
import { Element } from 'nav-frontend-typografi';
import { Kandidatliste, Kandidatlistestatus } from '../kandidatlistetyper';
import StatusHjelpetekst from './StatusHjelpetekst';
import { Kandidatsortering, Sorteringsalgoritme, Sorteringsvarianter } from '../sortering';
import './../kandidatrad/Kandidatrad.less';

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

const Kolonnetittel = ({
    className,
    children,
    onClick,
}: {
    className?: string;
    onClick?: () => void;
    children: ReactNode;
}) => (
    <div onClick={onClick} className={className ? className : ''}>
        <Element className="kandidatliste-kandidat__rad__kolonne-tittel">{children}</Element>
    </div>
);

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

    const byttSortering = (sorteringsalgoritme: Sorteringsalgoritme) => () => {
        console.log('Bytt til:', sorteringsalgoritme, 'Var fra før:', sortering);
        if (sortering === null || sortering.algoritme !== Sorteringsalgoritme.Navn) {
            setSortering({
                algoritme: sorteringsalgoritme,
                variant: Sorteringsvarianter.Stigende,
            });
        } else if (sortering.variant === Sorteringsvarianter.Stigende) {
            setSortering({
                algoritme: sorteringsalgoritme,
                variant: Sorteringsvarianter.Synkende,
            });
        } else {
            setSortering(null);
        }
    };

    return (
        <div className={klassenavn}>
            <div className={klassenavnForListerad}>
                <Checkbox
                    label="&#8203;" // <- tegnet for tom streng
                    className="text-hide"
                    checked={alleMarkert}
                    disabled={kandidatliste.status === Kandidatlistestatus.Lukket}
                    onChange={() => onCheckAlleKandidater()}
                />
                <div />
                <Kolonnetittel onClick={byttSortering(Sorteringsalgoritme.Navn)}>
                    Navn
                </Kolonnetittel>
                <Kolonnetittel>Fødselsnummer</Kolonnetittel>
                <Kolonnetittel>Lagt til av</Kolonnetittel>
                <Kolonnetittel>Lagt til</Kolonnetittel>
                <div className="kandidatliste-kandidat__kolonne-med-hjelpetekst">
                    <Element className="kandidatliste-kandidat__rad__kolonne-tittel">
                        Status
                    </Element>
                    <StatusHjelpetekst />
                </div>
                {kandidatliste.stillingId && <Kolonnetittel>Utfall</Kolonnetittel>}
                <Kolonnetittel>Notater</Kolonnetittel>
                <Kolonnetittel className="kandidatliste-kandidat__kolonne-midtstilt">
                    Info
                </Kolonnetittel>
                {visArkiveringskolonne && (
                    <Kolonnetittel className="kandidatliste-kandidat__kolonne-midtstilt">
                        Slett
                    </Kolonnetittel>
                )}
            </div>
        </div>
    );
};

export default ListeHeader;
