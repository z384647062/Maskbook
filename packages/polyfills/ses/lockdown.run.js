// No multiple lockdown.
if (Object.getOwnPropertyDescriptor(Object.prototype, 'isPrototypeOf').writable) {
    lockdown({
        domainTaming: 'unsafe',
        // errorTaming: 'unsafe',
        // stackFiltering: 'verbose',
        overrideTaming: 'severe',
        // consoleTaming: 'unsafe',
        overrideDebug: ['constructor'],
    })
}
