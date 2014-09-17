/** Progetto AnnOtaria
     Tecnologie Web 2014
     Riccardo Candido e April Tran
 **/

/*CONTROL*/
var docOpen = false;
/* Main Function */
$(document).ready(main);

/* function that laod the document*/
function load(docURI,docJSON,label){

    alert("Attention","Are you sure to change the file?", "you lost all annotation");
    removeArticle();
    removeAllNote();

    dataLoaded = 0;
    /* Load document */
    $.ajax({
        method: 'GET',
        url: docURI,
        success: function(d) {
            dataLoaded++;
            showArticle(d,label);
            docOpen = true;
            /* Either doc will load first or notes will load first */
            if(dataLoaded == 2) showSavedNotes(d);
        },
        error: function(a,b,c) {
            alert("ERROR","Could not display article", label);
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
            alert("ERROR","Could not display article", label);
            $("#alert-mod").modal();
            dataLoaded++;
            if(dataLoaded == 2) showSavedNotes(d);
        }
    });

}

/* function that add a annotation */
function addNote(){
    chooseWidget();
}

/* function that save a annotation */
function save(){

}

/* function that edit a annotation */
function edit(){

}

/* function that remove a annotation */
function remove(){

}

function isDocOpen(){
    return docOpen;
}

//-------------------------------
/* Auxiliar Function */

/* load something */
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
            for (var i = 0; i < d.length; i++) {
                loadTitle(d[i]);
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
    for (var i=0; i< d.length; i++) { // cycling the notes
        if (isEntire(d[i])){ // invoke a method about model
            addSavedNoteEntire(d[i]);// insert the note in html dom or in view for entire note
        }else{
            addSavedNoteFragment(d[i]);// insert the note in html dom or in view for entire note
        }
    }
}

/* VIEW */
var mode = "read";
/* Main Function */
    /* add and remove the annotation */
    function addSavedNoteFragment(viewNote){
        var r = document.createRange();
        var node = $("#" + viewNote.node)[0].childNodes[viewNote.pos];
        // sometimes make a error
        r.setStart(node, viewNote.start);
        r.setEnd(node, viewNote.end);
        var span = document.createElement("span");
        // set attributite for the visualization
        span.setAttribute("id", viewNote.id);
        span.setAttribute("class", "imspan " + viewNote.type + (booShow ? " edit-" + viewNote.type : ""));
        span.setAttribute("onmouseover", "showPopover(this.id)");
        span.setAttribute("onmouseout", "hidePopover(this.id)");
        // set the event for the popover
        span.setAttribute("data-toggle", "popover");
        span.setAttribute("data-placement", "right");
        span.setAttribute("data-content", "Label: " + viewNote.bodyLabel + "\n" + viewNote.email + " " + viewNote.label + " " + viewNote.name + " " + viewNote.time );
        r.surroundContents(span);
    }

    function addSavedNoteEntire(viewNote){
        $("#doc-notes ul").append("<li class='list-group-item no-border" + viewNote.type + "'><strong>" + viewNote.label + "</strong><br>" + viewNote.value + "<br><span class='small'>" + viewNote.name + " - " + viewNote.email + "</span></li>");
    }

    function addUnsavedNoteFragment(viewNote){
        // view this in edit


    }

    function addUnsavedNoteEntire(viewNote){


    }

    function removeUnsaveNoteEntire(){}

    function removeUnsavedNoteFragment(){}

    /* add and remove the style */
    function removeUnsavedNoteFragment(id){}


function chooseWidget(note){
    if (note == undefined){
        //show a modal where there are the button about the type
        if (getHTMLOfSelection() == '') {
            $("#add-note-entire").modal({backdrop: 'static'});
        } else {
            $("#add-note-frag").modal({backdrop: 'static'});
        }

        // return a type about the widget
    }
    switch (note.type){
        //invoco il widget corrispondente

    }
    //invoco il widget()
}

