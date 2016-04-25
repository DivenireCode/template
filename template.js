/**
 * Created by TanMin on 2016/4/25.
 * 构建的函数模型在拼接字符串时会出现效率问题（ie8以上浏览器对直接拼接字符串效率大于数组的join方法）
 */

var TemplateEngine = function(html, options) {
    var re = /<%([^%>]+)?%>/g,
        reExp = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g;

    var code = 'var r=[];\n'
            // 参数注入
            + (function (options) {
                var res = [];
                for (var key in options) {
                    res.push('var ' + key + '=this["' + key + '"];\n' );
                }
                return res.join('');
            }(options)),
        cursor = 0
    ;

    var add = function(line, js) {
        js
            ? (code += line.match(reExp)
                ? line + '\n'
                : 'r.push(' + line + ');\n')
            : (code += line != ''
                ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n'
                : '')
        ;

        return add;
    };

    while(match = re.exec(html)) {
        // 此处有待修缮
        add(html.slice(cursor, match.index))(match[1], true);
        cursor = match.index + match[0].length;
    }

    add(html.substr(cursor, html.length - cursor));
    code += 'return r.join("");';

    return new Function(code.replace(/[\r\t\n]/g, '')).call(options);
};