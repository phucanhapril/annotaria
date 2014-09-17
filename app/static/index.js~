/** Progetto AnnOtaria
 Tecnologie Web 2014
 Riccardo Candido e April Tran
 **/

/* Main Function */
$(document).ready(main);

/*CONTROL*/

var userMode = "read";  /******** PRIVATE -> the acces of this variables is only by the method set and get - the edit annotation **********/
var editMode =false;    /******** PRIVATE -> the acces of this variables is only by the method set and get - the edit annotation **********/
var URIArticle = "";    /******** PRIVATE -> the acces of this variables is only by the method set and get **********/
var userName ="";       /******** PRIVATE -> the acces of this variables is only by the method set and get **********/
var userMail ="";       /******** PRIVATE -> the acces of this variables is only by the method set and get **********/
var docJSON ="";        /******** PRIVATE -> the acces of this variables is only by the method set and get **********/
var label ="";          /******** PRIVATE -> the acces of this variables is only by the method set and get **********/

function main() {
    // the first thing is create the list of files
    getListFiles(); // control
    setArticlesWarning(); //view
    modeSwitch(); // view
    setFilter(); // view
    setAddButton(); // view
    setSaveButton(); // view
    disease_query();
    subject_query();
    set_people();
    set_places();
    set_publishers();

    $.ajax({
        method: 'GET',
        url: 'start.html',
        success: function(d) {
            showArticle(d, "Welcome to Annotaria - Getting Started");
        },
        error: function(a,b,c) {

        }
    });

    /*test stuff */
    $("#icon").click(function() {
        $.ajax({
            method: 'GET',
            url: 'dbpedia',
            data: {'search-term':'eiffel'},
            success: function(d) {
                console.log(d.result);
            },
            error: function(a,b,c) {
                alert('ya done fucked');
            }
        });
    });
}
/* Get list Files */
function getListFiles(){
    $.ajax({
        /* Get files */
        method: 'GET',
        url: 'filelist.json',
        success: function (d) {
           /*json = JSON.parse(d); //json -> javascript array
            for (var i = 0; i < json.length; i++) {
                loadTitle(json[i]);
                addToCiteList(json[i].url, json[i].label);
            }
        },*/
             for (var i = 0; i < d.length; i++) {
                 loadTitle(d[i]);
             }
        },
        error: function (a, b, c) {
            alert('No documents available');
        }
    });
}
/* function that laod the document*/
function load(docURI,docJSON,label){
    removeArticle();
    removeAllNote();
    setLabel(label);
    dataLoaded = 0;
    // take old notes because I have to remove this to the document
    var oldSavedNotes = {};
    if (getAllSavedNote().length > 0) var oldSavedNotes = jQuery.extend(true, {}, getAllSavedNote());
    // remove old saved notes
    removeAllSavedNote();
    /* Load document */
    $.ajax({
        method: 'GET',
        url: "docs/" + docURI,
        success: function(d) {
            dataLoaded++;
            if(showArticle(d,label)){
                setArticleDisplayed(docURI);
            }
            /* Either doc will load first or notes will load first */
            if(dataLoaded == 2) showSavedNotes(oldSavedNotes);
        },
        error: function(a,b,c) {
            alert("ERROR","Could not display article: ", label);
        }
    });
    /* AJAX QUERY - Load existing notes from Fuseki */ 
    $.ajax({
        method: 'GET',
        url: "/get_notes",
        data: {"doc" : docURI},
        success: function(d) {
	    console.log("Retrieved notes: "+d["result"]);
	    addNewSavedNotes(d["result"]);
	    dataLoaded++;
            if (dataLoaded == 2) showSavedNotes(oldSavedNotes);
        },
        error: function(a,b,c) {
            alert("ERROR","Could not download notes for: ", label);
        }
    });
}
/* function that save a annotation */
function save() {
    if (getAllNote().length > 0) {
        var allAnnotation = {};
        allAnnotation.data = JSON.stringify(getAllNote());
        //console.log("Sent: " + allAnnotation.data); /*Comment*/
        $.ajax({
            //method: 'POST', Flask workaround
            method: 'GET',
            url: "/save_notes",
            data: allAnnotation,
            success: function (d) {
                //console.log("Result: " + d.result); /*Comment*/
                /* Notify user, remove save button */
                alert("SUCCESS", "Annotations saved", "");
                removeAllNote(); // to data structure
                // clear the edit tab
                clearListUnsavedNote();
                // hide save button
                hideSaveButton();
                // RELOAD of the document
                load(getArticleDisplayed(), getDocJSON(), getLabel());
            },
            error: function (a, b, c) {
                /* Display error mod */
                alert("ERROR", "Your annotations could not be saved", "");
            }
        });
    } else {
        alert("ERROR", "Your request could not be processed.", "There are no annotations to save.");
    }
}

    /* -------------------------------------------------------- */
    /* when you invoke AddNote after the sys invoke setInputData*/
    /* -------------------------------------------------------- */
    /* function that add a annotation */
    function addNote(){
        chooseWidget();
    }
    /* function that take the view input data, create a note, add the note to unsaved note */
    function setInputData(myWidgetId,myDataNote){
        // create a note
        var newNote = createNote(myWidgetId, myDataNote, getDataSelection());
        // add the note to unsaved note
        addItemNote(newNote);
        console.log("Added: " + JSON.stringify(newNote)); /*Comment */
        // take the note
        var viewNote = getNote(newNote.id);
        // show the note
        if (isEntire(viewNote)) {
            addUnsavedNoteEntire(viewNote);
        }else{
            addUnsavedNoteFragment(viewNote);
        }
        showSaveButton();
    }
    /* -------------------------------------------------------- */
    /* -------------------------------------------------------- */
    /* when you invoke Edit after the sys invoke editInputdata  */
    /* -------------------------------------------------------- */
    /* function that edit a annotation */
    var editNote = {};    // this variable in the sys doesn't exist! I USE THIS ONLY IN THE FUNCTION EDIT AND EDITINPUTDATA
    function edit(id){
        setEditMode(true);
        editNote =  jQuery.extend(true, {}, getNote(id));
        // invoke widget
        chooseWidget(editNote);
    }
    /* function that take the view input data, create a note, add the note to unsaved note */
    function editInputData(myDataNote){
        editNote.bodyLabel= myDataNote.label; //Description about the resourcer;
        editNote.bodyResource = myDataNote.url; //URI the resource;
        editNote.time = getDateTime(); // The time
        // add new remove old note
        removeNote(editNote.id);
        addItemNote(editNote);
        // refresh the graphic Interface
        removeUnsavedNoteList(editNote.id);
        addNoteTabUnsaved(editNote, (isEntire(editNote) ? "Entire Note" : "Fragment Note"));
        //  clear the parameters
        setEditMode(false);
        editNote = {};
    }
    /* -------------------------------------------------------- */

