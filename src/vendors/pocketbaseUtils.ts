import { ClientResponseError } from 'pocketbase'

/**
 * Handle Pocketbase error in RTK Query to avoid redux serialization error
 * @param error Caugh error
 * @returns 
 */
export function handlePbError(error: unknown): {
    error: any
} {
    if (error instanceof ClientResponseError) {
        return { error: error.toJSON() }
    } else {
        return { error }
    }
}

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