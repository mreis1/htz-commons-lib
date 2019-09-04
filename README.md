[![Build Status](https://travis-ci.com/mreis1/htz-commons-lib.svg?token=hWQmAaR3kAdv8uivTTas&branch=master)](https://travis-ci.com/mreis1/htz-commons-lib)


# htz-commons-lib



### Install

`$ npm install htz-commons-lib`

### Development workflow

- Unit test your code
- Do your changes
- To test all functions, run ` npm run test`
- To unit test only certain functions, rename your spec file to `{filename}.xspec.ts`
- Then run `npm run test:xpec`. This will test files with
 

- When you are done with your changes, commit your work and then `npm version patch`
    - A few actions will take place:
    - The hook `preversion` is executed and runs the lint
    - The code is automatically formatted by prettier
    - Git adds every single file changed in src
    - The hook `postversion is executed` and will run: `git push && git push --tags`
    - The code is committed and sent to the repo
    
    -----
    
    - ... Check https://docs.npmjs.com/misc/scripts for more information on npm scripts execution order
