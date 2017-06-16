# AirNote
A note app just like air, concise but necessary.

## Develop

### Run
```
npm start
```

### EcmaScript 6 default
Default version of complied js code is es6. If you want to transform it to es5, please add code below to `.babelrc`.
```
"presets": [
  ["es2015", {"modules": false}]
],
```