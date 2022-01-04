import React, { FunctionComponent } from 'react';

type Props = {
    feil: boolean;
};

const SendSmsIkon: FunctionComponent<Props> = ({ feil }) => {
    const className = feil ? 'Sms__icon Sms__icon--feil' : 'Sms__icon Sms__icon--sendt';

    return (
        <div className="Sms">
            <i className={className} />
        </div>
    );
};

export default SendSmsIkon;
