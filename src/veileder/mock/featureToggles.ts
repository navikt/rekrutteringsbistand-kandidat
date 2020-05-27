import FEATURE_TOGGLES from '../../felles/konstanter';

export const featureToggles = FEATURE_TOGGLES.reduce(
    (alleToggles, toggle) => ({ ...alleToggles, [toggle]: true }),
    {}
);