/* function that remove a annotation */
function remove(id){
    var myNote = getNote(id); // take the note
    var booEntire= isEntire(myNote);
    removeNote(id); // remove in the model
    removeUnsavedNoteList(id); // remove the itemi in the list edit
    if (!booEntire) removeUnsavedNoteFragDoc(id); // if a fragment note remove this on the html document
}
/* ---------------------------- */
/* show saved Notes */
function showSavedNotes(myOldSavedNotes){
// riki
    // remove saved note to entire list
    removeSavedNoteList();
    console.log("Old saved: "+myOldSavedNotes);
    // remove fragment saved note to the list
    //for oldSavedNotes    
    //    removeSavedNoteFragDoc();
    for (key in myOldSavedNotes){
	if (!isEntireType(myOldSavedNotes[key].noteType)){
		removeSavedNoteFragDoc(myOldSavedNotes[key].id);
	}
    }    
    // add new Note
    var myNotes = getAllSavedNote();
    for (var i=0; i< myNotes.length; i++) { // cycling the notes
        if (isEntireType(myNotes[i].noteType)){ // invoke a method about model
            addSavedNoteEntire(myNotes[i], myNotes[i].name);// insert the note in html dom or in view for entire note
        }else{
            addSavedNoteFragment(myNotes[i]);// insert the note in html dom or in view for entire note
        }
    }
}
/* ---------------------------- */
/* Auxiliary functions for creating JSON */
/* get Provenance: Date and time stamp, returns 'time: "yyyy-mm-ddThh:mm"' */
function getDateTime() {
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    var hour = now.getHours();
    var minute = now.getMinutes();

    if (month.toString().length==1) month = '0' + month;
    if (day.toString().length==1) day = '0' + day;
    if (hour.toString().length==1) hour = '0' + hour;
    if (minute.toString().length==1) minute = '0' + minute;

    return year + '-' + month + '-' + day + 'T' + hour + ':' + minute;
}
/* set get methods mail credential */
function setUserMail(myEmail){
    userMail = myEmail;
}
function getUserMail(){
    return userMail;
}
/* set get methods user credential */
function setUserName(name){
    userName = name;
}
function getUserName(){
    return userName;
}
/* set get methods for the edit mode */
function setEditMode(booMode){
    editMode = booMode;
}
function isEditMode(){
    return editMode;
}
/* set get methods article displayed */
function setArticleDisplayed(myArticle){
    URIArticle = myArticle;
}
function getArticleDisplayed(){
    return URIArticle;
}
/* test if the document is open */
function isDocOpen(){
    return (URIArticle.length>0);
}
/* set get methods article displayed */
function setDocJSON(myJson){
    docJSON = myJson;
}
function getDocJSON(){
    return docJSON;
}
/* set get methods article displayed */
function setLabel(myLabel){
    label = myLabel;
}
function getLabel(){
    return label;
}
/* set get methods article displayed */
function setUserMode(myMode){
    userMode = myMode;
}
function getUserMode(){
    return userMode;
}
    /* --------------------------------------------------------
        when you invoke beameAnnotator, after if the user wants
        to became an annotator the sys invoke iMAnnotator
     -------------------------------------------------------- */
    /* became a annotator */
    function becameAnnotator(){
        if (getUserMode() == "read"){
            /* Get annotator name */
            getAnnotatorCredential(); /* this function set the variables userName userMail */
        }
    }
    function iMAnnotator(){

    }
    /* --------------------------------------------------------
         when you invoke became Reader, after if the user wants
         to became an reader the sys invoke iMReader
     -------------------------------------------------------- */
    /* became a reader */
    function becameReader(){
        if (getUserMode() == "annotate"){
            /* Get annotator name */
            if (getAllNote().length>0){
                // if i'm sure the alert invoke becameReaderSure function
                alertTrueFalse("QUESTION", "If you change the mode you lost all unsaved annotation","Are you sure?","","becameReaderSure");
            }else{
                becameReaderSure()
            }
        }
    }
    function becameReaderSure(){
        removeAnnotatorCredential(); /* this function set the variables userName userMail */
    }
    function iMReader(){
        removeAllNote();

        clearListUnsavedNote();
    }

/* control if the note are correct */
function thereAreUnsavedNotes(){
    return (getAllNote.length > 0);
}


