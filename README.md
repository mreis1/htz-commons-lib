[![Build Status](https://travis-ci.org/mreis1/htz-padding.svg?branch=master)](https://travis-ci.org/mreis1/htz-padding)


# htz-commons-lib
A small, dependency free lib to pad some strings


### Install

`$ npm install htz-padding`

### Usage

```
import {paddingLeft} from 'htz-padding';

paddingLeft('hello', 5, '0');
// Outputs 0hello

paddingRight('hello', 5, '0');
// Outputs hello0
```
