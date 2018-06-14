
var token = null;
var sub_data = null;
var sub_id = null;
async function login() {
    try {
    
        var response = await fetch('https://api.formx.stream/api/token', {
            body:JSON.stringify( {
                username: xusername,
                password: xpassword
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

function round(value, decimals) {
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
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
            document.getElementById("content").innerHTML +="<b>" + key + " : </b>" + "  " + data[key] + "<br>"
        }
}

function print_visit_data(visit_data){
    for (var key in visit_data){
        if (key == "timestamp"){
            var datetime = new Date(visit_data[key]*1000);
            document.getElementById("content").innerHTML += "<b>" + "Date and time" + " : </b>" + "  " + datetime.toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true }) + "<br>"
        }
        else
        document.getElementById("content").innerHTML += "<b>" + key + " : </b>" + "  " + visit_data[key] + "<br>"
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
        document.getElementById("content").innerHTML = ""
        print_single_sub_data(json_response.data)
        var datetime = new Date(json_response.data.timestamp * 1000);
        document.getElementById("content").innerHTML += "<b>Date and time : </b>" + datetime.toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true }) + "<br>";

        document.getElementById("content").innerHTML += "<b>First Visit Details:</b> <br> "
        print_visit_data(json_response.data.analyticalData.submitter.firstVisit)
        document.getElementById("content").innerHTML += "<b>Last Visit Details:</b> <br> "
        print_visit_data(json_response.data.analyticalData.submitter.lastVisit)

        document.getElementById("content").innerHTML += "<br><br>";


        document.getElementById("content").innerHTML += "<b>"+"Number of Visits : </b>"+json_response.data.analyticalData.submitter.numberOfVisits + "<br>";
        document.getElementById("content").innerHTML += " <b> Time spent in website : </b>" + round(json_response.data.analyticalData.submitter.totalTimeSpentInWebsite,2)  + "<br>";
        return json_response
    } catch (e) {
        alert(e)
    }
}

async function select_project() {
   let resp = await login()
    var d = document.getElementById("app")
    d.innerHTML += "<div id='myModal' class='modal fade' role='dialog'><div class='modal-dialog'><div class='modal-content'><div class='modal-header'><button type='button' class='close' data-dismiss='modal'>&times;</button><h4 class='modal-title'>Submission information</h4></div><div class='modal-body'><p id='content'></p></div><div class='modal-footer'><button type='button' class='btn btn-default' data-dismiss='modal'>Close</button></div></div></div></div>";
    try{
        var p_resp = await
        fetch('https://api.formx.stream/api/forms/'+ project_id,{
            method: 'GET',
            headers: {
                'Authorization': 'jwt ' + token,
                'Content-Type': 'application/json'
            }
        });

        project_response = await p_resp.json();
        var d = document.getElementById("app")
        var select = document.createElement("select");

        select.id = "projects";
        select.required = "required";
        var option = document.createElement("option");
        option.value = "";
        option.text = "Choose your form";
        option.selected = "selected";
        option.disabled = "disabled";
        option.hidden = "hidden";
        select.appendChild(option);
        for (i=0; i<project_response.data.length; i++){
            var option = document.createElement("option");
            option.value = project_response.data[i].id;
            option.text = project_response.data[i].name;
            select.appendChild(option);
        }
        d.appendChild(select);
        
    }
    catch(e){
        alert(e);
    }
    select.onchange = function(e){
        get_all_submissions(this.value);
    }    
    
}


async function get_all_submissions(form_id) {

    try {
        var response = await
        fetch('https://api.formx.stream/api/submissions/'+ form_id, {
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

        sub_data.forEach(function (el) {

            tablebody.push(JSON.parse(el.submission_data));
        });
        
        var tableheading = Object.keys(tablebody[0]);
        tableheading.push("view");
        buildTable();

        for (i = 0; i < sub_data.length; i++) {
            var element = document.getElementById(sub_data[i].id);
            element.onclick = function () {
                get_single_sub(this.id);
            }

        }
    }
    catch(error){
        alert(error);
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

        tablebody.forEach(function(el,index) {
            var tr = document.createElement("tr");
            for (var i in el) {
                var td = document.createElement("td");
                td.appendChild(document.createTextNode(el[i]));
                tr.appendChild(td);
            }
            var btn = document.createElement('button');
            btn.innerText = "View";
            btn.id=sub_data[index].id;
            btn.className += "btn btn-primary"
            btn.setAttribute("data-target", "#myModal");
            btn.setAttribute("data-toggle","modal");
            var td = document.createElement("td");
            td.appendChild(btn);
            tr.appendChild(td);
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
    });

}

select_project();
