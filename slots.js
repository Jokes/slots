function defaultPayout(sym) {
    var p = defaultPayouts[sym];
    if (p == null) {
        p = 0;
    }
    return p;
}

function addSymbol(sym, id) {
    var pay = defaultPayout(sym);
    var symhtml = '<li id="slot-' + id + '" class="slot"> <ul class="slot"> \
    <li>Symbol: <input type="text" class="ipt_symbol" id="slot-' + id + '_symbol" value="' + sym + '"></li> \
    <li>Payout: <input type="text" class="ipt_payout" id="slot-' + id + '_payout" value="' + pay + '"></li> </ul></li>';
    $("#slots-list").append(symhtml);
}

function randomSlot() {
    return Math.floor(Math.random() * $("#slotcount").text() + 1);
}

var sym = function(v) {
    return {
        symbol: $("#slot-" + v + "_symbol").val(),
        payout: $("#slot-" + v + "_payout").val()
    }
}

function fullRoll() {
    var rolln = [randomSlot(), randomSlot(), randomSlot()];
    var rolls = rolln.map(sym);

    var event = 1;
    var payout = 0;
    var a = rolln[0];
    var b = rolln[1];
    var c = rolln[2];
    if (a == b) {
        payout = rolls[0].payout;
        event = 2;
        if (b == c) {
            event = 3;
        }
    } else if (b == c || a == c) {
        payout = rolls[2].payout;
        event = 2;
    }

    return { roll: rolls, event: event, payout: payout }
}

function rollHtml(r) {
    console.log(r);
    console.log(r.roll);
    var rh = r.roll.map(function(v) {
        return '<li class="rollsym">' + v.symbol + '</li>'
    }).join("");
    var payclass = "payout-none";
    if (r.payout > 0) { payclass = "payout-yes" }
    return '<li class="rollcard event-' + r.event + ' ' + payclass + '"><ul>' + rh + '</ul></li>'
}

function cutRollSection() {
    $("#rolls-current").removeAttr("id");
    $("#roll-history").append('<ul id="rolls-current" class="roll-list"></ul>');
}

$(document).ready(function() {

    $("#btn_qload").click(function() {
        var qlstra = $("#txt_qload").val().split(/\s+/);
        var count = 0;
        $("#slots-list").empty();
        for (var i = 0; i < qlstra.length; i++) {
            count++;
            addSymbol(qlstra[i], count);
        }
        $("#slotcount").text("" + count);
    });

    $("#btn_roll").click(function() {
        var thisRoll = fullRoll();
        $("#rolls-current").append(rollHtml(thisRoll));
    });

    $("#btn_roll_e").click(function() {
        var event = 1;
        var thisRoll;
        cutRollSection();

        while (event < 2) {
            thisRoll = fullRoll();
            $("#rolls-current").append(rollHtml(thisRoll));
            event = thisRoll.event;
        }
    });

    $("#btn_roll_p").click(function() {
        var payout = 0;
        var thisRoll;
        cutRollSection();

        while (payout == 0) {
            thisRoll = fullRoll();
            $("#rolls-current").append(rollHtml(thisRoll));
            payout = thisRoll.payout;
        }
    });

});