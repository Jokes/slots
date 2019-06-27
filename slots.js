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
    return Math.floor(Math.random() * $("#disp_symcount").text() + 1);
}

var symInfo = function(v) {
    return {
        symbol: $("#slot-" + v + "_symbol").val(),
        payout: $("#slot-" + v + "_payout").val()
    };
}

function getNumSlots() {
    return $("#ipt_slotcount").val();
}

function fullRoll(styleIsAdd) {
    var slotn = getNumSlots();
    var rolln = [];
    for (var i = 0; i < slotn; i++) {
        rolln.push([randomSlot()]);
    }
    var rolls = rolln.map(symInfo);

    var event = 1;
    var payout = 0;

    if (styleIsAdd) {
        event = slotn;
    }

    var rollcounts = {};
    for (var i = 0; i < rolls.length; i++) {
        var s = rolls[i].symbol;
        if (rollcounts.hasOwnProperty(s)) {
            rollcounts[s]++;
            event = Math.max(event, rollcounts[s]);
        } else {
            rollcounts[s] = 1;
        }
    }
    for (var i = 0; i < rolls.length; i++) {
        rolls[i].count = rollcounts[rolls[i].symbol];
        if (styleIsAdd || rolls[i].count > 1) {
            payout += rolls[i].payout * rolls[i].count; // approximation, not final
        }
    }

    return { roll: rolls, event: event, payout: payout }
}

function rollHtml(r, styleIsAdd) {
    var rh = r.roll.map(function(v) {
        var liclass = "rollsym";
        if (v.payout > 0) { liclass += " sym-payout"; }
        if (v.count > 1) { liclass += " sym-combo sym-combo-" + v.count; }
        return '<li class="' + liclass + '">' + v.symbol + '</li>'
    }).join("");
    var payclass = "payout-none";
    var evclass = "event-" + r.event;
    if (r.payout > 0) { payclass = "payout-yes" }
    if (styleIsAdd) { evclass = "event-add" }
    return '<li class="rollcard ' + evclass + ' ' + payclass + '"><ul>' + rh + '</ul></li>'
}

function cutRollSection() {
    $("#rolls-current").removeAttr("id");
    $("#roll-history").append('<ul id="rolls-current" class="roll-list"></ul>');
}

function updateStats(count, pcount, ptotal) {
    // todo: revamp stat calculations to account for increased complexity

    var slotn = getNumSlots();
    var styleIsCombo = $("#sct_style").children("option:selected").val() == "combo";
    var payChance;
    var ev;

    if (styleIsCombo) {
        // unfortunately, combinatorics
        var perm = Math.pow(count, slotn);

        var notOne = (count - 1) * (count - 1) * count; // the thing, but two of them aren't this symbol
        var yesOne = perm - notOne;
        var yesAny = yesOne * pcount; // that times the number of things
        payChance = yesAny / perm;
        var smallPayChance = (yesAny - pcount) / perm; // big payoff happens with three of a kind
        var bigPayChance = pcount / perm; // like so
        var avgPay = ptotal / pcount;
        ev = avgPay * smallPayChance + avgPay * 10 * bigPayChance - $("#ipt_price").val();
    } else {
        // for now, assume additive

    }

    $("#disp_ev").text("" + ev);
    $("#disp_odds").text("" + payChance);
    $("#disp_symcount").text("" + count);
}

$(document).ready(function() {

    $("#btn_qload").click(function() {
        var qlstra = $("#txt_qload").val().split(/\s+/);
        var count = 0;
        var paycount = 0;
        var paytotal = 0;
        $("#slots-list").empty();
        for (var i = 0; i < qlstra.length; i++) {
            count++;
            addSymbol(qlstra[i], count);
            var pay = defaultPayout(qlstra[i]);
            if (pay > 0) {
                paycount++;
                paytotal += pay;
            }
        }
        updateStats(count, paycount, paytotal);
    });

    $("#btn_roll").click(function() {
        var styleIsAdd = $("#sct_style").children("option:selected").val() == "additive";
        var thisRoll = fullRoll(styleIsAdd);
        if ($("#chk_retry").is(":checked") && thisRoll.event < 2) {
            thisRoll = fullRoll(styleIsAdd);
        }
        $("#rolls-current").append(rollHtml(thisRoll, styleIsAdd));
    });

    $("#btn_roll_e").click(function() {
        var styleIsAdd = $("#sct_style").children("option:selected").val() == "additive";
        var event = 1;
        var thisRoll;
        cutRollSection();

        for (var attempts = 0; event < 2 && attempts < 1000; attempts++) {
            thisRoll = fullRoll(styleIsAdd);
            if ($("#chk_retry").is(":checked") && thisRoll.event < 2) {
                thisRoll = fullRoll(styleIsAdd);
            }
            $("#rolls-current").append(rollHtml(thisRoll, styleIsAdd));
            event = thisRoll.event;
        }
    });

    $("#btn_roll_p").click(function() {
        var styleIsAdd = $("#sct_style").children("option:selected").val() == "additive";
        var payout = 0;
        var thisRoll;
        cutRollSection();

        for (var attempts = 0; payout == 0 && attempts < 1000; attempts++) {
            thisRoll = fullRoll(styleIsAdd);
            if ($("#chk_retry").is(":checked") && thisRoll.event < 2) {
                thisRoll = fullRoll(styleIsAdd);
            }
            $("#rolls-current").append(rollHtml(thisRoll, styleIsAdd));
            payout = thisRoll.payout;
        }
    });

    $("#btn_clear").click(function() {
        $("#roll-history").html('<ul id="rolls-current" class="roll-list"></ul>');
    });

});