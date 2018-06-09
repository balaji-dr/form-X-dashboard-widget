
var token = null;
var sub_data = null;
var sub_id = null;

async function login() {
    try {
        var response = await fetch('https://api.formx.stream/api/token', {
            body:JSON.stringify( {
                username: "drbalaji97@gmail.com",
                password: "kingOfKings_760OK"
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

function print_single_sub_data(single_data){
    var data = JSON.parse(single_data.submissionData)
        for (var key in data){
            document.getElementById("content").innerHTML += key + "  " + data[key] + "<br>"
        }
}

function print_visit_data(visit_data){
    for (var key in visit_data){
        document.getElementById("content").innerHTML += key + "  " + visit_data[key] + "<br>"
    }
}

async function get_single_sub(id){
    try {
        var response = await fetch('https://api.formx.stream/api/submission/'+id, {
            method: 'GET',
            headers: {
                'Authorization': 'jwt ' + token,
                'Content-Type': 'application/json'
            }
        })
        var json_response = await response.json()
        console.log(json_response.data);
        document.getElementById("content").innerHTML = ""
        print_single_sub_data(json_response.data)
        document.getElementById("content").innerHTML += "Time stamp: " + json_response.data.timestamp + "<br>";

        document.getElementById("content").innerHTML += "<b>First Visit Details:</b> <br> "
        print_visit_data(json_response.data.analyticalData.submitter.firstVisit)
        document.getElementById("content").innerHTML += "<b>Last Visit Details:</b> <br> "
        print_visit_data(json_response.data.analyticalData.submitter.lastVisit)

        document.getElementById("content").innerHTML += "<br><br>";


        document.getElementById("content").innerHTML += "Number of Visits : "+json_response.data.analyticalData.submitter.numberOfVisits + "<br>";
        document.getElementById("content").innerHTML += "Time spent in website : " + json_response.data.analyticalData.submitter.totalTimeSpentInWebsite + "<br>";



        // var btn = document.createElement('button');
        //     btn.innerText = "Back";
        //     btn.id = "back";
        // var container = document.getElementById("app");
        //     container.appendChild(btn);  
        // var element = document.getElementById("back");
        // element.onclick = function () {
        //     document.getElementById("app").innerHTML = "";
        //         get_all_submissions();
        //     }
        return json_response
    } catch (e) {
        alert('Error!')
    }
}

async function get_all_submissions() {
   let resp = await login()
    console.log(token)
    var d = document.getElementById("app")
    d.innerHTML += "<div id='myModal' class='modal fade' role='dialog'><div class='modal-dialog'><div class='modal-content'><div class='modal-header'><button type='button' class='close' data-dismiss='modal'>&times;</button><h4 class='modal-title'>Modal Header</h4></div><div class='modal-body'><p id='content'></p></div><div class='modal-footer'><button type='button' class='btn btn-default' data-dismiss='modal'>Close</button></div></div></div></div>";

    // try {
        var response = await
        fetch('https://api.formx.stream/api/submissions/36', {
            method: 'GET',
            headers: {
                'Authorization': 'jwt ' + token,
                'Content-Type': 'application/json'
            }
        });

        var tablebody=[];
        var json_response = await
        response.json()
        sub_data = json_response.data;
        console.log(sub_data);
        sub_data.forEach(function (el) {
            tablebody.push(JSON.parse(el.submission_data));
        });
        var tableheading = Object.keys(tablebody[0]);

    console.log(tablebody);
    console.log(tableheading);
        buildTable();

        for (i = 0; i < sub_data.length; i++) {
            var btn = document.createElement('button');
            btn.innerText = "View";
            btn.id = sub_data[i].id;
            btn.className += "btn btn-primary"
            btn.setAttribute("data-target", "#myModal");
            btn.setAttribute("data-toggle","modal");

            print_sub_data(sub_data[i]);
            var container = document.getElementById("app");
            container.appendChild(btn);
            document.getElementById("app").innerHTML += "<br><br><br>"
            
        }

        for (i = 0; i < sub_data.length; i++) {
            var element = document.getElementById(sub_data[i].id);
            element.onclick = function () {
                get_single_sub(this.id);
            }

        }

    function buildTable() {
        var table = document.createElement("table");
        var thead = document.createElement("thead");
        var tbody = document.createElement("tbody");
        var headRow = document.createElement("tr");
        tableheading.forEach(function(el) {
            var th=document.createElement("th");
            th.appendChild(document.createTextNode(el));
            headRow.appendChild(th);
        });
        thead.appendChild(headRow);
        table.appendChild(thead);
        tablebody.forEach(function(el) {
           // console.log("el",el);
            var tr = document.createElement("tr");
            for (var i in el) {
                var td = document.createElement("td");
                td.appendChild(document.createTextNode(el[i]));
                tr.appendChild(td);
            }
            tbody.appendChild(tr);
        });
        table.appendChild(tbody);
        table.className += "table table-striped table-bordered";
        table.id="example";
        var container = document.getElementById("app");
        container.appendChild(table);
        datatable();
    }
}

function  datatable() {

    $(function() {
        $('#example').dataTable();
        $("#example").width(100);
    });

}

get_all_submissions()
