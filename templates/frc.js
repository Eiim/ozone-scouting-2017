

//////////////////// TIMERS ////////////////////////
var toExport = new TimerData();
var team_number_js = 0;
var team_alliance = "";
var autoPeriod = {};
var currentGearAction = "";
var iT;

function TimerData() {  // Class to store timer data
    this.timesList = [];
    this.matchStartTimer = "";
    this.gearTimer = {};
    this.fuelTimer = {};
    this.collectTimer = {};
    this.defenseTimer = {}; // MIGHT NOT USE THIS IN "TIMES"
    this.climbTimer = {};

    // Fuel Scout Stuff
    this.fuelScoutList = [];
    this.fuelScoutTimer = {};
}

function GetTime() { // Gets current time
    var d = new Date();
    var n = d.getTime();
    return n
}

function autoGear(val) {
    autoPeriod["gear"] = val;
}

function autoButtons(val) {
    document.getElementById("autoSuccessID").disabled = true;
    document.getElementById("autoFailID").disabled = true;
    document.getElementById("autoContinueID").disabled = true;

    document.getElementById(val).disabled = false;
}

function landingEnter() {
    var assignments = JSON.parse(localStorage.getItem("assignments"))
    for (var i = 0; i < assignments.length; i++) {
//        if (document.getElementById('landingNumber').value == "4611" || document.getElementById('landingNumber').value == "4145" || document.getElementById('landingNumber').value == "5413" || document.getElementById('landingNumber').value == "3324") {

            localStorage.setItem("scouter", "");
            if (assignments[i]["scouter"] == document.getElementById('landingName').value) {
                document.getElementById('scouter').value = document.getElementById('landingName').value;
                localStorage.setItem("scouter", document.getElementById('scouter').value);
                break;
            }


//        }
    }
    checkForEntry();
}

function MatchTimerStart() {
    toExport.matchStartTimer = GetTime() + 15000;
    autoPeriod["passedLine"] = false;
    document.getElementById("matchStart").disabled = true;
    document.getElementById("matchStart").innerHTML = "Match Started"
    document.getElementById("GearStartButton").disabled = false;
    document.getElementById("GearStopButton").disabled = true;
    document.getElementById("BallShootStartButton").disabled = false;
    document.getElementById("BallShootStopButton").disabled = true;
    document.getElementById("BallCollectStartButton").disabled = false;
    document.getElementById("BallCollectStopButton").disabled = true;
    document.getElementById("DefenseStartButton").disabled = false;
    document.getElementById("DefenseStopButton").disabled = true;
    document.getElementById("ClimbStartButton").disabled = false;
    document.getElementById("autoSuccessID").disabled = false;
    document.getElementById("autoFailID").disabled = false;
    document.getElementById("autoContinueID").disabled = false;
    document.getElementById("ball1").disabled = false;
    document.getElementById("ball2").disabled = false;
    document.getElementById("saveBtn").disabled = false;

    autoPeriod["gear"] = "fail";
    autoPeriod["passedLine"] = false;
    autoPeriod["ballPoints"] = 0;
}

function disableAll() {
    var disableElements = document.getElementsByClassName("disableAll");
    for (var i = 0; i < disableElements.length; i++) {
        disableElements[i].disabled = true;
    }
}

// Hides all elements that are still in development
function in_development() {
    var inDev = document.getElementsByClassName("in_development");
    for (var i = 0; i < inDev.length; i++) {
        inDev[i].style.display = "none";
    }
}

function nextPage(currentPage) {
    var pages = [];
    if (team_alliance != "") {
        pages = ["start", "setup", "auto", "teleop", "climb", "post"];
    } else {
        pages = ["start", "setup", "teleop", "post"];
    }
    document.getElementById("scroll-tab-" + currentPage).classList.remove("is-active");
    document.getElementById("tab-" + currentPage).classList.remove("is-active");
    document.getElementById("scroll-tab-" + pages[(pages.indexOf(currentPage) + 1) % pages.length]).classList.add("is-active");
    document.getElementById("tab-" + pages[(pages.indexOf(currentPage) + 1) % pages.length]).classList.add("is-active");
}

