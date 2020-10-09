#!/bin/bash

APPLICATION_PATH=$1

echo "**********************"
echo "****** Test App ******"
echo "**********************"

cd $APPLICATION_PATH && mvn test
