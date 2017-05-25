$(function(){
  var isinerval;
  /*获取验证码*/
  /*传入点击元素的form父元素*/
  $('.getVerify').click(function () {
    var parent = $(this).parents('form');
    get_verify(parent);
  });
  function get_verify(parent) {
    /*将parent传入子函数*/
    var parent = parent;
    var mobile = parent.find(".tel").val();
    var partten = /^1[3-9]\d{9}$/;
    if(!partten.test(mobile)){
      parent.find('.hint').text("请输入正确的手机号码").css('color','red');
      parent.find(".tel").focus();
      return false;
    }
    $.get("http://www.cy177.com/api.php?op=sms&callback=?",{ mobile: mobile,type:'参与配资',random:Math.random()}, function(data){
      if(data=="0") {
        parent.time = 120;
        parent.find(".getVerify").attr("disabled", true);
        parent.isinerval = setInterval( function () {
          CountDown(parent)
        } , 1000);
      }else if(data=="true") {
        parent.find('.hint').text("你已注册请勿重复").css('color','red');
        /*Todo 待删除*/
        parent.time = 120;
        parent.find(".getVerify").attr("disabled", true);
        parent.isinerval = setInterval( function () {
          CountDown(parent)
        } , 1000);
        /*Todo END 待删除*/
      }else if(data=="-1") {
        parent.find('.hint').text("你今天获取验证码次数已达到上限").css('color','red');
      }else {
        parent.find('.hint').text("短信发送失败").css('color','red');
      }
    },'jsonp');
  }
  /*验证码禁用*/
  function CountDown(parent) {
    if (parent.time < 1) {
      parent.find(".getVerify").val("获取验证码").attr("disabled", false);
      clearInterval(parent.isinerval);
      return;
    }
    parent.find(".getVerify").val(parent.time+"秒后重获");
    parent.time--;
  }
  /*验证码是否正确*/
  /*Done  index 改为parent*/
    $(".verify").blur(function(){
      var parent = $(this).parents('form');
      if(parent.find('.verify').val() != '' && parent.find('.verify').val() != '验证码'){
        verify = parent.find(".verify").val();
        mobile= parent.find(".tel").val();
        $.get("http://www.cy177.com/api.php?callback=?",{op:"sms_idcheck",action:"id_code",mobile:mobile,mobile_verify:verify,type:'参与配资'}, function(data){
          if( data == "1" ) {
            parent.find('.hint').text("验证码正确").css('color','green');
          } else {
            parent.find('.hint').text("验证码不正确").css('color','red');
            return false;
          }
        },'jsonp');
      }
    });

  /*表单提交*/
  /*Done  index 改为parent*/
  $(".sub").click(function(){
    var parent = $(this).parents('form');
    verify = parent.find(".verify").val();
    mobile= parent.find(".tel").val();
    username = parent.find(".name").val();
    type = parent.find('.type').val();
    console.log('name: '+username+', mobile: '+mobile+', verify :'+verify+', type :' +type);
    /*点击提交按钮 验证数据*/
    $.get("http://www.cy177.com/index.php?m=ptjd&c=index&a=register&callback=?",{Cname:username,Mobile:mobile,type:type,mobile_verify:verify},function(data){
      if(data == 'success'){
        alert('感谢您的参与！我们将会尽快与您联系！');
      }else if(data == 'true'){
        alert('您已成功参与活动报名，请勿重复提交！');
      }else if(data == 'errorcode'){
        parent.find('.hint').text("验证码输入错误").css('color','red');
      }else if(data == 'errortel'){
        parent.find('.hint').text("手机号码不正确").css('color','red');
      }
    },'jsonp');
    return false;
  })
})