/* VIEW */
var mode = "read";      /******** PRIVATE -> the acces of this variables is only by the method set and get **********/
var idWidget = "";      /******** PRIVATE -> the acces of this variables is only by the method set and get **********/
var textSelection = {}; /******** PRIVATE -> the acces of this variables is only by the method set and get **********/
var data={};            /******** PRIVATE -> the acces of this variables is only by the method set and get **********/
/* Main Function */
function setArticlesWarning() {
    $('#articles').click(function() {
        if(notSaved()) alert("WARNING", "Unsaved notes will be lost.", "Save notes before changing documents to avoid losing work")
        $("#docs-box").modal();
    })
}
/* add saved notes fragment  */
function addSavedNoteFragment(viewNote){
    // stiamo testando se sono in grado 
    // di inserire annotazioni fragment salvate
    var r = document.createRange();
    var node = $("#" + viewNote.node)[0].childNodes[0];
    // sometimes make a error
    r.setStart(node, parseInt(viewNote.start));
    r.setEnd(node, parseInt(viewNote.end));
    var span = document.createElement("span");
    // set attributite for the visualization
    span.setAttribute("id", 'span-' + viewNote.id);
    // if there is a filter checked i put the style in the type
    span.setAttribute("class", "imspan " + viewNote.noteType + ($('#filter-' + viewNote.noteType)[0].checked ? " edit-" + viewNote.noteType : ""));
    // set attributite for the filter - author and date
    console.log(viewNote); // rikii
    span.setAttribute("data-author", viewNote.name);
    span.setAttribute("data-time", viewNote.time.substring(0,10));
    span.setAttribute("data-type", viewNote.noteType);

    // set the event for the popover
    span.setAttribute("onmouseover", "showPopover(this.id)");
    span.setAttribute("onmouseout", "hidePopover(this.id)");
    // set the data for the popover
    span.setAttribute("data-placement", "left");
    span.setAttribute("data-html", true);
    span.setAttribute("data-toggle", "popover");
    span.setAttribute("data-placement", "left");
    span.setAttribute("data-content","<p>Type:" + viewNote.noteLabel + "</p><p>Annotation: " + viewNote.bodyLabel + "</p><p>Author:" + viewNote.name + "</p><p>Author Mail:" + viewNote.email +  "</p><p>Time:" + viewNote.time );
    r.surroundContents(span);
}
/* add saved notes entire */
function addSavedNoteEntire(viewNote,myTypeNote){
	$("#doc-notes ul").prepend("<li id='li-" + viewNote.id + "' class='list-group-item no-border' data-author='" + viewNote.name +"' data-time='" + viewNote.time.substring(0,10) + "' data-type='" +viewNote.noteType +"' ><strong>" + viewNote.noteLabel + "</strong><br>" + viewNote.bodyLabel + "<br><span class='small'>" + formattingTime(viewNote.time) + "&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;" + myTypeNote  + "</span></li>");
}
/* add unsaved notes Entire */
function addUnsavedNoteEntire(viewNote){
    addNoteTabUnsaved(viewNote, "Entire Note");
}
/* add unsaved notes Fragment */
function addUnsavedNoteFragment(viewNote){
    // add the note in the document
    addSavedNoteFragment(viewNote);
    addNoteTabUnsaved(viewNote, "Fragment Note");

}
/* remove unsaved notes Entire - Fragment*/
function removeUnsavedNoteList(id){
    $("#li-" + id).remove();
}
/* add and remove the style */
function removeUnsavedNoteFragDoc(id){
    $('#span-'+id).contents().unwrap();
}
/* show the form, after you can choose the type of annotation  */
function chooseWidget(note){
    /* call open widget */
    if (note == undefined) {
        /****** THE NOTE IS NEW ******/
        //show a modal where there are the button about the type
        if (getHTMLOfSelection() == '') {
            setDataSelection(undefined); // take the selection and set the selection
            $("#add-note-entire").modal({backdrop: 'static'});
        } else {
            setDataSelection(selection()); // take the selection and set the selection
            $("#add-note-frag").modal({backdrop: 'static'});
        }
    }else{
        /****** THE NOTE IS OLD (UNSAVED)******/
        openWidget(note.noteType, note.bodyLabel, note.bodyResource);
    }
}
/* open the widget */
function openWidget(idWidget, myLabel, myResource){
    /* Displays input widget */
    /********************* AJAX QUERY TO DISPLAY INSTANCES *************/
    switch (idWidget)   {
        case 'hasAuthor':
            (document.getElementById("instance-title")).innerHTML = "Add Author";
            (document.getElementById("instance-list-body")).innerHTML = 'Select an author from the following list:';
            (document.getElementById("instance-choice-body")).innerHTML = "Or add an unlisted author:";
            (document.getElementById("instance-btn")).setAttribute("class", "btn btn-info");
	    (document.getElementById("author-list")).setAttribute("style", "");
            /************************ AJAX QUERY TO FILL LIST *************/
            $("#create-instance").modal({backdrop: 'static'});
            /** IF WE ARE IN EDIT  MODE I PUT THE DATA IN THE INPUT TAG **/
            setEditDataIstance(myLabel,myResource);
            break;
        case 'hasPublisher':
            (document.getElementById("instance-title")).innerHTML = "Add Publisher";
            (document.getElementById("instance-list-body")).innerHTML = 'Select a publisher from the following list:';
            (document.getElementById("instance-choice-body")).innerHTML = "Or add an unlisted publisher:";
            (document.getElementById("instance-btn")).setAttribute("class", "btn btn-info");
   	    (document.getElementById("publisher-list")).setAttribute("style", "");
            /************************ AJAX QUERY TO FILL LIST *******/
            $("#create-instance").modal({backdrop: 'static'});
            /** IF WE ARE IN EDIT  MODE I PUT THE DATA IN THE INPUT TAG **/
            setEditDataIstance(myLabel,myResource);
            break;
        case 'hasPublisherYear':
            (document.getElementById("date-title")).innerHTML = "Add Publication Year";
            (document.getElementById("date-body")).innerHTML = "Publication Year:";
            (document.getElementById("date-btn")).setAttribute("class", "btn btn-info");
            $("#create-date").modal({backdrop: 'static'});
            /** IF WE ARE IN EDIT  MODE I PUT THE DATA IN THE INPUT TAG **/
            setEditDataTextDate(myLabel);
            break;
        case 'hasTitle':
            (document.getElementById("long-title")).innerHTML = "Add Title";
            (document.getElementById("long-body")).innerHTML = "Title:";
            (document.getElementById("long-btn")).setAttribute("class", "btn btn-info");
            $("#create-long").modal({backdrop: 'static'});
            /** IF WE ARE IN EDIT  MODE I PUT THE DATA IN THE INPUT TAG **/
            setEditDataTextArea(myLabel);
            break;
        case 'hasAbstract':
            (document.getElementById("long-title")).innerHTML = "Add Abstract";
            (document.getElementById("long-body")).innerHTML = "Abstract:";
            (document.getElementById("long-btn")).setAttribute("class", "btn btn-info");
            $("#create-long").modal({backdrop: 'static'});
            /** IF WE ARE IN EDIT  MODE I PUT THE DATA IN THE INPUT TAG **/
            setEditDataTextArea(myLabel);
            break;
        case 'hasShortTitle':
            (document.getElementById("short-title-mod")).innerHTML = "Add Short Title";
            (document.getElementById("short-body")).innerHTML = "Title:";
            (document.getElementById("short-btn")).setAttribute("class", "btn btn-info");
            $("#create-short").modal({backdrop: 'static'});
            /** IF WE ARE IN EDIT  MODE I PUT THE DATA IN THE INPUT TAG **/
            /*ERROR */
            setEditDataTextShort(myLabel);
            break;
        case 'hasArticleComment':
            (document.getElementById("long-title")).innerHTML = "Add Comment";
            (document.getElementById("long-body")).innerHTML = "Comment:";
            (document.getElementById("long-btn")).setAttribute("class", "btn btn-info");
            $("#create-long").modal({backdrop: 'static'});
            /** IF WE ARE IN EDIT  MODE I PUT THE DATA IN THE INPUT TAG **/
            setEditDataTextArea(myLabel);
            break;
        case 'denotesPerson':
            (document.getElementById("instance-title")).innerHTML = "Denote Person";
            (document.getElementById("instance-list-body")).innerHTML = 'Select a person from the following list:';
            (document.getElementById("instance-choice-body")).innerHTML = "Or add an unlisted person:";
            (document.getElementById("instance-btn")).setAttribute("class", "btn btn-primary");
	    (document.getElementById("person-list")).setAttribute("style", "");
            /************************ AJAX QUERY TO FILL LIST *******/
            $("#create-instance").modal({backdrop: 'static'});
            /** IF WE ARE IN EDIT  MODE I PUT THE DATA IN THE INPUT TAG **/
            setEditDataIstance(myLabel,myResource)
            break;
        case 'denotesPlace':
            (document.getElementById("instance-title")).innerHTML = "Denote Place";
            (document.getElementById("instance-list-body")).innerHTML = 'Select a place from the following list:';
            (document.getElementById("instance-choice-body")).innerHTML = "Or add an unlisted place:";
            (document.getElementById("instance-btn")).setAttribute("class", "btn btn-primary");
	    (document.getElementById("place-list")).setAttribute("style", "");
            /************************ AJAX QUERY TO FILL LIST *******/
            $("#create-instance").modal({backdrop: 'static'});
            /** IF WE ARE IN EDIT  MODE I PUT THE DATA IN THE INPUT TAG **/
            setEditDataIstance(myLabel,myResource)
            break;
        case 'denotesDisease':
            (document.getElementById("query-title-disease")).innerHTML = "Denote Disease";
            (document.getElementById("query-body-disease")).innerHTML = "Select disease from the International Classification of Diseases:";
            $("#create-query-disease").modal({backdrop: 'static'});
            break;
        case 'hasSubject':
            (document.getElementById("query-title-sub")).innerHTML = "Add Subject";
            (document.getElementById("query-body-sub")).innerHTML = 'Select a subject from the following list:';
            $("#create-query-sub").modal({backdrop: 'static'});
            break;
        case 'hasDbpedia':
            $("#create-pedia").modal({backdrop: 'static'});
            /** IF WE ARE IN EDIT  MODE I PUT THE DATA IN THE INPUT TAG **/
            /* error GRANDE COME UNA CASA
            if (myLabel!==undefined && myLabel.length>0) $("#instance-choice").val(myLabel);
            if (myResource!==undefined && myResource.length>0) $("#instance-list").val(myResource);*/
            /** to do ------------------------------------------------------------------------------------------------------------------------------**/
            break;
        case 'hasClarityScore':
            (document.getElementById("choice-title")).innerHTML = "Add Clarity Score";
            (document.getElementById("choice-body")).innerHTML = "Score:";
            (document.getElementById("choice-btn")).setAttribute("class", "btn btn-warning");
            $("#create-choice").modal({backdrop: 'static'});
            /** IF WE ARE IN EDIT  MODE I PUT THE DATA IN THE INPUT TAG **/
            // is not neccesary
            break;
        case 'hasOriginalityScore':
            (document.getElementById("choice-title")).innerHTML = "Add Originality Score";
            (document.getElementById("choice-body")).innerHTML = "Score:";
            (document.getElementById("choice-btn")).setAttribute("class", "btn btn-warning");
            $("#create-choice").modal({backdrop: 'static'});
            /** IF WE ARE IN EDIT  MODE I PUT THE DATA IN THE INPUT TAG **/
            // is not neccesary
            break;
        case 'hasFormattingScore':
            (document.getElementById("choice-title")).innerHTML = "Add Formatting Score";
            (document.getElementById("choice-body")).innerHTML = "Score:";
            (document.getElementById("choice-btn")).setAttribute("class", "btn btn-warning");
            /*ERROR*/
            $("#create-choice").modal({backdrop: 'static'});
            /** IF WE ARE IN EDIT  MODE I PUT THE DATA IN THE INPUT TAG **/
            // is not neccesary
            break;
        case 'hasCitation':
            $("#create-cite").modal({backdrop: 'static'});
            /** IF WE ARE IN EDIT  MODE I PUT THE DATA IN THE INPUT TAG **/
            /** to do -----------------------------------------------------------------------------------*/
            break;
        case 'hasComment':
            (document.getElementById("long-title")).innerHTML = "Add Comment";
            (document.getElementById("long-body")).innerHTML = "Comment:";
            (document.getElementById("long-btn")).setAttribute("class", "btn btn-danger");
            $("#create-long").modal({backdrop: 'static'});
            /** IF WE ARE IN EDIT  MODE I PUT THE DATA IN THE INPUT TAG **/
            setEditDataTextArea(myLabel);
            break;
    }
    setIdWidget(idWidget);
    setListener(idWidget); /* invoke setData() and send the dat to the controller */
}
/* set the listener for the widgets*/
function setListener(idWidget){

    /* INPUT SHORT */
    /* Turn off all other handlers for submit buttons */
    $("#short-btn").off("click");
    /* Check input, store note, display Save button, adjust default values */
    $("#short-btn").click(function() {
        var instance = {};
        instance.label = (document.getElementById("short-ip")).value;
        setData(instance);
        sendDataToController();
        $("#short-ip").val('').placeholder();
    });
    $("#short-cancel").click(function () {
        $("#short-ip").val('').placeholder();
    });

    /* INPUT LONG */
    $("#long-btn").off("click");
    $("#long-btn").click(function() {
        var instance = {};
        instance.label = (document.getElementById("long-ip")).value;;
        setData(instance);
        sendDataToController();
        $("#long-ip").val('');
    });
    $("#long-cancel").click(function () {
        $("#long-ip").val('');
    });

    /* INPUT DATE */
    $("#date-btn").off("click");
    $("#date-btn").click(function() {
        var date = (document.getElementById("date-ip")).value;
        if(date<0 || date>2014 || !checkNotBlank(date)) {
            alert("ERROR","Annotation creation failed!","Please input a valid publication year");
        }else{
            var instance = {};
            instance.label = date;
            setData(instance);
            sendDataToController();
        }
        $("#date-ip").val('');
    });
    $("#date-cancel").click(function () {
        $("#date-ip").val('');
    });

    /* INPUT CHOICE */
    $("#choice-btn").off("click");
    $("#choice-btn").click(function() {
        var e = (document.getElementById("choice-ip"));
        var instance = {};
        instance.label = e.options[e.selectedIndex].value;
        setData(instance);
        sendDataToController();
        $("#choice-ip").val("fair");
    });
    $("#choice-cancel").click(function () {
        $("#choice-ip").val("fair");
    });

    /* INPUT QUERY */
    $("#query-btn").off("click");
    $("#query-btn").click(function() {
        var e = (document.getElementById("query-ip"));
        var instance = {};
        instance.url = e.options[e.selectedIndex].value;
        instance.label = e.options[e.selectedIndex].innerHTML;
        setData(instance);
        sendDataToController();
        $("#query-ip").val("null-select");
    });
    $("#query-cancel").click(function () {
        $("#query-ip").val("null-select");
    });

    /* INPUT ISTANCE */
    $("#instance-btn").off("click");
    $("#instance-btn").click(function() {
	if(idWidget=='hasAuthor') var e = (document.getElementById("author-list"));
	else if(idWidget=='hasPublisher') var e = (document.getElementById("publisher-list"));
	else if(idWidget=='denotesPerson') var e = (document.getElementById("person-list"));
	else /*(instance.noteType=='denotesPlace')*/ var e = (document.getElementById("place-list"));
        ip = e.options[e.selectedIndex].value;
        var instanceTitle, instanceLink;
        if(ip=='null-select') {
            instanceTitle = (document.getElementById('instance-choice')).value;
            instanceLink = ''; /* will cause server to create uri for user input */
        } else {
            instanceTitle = e.options[e.selectedIndex].innerHTML;
            instanceLink = ip;
        }
        if(checkNotBlank(instanceTitle)) {
            var instance = {};
            instance.label = instanceTitle;
            instance.url = instanceLink;
            setData(instance);
            sendDataToController();
        }
	e.setAttribute("value", "null-select");
	e.setAttribute("style", "display: none;");
        $("#instance-choice").val("");
    });
    $("#instance-cancel").click(function() {
	if(idWidget=='hasAuthor') var e = (document.getElementById("author-list"));
	else if(idWidget=='hasPublisher') var e = (document.getElementById("publisher-list"));
	else if(idWidget=='denotesPerson') var e = (document.getElementById("person-list"));
	else /*(instance.noteType=='denotesPlace')*/ var e = (document.getElementById("place-list"));
	e.setAttribute("value", "null-select");
	e.setAttribute("style", "display: none;")
        $("#instance-choice").val("");
    });

    /* INPUT DBPEDIA */
    $("#pedia-search-btn").click(function() {
        clearPedia();
        /******************** GET MY ARTICLES ********/
        var toSearch = (document.getElementById("pedia-search")).value;
        $.ajax({
            method: 'GET',
            url: 'dbpedia',
            data: {'search-term':toSearch},
            success: function(d) {
                displayDbpediaResults(d.result);
            },
            error: function(a,b,c) {
                alert('ERROR', 'Could not return results.', 'Please try again');
            }
        });
    });
    $("#pedia-btn").off("click");
    $("#pedia-btn").click(function() {
        var e = (document.getElementById("pedia-results"));
        ip = e.options[e.selectedIndex].value;
        if(checkNotBlank(ip)) {
            var dbpedia = {};
            dbpedia.label = e.options[e.selectedIndex].innerHTML;
            dbpedia.url = ip;
            setData(dbpedia);
            sendDataToController();
        }
        clearPedia();
        $("#pedia-search").val("");
        $("#pedia-results").val("");
    });
    $("#pedia-cancel").click(function() {
        clearPedia();
        $("#pedia-search").val("");
        $("#pedia-results").val("");
    });

    /* INPUT CITE */
    $("#cite-btn").off("click");
    $("#cite-btn").click(function() {
        var e = (document.getElementById("cite-doc-list"));
        ip = e.options[e.selectedIndex].value;
        /* Body variables: cited article's title and url */
        var citeTitle, citeLink;
        /* Check if user selected external article */
        if(ip=='null-select') {
            citeTitle = (document.getElementById('cite-title')).value;
            citeLink = (document.getElementById('cite-link')).value;
            if(citeTitle.length<1 || citeLink.length<1) {
                alert("ERROR", "Annotation creation failed!","Please input required information")
            }
        } else {
            citeTitle = e.options[e.selectedIndex].innerHTML;
            citeLink = ip;
        }
        /* Create external article input to pass to storeNote() */
        var extIp = {};
        extIp.label = citeTitle;
        extIp.url = citeLink;
        setData(extIp);
        sendDataToController();
        $("#cite-doc-list").val("null-select");
        $("#cite-title").val("");
        $("#cite-link").val("");
    });
    $("cite-cancel").click(function() {
        $("#cite-doc-list").val("null-select");
        $("#cite-title").val("");
        $("#cite-link").val("");
    });
}
/* ---------------------------- */
/* Auxiliar Function            */
/* switch function for the mode */
function modeSwitch() {
    /* Switching to annotator mode requires input of annotator's name */
    $('#annotator-mode').click(function() {
        becameAnnotator();
    });
    /* Save warning when switching to Reader Mode with unsaved annotations */
    $('#reader-mode').click(function() {
        becameReader();
    });
}
/* create the link for to load the article */
function loadTitle(doc){
    $('#list').append("<li><a href='#' onclick='load(\"" + doc.url + "\",\"" + doc.notes + "\",\"" + doc.label + "\")'>" + doc.label + "</a></li>");
}
/* set the filte when load the page */
function setFilter(){
    $('#doc-title').hide();
    $('.collapse').collapse('hide')
}
/* show the articole and set the title*/
function showArticle(d,label) {
    $('#doc-display').html(d);
    $('#doc-title h2').html(label);
    $('#doc-title').show();
    return true;
}
/* show a alert modal view*/
function alert(head,title, message) {
    (document.getElementById("alert-title")).innerHTML = head;
    (document.getElementById("alert-body")).innerHTML = "<strong>" + title + "</strong>" + " " + message + ".";
    $("#alert-mod").modal();
}
/* Remove the page */
function removeArticle(){
    /* clear the page */
}
/* set the add button */
function setAddButton() {
    $("#note-add").click(function () {
        if (isDocOpen()) {
            addNote();
        } else {
            alert("ERROR","Could not add annotation.", "Please select an article in order to make annotations");
        }
    });
}
/* take the html selection */
function getHTMLOfSelection () {
    var range;
    if (document.selection && document.selection.createRange) {
        range = document.selection.createRange();
        return range.htmlText;
    } else if (window.getSelection) {
        var selection = window.getSelection();
        if (selection.rangeCount > 0) {
            range = selection.getRangeAt(0);
            var clonedSelection = range.cloneContents();
            var div = document.createElement('div');
            div.appendChild(clonedSelection);
            return div.innerHTML;
        } else {
            return '';
        }
    } else {
        return '';
    }
}
/* take the selection */
function selection() {
    if (window.getSelection) {
        return window.getSelection();
    } else if (document.getSelection) {
        return document.getSelection();
    } else if (document.selection) {
        return document.selection.createRange().text;
    }
}
/* Get e set for variables selection */
function setDataSelection(theSelection){
    textSelection = jQuery.extend(true, {}, theSelection);
}
function getDataSelection(){
    mySelection = {};
    if(textSelection.anchorNode != undefined) {
        var dad = textSelection.anchorNode.parentElement;
        mySelection.node = dad.id;
        mySelection.start = Math.min(textSelection.anchorOffset, textSelection.focusOffset);
        mySelection.end = Math.max(textSelection.anchorOffset, textSelection.focusOffset);
    }
    textSelection = {}; // clear the selection
    return mySelection;
}
/* Save notes */
function setSaveButton() {
    $("#note-save").click(function() {
        save(); // Invoke a function of control
    });
}
/* Checks if user input is valid: True if not blank, false if blank */
function checkNotBlank(test) {
    if(test.length<1) {
        alert("ERROR","Annotation creation failed.","Please input required information");
        return false;
    }
    return true;
}
/* Get e set for compatible Extremes*/
function compatibleExtremes(n) {
    return (n.anchorNode === n.focusNode && n.type=='Range');
}
/* add unsaved note to the list */
function addNoteTabUnsaved(viewNote, myTypeNote){
    var myId = "li-" + viewNote.id;
    var strEditButton = "<span style='cursor: pointer;' class=\"input-group-addon\"><span id='glyphiconEdit-"+ viewNote.id +"' class=\"glyphicon glyphicon-edit\"></span></span>";
    var strRemoveButton = "<span style='cursor: pointer;'  class=\"input-group-addon\"><span id='glyphiconRemove-"+ viewNote.id +"' class=\"glyphicon glyphicon-remove\"></span></span>";
    $("#unsaved-notes ul").prepend("<li id='" + myId + "' class='list-group-item no-border'><strong>" + viewNote.noteLabel + "</strong><br>" + viewNote.bodyLabel + "<br><span class='small'>" + formattingTime(viewNote.time) + "&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;" + myTypeNote  + "</span>"+strEditButton+strRemoveButton+"</li>");
    // set the event about the node
    $("#glyphiconEdit-"+ viewNote.id).click(function(){
        edit(viewNote.id, myId);
    });
    $("#glyphiconRemove-"+ viewNote.id).click(function(){
        remove(viewNote.id);
    });
}
/* add or remove the class ( for the filter Function )*/
function AddRemoveClass(id, typeClass, addRemoveClass) {
    // when i press on a button i set or unset the text
    if ($('#'+id).is(':checked'))
        $(typeClass).addClass(addRemoveClass);
    else
        $(typeClass).removeClass(addRemoveClass);
}
/* method to formatting a time */
function formattingTime(myTime){
    return myTime.replace("T"," - ");
}
/* Get e set for variables idWidget */
function setIdWidget(newIdWidget){
    idWidget=newIdWidget;
}
function getIdWidget() {
    return idWidget;
}
/* Get e set for variables data */
function setData(obj){
    data=obj;
}
function getData(){
    return data;
}
/* take the data about widget and data about the input and send all to control */
function sendDataToController(){
    if (isEditMode()){ // interrogate the control
        editInputData(getData());
    }else{
        setInputData(getIdWidget(),getData());
    }
}
/* clear list of unsaved Note */
function clearListUnsavedNote(){
    $("#unsaved-notes ul").empty();
}
/* show save button */
function showSaveButton(){
    if(notSaved()) $("#note-save")[0].setAttribute("style", "display: inline;");
}
/* hide button */
function hideSaveButton(){
    $("#note-save")[0].setAttribute("style", "display: none;");
}
/* show input annotator credential */
function getAnnotatorCredential(){
    // set the modal form
    $('#name-prompt').modal({backdrop: 'static'});
    // set the event for the modal
    $('#name-save').click(function() {
        var myName = document.getElementById("name").value;
        var myEmail = document.getElementById("email").value;
        if (myName.length > 0 && myEmail.length > 0) {
            /* Show annotator name and ability to add notes */
            document.getElementById('mode').innerHTML = "<span class='glyphicon glyphicon-pencil'></span>&nbsp;&nbsp;Annotator Mode";
            document.getElementById("name-change").innerHTML = "Annotator: " + myName;
            document.getElementById("name-change").setAttribute("style", "display: inline;");
            document.getElementById("note-add").setAttribute("style", "display: inline;");
            showSaveButton();
            /* set user credential */
            setUserName(myName);
            setUserMail(myEmail);
            setUserMode("annotate");
            iMAnnotator();
            // create the event
            $('#name-change').click(function () {
                $('#name-prompt').modal();
                $('#name-save').click(function () {
                    myName = document.getElementById("name").value;
                    myEmail = document.getElementById("email").value;
                    if (myName.length < 1 || myEmail.length < 1) {
                        alert("ERROR", "Could not enter Annotator Mode.", "Please input required information");
                    } else {
                        document.getElementById("name-change").innerHTML = "Annotator: " + myFirstName + " " + myLastName;
                        setUserName(myName);
                        setUserMail(MyEmail);

                    }
                });
            });
        } else {
            alert("ERROR", "Could not enter Annotator Mode.", "Please input required information");
        }
    });
}
/* remove input annotator credential */
function removeAnnotatorCredential(){
    if(thereAreUnsavedNotes()) {
        // mostra una modale
        $('#save-prompt').modal({backdrop: 'static'});
        $('#cont-read').click(function() {
            selectReaderAttribute();
        });
    } else {
        selectReaderAttribute();
    }
}
/* select attribute for reader */
function selectReaderAttribute(){
    // remove all annotation
    document.getElementById('mode').innerHTML = "<span class='glyphicon glyphicon-search'></span>&nbsp;&nbsp;Reader Mode";
    document.getElementById("name-change").setAttribute("style", "display: none;");
    document.getElementById("note-add").setAttribute("style", "display: none;");
    document.getElementById("note-save").setAttribute("style", "display: none;");
    setUserMode("read");
    iMReader();
}
/* show the popover*/
function showPopover(id){
    var classes = $('#' + id ).attr('class').split(" ");
    for (var i = 0; i < classes.length; i++) {
        console.log(classes[i]);
        var matches = /^edit\-(.+)/.exec(classes[i]);
        if (matches != null) {
            $('#' +id).popover('show')
            // do it
            $('#' +id).popover({
                html:true
            });
        }
    }
}
/* hide the popover*/
function hidePopover(id){
    $('#' +id).popover('destroy');
}
/* set the data for a Istance type*/
function setEditDataIstance(theLabel,theResource){
    if (theLabel!==undefined && theLabel.length>0) $("#instance-choice").val(theLabel);
    if (theResource!==undefined && theResource.length>0) {
	if(idWidget=='hasAuthor') var e = (document.getElementById("author-list"));
	else if(idWidget=='hasPublisher') var e = (document.getElementById("publisher-list"));
	else if(idWidget=='denotesPerson') var e = (document.getElementById("person-list"));
	else /*(instance.noteType=='denotesPlace')*/ var e = (document.getElementById("place-list"));
	e.val(theResource);  
    }
}
/* set the data for a text Area type*/
function setEditDataTextArea(theLabel){
    if (theLabel!==undefined && theLabel.length>0) $("#long-ip").val(theLabel);
}
/* set the data for a Date type*/
function setEditDataTextDate(theLabel){
    if (theLabel!==undefined && theLabel.length>0) $("#date-ip").val(theLabel);
}
/* set the data for a short text type*/
function setEditDataTextShort(theLabel){
    if (theLabel!==undefined && theLabel.length>0) $("#short-ip").val(theLabel);
}
/*set Alert true falase */
function alertTrueFalse(head, title, message, functionNo,functionYes){
    (document.getElementById("alert-title-trueFlase")).innerHTML = head;
    (document.getElementById("alert-body-trueFlase")).innerHTML = "<strong>" + title + "</strong>" + " " + message;
    $("#alert-mod-true-false").modal();
    $('#alertTrueFlaseYes').click(function() {
        switch (functionYes) {
            case 'becameReaderSure':
                becameReaderSure();
                break;
            default:
                //nothing
        }
    })
    $('#alertTrueFlaseYes').click(function() {
        switch (functionNo) {
            default:
            //nothing
        }
    })
}