function GearTimerStart() {
    if (currentGearAction == "SubmitGear" || currentGearAction == "") {
        currentGearAction = "GearTimerStart";
        toExport.gearTimer = {};
        $('input[name="gearstatus"]').prop('checked',false);
        var start = (GetTime() - toExport.matchStartTimer)/1000;
        if (start < 0) { start = 0; }
        if (start > 135) { start = 135; }
        start = Math.round(start);
        toExport.gearTimer["start"] = start;
        document.getElementById("GearStartButton").disabled = true;
        document.getElementById("GearStopButton").disabled = false;
    }
}

function GearTimerStop() {
    if (currentGearAction == "GearTimerStart") {
        currentGearAction = "GearTimerStop";
        var stop = (GetTime() - toExport.matchStartTimer)/1000;
        if (stop < 0) { stop = 0 ;}
        if (stop > 135) { stop = 135; }
        stop = Math.round(stop);
        toExport.gearTimer["stop"] = stop;
        document.getElementById("GearStopButton").disabled = true;
    }
}

function SubmitGear(gearstatus) {
    if (currentGearAction == "GearTimerStop") {
        currentGearAction = "SubmitGear";
            toExport.gearTimer["action"] = "gear";
            toExport.gearTimer["result"] = gearstatus;
            setTimeout(function() {
                document.getElementById("successRadioID").classList.remove("is-checked");
                document.getElementById("failRadioID").classList.remove("is-checked");
                document.getElementById("GearStartButton").disabled = false;
                document.getElementById("GearStopButton").disabled = true;
                toExport.timesList.push(toExport.gearTimer);
            }, 500);
    }
}

function undoGear() {

}

function BallShootTimerStart() {
    toExport.fuelTimer = {};
    var start = (GetTime() - toExport.matchStartTimer)/1000;
    if (start < 0) { start = 0; }
    if (start > 135) { start = 135; }
    start = Math.round(start);
    toExport.fuelTimer["start"] = start;
    document.getElementById("BallShootStartButton").disabled = true;
    document.getElementById("BallShootStopButton").disabled = false;
}

function BallShootTimerStop() {
    var stop = (GetTime() - toExport.matchStartTimer)/1000;
    if (stop < 0) { stop = 0; }
    if (stop > 135) { stop = 135; }
    stop = Math.round(stop);
    toExport.fuelTimer["stop"] = stop;
    toExport.fuelTimer["action"] = "shoot";
    toExport.fuelTimer["result"] = "success";
    toExport.timesList.push(toExport.fuelTimer);
    document.getElementById("BallShootStartButton").disabled = false;
    document.getElementById("BallShootStopButton").disabled = true;
}

function BallCollectTimerStart() {
    toExport.collectTimer = {};
    var start = (GetTime() - toExport.matchStartTimer)/1000;
    if (start < 0) { start = 0; }
    if (start > 135) { start = 135; }
    start = Math.round(start);
    toExport.collectTimer["start"] = start;
    document.getElementById("BallCollectStartButton").disabled = true;
    document.getElementById("BallCollectStopButton").disabled = false;
}

function BallCollectTimerStop() {
    var stop = (GetTime() - toExport.matchStartTimer)/1000;
    if (stop < 0) { stop = 0; }
    if (stop > 135) { stop = 135; }
    stop = Math.round(stop);
    toExport.collectTimer["stop"] = stop;
    toExport.collectTimer["action"] = "collect";
    toExport.collectTimer["result"] = "success";
    toExport.timesList.push(toExport.collectTimer);
    document.getElementById("BallCollectStartButton").disabled = false;
    document.getElementById("BallCollectStopButton").disabled = true;
}

// Times amount of time spent on defense
function DefenseTimerStart() {
    toExport.defenseTimer = {};
    var start = (GetTime() - toExport.matchStartTimer)/1000;
    if (start < 0) { start = 0; }
    if (start > 135) { start = 135; }
    start = Math.round(start);
    toExport.defenseTimer["start"] = start;
    document.getElementById("DefenseStartButton").disabled = true;
    document.getElementById("DefenseStopButton").disabled = false;
}

