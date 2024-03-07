import pb from '../../services/pocketbase.js'
import { redirect } from 'react-router-dom'

export default function rootLoader() {
    console.log(pb.authStore)
    if (!pb.authStore.isValid) {
        //return redirect('/login')
    } else {
        // TODO: Get user fav page
        //return redirect('/spentRecord')
    }
    return null
}