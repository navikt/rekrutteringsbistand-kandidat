import React, { FunctionComponent } from 'react';

type Props = {
    feil: boolean;
};

const SendSmsIkon: FunctionComponent<Props> = ({ feil }) => {
    console.log('feilsms', feil);
    const className = feil ? 'Sms__icon Sms__icon--feil' : 'Sms__icon';

    return (
        <div className="Sms">
            <i className={className} />
        </div>
    );
};

export default SendSmsIkon;