// Times amount of time spent on defense
function DefenseTimerStop() {
    var stop = (GetTime() - toExport.matchStartTimer)/1000;
    if (stop < 0) { stop = 0; }
    if (stop > 135) { stop = 135; }
    stop = Math.round(stop);
    toExport.defenseTimer["stop"] = stop;
    toExport.defenseTimer["action"] = "defense";
    toExport.defenseTimer["result"] = "success";
    toExport.timesList.push(toExport.defenseTimer);
    document.getElementById("DefenseStartButton").disabled = false;
    document.getElementById("DefenseStopButton").disabled = true;
}

function ClimbTimerStart() {
    toExport.climbTimer = {};
    var start = (GetTime() - toExport.matchStartTimer)/1000;
    if (start < 0) { start = 0; }
    if (start > 135) { start = 135; }
    start = Math.round(start);
    toExport.climbTimer["start"] = start;
    document.getElementById("ClimbStartButton").disabled = true;
    document.getElementById("ClimbStartButton").innerHTML = "Climbing Started"
}

function ClimbResult(param) {
    toExport.climbTimer["stop"] = 135;
    toExport.climbTimer["action"] = "climb";
    toExport.climbTimer["result"] = param;
    toExport.timesList.push(toExport.climbTimer);
}

// Receives information from ball scouting card, sets var ballScore equal to the updated score and alliance (which is required for "ballScout") is in the parameters
function BallScoutStop(alliance) {

    toExport.fuelScoutTimer = {};
    var score = document.getElementById(alliance + "Score").value;

    var stop = (GetTime() - toExport.matchStartTimer)/1000;
    if (stop > 135) { stop = 135; }
    if (stop < 0) { stop = 0; }

    toExport.fuelScoutTimer["alliance"] = alliance;
    toExport.fuelScoutTimer["stop"] = stop;
    toExport.fuelScoutTimer["points"] = score;

    toExport.fuelScoutList.push(toExport.fuelScoutTimer);

    if (alliance == "blue") {
        document.getElementById("blueScore").value = "";
        document.getElementById("blueClear").classList.remove("is-dirty");
    } else {
        document.getElementById("redScore").value = "";
        document.getElementById("redClear").classList.remove("is-dirty");
    }

}


/////////////////// ON BOOT /////////////////////////

// Check if a new cache is available on page load.
window.addEventListener('load', function(e) {
    window.applicationCache.addEventListener('updateready', function(e) {
        if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
            // Browser downloaded a new app cache.
            window.location.reload();
        } else {
            // Manifest didn't changed. Nothing new to server.
        }
    }, false);
    // custom items on startup
    downloadAssignments();
    updateAssignmentsDropdown();
    selectRepeatUser();
    $('#overrideDiv').hide()
    $('#exportDiv').hide()
    $('.mdl-layout__drawer-button').remove();
    $('.mdl-layout__tab-bar-right-button').remove();
    $('.mdl-layout__tab-bar-left-button').remove();

    checkForEntry();
    updateUploadStatus();

}, false);

function checkForEntry() {
    var scouterCheck = localStorage.getItem("scouter");
    if (scouterCheck == undefined) {
        $('#landingPage').show();
        $('.mdl-layout__container').hide();
    } else {
        $('#landingPage').hide();
        $('.mdl-layout__container').show();
    }
}

////////////////FOR ASSIGNMENTS///////////////////////

$("select#scouter").change(function(){
    showAssignment();
    $('#overridecheck').prop("checked",false);
    $('#overrideDiv').hide()
    localStorage.setItem("scouter", document.getElementById('scouter').value);
})

$("select#match").change(function(){
    showAssignment();
    $('#overridecheck').prop("checked",false);
    $('#overrideDiv').hide()
})

$("#overridecheck").change(function(){
    showAssignment();
    updateAssignmentsOverrideDropdown()
})

$("select#override").change(function(){
    showAssignment();
})

