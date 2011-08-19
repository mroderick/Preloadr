#!/bin/sh
clear
echo "Running tests ..."
java -jar JsTestDriver-1.3.2.jar --config ../jstestdriver.conf --tests all --reset --captureConsole