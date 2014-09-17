/** Progetto AnnOtaria
     Tecnologie Web 2014
     Riccardo Candido e April Tran **/

/* Filter variables */
var FragQualityListItem = false;
var entireTypes = ["hasAuthor","hasPublisher","hasPublisherYear","hasTitle","hasAbstract","hasShortTitle","hasComment"];


/* Mode switching variables */
var mode = 'read';
var myName = '';
var myEmail = '';

/* Load document variables */
var docOpen = 0;
var docIRI;
var savedNotes = {};
var dataLoaded = 0;

/* Create annotation variables */
var mySelection = '';
var currNote = {};
var unsavedNotes = {};
var saved = 1;

$(document).ready(main);

/* Ready app functions */
/* Get file list, ready mode switching, set default filter */
function main() { 
    /* file list */
    $.ajax({
        /* Get files */
        method: 'GET',
        url: 'filelist.json',
        success:function(d) {
        var json = JSON.parse(d);
            for (var i=0; i<json.length; i++) {
                var citeLabel = json[i].label;
                if(citeLabel.length>80) citeLabel = citeLabel.substring(0,80) + '...';
                $('#cite-doc-list').append('<option value = "' + json[i].url + '">' + citeLabel + '</option>');
                $('#list').append("<li><a href='#' onclick='load(\"docs/"+json[i].url+"\",\""+json[i].notes+"\",\""+json[i].label+"\")'>"+json[i].label+"</a></li>");
            }
        },
        error: function(a,b,c) {
            alert('No documents available');
        }
    });
    modeSwitch();
    setFilter();
}

/* Load doc and notes */
function load(docURI,docJSON,label) {
    dataLoaded = 0;
    docIRI = docURI;
    /* Get JSON filename to save new notes to */
	unsavedNotes.filename = docJSON;

    /* Load document */
    $.ajax({
        method: 'GET',
        url: docURI,
        success: function(d) {
            dataLoaded++;
            $('#doc-display').html(d);
            $('#doc-title h2').html(label);
            $('#doc-title').show();
            docOpen = 1;
            /* Either doc will load first or notes will load first */
            if(dataLoaded == 2) showSavedNotes();
        },
        error: function(a,b,c) {
            alert('Could not display article:'+ label);
        }
    });

    /* Load existing notes */
    $.ajax({
        method: 'GET',
        url: 'docs/' + docJSON,
        success: function(d) {
            savedNotes.data = d;
            unsavedNotes.data = [];
            dataLoaded++;
            if (dataLoaded == 2){
                showSavedNotes();
            }
        },
        error: function(a,b,c) {
            alert('Could not display annotations for: '+ label);
            savedNotes.data = [];
            unsavedNotes.data = [];
            dataLoaded++;
            if(dataLoaded == 2) showSavedNotes();
        }
    });
}

/* Loop through saved notes */
function showSavedNotes() {
    for (var i=0; i< savedNotes.data.length; i++) { // ciclo le note
        if(entireTypes.indexOf(savedNotes.data[i].type) !== -1){
            insertEntireNote(savedNotes.data[i],mode=='annotate');// inserisco le note passando la nota e una modalità
        }else{
            insertNote(savedNotes.data[i],mode=='annotate');// inserisco le note passando la nota e una modalità
            insertEntireNote(savedNotes.data[i],mode=='annotate');// inserisco le note passando la nota e una modalità

        }
    }
    //var n = $('.sentence').length;
    //$('#sentence')[0].max = n
}

/* Insert note into doc-notes to be displayed */
function insertEntireNote(note,active) {
    //"label":"Clarity Score","value":"fair","name":"riccardo","email":"riccardocandido@gmail.com","time":"2014-05-27T01:01"
    $('#doc-notes .list-group').html("<li class=\"list-group-item no-border\">" + note.label + "</li>");

}

/* Insert note into HTML to be displayed */
function insertNote(note,active) {
    var r = document.createRange(); // creo un range
    var node = $('#'+note.node)[0].childNodes[note.pos]; // prendo l'id del nodo, prendo il figlio
    r.setStart(node,note.start);
    r.setEnd(node,note.end);
    var span = document.createElement('span');
    span.setAttribute('id',note.id);
    span.setAttribute('class',note.type+(active?" edit-"+note.type:''));
    r.surroundContents(span);
}

/* Switch to annotator or reader mode */
/************* REVERT TEST PHASE CONDITIONS TO NORMAL REQUIREMENTS ******/
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

                    annotate();

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
}

/* Adding and saving annotations functions */
/* Annotator mode: add and save notes functionality */
function annotate() {
    /* Decide between entire doc note or fragment note */
    $("#note-add").click(function() {
        if(docOpen) {
            if(getHTMLOfSelection()=='') {
                /* Add target details to currNote */
                getTarget(0);
                $("#add-note-entire").modal({backdrop: 'static'});
            } else {
                mySelection = selection();
                getTarget(1);
                $("#add-note-frag").modal({backdrop: 'static'});
            }
        } else {
            (document.getElementById("alert-title")).innerHTML = "ERROR";
            (document.getElementById("alert-body")).innerHTML = "<strong>Could not add annotation.</strong> Please select an article in order to make annotations.";
            $("#alert-mod").modal();
        }
    });

    /* Save notes */
    $("#note-save").click(function() {
        saveNotes();
    });
}

