const formatter = new Intl.RelativeTimeFormat(undefined, {
    numeric: 'auto'
})

const DIVISIONS = [
    { amount: 60, name: 'seconds' },
    { amount: 60, name: 'minutes' },
    { amount: 24, name: 'hours' },
    { amount: 7, name: 'days' },
    { amount: 4.34524, name: 'weeks' },
    { amount: 12, name: 'months' },
    { amount: Number.POSITIVE_INFINITY, name: 'years' }
]

const convertDateInterval = (dateStr) => {
    const date = new Date(dateStr)
    console.log(date)
    const now = new Date()
    let duration = (date - now) / 1000
    for (let i = 0; i < DIVISIONS.length; i++) {
        const division = DIVISIONS[i]
        if (Math.abs(duration) < division.amount) {
            console.log(formatter.format(Math.round(duration), division.name))
            return formatter.format(Math.round(duration), division.name)
        }
        duration /= division.amount
    }
}

const dateHelper = {
    convertDateInterval
}

module.exports = dateHelper