$(function(){
    // フォームカウント
    var frm_cnt = 0;
  
    // clone object
    $(document).on('click', 'img.card-add-button', function() {
        var original = $('#form_block\\[' + frm_cnt + '\\]');
        frm_cnt++;
        original
            .clone()
            .hide()
            .insertAfter(original)
            .attr('id', 'form_block[' + frm_cnt + ']') // クローンのid属性を変更。
            .end() // 一度適用する
            .find('input').each(function(idx, obj) {
            $(obj).attr({
                id: $(obj).attr('id').replace(/\[[0-9]\]+$/, '[' + frm_cnt + ']'),
                name: $(obj).attr('name').replace(/\[[0-9]\]+$/, '[' + frm_cnt + ']')
            });
            $(obj).val('');
        });

        // clone取得
        var clone = $('#form_block\\[' + frm_cnt + '\\]');
        clone.children('img.card-close-button').show();
        clone.slideDown('slow');
    });
  
    // close object
    $(document).on('click', 'img.card-close-button', function() {
    var removeObj = $(this).parent();
    removeObj.fadeOut('fast', function() {
        removeObj.remove();
        // 番号振り直し
        frm_cnt = 0;
        $(".form-block[id^='form_block']").each(function(index, formObj) {
            if ($(formObj).attr('id') != 'form_block[0]') {
                frm_cnt++;
                $(formObj)
                    .attr('id', 'form_block[' + frm_cnt + ']') // id属性を変更。
                    .find('input').each(function(idx, obj) {
                        $(obj).attr({
                        id: $(obj).attr('id').replace(/\[[0-9]\]+$/, '[' + frm_cnt + ']'),
                        name: $(obj).attr('name').replace(/\[[0-9]\]+$/, '[' + frm_cnt + ']')
                        });
                    });
                }
            });
        });
    });

    // submit
    document.getElementById('timetable-form').addEventListener('submit', function(e) {
        console.log('[in]');
        e.preventDefault();
        send();
    }, {passive: false});
    
    function send() {
        var data = $('#timetable-form').serializeArray();
        data = JSON.stringify(data)
        console.log(data);
        $.ajax({
            type: 'POST',
            url: '../cgi-bin/collectingstar-timetable.py',
            data: data,
            success: function(data) {
                console.log(data);
                send2result(data);
            },
            error: function() {
                console.log("何らかの理由で失敗しました");
                error_alert();
            }
        });
    }

    function send2result(json) {
        // POST先
        var url = '../collectingstar-timetable-result.php';

        // パラメータを付与する
        var inputs = '';
        var data = json.data;
        inputs += '<input type="hidden" name="count" value="' + data.length + '" />';
        for (var i in data) {
            console.log(data[i]);
            var frameData = data[i];
            Object.keys(frameData).forEach(function (key) {
                var value = frameData[key];
                inputs += '<input type="hidden" name="' + key + i + '" value="' + value + '" />';
            });
        }

        console.log(inputs);

        $('body').append('<form action="'+url+'" method="post" id="post">'+inputs+'</form>');
        $('#post').submit();
    }

    function error_alert() {
        const e = alert('チェックに失敗しました。入力を確認してください。').addClass('alert-warning');

        // アラートを表示する
        $('#alert').append(e);

        // 2秒後にアラートを消す
        setTimeout(() => {
            e.alert('close');
        }, 2000);
    }

    // アラート要素を生成する
    function alert(msg) {
        return $('<div class="alert" role="alert"></div>')
        .text(msg);
    }

    // アラート要素(Closeボタン付き)を生成する
    function alertWithCloseBtn(msg) {
        return alert(msg)
          .addClass('alert-success alert-dismissable')
          .append(
            $('<button class="close" data-dismiss="alert"></button>')
              .append(
                $('<span aria-hidden="true">☓</span>')
              )
          );
      }
});