// ==UserScript==
// @name         一个从表格下载csv的插件
// @namespace    https://semoz.github.io/bksr-download-csv
// @version      0.2
// @description  download csv
// @author       Semoz
// @match        *://*/main_colors/system_index*
// @run-at       document-end
// @grant        none
// ==/UserScript==
(function() {
    function downloadPage() {
        var mainFrame = window.top.document.getElementById("main_Frame");

        if (mainFrame) {
            var tabFrame = mainFrame.contentDocument.getElementById("tab_0103021701Frame");

            if (tabFrame) {
                var messageItemDivs = tabFrame.contentDocument.getElementsByClassName("message-item");

                // 初始化一个数组来存储 CSV 数据
                var csvData = [];

                // 遍历找到的每个 message-item 元素并构建 CSV 数据
                for (var i = 0; i < messageItemDivs.length; i++) {
                    var rowData = [];
                    var spans = messageItemDivs[i].getElementsByClassName("districts");

                    // 遍历每个 span，并将其文本添加到行数据中
                    for (var j = 0; j < spans.length; j++) {
                        // 将小写字母转换为中文
                        var text = transformToChinese(spans[j].innerText.trim());
                        // 如果是身份证号码，用双引号括起来
                        if (isChineseIDCardNumber(text)) {
                            text = '"' + text + '"';
                        }
                        rowData.push(text);
                    }

                    // 将当前行数据添加到 CSV 数据中
                    csvData.push(rowData);
                }

                // 将 CSV 数据转换为 CSV 格式的字符串
                var csvContent = convertToCSV(csvData);

                // 创建一个下载链接
                var link = document.createElement("a");
                link.setAttribute("href", encodeURI(csvContent));
                link.setAttribute("download", "exported_data.csv");

                // 将链接添加到文档中
                document.body.appendChild(link);

                // 触发点击事件以下载文件
                link.click();

                // 移除添加的链接元素
                document.body.removeChild(link);
            } else {
                alert("未找到 tab_0103021701Frame 元素。请联系开发人员");
            }
        } else {
            alert("未找到 main_Frame 元素。");
        }

        // 将二维数组转换为 CSV 格式的字符串
        function convertToCSV(data) {
            var csvContent = "data:text/csv;charset=utf-8,\n";
            data.forEach(function (row) {
                csvContent += row.join(",") + "\n";
            });
            return csvContent;
        }

        // 将小写字母转换为中文
        function transformToChinese(text) {
            // 此处添加您的字母到中文的转换逻辑
            // 这里提供一个简单的例子，将小写字母 a 转换为 "中文a"
            return text.replace(/,/g, "，");
        }

        // 判断是否为中国身份证号码
        function isChineseIDCardNumber(text) {
            // 中国身份证号码正则表达式
            var regex = /^[1-9]\d{5}(19|20)\d{2}(0[1-9]|1[0-2])(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
            return regex.test(text);
        }
    }

    // Create a button element
    $(".admin_msg:first").prepend("<div class=\"bnts\"><ul><li><a id=\"btn-download\" href=\"javascript:void(0)\" onclick=\"\" title=\" 检测订单表格\"><i class=\"fa fa-cloud-download\"></i><span class=\"f12\"> 检测订单表格</span></a></li></ul></div>")
    var exportButton = document.getElementById("btn-download");
    exportButton.addEventListener("click", downloadPage);

})();
