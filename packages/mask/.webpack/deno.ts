import 'https://deno.land/std/node/global.ts'
import './patch.ts'
import { createRequire } from 'https://deno.land/std@0.115.1/node/module.ts'
const require = createRequire(import.meta.url)

import { createConfiguration } from './config.ts'
const { fileURLToPath } = require('url')
const { webpack } = require('../node_modules/webpack') as typeof import('webpack')

const compiler = webpack(
    createConfiguration({
        channel: 'stable',
        mode: 'production',
        runtime: { architecture: 'web', engine: 'chromium', manifest: 2 },
        hmr: false,
        outputPath: fileURLToPath(new URL('../../../dist-deno', import.meta.url)),
    }),
    (err, stats) => {
        if (err) {
            console.error(err)
            return
        }
        console.log(
            stats.toString({
                chunks: false, // Makes the build much quieter
                colors: true, // Shows colors in the console
            }),
        )
    },
)
