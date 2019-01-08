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
           // a = 0;
           // event.target;
           //  right.msg=event.target.innerText;
           //  b = event.target.getAttribute('tag');
           //  JSON.stringify(b)
        }
    }
});


menua = new Vue({
    el:'.menu',
    data:{},
    methods:{
        //新建文件夹
        newFolder:function (e,x) {
            document.getElementById("menu").style.width = '0px';
            $.ajax({
                url:'http://222.186.36.75:9999/note/note/insert',
                type:'post',
                dataType:'json',
                data:{data:'{pid:'+x+',category:\'0\'}'},
                success:function (data) {
                    getNoteData(x);
                },
                error:function(e){
                    alert(e)
                }
            });
        }
        // selecting:function (e) {
        //     var parent =  e.target.parentNode;
        //     for(i=0;i<parent.childElementCount;i++){
        //         if(parent.children[i]==e.target){
        //             parent.children[i].style.background = 'gray'
        //         }else{
        //             parent.children[i].style.background = 'white'
        //         }
        //
        //     }
        // }
    }
})

function sort() {

    // //根据数据类型显示相应的界面（文件 和 文件夹）
    // var c = document.getElementById('left-table').children;
    // for(var i=0;i<c.length;i++){
    //     if(left.items[i].type=='folder'){
    //         c[i].style.background = 'khaki';
    //     }else{
    //         c[i].style.background = 'darkgrey';
    //     }
    // }

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
            menu.setAttribute('pid',item.getAttribute('index'))
        }
    }
    sort()
    getNoteData('0')

}

window.onclick = function (e) {
    if(e.target.className=='menu'){
        menua.newFolder(e,noteid)
        //将新元素设置属性
        sort()
    }
    document.getElementById("menu").style.width = '0px';

    if(e.target.className=='left-table-div-a'){
        var item = e.target;
        getNoteData(item.getAttribute('data'))
    }
}

var noteid =0;

//从接口获取列表数据
function getNoteData(e) {
    $.ajax({
        url:'http://222.186.36.75:9999/note/note/selectByPId',
        type:'post',
        dataType:'json',
        data:{data:e},
        success:function (data) {
            // if(data.data.length!=0){
            //
            // }
            left.items=[];
            noteid = e;

            for(i=0;i<data.data.length;i++){
                left.items.push(data.data[i])
            }
        },
        error:function(e){
            alert(e)
        }
    });
}

function getParentData() {
    $.ajax({
        url:'http://222.186.36.75:9999/note/note/selectParentById',
        type:'post',
        dataType:'json',
        data:{data:noteid},
        success:function (data) {
            // if(data.data.length!=0){
            //
            // }
            left.items=[];
            for(i=0;i<data.data.length;i++){
                left.items.push(data.data[i])
                noteid = data.data[i].pid;
            }
        },
        error:function(e){
            alert(e)
        }
    });
}


