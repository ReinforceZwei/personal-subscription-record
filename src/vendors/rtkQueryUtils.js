export function generateCacheTagList(result, tagName, keySelector = (x) => x.id, listKey = '*') {
    return result ? [
        ...result.map((item) => ({ type: tagName, id: keySelector(item) })),
        { type: tagName, id: listKey }
    ] : [
        { type: tagName, id: listKey }
    ]
}