// Shows assignment based on scouter & match
function showAssignment() {
//    debugger;
    var assignments = JSON.parse(localStorage.getItem("assignments"))
    var assignment = "No assignment";
    var team_number = "";
    var override = "";
    var alliance = "";
    var exportText = "";
    var titleText = "";
    if ($('#overridecheck').is(':checked')) {
        $('#overrideDiv').show()
        override = document.getElementById('override').value;
        if (override != "fuel" && override != "select" && override != "") {
            assignment = "team";
            team_number = document.getElementById('override').value;
            for (var i = 0; i < assignments.length; i++) {
                if (assignments[i]["assignment"] == "team") {
                    if (assignments[i]["team_number"] == document.getElementById('override').value) {
                        alliance = assignments[i]["alliance"]
                    }
                }
            }
        } else if (override == "fuel") {
            assignment = "fuel"
        }
    } else {
        $('#overrideDiv').hide()
        for (var i = 0; i < assignments.length; i++) {
            if (assignments[i]["scouter"] == document.getElementById('scouter').value) {
                if (assignments[i]["match"] == document.getElementById('match').value) {
                    assignment = assignments[i]["assignment"]
                    if (assignment == "team") {
                        team_number = assignments[i]["team_number"]
                        alliance = assignments[i]["alliance"]
                    }
                }
            }
        }
    }

    if(assignment == "fuel") {
        exportText = "Fuel Scout";
        titleText = "Match " + document.getElementById("match").value + " - Fuel";
        $('.teamScout').hide();
        $('.fuelScout').show();
    } else if (assignment == "No assignment") {
        exportText = "No Assignment";
        titleText = "Ozone Scouting";
    } else if (assignment == "team") {
        exportText = "Team" + " - " + team_number;
        titleText = "Match " + document.getElementById("match").value + " - " + team_number;
        $('.fuelScout').hide();
        $('.teamScout').show();
    }

    team_number_js = team_number;
    team_alliance = alliance;

    coloring();

    document.getElementById('exportText').innerText = exportText;
    document.getElementById('importantTitle').innerText = titleText;

    $('#exportDiv').show()
//    document.getElementById('team_number').innerText = team_number;
//    document.getElementById('alliance').innerText = alliance;
}

function coloring() {
    var changeColor = "";
    if (team_alliance == "blue") {
        changeColor = "rgb(30, 100, 240)";
    } else if (team_alliance == "red") {
        changeColor = "rgb(190, 15, 15)";
    } else {
        changeColor = "rgb(15, 157, 88)";
    }

    document.getElementById("exportDiv").style.backgroundColor = changeColor;
    document.getElementById("titleHeader").style.backgroundColor = changeColor;
    document.getElementById("titleFooter").style.backgroundColor = changeColor;
    document.getElementById("titleFooter2").style.backgroundColor = changeColor;
    document.getElementById("tab-start").style.backgroundColor = changeColor;
    document.getElementById("tab-setup").style.backgroundColor = changeColor;
    document.getElementById("tab-auto").style.backgroundColor = changeColor;
    document.getElementById("tab-teleop").style.backgroundColor = changeColor;
    document.getElementById("tab-climb").style.backgroundColor = changeColor;
    document.getElementById("tab-post").style.backgroundColor = changeColor;
}

function downloadAssignments() {
    // Download the assignments
    // If offline and assignments have never been entered, enter sample data
    $.getJSON("/assignments", function (responseTxt, statusTxt, xhr) {
        if(statusTxt == "success") {
            var assignments = responseTxt
            localStorage.setItem("assignments", JSON.stringify(assignments));
            updateAssignmentsDropdown();
        }
    })
}


function updateAssignmentsDropdown() {
    var assignments = JSON.parse(localStorage.getItem("assignments"));

    // Setting the user dropdown
    var options = "<option>--Select--</option>";
    var userlist = [];
    if (assignments != undefined) {
        for (var i = 0; i < assignments.length; i++) {
            // only add to the list if the user isn't already added
            if (userlist.indexOf(assignments[i]["scouter"]) == -1) {
                userlist.push(assignments[i]["scouter"]);
            }
        }
        userlist.sort();
        for (j = 0; j < userlist.length; j++) {
            options += '<option value="' + userlist[j] + '">' + userlist[j] + '</option>';
        }
    }
    $("#scouter").html(options);
    selectRepeatUser();

    // Setting the match dropdown
    var options = "<option>--Select--</option>";
    var matchlist = [];
    if (assignments != undefined) {
        for (var i = 0; i < assignments.length; i++) {
            // only add to the list if the match isn't already added
            if (matchlist.indexOf(assignments[i]["match"]) == -1) {
                matchlist.push(assignments[i]["match"]);
            }
        }
        matchlist.sort(function(a, b){return a-b});
        for (j = 0; j < matchlist.length; j++) {
            options += '<option value="' + matchlist[j] + '">' + matchlist[j] + '</option>';
        }
    }
    $("#match").html(options);
}

