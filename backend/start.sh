#!/bin/sh
set -e

echo "Waiting for MySQL..."
while ! nc -z $DB_HOST $DB_PORT; do
  sleep 1
done
echo "MySQL is up"

npm run migration:run

npm run start:prod
