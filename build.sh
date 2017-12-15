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
fi

APIROOT=$APIROOT \
NODE_ENV=$NODE_ENV \
NODE_PATH=$NODE_PATH \
PORT=$PORT \
webpack --verbose --colors -p --display-error-details \
    --config webpack/prod.config.js