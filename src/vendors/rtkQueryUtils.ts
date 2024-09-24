export function generateCacheTagList(result: any[], tagName: string, keySelector: (arg0: any) => string = (x) => x.id, listKey = '*') {
    return result ? [
        ...result.map((item) => ({ type: tagName, id: keySelector(item) })),
        { type: tagName, id: listKey }
    ] : [
        { type: tagName, id: listKey }
    ]
}