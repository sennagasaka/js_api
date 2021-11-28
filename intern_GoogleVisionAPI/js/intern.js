
//APIのURLの定義
const url='https://vision.googleapis.com/v1/images:annotate?key=';
const api_url=url+KEY;

//APIにリクエストを送信
const sendAPI=(base64string)=>{
    const xhr = new XMLHttpRequest();
    xhr.open('POST', api_url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
        requests:[{
            "image":{
                content:base64string
            },
            "features":[
                {
                type:'OBJECT_LOCALIZATION',
                },
                {
                type: 'SAFE_SEARCH_DETECTION',
                },
            ]
        }]
    })
    );
　　 const promise= new Promise((resolve,reject)=>{
        xhr.onreadystatechange=()=>{
            if(xhr.readyState!=XMLHttpRequest.DONE){
                return
                };
            if(xhr.status >= 400){
                return reject({message: `Failed with ${xhr.status}:${xhr.statusText}`});
            }
            resolve(JSON.parse(xhr.responseText));
        };
    })
    return promise
}

//ファイルの読み込み
const readFile=(file)=>{
    const reader=new FileReader();
    reader.readAsDataURL(file);
    const promise=new Promise((resolve,reject)=>{
        reader.onload=(ev)=>{
            document.querySelector('img').setAttribute('src', ev.target.result);
            resolve(ev.target.result.replace(/^data:image\/(png|jpeg);base64,/, ''));
        };
    })
    return promise;
}
//ファイルがinputされたときの動作
document.querySelector('input').addEventListener('input', ev=>{
    if(!ev.target.files||ev.target.files.length==0){
        return;
    }
    Promise.resolve(ev.target.files[0])
        .then(readFile)
        .then(sendAPI)
        .then(res => {
            console.log('SUCCESS!', res);
            //OBJECT_LOCALIZATIONの表示
            document.getElementById('name').innerHTML=res.responses[0].localizedObjectAnnotations[0].name;
            document.getElementById('score').innerHTML=res.responses[0].localizedObjectAnnotations[0].score;
            //SAFE_SEARCH_DETECTIONの表示
            //冗長、、、
            document.getElementById('adult').innerHTML=res.responses[0].safeSearchAnnotation.adult;
            document.getElementById('spoof').innerHTML=res.responses[0].safeSearchAnnotation.spoof;
            document.getElementById('medical').innerHTML=res.responses[0].safeSearchAnnotation.medical;
            document.getElementById('violence').innerHTML=res.responses[0].safeSearchAnnotation.violence;
            document.getElementById('racy').innerHTML=res.responses[0].safeSearchAnnotation.racy;
            let array=[];
            for(value in res.responses[0].safeSearchAnnotation){
                array.push(res.responses[0].safeSearchAnnotation[value]);
            } 
            console.log(array);
            for(let i=0;i<=4;i++){
                let meter=document.getElementById('meter-'+i);
                switch(array[i]){
                    case 'VERY_UNLIKELY':
                        meter.children[0].style.backgroundColor='rgb(144, 238, 144)';
                    break
                    case 'UNLIKELY':
                        meter.children[0].style.backgroundColor='rgb(144, 238, 144)';
                        meter.children[1].style.backgroundColor='rgb(144, 238, 144)';
                    break
                    case 'POSSIBLE':
                        meter.children[0].style.backgroundColor='rgb(144, 238, 144)';
                        meter.children[1].style.backgroundColor='rgb(144, 238, 144)';
                        meter.children[2].style.backgroundColor='rgb(144, 238, 144)';
                    break
                    case 'LIKELY':
                        meter.children[0].style.backgroundColor='rgb(144, 238, 144)';
                        meter.children[1].style.backgroundColor='rgb(144, 238, 144)';
                        meter.children[2].style.backgroundColor='rgb(144, 238, 144)';
                        meter.children[3].style.backgroundColor='rgb(144, 238, 144)';
                    break
                    case 'VERY_LIKELY':
                        meter.children[0].style.backgroundColor='rgb(144, 238, 144)';
                        meter.children[1].style.backgroundColor='rgb(144, 238, 144)';
                        meter.children[2].style.backgroundColor='rgb(144, 238, 144)';
                        meter.children[3].style.backgroundColor='rgb(144, 238, 144)';
                        meter.children[4].style.backgroundColor='rgb(144, 238, 144)';
                    break
                }
            }
        })
        .catch(err => {
        console.log('FAILED:(', err);
        });
});

//画面の切り替え
let objects=document.getElementById('objects');
let safe_search=document.getElementById('safe-search');
let result_tab_1=document.getElementById('result-tab-1');
let result_tab_2=document.getElementById('result-tab-2');

objects.addEventListener('click',function(){
    //titleの背景色の切り替え
    safe_search.classList.remove('yellow');
    this.classList.add('yellow');
    //resultの切り替え
    result_tab_2.classList.remove('show');
    result_tab_1.classList.add('show');
});

safe_search.addEventListener('click',function(){
    //titleの背景色の切り替え
    objects.classList.remove('yellow');
    this.classList.add('yellow');
    //resultの切り替え
    result_tab_1.classList.remove('show');
    result_tab_2.classList.add('show');
});