function openWidget(id){
    var title, body, create, ip;
    /* Displays input widget */
    /********************* AJAX QUERY TO DISPLAY INSTANCES *************/
    switch (id) {
        case 'note-author':
            (document.getElementById("instance-title")).innerHTML = "Add Author";
            (document.getElementById("instance-list-body")).innerHTML = 'Select an author from the following list:';
            (document.getElementById("instance-choice-body")).innerHTML = "Or add an unlisted author:";
            (document.getElementById("instance-btn")).setAttribute("class", "btn btn-info");
            /************************ AJAX QUERY TO FILL LIST *******/
            $("#create-instance").modal({backdrop: 'static'});
            break;
        case 'note-pub':
            (document.getElementById("instance-title")).innerHTML = "Add Publisher";
            (document.getElementById("instance-list-body")).innerHTML = 'Select a publisher from the following list:';
            (document.getElementById("instance-choice-body")).innerHTML = "Or add an unlisted publisher:";
            (document.getElementById("instance-btn")).setAttribute("class", "btn btn-info");
            /************************ AJAX QUERY TO FILL LIST *******/
            $("#create-instance").modal({backdrop: 'static'});
            break;
        case 'note-year':
            (document.getElementById("date-title")).innerHTML = "Add Publication Year";
            (document.getElementById("date-body")).innerHTML = "Publication Year:";
            (document.getElementById("date-btn")).setAttribute("class", "btn btn-info");
            $("#create-date").modal({backdrop: 'static'});
            break;
        case 'note-title':
            (document.getElementById("long-title")).innerHTML = "Add Title";
            (document.getElementById("long-body")).innerHTML = "Title:";
            (document.getElementById("long-btn")).setAttribute("class", "btn btn-info");
            $("#create-long").modal({backdrop: 'static'});
            break;
        case 'note-abstract':
            (document.getElementById("long-title")).innerHTML = "Add Abstract";
            (document.getElementById("long-body")).innerHTML = "Abstract:";
            (document.getElementById("long-btn")).setAttribute("class", "btn btn-info");
            $("#create-long").modal({backdrop: 'static'});
            break;
        case 'note-s-title':
            (document.getElementById("short-title-mod")).innerHTML = "Add Short Title";
            (document.getElementById("short-body")).innerHTML = "Title:";
            (document.getElementById("short-btn")).setAttribute("class", "btn btn-info");
            $("#create-short").modal({backdrop: 'static'});
            break;
        case 'note-comment':
            (document.getElementById("long-title")).innerHTML = "Add Comment";
            (document.getElementById("long-body")).innerHTML = "Comment:";
            (document.getElementById("long-btn")).setAttribute("class", "btn btn-info");
            $("#create-long").modal({backdrop: 'static'});
            break;
        case 'note-person':
            (document.getElementById("instance-title")).innerHTML = "Denote Person";
            (document.getElementById("instance-list-body")).innerHTML = 'Select a person from the following list:';
            (document.getElementById("instance-choice-body")).innerHTML = "Or add an unlisted person:";
            (document.getElementById("instance-btn")).setAttribute("class", "btn btn-primary");
            /************************ AJAX QUERY TO FILL LIST *******/
            $("#create-instance").modal({backdrop: 'static'});
            break;
        case 'note-place':
            (document.getElementById("instance-title")).innerHTML = "Denote Place";
            (document.getElementById("instance-list-body")).innerHTML = 'Select a place from the following list:';
            (document.getElementById("instance-choice-body")).innerHTML = "Or add an unlisted place:";
            (document.getElementById("instance-btn")).setAttribute("class", "btn btn-primary");
            /************************ AJAX QUERY TO FILL LIST *******/
            $("#create-instance").modal({backdrop: 'static'});
            break;
        case 'note-disease':
            (document.getElementById("instance-title")).innerHTML = "Denote Disease";
            (document.getElementById("instance-list-body")).innerHTML = "Select disease from the International Classification of Diseases:";
            (document.getElementById("instance-choice-body")).innerHTML = "Or denote an unlisted disease:";
            (document.getElementById("instance-btn")).setAttribute("class", "btn btn-primary");
            /************************ AJAX QUERY TO FILL LIST *******/
            $("#create-instance").modal({backdrop: 'static'});
            break;
        case 'note-subject':
            (document.getElementById("instance-title")).innerHTML = "Add Subject";
            (document.getElementById("instance-list-body")).innerHTML = 'Select a subject from the following list:';
            (document.getElementById("instance-choice-body")).innerHTML = "Or add an unlisted subject:";
            (document.getElementById("instance-btn")).setAttribute("class", "btn btn-primary");
            /************************ AJAX QUERY TO FILL LIST *******/
            $("#create-instance").modal({backdrop: 'static'});
            break;
        case 'note-dbpedia':
            $("#create-pedia").modal({backdrop: 'static'});
            break;
        case 'note-clarity':
            (document.getElementById("choice-title")).innerHTML = "Add Clarity Score";
            (document.getElementById("choice-body")).innerHTML = "Score:";
            (document.getElementById("choice-btn")).setAttribute("class", "btn btn-warning");
            $("#create-choice").modal({backdrop: 'static'});
            break;
        case 'note-originality':
            (document.getElementById("choice-title")).innerHTML = "Add Originality Score";
            (document.getElementById("choice-body")).innerHTML = "Score:";
            (document.getElementById("choice-btn")).setAttribute("class", "btn btn-warning");
            $("#create-choice").modal({backdrop: 'static'});
            break;
        case 'note-format':
            (document.getElementById("choice-title")).innerHTML = "Add Formatting Score";
            (document.getElementById("choice-body")).innerHTML = "Score:";
            (document.getElementById("choice-btn")).setAttribute("class", "btn btn-warning");
            $("#create-choice").modal({backdrop: 'static'});
            break;
        case 'note-cite':
            $("#create-cite").modal({backdrop: 'static'});
            break;
        case 'note-cite-comm':
            (document.getElementById("long-title")).innerHTML = "Add Comment";
            (document.getElementById("long-body")).innerHTML = "Comment:";
            (document.getElementById("long-btn")).setAttribute("class", "btn btn-danger");
            $("#create-long").modal({backdrop: 'static'});
            break;
    }
    console.log("ti spacco il culo coglione");
}


