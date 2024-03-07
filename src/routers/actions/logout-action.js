import { redirect } from "react-router-dom";
import pocketbase from "../../services/pocketbase";

export default function logoutAction() {
    pocketbase.authStore.clear()
    return redirect("/login")
}