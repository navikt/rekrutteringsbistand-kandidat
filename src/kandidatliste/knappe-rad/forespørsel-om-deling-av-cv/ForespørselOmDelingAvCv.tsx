import React, { FunctionComponent, MouseEvent, useState } from 'react';
import Popover, { PopoverOrientering } from 'nav-frontend-popover';
import Lenkeknapp from '../../../common/lenkeknapp/Lenkeknapp';
import useMinstEnKandidatErMarkert from '../useMinstEnKandidatErMarkert';
import { Normaltekst } from 'nav-frontend-typografi';
import './ForespørselOmDelingAvCv.less';

const ForespørselOmDelingAvCvModal: FunctionComponent = () => {
    const minstEnKandidatErMarkert = useMinstEnKandidatErMarkert();

    const [ingenMarkertPopover, setIngenMarkertPopover] = useState<HTMLElement | undefined>(
        undefined
    );

    const toggleIngenMarkertPopover = (event: MouseEvent<HTMLElement>) => {
        setIngenMarkertPopover(ingenMarkertPopover ? undefined : event.currentTarget);
    };

    const lukkIngenMarkertPopover = () => {
        setIngenMarkertPopover(undefined);
    };

    const onÅpneModal = () => {
        console.log('Åpne meg');
    };

    return (
        <div className="foresporsel-om-deling-av-cv">
            <Lenkeknapp
                tittel="Del stillingen med de markerte kandidatene"
                onClick={minstEnKandidatErMarkert ? onÅpneModal : toggleIngenMarkertPopover}
                className="kandidatlisteknapper__knapp DelMedKandidat"
            >
                <i className="DelMedKandidat__icon" />
                Del med kandidat
            </Lenkeknapp>
            <Popover
                ankerEl={ingenMarkertPopover}
                onRequestClose={lukkIngenMarkertPopover}
                orientering={PopoverOrientering.Under}
            >
                <Normaltekst className="foresporsel-om-deling-av-cv__ingen-valgt-popover">
                    Du må huke av for kandidatene du ønsker å dele stillingen med.
                </Normaltekst>
            </Popover>
        </div>
    );
};

export default ForespørselOmDelingAvCvModal;
