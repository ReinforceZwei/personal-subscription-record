/**
 * Remove PocketBase system fields from result object (`id`, `created`, `updated`, `collectionId`, `collectionName`)
 * @param {*} fullObject PocketBase Result Object
 * @returns New object with system fields removed
 */
export function removePbDefaultField(fullObject: any): any {
    let data = {...fullObject}
    delete data['id']
    delete data['created']
    delete data['updated']
    delete data['collectionId']
    delete data['collectionName']
    return data
}