/* remove all Entire saved notes */
function removeSavedNoteList(id){
    $("#doc-notes ul").empty();
}
/* add and remove the style */
function removeSavedNoteFragDoc(id){
    $('#span-'+id).contents().unwrap();
}

// rikii
var listAuthorFragment = [];
var listAuthorEntire = [];
//<input onClick="AddRemoveClassAuthor()" id="filter-author" type="checkbox">
function AddRemoveClassFilterAuthor(id){
	// se checcato = true
	if ($('#'+id).is(':checked') && $("#who-author").val().length>0){
		// prendo il testo
		var mySearch=$("#who-author").val();
		// seleziono jquery di tutti gli elementi con data-author = "testo" -	// data-date = "testo"
		var myNodes=$("[data-author="+mySearch+"]");

		for (var i=0; i < myNodes.length; i++ ){
			if (isEntireType($(myNodes[i]).attr("data-type"))){ // little trasgression to MVC structure
				// li inizio a scorrere sposto gli entire in una lista 
				listAuthorEntire.push($(myNodes[i]).attr("id"));
			}else{
				//li inizio a scorrere sposto i fragment in una lista 
				listAuthorFragment.push($(myNodes[i]).attr("id"));		
			}
		}	

		if (listAuthorFragment.length==0) alert("INFO","There aren't fragment notes","that corrispond to these critirias");
		// prendo i fragment e assegno ai fragment e gli assegno un mio stile
		for (var i = 0; i < listAuthorFragment.length; i++ ){
			$("#"+listAuthorFragment[i]).addClass("filterAuthorStyle");	
		}
		// nascondo tutte saved annotation, ciclo le entire  e faccio al show di quelle che sono presenti nella mia lista
		// prendo i fragment e assegno ai fragment e gli assegno un mio stile
		if (listAuthorFragment.length==0) alert("INFO","There aren't entire notes","that corrispond to these critirias");
		$("#doc-notes li").hide();
		for (var i = 0; i < listAuthorEntire.length; i++ ){
			$("#"+listAuthorEntire[i]).show();	
		}
		// disebled text type
		$("#who-author").prop('disabled', true)
	}else{
		// disebled text type
		$("#who-author").prop('disabled', true)	
	}
	if (!$('#'+id).is(':checked')){
		// se checcato diveta false
		//	avro' le due list di fragment e entire
		// 	prendo i fragment e rimuovo lo stile, se non è filtrato -> test
		// prendo i fragment e assegno ai fragment e gli assegno un mio stile
		for (var i = 0; i < listAuthorFragment.length; i++ ){
			$("#"+listAuthorFragment[i]).removeClass("filterAuthorStyle");	
		}
		// faccio la show di tutte gli item di list presenti nella mia lista saved note
		$("#doc-notes li").hide();
		// pulisco tutte e due le liste
		listAuthorFragment = [];
		listAuthorEntire = [];
		// enabled text type
		$("#who-author").prop('disabled', false)

	}
}

