import { Event } from '@sentry/types';

export const fjernPersonopplysninger = (event: Event): Event => {
    const url = event.request?.url ? maskerPersonopplysninger(event.request.url) : '';

    return {
        request: {
            ...event.request,
            url,
        },
        breadcrumbs: (event.breadcrumbs || []).map((breadcrumb) => {
            return {
                ...breadcrumb,
                data: {
                    from: maskerPersonopplysninger(breadcrumb.data?.from),
                    to: maskerPersonopplysninger(breadcrumb.data?.to),
                },
            };
        }),
    };
};

const maskeringsregler = [
    {
        regex: /[A-Z]{2}[0-9]{6}/g,
        erstatning: '<kandidatnr>',
    },
    {
        regex: /PAM0[a-z0-9]{8}/g,
        erstatning: '<kandidatnr>',
    },
    {
        regex: /[0-9]{11}/g,
        erstatning: '<fnr>',
    },
];

export const maskerPersonopplysninger = (tekst: string) => {
    let maskert = tekst;
    maskeringsregler.forEach(({ regex, erstatning }) => {
        maskert = maskert.replace(regex, erstatning);
    });

    return maskert;
};
