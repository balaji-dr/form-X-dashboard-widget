
var token = null;
var sub_data = null;

async function login() {
    try {
        var response = await fetch('https://api.formx.stream/api/token', {
            body:JSON.stringify( {
                username: 'drbalaji97@gmail.com',
                password: 'kingOfKings_760OK'
            }),
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            }
        })
        var json_response = await response.json()
        token = json_response.token
        return json_response
    } catch (e) {
        alert('Error!')
    }
}

function print_sub_data(sub_data) {

        var data = JSON.parse(sub_data.submission_data)
        for (var key in data){
            document.getElementById("app").innerHTML += key + "  " + data[key] + "<br>"
        }


}

function get_single_sub(id){
    console.log(id)
}

async function get_all_submissions() {
   let resp = await login()
    console.log(token)
    try {
        var response = await fetch('https://api.formx.stream/api/submissions/36', {
            method: 'GET',
            headers:{
                'Authorization': 'jwt ' + token,
                'Content-Type': 'application/json'
            }
        })
        var json_response = await response.json()
        sub_data = json_response.data
        console.log(sub_data)
        for(i=0;i<sub_data.length;i++){
            var temp = sub_data[i].id;
            console.log(temp)
            document.getElementById("app").innerHTML += "<button onclick='get_single_sub()'>View</button>"
                print_sub_data(sub_data[i])
        }


    } catch (e) {
        alert('Error!')
    }

}


get_all_submissions()
