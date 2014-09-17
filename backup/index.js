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
/* function that laod the document*/
function load(docURI,docJSON,label){
    removeArticle();
    removeAllNote();
    setLabel(label);
    dataLoaded = 0;
    /* Load document */
    $.ajax({
        method: 'GET',
        url: docURI,
        success: function(d) {
            dataLoaded++;
            if(showArticle(d,label)){
                setArticleDisplayed(docURI);
            }
            /* Either doc will load first or notes will load first */
            if(dataLoaded == 2) showSavedNotes(d);
        },
        error: function(a,b,c) {
            alert("ERROR","Could not display article: ", label);
        }
    });
    /* Load existing notes */
    $.ajax({
        method: 'GET',
        url: "docs/"+docJSON,
        success: function(d) {
            dataLoaded++;
            if (dataLoaded == 2) showSavedNotes(d);
        },
        error: function(a,b,c) {
            alert("ERROR","Could not download notes for: ", label);
        }
    });
}
/* function that save a annotation */
function save(){
    if (getAllNote().length>0){
        var allAnnotation = {};
        allAnnotation.data =JSON.stringify(getAllNote());
        console.log("Sent: " + allAnnotation.data); /*******/
        $.ajax({
        method: 'GET', /* originally POST method */
        url: "/save_notes",
        data: allAnnotation,
        success: function(d) {
            console.log("Result: " + d.result);
            /* Notify user, remove save button */
            alert("SUCCESS","Annotations saved","");
            removeAllNote(); // to data structure
            // clear the edit tab
            clearListUnsavedNote();
            // hide save button
            hideSaveButton();
            // RELOAD of the document
            load(getArticleDisplayed(),getDocJSON(), getLabel());
        },
        error: function(a,b,c) {
            /* Display error mod */
            alert("ERROR","Your annotations could not be saved","");
        }
    });
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
        // take the note
        var viewNote = getNote(newNote.id);
        // show the note
        if (isEntire(viewNote)) {
            addUnsavedNoteEntire(viewNote);
        }else{
            addUnsavedNoteFragment(viewNote);
        }
        console.log("Added: " + JSON.stringify(newNote));
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
        // invoco il widget
        openWidget(editNote.noteType);
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
function remove(id, itemListId){
    var myNote = getNote(id); // take the note
    var booEntire= isEntire(myNote);
    removeNote(id); // remove in the model
    removeUnsavedNoteList(itemListId); // remove the itemi in the list edit
    if (!booEntire) removeUnsavedNoteFragDoc(id); // if a fragment note remove this on the html document
}
/* ---------------------------- */
/* Auxiliar Function            */
/* load something               */
function main() {
    // the first thing is create the list of files
    getListFiles() // control
    modeSwitch(); // view
    setFilter(); // view
    setAddButton(); // view
    setSaveButton(); // view

}
/* Get list Files */
function getListFiles(){
    $.ajax({
        /* Get files */
        method: 'GET',
        url: 'filelist.json',
        success: function (d) {
            json = JSON.parse(d); // json -> javascript array
            for (var i = 0; i < json.length; i++) {
                loadTitle(json[i]);
            }
        },
        error: function (a, b, c) {
            alert('No documents available');
        }
    });
}
/* show saved Notes */
function showSavedNotes(d){
    // remove list entire note
    for (var i=0; i< json.length; i++) { // cycling the notes
        if (isEntire(json[i])){ // invoke a method about model
            addSavedNoteEntire(json[i]);// insert the note in html dom or in view for entire note
        }else{
            addSavedNoteFragment(json[i]);// insert the note in html dom or in view for entire note
        }
    }
}
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
            removeAnnotatorCredential(); /* this function set the variables userName userMail */
        }
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
/* add saved notes fragment  */
function addSavedNoteFragment(viewNote){
    var r = document.createRange();
    var node = $("#" + viewNote.node)[0].childNodes[viewNote.pos];
    // sometimes make a error
    r.setStart(node, viewNote.start);
    r.setEnd(node, viewNote.end);
    var span = document.createElement("span");
    // set attributite for the visualization
    span.setAttribute("id", 'span-' + viewNote.id);
    // if there is a filter checked i put the style in the type
    span.setAttribute("class", "imspan " + viewNote.noteType + ($('#filter-' + viewNote.noteType)[0].checked ? " edit-" + viewNote.noteType : ""));
    span.setAttribute("onmouseover", "showPopover(this.id)");
    span.setAttribute("onmouseout", "hidePopover(this.id)");
    // set the event for the popover
    span.setAttribute("data-toggle", "popover");
    span.setAttribute("data-placement", "right");
    span.setAttribute("data-content", "Label: " + viewNote.bodyLabel + "\n" + viewNote.email + " " + viewNote.noteLabel + " " + viewNote.name + " " + viewNote.time );
    r.surroundContents(span);
}
/* add saved notes entire */
function addSavedNoteEntire(viewNote){
    $("#doc-notes ul").append("<li class='list-group-item no-border" + viewNote.type + "'><strong>" + viewNote.label + "</strong><br>" + viewNote.value + "<br><span class='small'>" + viewNote.name + " - " + viewNote.email + "</span></li>");
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
    $("#li-" + id).closest('li').remove();
}
/* add and remove the style */
function removeUnsavedNoteFragDoc(id){


}
/* show the form, after you can choose the type of annotation  */
function chooseWidget(note){
    /* call open widget */
    if (note == undefined) {
        //show a modal where there are the button about the type
        if (getHTMLOfSelection() == '') {
            setDataSelection(undefined); // take the selection and set the selection
            $("#add-note-entire").modal({backdrop: 'static'});
        } else {
            setDataSelection(selection()); // take the selection and set the selection
            $("#add-note-frag").modal({backdrop: 'static'});
        }
    }else{
        openWidget(note.type);
    }
}
/* open the widget */
function openWidget(idWidget, myLabel){
    /* Displays input widget */
    /********************* AJAX QUERY TO DISPLAY INSTANCES *************/
    console.log(myLabel);
    switch (idWidget)   {
        case 'hasAuthor':
            (document.getElementById("instance-title")).innerHTML = "Add Author";
            (document.getElementById("instance-list-body")).innerHTML = 'Select an author from the following list:';
            (document.getElementById("instance-choice-body")).innerHTML = "Or add an unlisted author:";
            (document.getElementById("instance-btn")).setAttribute("class", "btn btn-info");
            /************************ AJAX QUERY TO FILL LIST *******/
            $("#create-instance").modal({backdrop: 'static'});
            if (myLabel!==undefined){

            }
            break;
        case 'hasPublisher':
            (document.getElementById("instance-title")).innerHTML = "Add Publisher";
            (document.getElementById("instance-list-body")).innerHTML = 'Select a publisher from the following list:';
            (document.getElementById("instance-choice-body")).innerHTML = "Or add an unlisted publisher:";
            (document.getElementById("instance-btn")).setAttribute("class", "btn btn-info");
            /************************ AJAX QUERY TO FILL LIST *******/
            $("#create-instance").modal({backdrop: 'static'});
            break;
        case 'hasPublisherYear':
            (document.getElementById("date-title")).innerHTML = "Add Publication Year";
            (document.getElementById("date-body")).innerHTML = "Publication Year:";
            (document.getElementById("date-btn")).setAttribute("class", "btn btn-info");
            $("#create-date").modal({backdrop: 'static'});
            break;
        case 'hasTitle':
            (document.getElementById("long-title")).innerHTML = "Add Title";
            (document.getElementById("long-body")).innerHTML = "Title:";
            (document.getElementById("long-btn")).setAttribute("class", "btn btn-info");
            $("#create-long").modal({backdrop: 'static'});
            break;
        case 'hasAbstract':
            (document.getElementById("long-title")).innerHTML = "Add Abstract";
            (document.getElementById("long-body")).innerHTML = "Abstract:";
            (document.getElementById("long-btn")).setAttribute("class", "btn btn-info");
            $("#create-long").modal({backdrop: 'static'});
            break;
        case 'hasShortTitle':
            (document.getElementById("short-title-mod")).innerHTML = "Add Short Title";
            (document.getElementById("short-body")).innerHTML = "Title:";
            (document.getElementById("short-btn")).setAttribute("class", "btn btn-info");
            $("#create-short").modal({backdrop: 'static'});
            break;
        case 'hasArticleComment':
            (document.getElementById("long-title")).innerHTML = "Add Comment";
            (document.getElementById("long-body")).innerHTML = "Comment:";
            (document.getElementById("long-btn")).setAttribute("class", "btn btn-info");
            $("#create-long").modal({backdrop: 'static'});
            break;
        case 'denotesPerson':
            (document.getElementById("instance-title")).innerHTML = "Denote Person";
            (document.getElementById("instance-list-body")).innerHTML = 'Select a person from the following list:';
            (document.getElementById("instance-choice-body")).innerHTML = "Or add an unlisted person:";
            (document.getElementById("instance-btn")).setAttribute("class", "btn btn-primary");
            /************************ AJAX QUERY TO FILL LIST *******/
            $("#create-instance").modal({backdrop: 'static'});
            break;
        case 'denotesPlace':
            (document.getElementById("instance-title")).innerHTML = "Denote Place";
            (document.getElementById("instance-list-body")).innerHTML = 'Select a place from the following list:';
            (document.getElementById("instance-choice-body")).innerHTML = "Or add an unlisted place:";
            (document.getElementById("instance-btn")).setAttribute("class", "btn btn-primary");
            /************************ AJAX QUERY TO FILL LIST *******/
            $("#create-instance").modal({backdrop: 'static'});
            break;
        case 'denotesDisease':
            (document.getElementById("instance-title")).innerHTML = "Denote Disease";
            (document.getElementById("instance-list-body")).innerHTML = "Select disease from the International Classification of Diseases:";
            (document.getElementById("instance-choice-body")).innerHTML = "Or denote an unlisted disease:";
            (document.getElementById("instance-btn")).setAttribute("class", "btn btn-primary");
            /************************ AJAX QUERY TO FILL LIST *******/
            $("#create-instance").modal({backdrop: 'static'});
            break;
        case 'hasSubject':
            (document.getElementById("instance-title")).innerHTML = "Add Subject";
            (document.getElementById("instance-list-body")).innerHTML = 'Select a subject from the following list:';
            (document.getElementById("instance-choice-body")).innerHTML = "Or add an unlisted subject:";
            (document.getElementById("instance-btn")).setAttribute("class", "btn btn-primary");
            /************************ AJAX QUERY TO FILL LIST *******/
            $("#create-instance").modal({backdrop: 'static'});
            break;
        case 'hasDbpedia':
            $("#create-pedia").modal({backdrop: 'static'});
            break;
        case 'hasClarityScore':
            (document.getElementById("choice-title")).innerHTML = "Add Clarity Score";
            (document.getElementById("choice-body")).innerHTML = "Score:";
            (document.getElementById("choice-btn")).setAttribute("class", "btn btn-warning");
            $("#create-choice").modal({backdrop: 'static'});
            break;
        case 'hasOriginalityScore':
            (document.getElementById("choice-title")).innerHTML = "Add Originality Score";
            (document.getElementById("choice-body")).innerHTML = "Score:";
            (document.getElementById("choice-btn")).setAttribute("class", "btn btn-warning");
            $("#create-choice").modal({backdrop: 'static'});
            break;
        case 'hasFormattingScore':
            (document.getElementById("choice-title")).innerHTML = "Add Formatting Score";
            (document.getElementById("choice-body")).innerHTML = "Score:";
            (document.getElementById("choice-btn")).setAttribute("class", "btn btn-warning");
            $("#create-choice").modal({backdrop: 'static'});
            break;
        case 'hasCitation':
            $("#create-cite").modal({backdrop: 'static'});
            break;
        case 'hasComment':
            (document.getElementById("long-title")).innerHTML = "Add Comment";
            (document.getElementById("long-body")).innerHTML = "Comment:";
            (document.getElementById("long-btn")).setAttribute("class", "btn btn-danger");
            $("#create-long").modal({backdrop: 'static'});
            break;
    }
    setIdWidget(idWidget);
    setListener(); /* invoke setData() and send the dat to the controller */
}
/* set the listener for the widgets*/
function setListener(){

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
    })

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
    })

    /* INPUT DATE */
    $("#date-btn").off("click");
    $("#date-btn").click(function() {
        var date = (document.getElementById("date-ip")).value;
        if(date<0 || date>2014 || !checkNotBlank(date)) {
            alert("ERROR","Annotation creation failed!","Please input a valid publication year.");
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
    })

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
    })

    /* INPUT ISTANCE */
    $("#instance-btn").off("click");
    $("#instance-btn").click(function() {
        var e = (document.getElementById("instance-list"));
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
        $("#instance-list").val("null-select");
        $("#instance-choice").val("");
    })
    $("#instance-cancel").click(function() {
        $("#instance-list").val("null-select");
        $("#instance-choice").val("");
    })

    /* INPUT DBPEDIA */
    $("#pedia-search-btn").click(function() {
        /******************** GET MY ARTICLES ********/
        var toSearch = (document.getElementById("pedia-search")).value;
    })
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
        $("#pedia-search").val("");
        $("#pedia-results").val("");
    })
    $("#pedia-cancel").click(function() {
        $("#pedia-search").val("");
        $("#pedia-results").val("");
    })

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
    })
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
};
/* create the link for to load the article */
function loadTitle(doc){
    $('#list').append("<li><a href='#' onclick='load(\"docs/" + doc.url + "\",\"" + doc.notes + "\",\"" + doc.label + "\")'>" + doc.label + "</a></li>");
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
            alert("ERROR","Could not add annotation:", "Please select an article in order to make annotations.");
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
        if(compatibleExtremes(textSelection)) { /* Check overlapping */
            dad.childNodes.indexOf = function(n) {
                var i=-1;
                while (this.item(i) !== n)
                    i++;
                return i;
            };
            var pos = dad.childNodes.indexOf(textSelection.anchorNode);
        }
        mySelection.node = dad.id;
        mySelection.pos = pos;
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
        alert("ERROR","Annotation creation failed","Please input required information");
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
    var strEditButton = "<span style='cursor: pointer;' onclick='edit(\"" + viewNote.id + "\",\"" + myId + "\")' class=\"input-group-addon\"><span class=\"glyphicon glyphicon-edit\"></span></span>";
    var strRemoveButton = "<span style='cursor: pointer;' onclick='remove(\"" + viewNote.id + "\",\"" + myId + "\")' class=\"input-group-addon\"><span class=\"glyphicon glyphicon-remove\"></span></span>";
    $("#unsaved-notes ul").prepend("<li id='" + myId + "' class='list-group-item no-border'><strong>" + viewNote.noteLabel + "</strong><br>" + viewNote.bodyLabel + "<br><span class='small'>" + formattingTime(viewNote.time) + "&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;" + myTypeNote  + "</span>"+strEditButton+strRemoveButton+"</li>");
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
    $("#note-save")[0].setAttribute("style", "display: inline;");
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
        if (1) {
            /************ MAKE NAME AND EMAIL REQUIRED *******/
            /* Show annotator name and ability to add notes */
            document.getElementById('mode').innerHTML = "<span class='glyphicon glyphicon-pencil'></span>&nbsp;&nbsp;Annotator Mode";
            document.getElementById("name-change").innerHTML = "Annotator: " + myName;
            document.getElementById("name-change").setAttribute("style", "display: inline;");
            document.getElementById("note-add").setAttribute("style", "display: inline;");
            document.getElementById("note-save").setAttribute("style", "display: inline;");
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
                        alert("ERROR", "Could not enter Annotator Mode", "Please input required information.");
                    } else {
                        document.getElementById("name-change").innerHTML = "Annotator: " + myFirstName + " " + myLastName;
                        setUserName(myName);
                        setUserMail(MyEmail);

                    }
                });
            });
        } else {
            alert("ERROR", "Could not enter Annotator Mode", "Please input required information");
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
        //console.log(classes[i]);
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



/*MODEL*/
var entireTypes = ["hasAuthor","hasPublisher","hasPublisherYear","hasTitle","hasAbstract","hasShortTitle","hasArticleComment"];
var unsavedNote = [];

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
        case 'hasPublisherYear':
        case 'hasPublisher':
            note.bodyLabel= listItem.label; //Description about the resourcer;
            note.bodyResource = listItem.url; //URI the resource;
            break;
        case 'hasTitle':
        case 'hasAbstract':
        case 'hasShortTitle':
        case 'hasArticleComment':
            note.bodyLabel= listItem.label;
            break;
        case 'hasCitation':
        case 'hasComment':
        case 'hasFormattingScore':
        case 'hasOriginalityScore':
        case'hasClarityScore':
        case 'hasDbpedia':
        case 'hasSubject':
        case 'denotesDisease':
        case 'denotesPlace':
        case 'denotesPerson':
            note.bodyLabel= listItem.label; //Description about the resourcer;
            note.bodyResource = listItem.url; //URI the resource;
            note.node = selection.node;
            note.pos = selection.pos;
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
/* ---------------------------- */
/* Auxiliar Function            */
/* test if the type of note     */
function isEntire(myNote){
    return (entireTypes.indexOf(myNote.noteType) !== -1);
}
/* return a unique id */
function uniqueId() {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return '_' + Math.random().toString(36).substr(2, 9);
};
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