/* Gets user input for note, makeNote is called in HTML when user clicks note type */
function makeNote(id) {
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
    submitNote(id);
}

/* Event handlers for note submission, checks input and calls storeNote */
function submitNote(id) {
    var ip;
    /* Turn off all other handlers for submit buttons */
    $("#short-btn").off("click");
    /* Check input, store note, display Save button, adjust default values */
    $("#short-btn").click(function() {
        ip = (document.getElementById("short-ip")).value;
        if(checkNotBlank(ip)) {
            storeNote(id, ip);
            checkSave();
        }
        $("#short-ip").val('').placeholder();
    });
    $("#short-cancel").click(function () {
        $("#short-ip").val('').placeholder();
    })

    $("#long-btn").off("click");
    $("#long-btn").click(function() {
        ip = (document.getElementById("long-ip")).value;
        if(checkNotBlank(ip)) {
            storeNote(id, ip);
            checkSave();
        }
        $("#long-ip").val('');
    });
    $("#long-cancel").click(function () {
        $("#long-ip").val('');
    })

    $("#date-btn").off("click");
    $("#date-btn").click(function() {
        ip = (document.getElementById("date-ip")).value;
        if(ip<0 || ip>2014) {
            (document.getElementById("alert-body")).innerHTML = "<strong>Annotation creation failed.</strong> Please input a valid publication year.";
            $("#alert-mod").modal();
        } else if(checkNotBlank(ip)) {
            storeNote(id, ip);
            checkSave();
        }
        $("#date-ip").val('');
    });
    $("#date-cancel").click(function () {
        $("#date-ip").val('');
    })

    $("#choice-btn").off("click");
    $("#choice-btn").click(function() {
        var e = (document.getElementById("choice-ip"));
        ip = e.options[e.selectedIndex].value;
        storeNote(id, ip);
        checkSave();
        $("#choice-ip").val("fair");

    });
    $("#choice-cancel").click(function () {
        $("#choice-ip").val("fair");
    })

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
            storeNote(id, instance);
            checkSave();
        }
        $("#instance-list").val("null-select");
        $("#instance-choice").val("");
    })
    $("#instance-cancel").click(function() {
        $("#instance-list").val("null-select");
        $("#instance-choice").val("");
    })

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
            storeNote(id,dbpedia);
            checkSave();
        }
        $("#pedia-search").val("");
        $("#pedia-results").val("");
    })
    $("#pedia-cancel").click(function() {
        $("#pedia-search").val("");
        $("#pedia-results").val("");
    })

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
                (document.getElementById("alert-body")).innerHTML = "<strong>Annotation creation failed.</strong> Please input required information.";
                $("#alert-mod").modal();
            }
        } else {
            citeTitle = e.options[e.selectedIndex].innerHTML;
            citeLink = ip;
        }
        /* Create external article input to pass to storeNote() */
        var extIp = {};
        extIp.label = citeTitle;
        extIp.url = citeLink;
        storeNote(id, extIp);
        checkSave();
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

/* Store current note to unsaved notes array */
function storeNote(id, ip) {
    /* Sets type, label, and removes extra target info */
    switch(id) {
        case 'note-author':
            currNote.type="hasAuthor";
            currNote.label="Author";
            removeTarget();
            break;
        case 'note-pub':
            currNote.type="hasPublisher";
            currNote.label="Publisher";
            removeTarget();
            break;
        case 'note-year':
            currNote.type="hasPublicationYear";
            currNote.label="Publication Year";
            removeTarget();
            break;
        case 'note-title':
            currNote.type="hasTitle";
            currNote.label="Title";
            removeTarget();
            break;
        case 'note-abstract':
            currNote.type="hasAbstract";
            currNote.label="Abstract";
            removeTarget();
            break;
        case 'note-s-title':
            currNote.type="hasShortTitle";
            currNote.label="Short Title";
            removeTarget();
            break;
        case 'note-comment':
            currNote.type="hasArticleComment";
            currNote.label="Comment";
            removeTarget();
            break;
        case 'note-person':
            currNote.type="denotesPerson";
            currNote.label="Associated with Person";
            break;
        case 'note-place':
            currNote.type="denotesPlace";
            currNote.label="Associated with Place";
            break;
        case 'note-disease':
            currNote.type="denotesDisease";
            currNote.label="Associated with Disease";
            break;
        case 'note-subject':
            currNote.type="hasSubject";
            currNote.label="Subject";
            break;
        case 'note-dbpedia':
            currNote.type="relatesTo";
            currNote.label="Related to";
            break;
        case 'note-clarity':
            currNote.type="hasClarityScore";
            currNote.label="Clarity Score";
            break;
        case 'note-originality':
            currNote.type="hasOriginalityScore";
            currNote.label="Originality Score";
            break;
        case 'note-format':
            currNote.type="hasFormattingScore";
            currNote.label="Formatting Score";
            break;
        case 'note-cite':
            currNote.type="cites";
            currNote.label="Cites";
            break;
        case 'note-cite-comm':
            currNote.type="hasComment";
            currNote.label="Comment";
            break;
    }

    /* Add note information to myNote array */
    getJSON(currNote.type,ip);
    unsavedNotes.data.push(currNote);
    /* insert the note in the html document */
    insertNote(currNote,true);
    /********** AYE TESTING HERE *********/
    console.log("Storing: "+JSON.stringify(currNote));
    $.getJSON('/jsonplay', currNote, function(data) {
        console.log('-come va? -' + data.result);
    });
    currNote = {};
}

