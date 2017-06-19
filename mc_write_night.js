var JsonObj;
var json_streng;

function loadData(url) {
    $.ajax({
        url: url,
        // contentType: "application/json; charset=utf-8",  // Blot en test af tegnsaettet....
        //dataType: 'json', // <------ VIGTIGT: Saadan boer en angivelse til en JSON-fil vaere! 
        dataType: 'text', // <------ VIGTIGT: Pga. ???, saa bliver vi noedt til at angive JSON som text. 
        async: false, // <------ VIGTIGT: Sikring af at JSON hentes i den rigtige raekkefoelge (ikke asynkront). 
        success: function(data, textStatus, jqXHR) {
            JsonObj = jQuery.parseJSON(data);
            // Alt data JsonObj foeres over i arrays:


            //$(".correct").html("Correct answers: <b>" + score + " / " + antal_korrekte + " </b> Attempts: <b>" + attempts + "</b>");
            //next_round();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert("Error!!!\njqXHR:" + jqXHR + "\ntextStatus: " + textStatus + "\nerrorThrown: " + errorThrown);
        }
    });
    json_streng = JSON.stringify(JsonObj);

    console.log("jSON loaded");
    init();
}

function init() {

    $(".btn_bland").click(bland_kategorier);

    $(".btn_start_tid").click(startTimer);

    for (var i = 0; i < JsonObj.kategorier.length; i++) {
        var rand = Math.floor(Math.random() * JsonObj.kategorier[i].imgcontent.length);
        $(".kategori_container").append("<div class='kat_obj_container col-xs-6 col-md-4'><div class='inner_container col-xs-10'> <div class='imgcontent'><img src='" + JsonObj.kategorier[i].imgcontent[rand] + "' value='" + rand + "' /></div><div class='content_header h3'>" + JsonObj.kategorier[i].tekst + "</div></div><div class='col-xs-1 glyph_container'> <span class='glyphicon glyphicon-plus-sign'></span></div></div>");
    }
    //$(".glyph_container").eq($(".glyph_container").length - 1).hide();

    $(".glyph_container, .imgcontent").click(function() {
        next_icon($(this));
    });
}


function bland_kategorier() {
    $(".imgcontent").each(function(index) {
        $(this).find("img").delay(index * 150).animate({
            opacity: "0",
        }, 250, function() {
            var rand = Math.floor(Math.random() * JsonObj.kategorier[index].imgcontent.length);
            $("img").eq(index).attr("src", JsonObj.kategorier[index].imgcontent[rand]).attr("value", rand)
            $("img").eq(index).animate({
                opacity: "1"
            }, 300);
        });
        //$(this).attr("src", JsonObj.kategorier[index].imgcontent[Math.floor(Math.random() * JsonObj.kategorier[index].imgcontent.length)]);
    });
}


function startTimer() {

    $("audio").remove();
    $(".btn_start_tid, .btn_bland, .txt_tid, .p_tid").hide();
    $("#clock").show();
    var minutes = $(".txt_tid").val();
    var seconds = new Date().getTime() + (minutes * 60000);

    var display = document.querySelector('#clock'),
        timer = new CountDownTimer(minutes * 60);

    timer.onTick(format).onTick(restart).start();

    $(".tid_container").append("<span class='btn_stop btn btn-info'><span class='glyphicon glyphicon-stop'></span> Stop </span>");

    $(".btn_stop").click(function(){
      location.reload();
    });

    function restart() {
        if (this.expired()) {
            $("body").append("<audio autoplay><source src='times_up.mp3' type='audio/mpeg'></audio>");
            UserMsgBox("body", "<h3>Tiden er udløbet</h3>");
            $(".btn_start_tid, .btn_bland, .txt_tid, .p_tid").show();
            $("#clock").hide();
            $(".btn_stop").remove();
            //this.stop();

        }
        console.log(format);
    }

    function format(minutes, seconds) {
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        display.textContent = "Time left: " + minutes + ':' + seconds;
        txt_format_tid = minutes + ':' + seconds;
    }
}

function stopTimer() {
    $('div#clock').countdown('stop');
    $(".btn_start_tid").html("Start nedtælling").off(); //.click(startTimer);
}

function next_icon(obj) {

    var isimg = obj.hasClass("imgcontent");

    var parents = obj.closest("body");

    if (isimg === true) {
        var indeks = obj.parent().parent().index();
    } else {
        var indeks = obj.parent().index();
    }

    var new_img_value = parseInt($("img").eq(indeks).attr("value"));

    new_img_value++;

    $("img").eq(indeks).animate({
        opacity: "0",
    }, 200 + Math.random() * 300, function() {
        if (new_img_value < JsonObj.kategorier[indeks].imgcontent.length) {
            $("img").eq(indeks).attr("src", JsonObj.kategorier[indeks].imgcontent[new_img_value]).attr("value", new_img_value);
        } else {
            $("img").eq(indeks).attr("src", JsonObj.kategorier[indeks].imgcontent[0]).attr("value", 0);
        }
        $("img").eq(indeks).animate({
            opacity: "1"
        }, 200);
    });

}


$(document).ready(function() {
    $('#instructionWrap').html(instruction(JsonObj.userInterface.instruktion));
});
