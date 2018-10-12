

let xhr = new XMLHttpRequest();


xhr.open('POST', '/nccloud/platform/pub/mergerequest.do', true);

xhr.setRequestHeader('Content-Type', 'application/json');

xhr.onreadystatechange = function() {
    if(xhr.readyState === 4 && xhr.status === 200) {
        console.log(xhr.responseText);
    }
}

xhr.send(JSON.stringify({
    busiParamJson: '"[{"rqUrl":"/platform/templet/querypage.do","rqJson":"{\n  \"pagecode\": \"60131041p\",\n  \"appcode\": \"60131041\"\n}","rqCode":"template"},{"rqUrl":"/platform/appregister/queryallbtns.do","rqJson":"{\n  \"pagecode\": \"60131041p\",\n  \"appcode\": \"60131041\"\n}","rqCode":"button"},{"rqUrl":"/platform/appregister/queryappcontext.do","rqJson":"{\n  \"appcode\": \"60131041\"}","rqCode":"context"}]"',
    sysParamJson: {
        appcode: '',
        busiaction: 'null-合并请求',
        from: '',
        ts: 1539322472540
    }
}));