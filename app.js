
const resource = "https://gist.githubusercontent.com/CliffCrerar/54442b8328e8baecf8296fe4bd406a6a/raw/deb504adc663f1cecafaf1e95a575901da322b75/callbacks-demo.json";
console.log('Hello callbacks-promises-observer');

const byId = (id) => document.getElementById(id);
const create = (el) => document.createElement(el);
const append = (parent, child) => parent.appendChild(child);
/*  */

const mainTag = byId('dataView');
console.log('mainTag: ', mainTag);
const addDiv = create('div');
const myFetchResult = create('div');
const myFetchAsyncResult = create('div');
const errorDiv = create('div');
console.log('errorDiv: ', errorDiv);

[errorDiv, addDiv, myFetchResult, myFetchAsyncResult]
    .forEach(el => {
        append(mainTag, el);
    });

/*  */

/* --------- */
/* Callbacks */
/* --------- */

// Example One

function add(a, b, callback) {
    setTimeout(() => {
        callback(a + b);
    }, 3000)
}

const result = add(1, 2, (result) => {
    console.log('result: ', result);
    addDiv.innerText = result;
});

// Example 2 Node.JS callback

// const fs = require('fs');

// const myFileRead = (path,callback) => {
// fs.readFile(path,'utf8', (err,data)=>{
//     if(err) {
//         callback(err, null);
//         return;
//     }
// callback(null, data);
// })
// }

// myFileRead('./fileToRead1.json', (err,data)=>{
//     if(err) {
//         console.error(err.message);
//         return;
//     }
//     console.log(data);
// })

// Example 3 Http Call

async function myAsyncFetch(uri) {
    const fetchExecute = await fetch(uri);
    // console.log('fetchExecute: ', fetchExecute);
    const result = await fetchExecute.json()
    return result;
}

function myFetch(uri, callback) {
    const fetchExecute = fetch(uri);
    // console.log('fetchExecute: ', fetchExecute);

    fetchExecute.then(response => {
        console.log(response);
        if (response.ok) {
            response.json().then(data => {
                callback(null, data);
            })
                .catch(dataConversionError => {
                    callback(dataConversionError, null);
                })
        }
    })

    fetchExecute.catch(errorResponse => {
        console.log('errorResponse: ', errorResponse);
        callback(errorResponse, null);
    })
}

myFetch(resource, myFetchHandler);


function myFetchHandler(err, data) {
    if (err) {
        errorDiv.innerText = err.message;
        console.error('myFetchHandlerError: ', err.message);
    }

    console.log('myFetchHandler: ', data);
    myFetchResult.innerText = 'myFetchResult: ' + JSON.stringify(data);
}

const mySyncFetchResult = myAsyncFetch(resource)

mySyncFetchResult
    .then(data => {
        console.log(data);
        myFetchAsyncResult.innerText = '\n myFetchAsyncResult Then 1: ' + JSON.stringify(data);
        return data.data[0];
    })
    .then(oneRow => {
        console.log('oneRow: ', oneRow);
        myFetchAsyncResult.innerText += '\n myFetchAsyncResult Then 2: ' + JSON.stringify(oneRow);
        return oneRow.Name;
    })
    .then(name => {
        myFetchAsyncResult.innerText += '\n myFetchAsyncResult Then 3: ' + name;
        console.log(name)
    })


mySyncFetchResult.catch(error => {
    console.error(error);
})

mySyncFetchResult.finally(() => {
    console.log('FINALLY');
})
console.log('mySyncFetchResult: ', mySyncFetchResult);