var listDataFragment = [];
var listDataEntire = [];
//<input onClick="AddRemoveClassDate()" id="filter-date" type="checkbox">
function AddRemoveClassFilterDate(id){
	// se checcato = true
	if ($('#'+id).is(':checked') && $("#which-date").val().length>0){
		// prendo il testo
		var mySearch=$("#which-date").val();
		// seleziono jquery di tutti gli elementi con data-author = "testo" -	// data-date = "testo"
		var myNodes=$("[data-time="+mySearch.trim()+"]");

		for (var i=0; i < myNodes.length; i++ ){
			if (isEntireType($(myNodes[i]).attr("data-type"))){ // little trasgression to MVC structure
				// li inizio a scorrere sposto gli entire in una lista 
				listDataEntire.push($(myNodes[i]).attr("id"));
			}else{
				//li inizio a scorrere sposto i fragment in una lista 
				listDataFragment.push($(myNodes[i]).attr("id"));		
			}
		}
		if (listDataFragment.length==0) alert("INFO","There aren't fragment notes","that corrispond to these critirias");
		// prendo i fragment e assegno ai fragment e gli assegno un mio stile
		for (var i = 0; i < listDataFragment.length; i++ ){
			$("#"+listDataFragment[i]).addClass("filterDateStyle");	
		}
		// nascondo tutte saved annotation, ciclo le entire  e faccio al show di quelle che sono presenti nella mia lista
		// prendo i fragment e assegno ai fragment e gli assegno un mio stile
		if (listDataEntire.length==0) alert("INFO","There aren't entire notes","that corrispond to these critirias");
		$("#doc-notes li").hide();
		for (var i = 0; i < listDataEntire.length; i++ ){
			$("#"+listDataEntire[i]).show();	
		}
		// disabled the text type
		$("#which-date").prop('disabled', true)
	}else{
		// disebled text type
		$("#which-date").prop('disabled', true)	
	}
	if (!$('#'+id).is(':checked')){
		// se checcato diveta false
		//	avro' le due list di fragment e entire
		// 	prendo i fragment e rimuovo lo stile, se non è filtrato -> test
		// prendo i fragment e assegno ai fragment e gli assegno un mio stile
		for (var i = 0; i < listDataFragment.length; i++ ){
			$("#"+listDataFragment[i]).removeClass("filterDateStyle");	
		}
		// faccio la show di tutte gli item di list presenti nella mia lista saved note
		$("#doc-notes li").hide();
		// pulisco tutte e due le liste
		listDataFragment = [];
		listDataEntire = [];
		// enabled text type
		$("#which-date").prop('disabled', false)
	}
}


