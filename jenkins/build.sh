#!/bin/bash

APPLICATION_PATH=$1

echo "**************************"
echo "****** Building Jar ******"
echo "**************************"

cd $APPLICATION_PATH && mvn -B -DskipTests clean package
