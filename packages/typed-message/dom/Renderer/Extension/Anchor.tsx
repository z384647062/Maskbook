import { memo, useContext } from 'react'
import type { TypedMessageAnchor } from '../../../base'
import type { MessageRenderProps } from '../Entry'
import { withMetadata } from '../MetadataRender'
import { LinkDefault, MessageRenderUIComponentsContext } from '../utils/ComponentsContext'

export const TypedMessageAnchorRenderer = memo(function TypedMessageAnchorRenderer(
    props: MessageRenderProps<TypedMessageAnchor>,
) {
    const { content, href } = props.message
    const { Link = LinkDefault! } = useContext(MessageRenderUIComponentsContext)
    return withMetadata(props, <Link href={href}>{content}</Link>)
})
