
export interface ICollection<T> {
    elements: T[];
}

export function groupBy<T>(elements:T[], keySelector:((t:T)=>string)): object {
    let retval = {}
    elements.forEach(f => {
        let key = keySelector(f);
        retval[key] = retval[key] || [];
        retval[key].push(f);
    });
    return retval;
}