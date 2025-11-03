export const NairaFMT = (amount: number | string, notation: 'compact'| 'standard') =>{
    return new Intl.NumberFormat('en-NG', 
        {
            style: 'currency',
            currency: 'NGN',
            maximumFractionDigits: 2,
            notation: notation
        }
    ).format(Number(amount))
}