window.onload = function() {
    var XLSX = require("xlsx");
    var drop_dom_element1 = document.getElementById("file_timedata");
    var drop_dom_element2 = document.getElementById("file_alldata");
    var time_head = 0, all_head = 2;
    var time_id = "IP号", all_id="证件号码";
    document.ondragover = function (e) {
        e.preventDefault();
    };
    var jsonfile1, jsonfile2;
    function handleDrop1(e) {
        e.stopPropagation();
        e.preventDefault();
        var files = e.dataTransfer.files, f = files[0];
        var status_dom_element = document.getElementById("time_hint");
        status_dom_element.innerText = "加载月度数据中，请稍后";
        var reader = new FileReader();
        reader.onload = function(e) {
            var data = new Uint8Array(e.target.result);
            var workbook = XLSX.read(data, {type: 'array'});
            var sheet = workbook.Sheets[workbook.SheetNames[0]];
            jsonfile1 = XLSX.utils.sheet_to_json(sheet, {range:time_head, defval: ' '});
            status_dom_element.innerText = "月度数据加载完成！";
            checkX();
        };
        reader.readAsArrayBuffer(f);
    }
    function handleDrop2(e) {
        e.stopPropagation();
        e.preventDefault();
        var files = e.dataTransfer.files, f = files[0];
        var status_dom_element = document.getElementById("all_hint");
        status_dom_element.innerText = "加载贫困户数据中，请稍后";
        var reader = new FileReader();
        reader.onload = function(e) {
            var data = new Uint8Array(e.target.result);
            var workbook = XLSX.read(data, {type: 'array'});
            var sheet = workbook.Sheets[workbook.SheetNames[0]];
            jsonfile2 = XLSX.utils.sheet_to_json(sheet, {range:all_head, defval: ' '});
            status_dom_element.innerText = "贫困户数据加载完成！";
            checkY();
        };
        reader.readAsArrayBuffer(f);
    }
    var x = 1;
    var y = 1;
    function checkX() {
        if (x == 1) {
            x = 0;
            drop_dom_element1.style.backgroundColor = "green";
            drop_dom_element1.removeEventListener("drop", handleDrop1, false);
            checkXY();
        }
    }
    function checkY() {
        if (y == 1) {
            y = 0;
            drop_dom_element2.style.backgroundColor = "green";
            drop_dom_element2.removeEventListener("drop", handleDrop2, false);
            checkXY();
        }
    }
    function checkXY() {
        if (x == 0 && y == 0) {
            // add button
            var map = {};
            for (var i = 0; i < jsonfile2.length; i++) {
                var record = jsonfile2[i];
                var id = record[all_id];
                delete record[all_id];
                map[id] = record;
            }
            var result = [];
            for (i = 0; i < jsonfile1.length; i++) {
                if (jsonfile1[i][time_id] in map) {
                    var record2 = map[jsonfile1[i][time_id]];
                    var connected = eval('('+(JSON.stringify(jsonfile1[i])+JSON.stringify(record2)).replace(/}{/,',') + ')');
                    result.push(connected);
                } else {
                    result.push(jsonfile1[i]);
                }
            }
            var write_sheet = XLSX.utils.json_to_sheet(result);
            var workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, write_sheet);
            var wopts = { bookType:'xlsx', bookSST:false, type:'array', compression:true };
            var wbout = XLSX.writeFile(workbook,'out.xlsx', wopts);
        }
    }
    function turncolor(e) {
        e.stopPropagation();
        e.preventDefault();
        e.target.style.backgroundColor = 'yellow';
    }
    function backcolor(e) {
        e.stopPropagation();
        e.preventDefault();
        e.target.style.backgroundColor = '';
    }
    drop_dom_element1.addEventListener("dragenter", turncolor, false);
    drop_dom_element1.addEventListener("dragleave", backcolor, false);
    drop_dom_element2.addEventListener("dragenter", turncolor, false);
    drop_dom_element2.addEventListener("dragleave", backcolor, false);
    drop_dom_element1.addEventListener("drop", handleDrop1, false);
    drop_dom_element2.addEventListener("drop", handleDrop2, false);
}
