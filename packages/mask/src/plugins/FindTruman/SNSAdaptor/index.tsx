import { base } from '../base'
import { useMemo, Suspense } from 'react'
import { Skeleton } from '@mui/material'
import { makeStyles } from '@masknet/theme'
import { type Plugin, usePostInfoDetails, usePluginWrapper } from '@masknet/plugin-infra'
import { extractTextFromTypedMessage, parseURL } from '@masknet/shared-base'
import { PostInspector } from './PostInspector'

const useStyles = makeStyles()((theme) => {
    return {
        skeleton: {
            margin: theme.spacing(2),
            '&:first-child': {
                marginTop: theme.spacing(3),
            },
        },
    }
})

/**
 * https://findtruman.io/#/encryption?clueId={clueId}
 * https://findtruman.io/#/findtruman/stories/{storyId}
 * https://findtruman.io/#/findtruman/stories/{storyId}/puzzles/{puzzleId}
 * https://findtruman.io/#/findtruman/stories/{storyId}/polls/{pollId}
 * https://findtruman.io/#/findtruman/stories/{storyId}/completions/{completionId}
 * https://findtruman.io/#/findtruman/stories/{storyId}/puzzle_result/{pollId}
 * https://findtruman.io/#/findtruman/stories/{storyId}/poll_result/{pollId}
 */
const isFindTrumanURL = (input: string): boolean => {
    if (!input.startsWith('https://findtruman.io')) {
        return false
    }
    const { pathname, hash } = new URL(input)
    if (pathname !== '/') {
        return false
    }
    if (hash.startsWith('#/encryption')) {
        return /^#\/encryption\?clueid=[\da-z]+$/i.test(hash)
    }
    if (hash.startsWith('#/findtruman/stories')) {
        return /^#\/findtruman\/stories\/[\da-z]+(\/|\/(puzzle|poll|completion)(s|_result)\/[\da-z]+\/?)?$/i.test(hash)
    }
    return false
}

function Renderer({ url }: { url: string }) {
    const { classes } = useStyles()
    usePluginWrapper(true)
    const fallbackUI = Array.from({ length: 2 })
        .fill(0)
        .map((_, i) => (
            <Skeleton
                key={i}
                className={classes.skeleton}
                animation="wave"
                variant="rectangular"
                width={i === 0 ? '80%' : '60%'}
                height={15}
            />
        ))
    return (
        <Suspense fallback={fallbackUI}>
            <PostInspector url={url} />
        </Suspense>
    )
}

const sns: Plugin.SNSAdaptor.Definition = {
    ...base,
    init(signal) {},
    DecryptedInspector: function Component(props): JSX.Element | null {
        const link = useMemo(() => {
            const x = extractTextFromTypedMessage(props.message)
            if (x.none) return null
            return parseURL(x.val).find(isFindTrumanURL)
        }, [props.message])
        if (!link) return null
        return <Renderer url={link} />
    },
    PostInspector: function Component(): JSX.Element | null {
        const links = usePostInfoDetails.mentionedLinks()
        const link = links.find(isFindTrumanURL)
        if (!link) return null
        return <Renderer url={link} />
    },
}

export default sns
