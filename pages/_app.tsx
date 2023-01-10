import type {AppProps} from 'next/app'

import {Inter, Source_Code_Pro} from '@next/font/google'

import 'lib/std'

import 'styles/globals.sass'


const inter = Inter({subsets: ['cyrillic']})


export default function App({Component, pageProps}: AppProps) {
    return <>
        <style jsx global>{`
          html {
            font-family: ${inter.style.fontFamily};
          }
        `}</style>
        <Component {...pageProps} />
    </>
}
