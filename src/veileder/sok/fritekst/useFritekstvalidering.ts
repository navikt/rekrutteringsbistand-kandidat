import { useHistory } from 'react-router-dom';
import { sendEvent } from './../../amplitude/amplitude';
import { useState, useEffect } from 'react';
import { Fritekststatus, Fritekstvalidering, validerFritekstfelt } from './validering';

const useFritekstvalidering = (input: string, hasSubmit: boolean) => {
    const history = useHistory();

    const [validering, setValidering] = useState<Fritekstvalidering>({
        status: Fritekststatus.IkkeEtFnr,
    });

    useEffect(() => {
        const valider = async () => {
            const validerer = {
                status: Fritekststatus.Validerer,
            };

            setValidering(validerer);
            setValidering(await validerFritekstfelt(input));
        };

        valider();
    }, [input]);

    useEffect(() => {
        if (hasSubmit && validering.status === Fritekststatus.FantKandidat) {
            sendEvent('fødselsnummersøk', 'naviger_til_cv');
            history.push(`/kandidater/kandidat/${validering.kandidatnr}/cv`);
        }
    }, [hasSubmit, validering, history]);

    return validering;
};

export default useFritekstvalidering;