function updateAssignmentsOverrideDropdown() {
//    debugger;
    var assignments = JSON.parse(localStorage.getItem("assignments"));
    //Setting the override dropdown
    var options = "<option value=select>--Select--</option>";
    options += '<option value=fuel>fuel</option>';
    var overridelist = [];
    if (assignments != undefined) {
        for (var i = 0; i < assignments.length; i++) {
            // only add to the list if the match isn't already added
            if (assignments[i]['match'] == document.getElementById('match').value) {
                if (overridelist.indexOf(assignments[i]["team_number"]) == -1) {
                    if (assignments[i]["team_number"] != undefined) {
                        overridelist.push(assignments[i]["team_number"]);
                    }
                }
            }
        }
        overridelist.sort(function(a, b){return a-b});
        for (j = 0; j < overridelist.length; j++) {
            options += '<option value="' + overridelist[j] + '">team - ' + overridelist[j] + '</option>';
        }
    }
    $("#override").html(options);
}



function selectRepeatUser() {
    var scouter = localStorage.getItem("scouter");
    if (scouter != undefined) {
        document.getElementById('scouter').value = scouter
    }
}


//////////////////////// Upload ///////////////////

// Checks to make sure there's a start and stop time that's withing 0 < t < 135, as well as an action and result
function verifyTimesEntries() {
    var toCheck = toExport.timesList;

    for (var i = 0; i < toCheck.length; i++) {
        if (toCheck[i]["start"] == undefined) {
            toCheck[i]["start"] = 135;
            alert("start Tripped")
        }
        if (toCheck[i]["stop"] == undefined) {
            toCheck[i]["stop"] = 135;
            alert("stop Tripped")
        }
    }
}

function checkClimbs() {
    var climbed = false;
    var toCheck = toExport.timesList;
    for (var i = 0; i < toCheck.length; i++) {
        if (toCheck[i]["action"] == "climb") {
            if (climbed == true) {
                toCheck.splice(i, 1);
                i--;
            }
            climbed = true;
        }
    }
}

function updateUploadStatus() {
    var existing = localStorage.getItem("entries");
    $("#upload").hide();
    if ( existing != undefined ) {
        var entries = JSON.parse(existing);
        if (entries.length > 0) {
            $("#upload").show();
            document.getElementById("upload").setAttribute("data-badge", entries.length);
        }
    }
}

function PostDrupal() {
    var existing = localStorage.getItem("entries");
    if ( existing != undefined ) {
        var entries = JSON.parse(existing);
        if ( entries.length > 0 ) {
            var entry = entries[0];
            $.ajax({
                url:"scouting",
                type:"POST",
                data:JSON.stringify(entry),
                contentType:"application/json; charset=utf-8",
                timeout:4000,
                success: function(result, status, xhr){
                    entries.splice(0,1);
                    localStorage.setItem("entries", JSON.stringify(entries));
                    updateUploadStatus();
                    PostDrupal();
                }
            })
        }
    }
    updateUploadStatus();
}

function compileDefense() {
    var toReturn = {};
    if (document.getElementById("location-1").checked) { toReturn["top"] = 1; } else { toReturn["top"] = 0; };
    if (document.getElementById("location-2").checked) { toReturn["left"] = 1; } else { toReturn["left"] = 0; };
    if (document.getElementById("location-3").checked) { toReturn["bottom"] = 1; } else { toReturn["bottom"] = 0; };
    if (document.getElementById("location-4").checked) { toReturn["right"] = 1; } else { toReturn["right"] = 0; };
    if (document.getElementById("location-5").checked) { toReturn["crossLeft"] = 1; } else { toReturn["crossLeft"] = 0; };
    if (document.getElementById("location-6").checked) { toReturn["crossRight"] = 1; } else { toReturn["crossRight"] = 0; };

    return toReturn;
}

