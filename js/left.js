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

function onRightClick(e,treeId,treeNode) {
   // reventDefault()
    treeNodes = treeNode;
    document.getElementById('input-mid-text').style.display = 'none'
    document.getElementById('button-save').style.display = 'none'
    document.getElementById('html-link-content').style.display = 'none'
    hideOrShowTypeMenu(e,true,1,treeNode)

}

function onMouseDown(e, treeId, treeNode) {
    treeNodes = treeNode
    switch (treeNode.category){
        //文本
        case '0':
        case 0:
            document.getElementById('input-mid-text').style.display = 'inline'
            document.getElementById('button-save').style.display = 'inline'
            document.getElementById('html-link-content').style.display = 'none'
            document.getElementById("input-mid-text").value = treeNode.text;
            break
        case '5':
        case 5:
            document.getElementById('input-mid-text').style.display = 'none'
            document.getElementById('button-save').style.display = 'none'
            document.getElementById('html-link-content').style.display = 'inline'
            document.getElementById("formContenFrame").src = treeNode.text;
            break
    }
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
    rename = menu.children[3]
    link = menu.children[4]

    // newfolder.style.display = 'inline'
    // newfile.style.display = 'inline'
    // dlte.style.display = 'inline'
    // rename.style.display = 'inline'
    // link.style.display = 'inline'

    newfolder.setAttribute('data',treeNode.id)
    newfile.setAttribute('data',treeNode.id)
    dlte.setAttribute('data',treeNode.id)
    rename.setAttribute('data',treeNode.id)
    link.setAttribute('data',treeNode.id)

    switch (i){
        //右键根文件夹
        case 0:
            newfolder.style.display = 'block'
            newfile.style.display = 'block'
            dlte.style.display = 'none'
            rename.style.display = 'block'
            link.style.display = 'block'
            break
        //右键文件夹
        case 1:
            newfolder.style.display = 'block'
            newfile.style.display = 'block'
            dlte.style.display = 'block'
            rename.style.display = 'block'
            link.style.display = 'block'
            break
        case 2:
            //右键文件
            newfolder.style.display = 'none'
            newfile.style.display = 'none'
            dlte.style.display = 'block'
            rename.style.display = 'block'
            link.style.display = 'block'
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
    var d = new Object()
    d.pid = pid;
    d.category = '0'
    d.name = name
    $.ajax({
        url:window.myurl+'/note/insert',
        type:'post',
        dataType:'json',
        data:{data:JSON.stringify(d)},
        success:function (data) {
            var json = JSON.parse(data.data)
            var news;
                b = new Object()
                b.id = json.id;
                b.pId =  json.pid;
                b.name = b.id+'-'+json.name;
                b.category = '0'
                b.text = '';
                //a.push(b)
            $.fn.zTree.getZTreeObj("treeDemo").addNodes(treeNodes,-1,b)
        },
        error:function(e){
            alert(e)
        }
    });
}

//新建节点
function newLinkHtml(pid,name,link){
    var d = new Object()
    d.pid = pid;
    d.category = '5'
    d.name = name
    d.text = link
    $.ajax({
        url:window.myurl+'/note/insert',
        type:'post',
        dataType:'json',
        data:{data:JSON.stringify(d)},
        success:function (data) {
            var json = JSON.parse(data.data)
            var news;
            b = new Object()
            b.id = json.id;
            b.pId =  json.pid;
            b.name = b.id+'-'+json.name;
            b.category = '5'
            b.text = link;
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
        url:window.myurl+'/note/delete',
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

//录入文件名称
function addName(e){
    var v = document.getElementById("input-rename").value;
    var id = e.getAttribute('data')
    var type = e.getAttribute('data2')
    switch (type){
        case 'newfolder':
            newFile(id,v)
            break
        case 'rename':
            reName(id,v)
            break
        case 'linkhtml':
            var link = document.getElementById("input-link-html").value;
            newLinkHtml(id,v,link)
            break
    }
    document.getElementById("div-rename").style.display='none'
}

//保存笔记
function saveText(e){
    var text = document.getElementById("input-mid-text").value;
    d = new Object();
    d.id= treeNodes.id
    d.text = text;
    $.ajax({
        url:window.myurl+'/note/updateTextById',
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

//重命名
function reName(id,name){
    d = new Object();
    d.id= id
    d.name =name

    $.ajax({
        url:window.myurl+'/note/reName',
        type:'post',
        dataType:'json',
        data:{data:JSON.stringify(d)},
        success:function (data) {
            treeNodes.name = id+'-'+name;
            //$.fn.zTree.getZTreeObj("treeDemo").reAsyncChildNodes(treeNodes,'refresh',false)
            $.fn.zTree.getZTreeObj("treeDemo").updateNode(treeNodes)
        },
        error:function(e){
            alert(e)
        }
    });
}

//界面准备完毕
$(document).ready(function(){
    $.ajax({
        url:window.myurl+'/note/getAllNotes',
        type:'get',
        dataType:'json',
        success:function (data) {
            var json = JSON.parse(data.data)
            for(i=0;i<json.length;i++){
                b = new Object()
                b.id = json[i].id;
                b.pId =  json[i].pid;
                b.name = b.id+'-'+json[i].name;
                b.category = json[i].category
                b.text = json[i].text==undefined?'':json[i].text;
                allnotedata.push(b)
            }
            $.fn.zTree.init($("#treeDemo"), setting, allnotedata);
        },
        error:function(e){
            alert(e)
        }
    });

    //右键菜单
    document.oncontextmenu=function (e) {
        if(e.target.className == 'content_wrap'){
            //点击左边节点目录 取消默认的右键菜单
            e.preventDefault()
        }
    }

    window.onclick = function (e) {
        document.getElementById("right-menu").style.width = '0px';
        var id = e.target.getAttribute('data')
        if(e.target.className=='right-menu'){
            switch (e.target.id){
                case "newfolder":
                    document.getElementById("div-rename").style.display = 'inline'
                    document.getElementById("makesure-rename").setAttribute('data',id)
                    document.getElementById("makesure-rename").setAttribute('data2','newfolder')
                    break;
                case "newfile":
                    break
                case "delete":
                    dlt(id)
                    break
                case "rename":
                    document.getElementById("div-rename").style.display = 'inline'
                    document.getElementById("makesure-rename").setAttribute('data',id)
                    document.getElementById("makesure-rename").setAttribute('data2','rename')
                    break
                case "linkhtml":
                    document.getElementById("div-rename").style.display = 'inline'
                    document.getElementById("input-link-html").style.display = 'inline'
                    document.getElementById("makesure-rename").setAttribute('data',id)
                    document.getElementById("makesure-rename").setAttribute('data2','linkhtml')
                    break
            }
        }
    }
});