/*MODEL*/
var entireTypes = ["hasAuthor","hasPublisher","hasPublisherYear","hasTitle","hasAbstract","hasShortTitle","hasArticleComment"];
var unsavedNote = [];
var savedNote = [];

/* Main Function */
/* create a note*/
function createNote(myWidgetId, listItem, selection){
    var note = {};
    "the same for all annotation"
    note.noteType = myWidgetId;
    note.noteLabel= labelType[myWidgetId]; //description about the type;
    note.source = getArticleDisplayed(); //URI the article
    note.name = getUserName();
    note.email = getUserMail();
    note.time = getDateTime();
    note.id = uniqueId();
    switch (idWidget) {
        case 'hasAuthor':
        case 'hasPublisher':
            note.bodyLabel= listItem.label; //Description about the resourcer;
            note.bodyResource = listItem.url; //URI the resource;
            break;
        case 'hasTitle':
        case 'hasPublisherYear':
        case 'hasAbstract':
        case 'hasPublisherYear':
        case 'hasShortTitle':
        case 'hasArticleComment':
            note.bodyLabel= listItem.label;
            break;
        case 'hasCitation':
        case 'hasComment':
        case 'hasFormattingScore':
        case 'hasOriginalityScore':
        case 'hasClarityScore':
        case 'hasDbpedia':
        case 'hasSubject':
        case 'denotesDisease':
        case 'denotesPlace':
        case 'denotesPerson':
            note.bodyLabel= listItem.label; //Description about the resourcer;
            note.bodyResource = listItem.url; //URI the resource;
            note.node = selection.node;
            note.start = selection.start;
            note.end = selection.end;
            break;
    }
    return note;
}

