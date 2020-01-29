#!/bin/bash

LOGINSERVICE_URL="http://localhost:8766/pam-kandidatsok-api/local/cookie?level=Level3" \
LOGOUT_URL='#' \
LOGOUTSERVICE_URL='#' \
PAMPORTAL_URL='#' \
PAM_KANDIDATSOK_API_URL="http://localhost:8766/pam-kandidatsok-api/rest/" \
PAM_KANDIDATSOK_API_PROXY_API_APIKEY="dummy" \
PROXY_API_KEY="123" \
NODE_ENV="development" \
PORT=9009 \
npm run start-express
