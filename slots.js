function addSymbol(sym, id) {
    var pay = 0;
    if (sym == "💰") {
        pay = 10;
    } else if (sym == "🍒") {
        pay = 8;
    } else if (sym == "6") {
        pay = 6;
    } else if (sym == "💎") {
        pay = 4;
    } else if (sym == "📀") {
        pay = 2;
    }
    var symhtml = '<li id="slot-' + id + '" class="slot"> <ul class="slot"> \
    <li>Symbol: <input type="text" class="ipt_symbol" name="slot-' + id + '_symbol" value="' + sym + '"></li> \
    <li>Payout: <input type="text" class="ipt_payout" name="slot-' + id + '_payout" value="' + pay + '"></li> </ul></li>';
    $("#slots-list").append(symhtml);
}

function randomSlot() {
    return Math.floor(Math.random() * $("#slotcount").text() + 1);
}

function fullRoll() {
    var rolln = [randomSlot(), randomSlot(), randomSlot()];
    var roll = rolln.map(function(v) {
        return {
            symbol: $("#slot-" + v + "_symbol").val(),
            payout: $("#slot-" + v + "_payout").val()
        }
    });

    var event = 1;
    var payout = 0;
    var a = rolln[0];
    var b = rolln[1];
    var c = rolln[2];
    if (a == b) {
        payout = roll[0].payout;
        if (b == c) {
            event = 3;
        }
        event = 2;
    } else if (b == c || a == c) {
        payout = roll[2].payout;
        event = 2;
    }

    return { roll: roll, event: event, payout: payout }
}

$(document).ready(function() {

    $("#btn_qload").click(function() {
        // quickload from textarea
        var qlstra = Array.from($("#txt_qload").val().replace(/\s/g, ""));
        var count = 0;
        $("#slots-list").empty();
        for (var i = 0; i < qlstra.length; i++) {
            if (qlstra[i] != ',') {
                count++;
                addSymbol(qlstra[i], count);
            }
        }
        $("#slotcount").text("" + count);
    });

    $("#btn_roll").click(function() {
        var thisRoll = fullRoll();
    });

});