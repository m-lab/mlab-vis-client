#!/bin/bash

set -e
set -x

usage() {
  echo "Usage: KEY_FILE=<path> $0 -m staging|production|sandbox" $1 1>&2; exit 1;
}

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

if [ -n "${API_MODE}" ]; then
  source $DIR/environments/$API_MODE.sh
  cp $DIR/environments/$API_MODE.sh .env
else
    while getopts ":m:" opt; do
    case $opt in
        m)
        echo "${OPTARG} environment"
        if [[ "${OPTARG}" == production ]]; then
            source $DIR/environments/production.sh
            cp $DIR/environments/production.sh .env
        elif [[ "${OPTARG}" == staging ]]; then
            source $DIR/environments/staging.sh
            cp $DIR/environments/staging.sh .env
        elif [[ "${OPTARG}" == sandbox ]]; then
            source $DIR/environments/sandbox.sh
            cp $DIR/environments/sandbox.sh .env
        else
            echo "BAD ARGUMENT TO $0: ${OPTARG}"
            exit 1
        fi
        ;;
        \?)
        echo "Invalid option: -$OPTARG" >&2
        exit 1
        ;;
        :)
        echo "Option -$OPTARG requires an argument." >&2
        exit 1
        ;;
    esac
    done
fi


# build app.yaml
mkdir -p deploy-build
cp templates/app.yaml deploy-build/

./travis/substitute_values.sh deploy-build/ \
    APIROOT ${APIROOT} \
    API_MODE ${API_MODE} \
    NODE_PATH ${NODE_PATH} \
    NODE_ENV ${NODE_ENV} \
    PORT ${PORT}

cp deploy-build/app.yaml app.yaml

# authenticate
gcloud config set project ${PROJECT}
gcloud auth activate-service-account --key-file=${KEY_FILE}

# deploy
gcloud app deploy

# clean up
rm app.yaml
rm -rf deploy-build
rm .env
