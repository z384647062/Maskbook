import { createRequire } from 'https://deno.land/std@0.115.1/node/module.ts'
const require = createRequire(import.meta.url)

export const globby = require('./globby/index').globby
// const { join } = require('path')
// const rimraf = require('rimraf')

// rimraf(join(__dirname, '../../../dist/hot*'), () => {})
