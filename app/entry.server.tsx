import type { EntryContext } from '@remix-run/node'
import { Response } from '@remix-run/node'
import { RemixServer } from '@remix-run/react'
import isBot from 'isbot'
import { renderToPipeableStream } from 'react-dom/server'
import { PassThrough } from 'stream'

const ABORT_DELAY = 5000

export default async function handleRequest(request: Request, responseStatusCode: number, responseHeaders: Headers, remixContext: EntryContext) {
  const callbackName = isBot(request.headers.get('user-agent')) ? 'onAllReady' : 'onShellReady'

  return new Promise((resolve, reject) => {
    let didError = false

    const { pipe, abort } = renderToPipeableStream(<RemixServer context={remixContext} url={request.url} />, {
      [callbackName]() {
        const body = new PassThrough()

        responseHeaders.set('Content-Type', 'text/html')

        resolve(
          new Response(body, {
            headers: responseHeaders,
            status: didError ? 500 : responseStatusCode,
          })
        )

        pipe(body)
      },
      onShellError(error) {
        reject(error)
      },
      onError(error) {
        didError = true

        console.error(error)
      },
    })

    setTimeout(abort, ABORT_DELAY)
  })
}