/* structure */
/* addNote */
function addItemNote(myNote){
    unsavedNote.push(myNote);
}
/* getNote */
function getNote(id){
    for (var i = 0; i < unsavedNote.length; i++) {
        if (unsavedNote[i].id == id){
            return unsavedNote[i];
        }
    }
}
/* getAllNote */
function getAllNote(){
    return unsavedNote;
}
/* removeNote */
function removeNote(id){
    var i = 0;
    var booTest = false;
    for (i = 0; i < unsavedNote.length; i++) {
        if (unsavedNote[i].id == id){
            booTest = true;
            break;
        }
    }
    if (booTest) {
        unsavedNote.splice(i, 1);
    }
}
/* removeAllNote */
function removeAllNote(){
    unsavedNote = [];
}
/* getAllNote */
function getAllSavedNote(){
    return savedNote;
}
/* remove All saved Note */
function removeAllSavedNote(){
    savedNote = [];
}
/* addSavedNote */
function addSavedNote(mySavedNote){
    savedNote.push(mySavedNote);
}

function addNewSavedNotes(listSavedNote){
	for (key in listSavedNote){
		listSavedNote[key].id = uniqueId();
		listSavedNote[key].noteLabel = labelType[listSavedNote[key].noteType];
		/* if you want to add some data to the saved annotation put all here*/
		addSavedNote(listSavedNote[key]);
	}
}


