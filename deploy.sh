#!/bin/bash

set -e
set -x

usage() {
  echo "Usage: KEY_FILE=<path> $0 -m staging|production|sandbox" $1 1>&2; exit 1;
}

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

while getopts ":m:d:t:" opt; do
  case $opt in
    m)
      echo "${OPTARG} environment"
      if [[ "${OPTARG}" == production ]]; then
        source $DIR/environments/production.sh
      elif [[ "${OPTARG}" == staging ]]; then
        source $DIR/environments/staging.sh
      elif [[ "${OPTARG}" == sandbox ]]; then
        source $DIR/environments/sandbox.sh
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

# build app.yaml
mkdir -p deploy-build
cp templates/app.yaml deploy-build/

./travis/substitute_values.sh deploy-build/ \
    APIROOT ${APIROOT}

cp deploy-build/app.yaml app.yaml

# authenticate
gcloud config set project ${PROJECT}
gcloud auth activate-service-account --key-file=${KEY_FILE}

# deploy
gcloud app deploy

# clean up
rm app.yaml
rm -rf deploy-build
