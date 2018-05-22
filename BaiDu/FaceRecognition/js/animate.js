var timeout;

function openMove1(){
    offMove1();
    $(".bg1").addClass("blur-animate");
    $(".s1-title").animate({left: 0}, 1600, 'swing', function () {
        $(this).animate({top: '50%', marginTop: '63px'}, 1600, 'swing')
    })
}
function offMove1(){
    $(".bg1").removeClass("blur-animate");
    $(".s1-title").css({left: '1873px', top: '63px', marginTop: 0});
}
function openMove2(){
    offMove2();
    $(".bg2").animate({top:'50%',marginTop:'-200px'},1000,'swing');
    $(".s2-title").animate({top:'50%',marginTop:'-200px'},1000,'swing')
}
function offMove2(){
    $(".bg2").css({top:'100%',marginTop:0});
    $(".s2-title").css({top:'-400px',marginTop:0})
}
function openMove3(){
    offMove3();
    var i=0;
    var counter=setInterval(function(){
        var arry1=$(".bg3 .icon");
        var arry2=$(".s3-title .item");
        arry2.eq(i).animate({marginTop:'0',opacity:1},1000,'swing');
        arry1.eq(i).animate({marginLeft:'60px',opacity:0.5},500,'swing',function(){
            $(this).animate({marginLeft:0,opacity:1},500,'swing')
        });
        i++;
        if(i>arry1.length){
            clearInterval(counter)
        }
    },800)
}
function offMove3(){
    $(".bg3 .icon").css("opacity",0);
    $(".s3-title .item").css({"marginTop":'-80px',"opacity":0})
}
function openMove4(){
    offMove4();
    $(".js-4-list").animate({marginTop:'20px',opacity:1},1500,'swing');
}
function offMove4() {
    $(".js-4-list").css({marginTop: '200px', opacity: 0})
}
var interval;
function openMove6(){
    offMove6();
    var arr=$(".logo-list li");
    interval=setInterval(function(){
        var index = Math.floor((Math.random()*arr.length));
        var ele=arr.splice(index,1);
        $(ele).find("a").animate({opacity:1},250);
        if(arr.length==0){
            clearInterval(interval)
        }
    },250);
}
function offMove6(){
    $(".logo-list li a").css({opacity:0});
    clearInterval(interval);
}