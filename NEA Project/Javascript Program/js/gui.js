$("#SetFen").click(function() {
    var fenStr = $("#fenIn").val();
    ParseFen(fenStr);
    PrintBoard();
    Perft(5);
    PerftTest(5);
});