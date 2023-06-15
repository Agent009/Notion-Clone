# Notion-Clone

## Platform Requirements

* NodeJS Version: `18.13.0`

## Strapi + React Integration

You must generate an [API token](https://docs.strapi.io/dev-docs/configurations/api-tokens) and add the token key in the following enviornment variables:

* `strapi_backend/.env`: `BEARER_TOKEN`
* `frontend/.env`: `REACT_APP_BEARER_TOKEN`

Once this is done, the react front-end app will be able to make REST API calls to the Strapi back-end.