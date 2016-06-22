echo "> Start transpiling ES2015"
echo ""
./node_modules/.bin/babel --plugins "transform-regenerator" --plugins "transform-runtime" --plugins "transform-decorators-legacy" --plugins "angular2-annotations" ./src --ignore __test__ --out-dir ./dist
echo ""
echo "> Complete transpiling ES2015"
