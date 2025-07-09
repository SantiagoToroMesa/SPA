import {get, post, deletes, update} from "./services";

async function fetchUsers(){
    let users = []
    try{
        const users = await get("http://localhost:3000/Users");
        for(let user of users){
            console.log(user);
        }
    } catch (error) {
    }
}
fetchUsers();