//-------------------------

/* Auxiliar Function */

/* switch function for the mode*/
function modeSwitch() {
    /* Switch between reader and annotator modes */
    var modeDisplay = document.getElementById('mode');
    modeDisplay.innerHTML = 'Reader Mode';
    var annotator = document.getElementById("name-change");
    var noteAdd = document.getElementById("note-add");
    var noteSave = document.getElementById("note-save");

    /* Switching to annotator mode requires input of annotator's name */
    $('#annotator-mode').click(function() {
        if(mode=='read') {
            /* Get annotator name */
            $('#name-prompt').modal({backdrop: 'static'});
            $('#name-save').click(function() {
            myName = document.getElementById("name").value;
            myEmail = document.getElementById("email").value;

            if(1) { /************ MAKE NAME AND EMAIL REQUIRED *******/
                mode='annotate';
                modeDisplay.innerHTML = 'Annotator Mode';
                annotator.innerHTML = "Annotator: " + myName;
                /* Show annotator name and ability to add notes */
                annotator.setAttribute("style", "display: inline;");
                noteAdd.setAttribute("style", "display: inline;");

                $('#name-change').click(function() {
                    $('#name-prompt').modal();
                    $('#name-save').click(function() {
                        myName = document.getElementById("name").value;
                        myEmail = document.getElementById("email").value;
                        if(myName.length<1 || myEmail.length<1) {
                            (document.getElementById("alert-title")).innerHTML = "ERROR";
                            (document.getElementById("alert-body")).innerHTML = "<strong>Could not enter Annotator Mode.</strong> Please input required information.";
                            $("#alert-mod").modal();
                        } else annotator.innerHTML = "Annotator: " + myFirstName + " " + myLastName;
                    });
                });
            } else {
                (document.getElementById("alert-title")).innerHTML = "ERROR";
                (document.getElementById("alert-body")).innerHTML = "<strong>Could not enter Annotator Mode.</strong> Please input required information.";
                $("#alert-mod").modal();
            }

            });
        }
    });

    /* Save warning when switching to Reader Mode with unsaved annotations */
    $('#reader-mode').click(function() {
        if(mode=='annotate') {
            if(!saved) {
                $('#save-prompt').modal({backdrop: 'static'});
                $('#cont-read').click(function() {
                    saved = 1;
                    mode = 'read';
                    modeDisplay.innerHTML = 'Reader Mode';
                    /* Remove annotator mode details */
                    annotator.setAttribute("style", "display: none;");
                    noteAdd.setAttribute("style", "display: none;");
                    noteSave.setAttribute("style", "display: none;");
                });
            } else {
                mode = 'read';
                modeDisplay.innerHTML = 'Reader Mode';
                annotator.setAttribute("style", "display: none;");
                noteAdd.setAttribute("style", "display: none;");
                noteSave.setAttribute("style", "display: none;");
            }
        }
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
}
/* show a alert modal view*/
function alert(head,title, message) {
    (document.getElementById("alert-title")).innerHTML = head;
    (document.getElementById("alert-body")).innerHTML = "<strong>" + title + "</strong>" + message + ".";
    $("#alert-mod").modal();
}
/* Remove the page */
function removeArticle(){
    /* clear the page */
}
/* set the add button */
function setAddButton() {
    $("#note-add").click(function () {
        if (isDocOpen == true) {
            addNote();
        } else {
            alert("ERROR","Could not add annotation:", "Please select an article in order to make annotations.");
        }
    });
}
/* take the selection */
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
/* Save notes */
function setSaveButton() {
    $("#note-save").click(function() {
        save(); // Invoke a function of control
    });
}



/*MODEL*/
var entireTypes = ["hasAuthor","hasPublisher","hasPublisherYear","hasTitle","hasAbstract","hasShortTitle","hasArticleComment"];
var unsavedNote = [];
/* Main Function */
/* create a note*/
function createNote(listItem){
    var note = {};
    /**/
    return note;
}
/* addNote */
function addItemNote(myNote){
    unsavedNote.push(myNote);
}
/* getNote */
function getNote(id){

}
/* getAllNote */
function getAllNote(){
    return unsavedNote;
}
/* removeNote */
function removeNote(id){
    var i = 0;
    var booTest = false;
    for (i = 0; i < unsavedNotes.length; i++) {
        if (unsavedNotes[i].id == id){
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
/* Auxiliar Function */
function isEntire(myNote){
    return (entireTypes.indexOf(myNote.type) !== -1);
}