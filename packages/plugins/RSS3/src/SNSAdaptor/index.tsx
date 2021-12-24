import type { Plugin } from '@masknet/plugin-infra'
import { DonationPage, FootprintPage } from './pages'
import { AddressViewer } from './components'
import { base } from '../base'

const sns: Plugin.SNSAdaptor.Definition = {
    ...base,
    init(signal) {},
    ProfileTabs: [
        {
            ID: 'donations',
            label: 'Donations',
            priority: 1,
            children: ({ addressNames = [] }) => {
                if (!addressNames.length) return null
                const addressName = addressNames.find((x) => x.label.match(/\w+\.rss3$/)) || addressNames[0]
                const address = addressName.resolvedAddress
                return (
                    <>
                        <link rel="stylesheet" href={new URL('./styles/tailwind.css', import.meta.url).toString()} />
                        <AddressViewer addressName={addressName} />
                        <DonationPage address={address} />
                    </>
                )
            },
        },
        {
            ID: 'footprints',
            label: 'Footprints',
            priority: 2,
            children: ({ addressNames = [] }) => {
                if (!addressNames.length) return null
                const addressName = addressNames.find((x) => x.label.match(/\w+\.rss3$/)) || addressNames[0]
                const address = addressName.resolvedAddress
                return (
                    <>
                        <link rel="stylesheet" href={new URL('./styles/tailwind.css', import.meta.url).toString()} />
                        <AddressViewer addressName={addressName} />
                        <FootprintPage address={address} />
                    </>
                )
            },
        },
    ],
}

export default sns
