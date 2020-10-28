import React, { ChangeEvent, FunctionComponent, useState } from 'react';
import NavFrontendModal from 'nav-frontend-modal';
import { Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import {
    Utfall,
    utfallToDisplayName,
} from '../kandidatrad/utfall-med-endre-ikon/UtfallMedEndreIkon';
import { Flatknapp, Hovedknapp } from 'nav-frontend-knapper';
import './EndreUtfallModal.less';
import { Radio, RadioGruppe } from 'nav-frontend-skjema';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import UtfallLabel, { Orientering } from '../kandidatrad/utfall-med-endre-ikon/UtfallLabel';

interface Props {
    vis: boolean;
    utfall: Utfall;
    fornavn?: string;
    etternavn?: string;
    onBekreft: (utfall: Utfall) => void;
    onLukk: () => void;
}

const EndreUtfallModal: FunctionComponent<Props> = ({
    vis,
    fornavn,
    etternavn,
    utfall,
    onBekreft,
    onLukk,
}) => {
    const [nyttUtfall, setNyttUtfall] = useState<Utfall>(utfall);

    const onEndreUtfall = (event: ChangeEvent<HTMLInputElement>) => {
        setNyttUtfall(event.target.value as Utfall);
    };

    const navn = `${fornavn || ''} ${etternavn || ''}`;

    return (
        <NavFrontendModal
            closeButton
            isOpen={vis}
            contentLabel="Endre utfall for kandidat"
            onRequestClose={onLukk}
            className="endreUtfallModal"
        >
            <Systemtittel className="endreUtfallModal__tittel">Endre utfall</Systemtittel>
            <Normaltekst className="endreUtfallModal__beskrivelse">
                Utfallet du registrerer på {navn} vil bli telt, og tellingen vil bli brukt til
                statistikk.
            </Normaltekst>
            <RadioGruppe legend="Velg utfall:">
                <Radio
                    label={
                        <UtfallLabel
                            utfall={Utfall.IkkePresentert}
                            prikkOrientering={Orientering.Bak}
                        />
                    }
                    value={Utfall.IkkePresentert}
                    checked={nyttUtfall === Utfall.IkkePresentert}
                    onChange={onEndreUtfall}
                    name="endreUtfall"
                />
                <Radio
                    label={
                        <UtfallLabel
                            utfall={Utfall.Presentert}
                            prikkOrientering={Orientering.Bak}
                        />
                    }
                    value={Utfall.Presentert}
                    checked={nyttUtfall === Utfall.Presentert}
                    onChange={onEndreUtfall}
                    name="endreUtfall"
                />
                <Radio
                    label={
                        <>
                            <UtfallLabel
                                utfall={Utfall.FåttJobben}
                                prikkOrientering={Orientering.Bak}
                            />
                            <Normaltekst>
                                Velger du utfallet «{utfallToDisplayName(Utfall.FåttJobben)}» får du
                                også telling på «{utfallToDisplayName(Utfall.Presentert)}».
                            </Normaltekst>
                        </>
                    }
                    value={Utfall.FåttJobben}
                    checked={nyttUtfall === Utfall.FåttJobben}
                    onChange={onEndreUtfall}
                    name="endreUtfall"
                />
            </RadioGruppe>
            {(nyttUtfall === Utfall.Presentert || nyttUtfall === Utfall.FåttJobben) && (
                <AlertStripeAdvarsel className="endreUtfallModal__advarsel">
                    {alertTekst(nyttUtfall)}
                </AlertStripeAdvarsel>
            )}
            <div className="endreUtfallModal__knapper">
                <Hovedknapp
                    onClick={() => {
                        onBekreft(nyttUtfall);
                    }}
                    className="endreUtfallModal__bekreftknapp"
                >
                    Endre utfall
                </Hovedknapp>
                <Flatknapp onClick={onLukk}>Avbryt</Flatknapp>
            </div>
        </NavFrontendModal>
    );
};

const alertTekst = (valgtUtfall: Utfall): string => {
    const alertForPresentert = `Endrer du utfallet til 
        «${utfallToDisplayName(Utfall.IkkePresentert)}»
        vil tellingen av 
        «${utfallToDisplayName(Utfall.Presentert)}»
        tas bort.`;

    const alertForFåttJobb = `Endrer du utfallet til
        «${utfallToDisplayName(Utfall.IkkePresentert)}» eller 
        «${utfallToDisplayName(Utfall.Presentert)}»
        vil tellingen av 
        «${utfallToDisplayName(Utfall.FåttJobben)}»
        tas bort.`;

    switch (valgtUtfall) {
        case Utfall.FåttJobben:
            return alertForFåttJobb;
        case Utfall.Presentert:
            return alertForPresentert;
        default:
            throw new Error('Skal ikke komme hit. valgtUtfall=' + valgtUtfall);
    }
};

export default EndreUtfallModal;
