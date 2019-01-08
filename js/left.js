var setting = {
    data: {
        simpleData: {
            enable: true
        }
    },
    callback:{
        onRightClick: onRightClick,
        onMouseDown: onMouseDown
    }
};

var zNodes =[
    { id:1, pId:0, name:"父节点1 - 展开", open:true},
    { id:11, pId:1, name:"父节点11 - 折叠"},
    { id:111, pId:11, name:"叶子节点111",open:true},
    { id:1111, pId:111, name:"叶子节点1111"},
    { id:1112, pId:111, name:"叶子节点1112"},
    { id:1113, pId:111, name:"叶子节点1113"},
    { id:112, pId:11, name:"叶子节点112"},
    { id:113, pId:11, name:"叶子节点113"},
    { id:114, pId:11, name:"叶子节点114"},
    { id:12, pId:1, name:"父节点12 - 折叠"},
    { id:121, pId:12, name:"叶子节点121"},
    { id:122, pId:12, name:"叶子节点122"},
    { id:123, pId:12, name:"叶子节点123"},
    { id:124, pId:12, name:"叶子节点124"},
    { id:13, pId:1, name:"父节点13 - 没有子节点", isParent:true},
    { id:2, pId:0, name:"父节点2 - 折叠"},
    { id:21, pId:2, name:"父节点21 - 展开", open:true},
    { id:211, pId:21, name:"叶子节点211"},
    { id:212, pId:21, name:"叶子节点212"},
    { id:213, pId:21, name:"叶子节点213"},
    { id:214, pId:21, name:"叶子节点214"},
    { id:22, pId:2, name:"父节点22 - 折叠"},
    { id:221, pId:22, name:"叶子节点221"},
    { id:222, pId:22, name:"叶子节点222"},
    { id:223, pId:22, name:"叶子节点223"},
    { id:224, pId:22, name:"叶子节点224"},
    { id:23, pId:2, name:"父节点23 - 折叠"},
    { id:231, pId:23, name:"叶子节点231"},
    { id:232, pId:23, name:"叶子节点232"},
    { id:233, pId:23, name:"叶子节点233"},
    { id:234, pId:23, name:"叶子节点234"},
    { id:3, pId:0, name:"父节点3 - 没有子节点", isParent:true}
];

function onRightClick(e,treeId,treeNode) {
   // reventDefault()
    treeNodes = treeNode;
    hideOrShowTypeMenu(e,true,1,treeNode)

}

function onMouseDown(e, treeId, treeNode) {
    treeNodes = treeNode
    document.getElementById("input-mid-text").value = treeNode.text;
}

var treeNodes//当前被右键的节点
//显示或者隐藏右键菜单 根据不同类型返回不同选项
function hideOrShowTypeMenu(e,a,i,treeNode) {
    menu = document.getElementById("right-menu");
    menu.style.width = a?'125px':'0px'
    menu.style.left = e.clientX +'px'
    menu.style.top = e.clientY +'px'
    menu.setAttribute('data',treeNode.id)

    newfolder = menu.children[0];
    newfile = menu.children[1];
    dlte = menu.children[2];
    newfolder.style.display = 'inline'
    newfolder.style.display = 'inline'
    newfolder.style.display = 'inline'
    newfolder.setAttribute('data',treeNode.id)
    newfile.setAttribute('data',treeNode.id)
    dlte.setAttribute('data',treeNode.id)

    switch (i){
        //右键根文件夹
        case 0:
            newfolder.style.display = 'inline'
            newfolder.style.display = 'inline'
            newfolder.style.display = 'none'
            break
        //右键文件夹
        case 1:
            newfolder.style.display = 'inline'
            newfolder.style.display = 'inline'
            newfolder.style.display = 'inline'
            break
        case 2:
            //右键文件
            newfolder.style.display = 'none'
            newfolder.style.display = 'none'
            newfolder.style.display = 'inline'
            break
    }

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

//新建节点
function newFile(pid,name){
    $.ajax({
        url:'http://222.186.36.75:8888/note/note/insert',
        type:'post',
        dataType:'json',
        data:{data:'{pid:'+pid+',category:\'0\',name:'+name+'}'},
        success:function (data) {
            var json = JSON.parse(data.data)
            var news;
                b = new Object()
                b.id = json.id;
                b.pId =  json.pid;
                b.name = b.id+json.name;
                b.text = json.text;
                //a.push(b)
            $.fn.zTree.getZTreeObj("treeDemo").addNodes(treeNodes,-1,b)
        },
        error:function(e){
            alert(e)
        }
    });
}
//删除节点
function dlt(id){
    $.ajax({
        url:'http://222.186.36.75:8888/note/note/delete',
        type:'post',
        dataType:'json',
        data:{data:id+''},
        success:function (data) {
            $.fn.zTree.getZTreeObj("treeDemo").removeNode(treeNodes)
        },
        error:function(e){
            alert(e)
        }
    });
}


window.onclick = function (e) {
    document.getElementById("right-menu").style.width = '0px';
    var id = e.target.getAttribute('data')
    if(e.target.className=='right-menu'){
        switch (e.target.id){
            case "newfolder":
                document.getElementById("div-rename").style.display = 'inline'
                document.getElementById("makesure-rename").setAttribute('data',id)
                break;
            case "newfile":
                break
            case "delete":
                dlt(id)
                break
        }
    }
}

//录入文件名称
function addName(e){
    var v = document.getElementById("input-rename").value;
    var id = e.getAttribute('data')
    newFile(id,v)
    document.getElementById("div-rename").style.display='none'
}

function saveText(e){
    var text = document.getElementById("input-mid-text").value;
    d = new Object();
    d.id= treeNodes.id
    d.text = text;
    $.ajax({
        url:'http://222.186.36.75:8888/note/note/updateTextById',
        type:'post',
        dataType:'json',
        data:{data:JSON.stringify(d)},
        success:function (data) {
            treeNodes.text = text;
            $.fn.zTree.getZTreeObj("treeDemo").reAsyncChildNodes(treeNodes,'refresh',false)
        },
        error:function(e){
            alert(e)
        }
    });
}



//右键菜单
document.oncontextmenu=function (e) {
    if(e.target.className == 'content_wrap'){
        //取消默认的右键菜单
        e.preventDefault()
    }
}


//总数据
var a = [];

$(document).ready(function(){
    $.ajax({
        url:'http://222.186.36.75:8888/note/note/getAllNotes',
        type:'get',
        dataType:'json',
        success:function (data) {
            var json = JSON.parse(data.data)
            var news;
            for(i=0;i<json.length;i++){
                json[i].category;
                b = new Object()
                b.id = json[i].id;
                b.pId =  json[i].pid;
                b.name = b.id+json[i].name;
                b.text = json[i].text==undefined?'':json[i].text;
                a.push(b)
            }
            $.fn.zTree.init($("#treeDemo"), setting, a);
        },
        error:function(e){
            alert(e)
        }
    });
});