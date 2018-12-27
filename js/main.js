var right = new Vue({
    el:'#right-div',
    data:{
        msg:''
    }
});

var left = new Vue({
    el:'#left-table',
    data:{
        items:[

        ]
    },
    methods:{
        selectItem:function (event) {
           a = 0;
           event.target;
            right.msg=event.target.innerText;
            b = event.target.getAttribute('tag');
            JSON.stringify(b)
        }
    }
});


menua = new Vue({
    el:'.menu',
    data:{},
    methods:{
        //新建文件夹
        newFolder:function (e,x) {
            var m = e.target;
            var index =parseInt(m.parentNode.getAttribute('index'))
            var level = parseInt(m.parentNode.getAttribute('level'))
            console.log(level)
            var item;
            switch (x){
                //新建文件夹
                case '0':
                    item = {text:left.items.length,type:'folder',index:index+1,dis:'inline',level:level+1};
                    break
                //新建文件
                case '1':
                    item = {text:left.items.length,type:'file',index:index+1,dis:'none',level:level};
                    break
                default:
                    return;

            }
            left.items.splice(index+1,0,item)
            for(i=0;i<left.items.length;i++){
                left.items[i].index = i;
            }
            document.getElementById("menu").style.width = '0px';
        },
        selecting:function (e) {
            var parent =  e.target.parentNode;
            for(i=0;i<parent.childElementCount;i++){
                if(parent.children[i]==e.target){
                    parent.children[i].style.background = 'gray'
                }else{
                    parent.children[i].style.background = 'white'
                }

            }
        }
    }
})

for(i=0;i<10;i++){
    left.items.push( {text:i,type:i%4==0?'folder':'file',index:i,dis:'inline',level:0});
}


function sort() {

    //根据数据类型显示相应的界面（文件 和 文件夹）
    var c = document.getElementById('left-table').children;
    for(var i=0;i<c.length;i++){
        if(left.items[i].type=='folder'){
            c[i].style.background = 'khaki';
        }else{
            c[i].style.background = 'darkgrey';
        }
    }

}


//网页加载完毕后
window.onload = function () {
    //右键菜单
    document.oncontextmenu=function (e) {
        if(e.target.className == 'left-table-div'){
            //取消默认的右键菜单
            e.preventDefault()
            menu = document.getElementById("menu");
            menu.style.width = '125px'
            menu.style.left = e.clientX +'px'
            menu.style.top = e.clientY +'px'
            var item = e.target;
            menu.setAttribute('index',item.getAttribute('index'))
            menu.setAttribute('level',item.getAttribute('level'))
        }
    }
    sort()

}

window.onclick = function (e) {
    if(e.target.className=='menu'){
        menua.newFolder(e,e.target.getAttribute('index'))
        //将新元素设置属性
        sort()
    }
    document.getElementById("menu").style.width = '0px';
}

function selecting(e) {
    var parent =  e.target.parentNode;
    for(i=0;i<parent.childElementCount;i++){
        if(parent.children[i]==e.target){
            parent.children[i].style.background = 'gray'
        }else{
            parent.children[i].style.background = 'white'
        }

    }
}