/* Sends note via Ajax */
function saveNotes() {
    $.ajax({
        method: 'POST',
        url: "save.php",
        data: "json="+JSON.stringify(unsavedNotes),
        success: function(d) {
            saved = 1;
            unsavedNotes={};
            unsavedNotes.data = [];
            /* Notify user, remove save button */
            (document.getElementById("alert-title")).innerHTML = "SUCCESS";
            (document.getElementById("alert-body")).innerHTML = "Annotations saved.";
            $("#alert-mod").modal();
            (document.getElementById("note-save")).setAttribute("style", "display: none;");
        },
        error: function(a,b,c) {
            /* Display error mod */
            (document.getElementById("alert-title")).innerHTML = "ERROR";
            (document.getElementById("alert-body")).innerHTML = "Your annotations could not be saved.";
            $("#alert-mod").modal();
        }
    });
}

/* Create JSON object functions */
/* Stores data in global array currNote (current note) */
function getJSON(type,ip) {
    getBody(type,ip);
    getProvenance();
}

/* Annotations: body */
/******************************* TO DO: IRI *****/
function getBody(type,ip) {
    /* Either a value or a resource (with label) */
    if(type=='cites'||type=='hasAuthor'||type=='hasPublisher'||type=='hasSubject'||type=='relatesTo'||type.substring(0,7)=='denotes') {
        /* Body type = resource (label and resource URI) */
        currNote.bodyLabel = ip.label;
        currNote.resource = ip.url;
    } else {
        /* Body type = value */
        currNote.value = ip;
    }
}

/* Target: Source, id, node, pos, start, end */
function getTarget(frag) {
    if(frag) {
        var dad = mySelection.anchorNode.parentElement;
        if(compatibleExtremes(mySelection)) { /* Check overlapping */
            var spanId = 'span-'+ ($('#doc-display span').length+1);
            var pos = dad.childNodes.indexOf(mySelection.anchorNode);
        }
        currNote.id = spanId;
        currNote.node = dad.id;
        currNote.pos = pos;
        currNote.start = Math.min(mySelection.anchorOffset, mySelection.focusOffset);
        currNote.end = Math.max(mySelection.anchorOffset, mySelection.focusOffset);
    }
    currNote.source = docIRI;
}

/* Provenance: Name, email, time */
function getProvenance() {
    currNote.name = myName;
    currNote.email = myEmail;
    currNote.time = getDateTime();
}

/* Provenance: Date and time stamp, returns 'time: "yyyy-mm-ddThh:mm"' */
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

/* Auxiliary functions */
/* Selection functions */
function selection() {
    if (window.getSelection) {
        return window.getSelection();
    } else if (document.getSelection) {
        return document.getSelection();
    } else if (document.selection) {
        return document.selection.createRange().text;
    }
}

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

/* Checks if user input is valid: True if not blank, false if blank */
function checkNotBlank(ip) {
    if(ip.length<1) {
        (document.getElementById("alert-body")).innerHTML = "<strong>Annotation creation failed.</strong> Please input required information.";
        $("#alert-mod").modal();
        return false;
    }
    return true;
}

/* Displays Save button if not already displayed */
function checkSave() {
    if(saved) {
        saved = 0;
        (document.getElementById("note-save")).setAttribute("style", "display: inline;");
    }
}

/* For entire-doc notes, removes unnecessary info (info added when user chooses entire-doc note with selection) */
function removeTarget() {
    if(mySelection!='') {
        delete currNote.id;
        delete currNote.node;
        delete currNote.pos;
        delete currNote.start;
        delete currNote.end;
    }
}

/* Overlapping options */
function compatibleExtremes(n) {
    return (n.anchorNode === n.focusNode && n.type=='Range');
}

NodeList.prototype.indexOf = function(n) {
    var i=-1;
    while (this.item(i) !== n)
        i++;
    return i;
};

/* Filter functions */
/* Set event to filter annotations */
function setFilter(){
    $('#doc-title').hide();
    $('.collapse').collapse('hide')
}

/* function for to show of style */
function AddRemoveClass(id, typeClass, addRemoveClass) {
    // when i press on a button i set or unset the text
    if ($('#'+id).is(':checked'))
        $(typeClass).addClass(addRemoveClass);
    else
        $(typeClass).removeClass(addRemoveClass);
}