/* ---------------------------- */
/* Auxiliar Function            */
/* returns true if there are unsaved notes, false otherwise */
function notSaved() {
    if(unsavedNote.length>0) return true;
    else return false;
}
/* test if the type of note     */
function isEntire(myNote){
    return (entireTypes.indexOf(myNote.noteType) !== -1);
}
function isEntireType(myType){
    return (entireTypes.indexOf(myType) !== -1);
}
/* return a unique id */
function uniqueId() {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return '_' + Math.random().toString(36).substr(2, 9);
}
var labelType = {};
labelType["hasAuthor"]="Author";
labelType["hasPublisher"]="Publisher";
labelType["hasPublisherYear"]="Publication Year";
labelType["hasTitle"]="Title";
labelType["hasAbstract"]="Abstract";
labelType["hasShortTitle"]="Short Title";
labelType["hasArticleComment"]="Comment";
labelType["denotesPerson"]="Associated with Person";
labelType["denotesPlace"]="Associated with Place";
labelType["denotesDisease"]="Associated with Disease";
labelType["hasSubject"]="Subject";
labelType["hasDbpedia"]="Related to";
labelType["hasClarityScore"]="Clarity Score";
labelType["hasOriginalityScore"]="Originality Score";
labelType["hasFormattingScore"]="Formatting Score";
labelType["hasCitation"]="Cites";
labelType["hasComment"]="Comment";


/** MOVE TO APPROPRIATE MVC SECTION */
/* Adds Dbpedia result labels to list for user to select in Dbpedia note modal */
function displayDbpediaResults(results){
    var rlist = document.getElementById("pedia-results"); //parent node
    for(var i=0; i<results.length; i++){ //iterate through search results
        var n = JSON.stringify(results[i]);
        var object = JSON.parse(n);

        var uri = object['uri'];
        var label = object['label'];

        var r = document.createElement("option"); //create child node
        r.setAttribute('value', uri);
        r.innerHTML = label;
        rlist.appendChild(r);
    }
}

/* Adds internal articles to citation selection list in cite note modal */
function addToCiteList(docURI, docLabel) {
    var dlist = document.getElementById("cite-doc-list");
    var d = document.createElement("option");
    d.setAttribute('value', docURI);
    if(docLabel.length > 80) docLabel = docLabel.slice(0,80);
    d.innerHTML = docLabel;
    dlist.appendChild(d);
}

/* had to mix view/control because ajax was being mean */
function disease_query(){
    $.ajax({
        method: 'GET',
        url: 'get_diseases',
        success: function(d) {
            var results = d.result;
            var qlist = document.getElementById("query-ip-disease");
            for(var i=0; i<results.length; i++) {
                var n = JSON.stringify(results[i]);
                var object = JSON.parse(n);

                var uri = results[i]['uri'];
                var disease = results[i]['disease'];

                var q = document.createElement("option");
                q.setAttribute('value', uri);
                if(disease.length > 80) disease = disease.slice(0,80);
                q.innerHTML = disease;
                qlist.appendChild(q);
            }
        },
        error: function(a,b,c) {
            alert('ERROR', 'Could not display results.', 'Please try again');
        }
    });

}

function subject_query(){
    $.ajax({
        method: 'GET',
        url: 'get_subjects',
        success: function(d) {
            var results = d.result;
            var qlist = document.getElementById("query-ip-sub");
            for(var i=0; i<results.length; i++) {
                var n = JSON.stringify(results[i]);
                var object = JSON.parse(n);

                var uri = results[i]['uri'];
                var subject = results[i]['subject'];

                var q = document.createElement("option");
                q.setAttribute('value', uri);
                if(subject.length > 80) subject = subject.slice(0,80);
                q.innerHTML = subject;
                qlist.appendChild(q);
            }
        },
        error: function(a,b,c) {
            alert('ERROR', 'Could not display results.', 'Please try again');
        }
    });
}

/* Clear dbpedia modal search results */
function clearPedia(){
    var myNode = document.getElementById("pedia-results");
    while (myNode.lastChild) {
        myNode.removeChild(myNode.lastChild);
    }
}

function set_people(){
    $.ajax({
        method: 'GET',
        url: 'people.json',
        success: function(d) {
	    var a = document.getElementById("author-list");
	    var p = document.getElementById("person-list");
            for (var i = 0; i < d.length; i++) {
                 var n = d[i]['name'];
		 var e = d[i]['email'];
		 var child = document.createElement("option");
		 child.setAttribute("value", e);
		 child.innerHTML = n;
		 var child2 = document.createElement("option");
		 child2.setAttribute("value", e);
		 child2.innerHTML = n;
		 a.appendChild(child);
		 p.appendChild(child2);
             }
        },
        error: function(a,b,c) {
            /* EH */
        }
    });
}

function set_places(){
    $.ajax({
        method: 'GET',
        url: 'places.json',
        success: function(d) {
	    var parent = document.getElementById("place-list");
            for (var i = 0; i < d.length; i++) {
                 var n = d[i]['place'];
		 var l = n + ': ' + d[i]['location'];
		 if(l.length>70) l = l.slice(0,70) + "...";
		 var child = document.createElement("option");
		 child.setAttribute("value", n);
		 child.innerHTML = l;
		 parent.appendChild(child);
             }
        },
        error: function(a,b,c) {
            /* EH */
        }
    });
}

function set_publishers(){
    $.ajax({
        method: 'GET',
        url: 'publishers.json',
        success: function(d) {
	    var parent = document.getElementById("publisher-list");
            for (var i = 0; i < d.length; i++) {
                 var n = d[i]['publisher'];
		 var child = document.createElement("option");
		 child.setAttribute("value", n);
		 child.innerHTML = n;
		 parent.appendChild(child);
             }
        },
        error: function(a,b,c) {
            /* EH */
        }
    });
}
//function send_publishers(publishers) {
//    $.ajax({
//        method: 'GET',
//        url: 'set_publishers',
//        data: publishers,
//        success: function(d) {
//            console.log("Publishers: "+d.result); /*TESTCOMMENT*/
//        },
//        error: function(a,b,c) {
//            /* EH */
//        }
//    });
//}
