/** Progetto AnnOtaria
     Tecnologie Web 2014
     Riccardo Candido e April Tran **/

$(document).ready(main());
 
    
function main() {
    var saveNote = function(json) {
        var toSend = {"data": '[{"type":"hasComment", "label":"Comment", "value":"This is my comment.", "source":"/article.html", "id":"div123", "start":"1", "end":"10", "name":"april", "email":"april@email.com", "time":"2014-03-12T15:46"},{"type":"hasPublicationYear", "label":"Publishing Year", "value":"1984", "source":"/article.html", "name":"riki", "email":"riki@email.com", "time":"2013-02-05T14:43"}]'};

        $.getJSON("/save_notes", toSend, function(returned) {
            console.log(returned.result);
            $("#doc-display").text(returned.result); 
        });
        return false;
    }
    $("#icon").bind("click", saveNote);
}

    