function resetElements() {
    // Clear text fields
    document.getElementById("match").value = "--Select--";
    $('#exportDiv').hide()
    document.getElementById("prenotes").value = "";
    document.getElementById("postnotes").value = "";
    document.getElementById("improvements").value = "";
    document.getElementById("autoFuel").value = "";
    document.getElementById("blueScore").value = "";
    document.getElementById("redScore").value = "";
    document.getElementById('importantTitle').innerText = "Ozone Scouting";

    currentGearAction = ""

    // Remove dirty classes
    var dirtyClass = document.getElementsByClassName("removeDirty");
    for (var i = 0; i < dirtyClass.length; i++) {
        dirtyClass[i].classList.remove("is-dirty");
    }

    // Uncheck boxes and do other stuff
    document.getElementById("needsReview").checked = false;
    document.getElementById("matchStart").disabled = false;
    document.getElementById("matchStart").innerHTML = "Start Match";
    DefenseTimerStop();
    document.getElementById("successRadioID").classList.remove("is-checked");
    document.getElementById("failRadioID").classList.remove("is-checked");
    document.getElementById("GearStartButton").disabled = true;
    document.getElementById("GearStopButton").disabled = true;
    BallShootTimerStop();
    BallCollectTimerStop();
    document.getElementById("ClimbStartButton").disabled = false;
    document.getElementById("ClimbStartButton").innerHTML = "Start Climbing"
    document.getElementById("climbSuccessID").classList.remove("is-checked");
    document.getElementById("climbFailID").classList.remove("is-checked");
    document.getElementById("l1").classList.remove("is-checked");
    document.getElementById("l2").classList.remove("is-checked");
    document.getElementById("l3").classList.remove("is-checked");
    document.getElementById("l4").classList.remove("is-checked");
    document.getElementById("l5").classList.remove("is-checked");
    document.getElementById("l6").classList.remove("is-checked");
    document.getElementById("nrID").classList.remove("is-checked");
    team_number_js = 0;
    team_alliance = "";
    toExport.timesList = [];
    toExport.fuelScoutList = [];

    autoPeriod["passedLine"] = false;
    autoPeriod["ballPoints"] = 0;
    autoPeriod["gear"] = "fail"
    document.getElementById("lineCheckbox").classList.remove("is-checked");

    coloring();

    disableAll();
}


////////////// Save Local ////////////////////

function SaveLocal() {
    // Verify times
    verifyTimesEntries();
    checkClimbs();

    // Grab variable values
    var scouter = document.getElementById("scouter").value;
    var match = document.getElementById("match").value;
    if (match == null || match == "--Select--") { match = 9999; }
    var prenotes = document.getElementById("prenotes").value;
    if (prenotes == null) { prenotes = ""; }
    var postnotes = document.getElementById("postnotes").value;
    if (postnotes == null) { postnotes = ""; }
    var improvements = document.getElementById("improvements").value;
    if (improvements == null) { improvements = ""; }
    var needsReview = document.getElementById("needsReview").checked;
    var defenseList = compileDefense();

    if (document.getElementById("lineCheckbox").classList.contains("is-checked")) { autoPeriod["passedLine"] = true; }

    autoPeriod["ballPoints"] = document.getElementById("autoFuel").value;
    if (document.getElementById("autoFuel").value == "") { autoPeriod["ballPoints"] = 0; }

    // Get localStorage stuff
    var existing = localStorage.getItem("entries");
    if (existing == undefined) {
        var entries = [];
    } else {
        var entries = JSON.parse(existing);
    }
    entries.push({
        "prenotes": prenotes,
        "postnotes": postnotes,
        "improvements": improvements,
        "needsReview": needsReview,
        "scouter": scouter,
        "match": match,
        "team": team_number_js,
        "alliance": team_alliance,
        "autoperiod": [autoPeriod],
        "times": toExport.timesList,
        "defense": [defenseList],
        "ballScout": toExport.fuelScoutList
    })
    localStorage.setItem("entries", JSON.stringify(entries));
    updateUploadStatus();
    PostDrupal();

    resetElements();
}