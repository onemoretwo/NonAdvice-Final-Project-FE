import axios from "axios";

const hostname = "http://localhost:9000";

export default function getUserRole(id){
    var url = `${hostname}/api/users/userrole/${id}`;
    var role = "a";
    axios.get(url).then((res) => {
        role = res;
    });
    return role;
}