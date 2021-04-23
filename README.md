# Trace Extension #

This project was created using `node v14.3.0` and `npm v6.14.5`

## Build Instructions ##

1. Run `npm install`
2. Run `npm run build`
3.
```sh
VERSION=$(cat package.json | awk '/version":/ { print $2 }' | tr -d '",')
cd build
zip -r ../trace-${VERSION}.zip .
cd -
```
4. Upload to https://addons.mozilla.org
