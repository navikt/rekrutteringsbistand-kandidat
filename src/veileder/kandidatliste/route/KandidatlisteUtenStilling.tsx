import React, { FunctionComponent } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import KandidatlisteRoute from './KandidatlisteRoute';

type Props = RouteComponentProps<{
    listeid: string;
}>;

const KandidatlisteMedStilling: FunctionComponent<Props> = (props) => {
    const id = props.match.params.listeid;

    return <KandidatlisteRoute kandidatlisteId={id} />;
};

export default KandidatlisteMedStilling;
