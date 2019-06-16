function addSymbol(sym, id) {
    var symhtml = '<li id="slot-' + id + '" class="slot"> <ul class="slot"> \
    <li>Symbol: <input type="text" class="ipt_symbol" name="slot-1_symbol" value="' + sym + '"></li> \
    <li>Payout: <input type="text" class="ipt_payout" name="slot-1_payout"></li> </ul></li>';
    $("#slots-list").append(symhtml);
}

$(document).ready(function() {

    $("#btn_qload").click(function() {
        // quickload from textarea
        var qlstra = Array.from($("#txt_qload").val());
        var count = 0;
        $("#slots-list").empty();
        for (var i = 0; i < qlstra.length; i++) {
            if (qlstra[i].trim().length > 0) {
                count++;
                addSymbol(qlstra[i], count);
            }
        }
        $("#ipt_slotcount").val(count);
    });

});