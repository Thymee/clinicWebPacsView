/**
 * 缓存图像到IndexedDB qin.ou 201709
 */

var indexedDBObj = {};

(function (indexedDBObj) {
    "use strict";
    var storeName = 'dicomCache';
    var dbName = 'dicomCache';
    var dbVersion = 1;
    var localDatabase = {};
    localDatabase.indexedDB = self.indexedDB || self.webkitIndexedDB || self.mozIndexedDB  || self.msIndexedDB;
    localDatabase.IDBKeyRange = self.IDBKeyRange || self.webkitIDBKeyRange || self.msIDBKeyRange;
    localDatabase.IDBTransaction = self.IDBTransaction || self.webkitIDBTransaction || self.msIDBTransaction;

    function addDicom(imageId, imagePromise) {
        var db,dbConnect = localDatabase.indexedDB.open(dbName,dbVersion);
        dbConnect.onupgradeneeded = function (e) {
            db = e.target.result;
            if(!db.objectStoreNames.contains(storeName)) {
                var store = db.createObjectStore(storeName,{keyPath:'key'});
                store.createIndex("UK_DicomID", "key", {unique: true});
            }
        };
        dbConnect.onsuccess = function(e) {
            db = e.target.result;
            var option = {
                key : imageId,
                value : imagePromise
            };
            db.transaction(storeName,"readwrite").objectStore(storeName).add(option);
            db.onsuccess = function (event) {
                //console.log(event.target.result);
            };
            db.onerror = function (event) {
                //console.log(event.target.error.message);
            };
        };
        dbConnect.onerror = function (event) {
            alert("当前浏览器已禁用 IndexedDB 数据库功能，请检查相关设置。");
        };
    }

    function getDicom(imageId) {
        var dtd = $.Deferred();
        var db, dbConnect = localDatabase.indexedDB.open(dbName,dbVersion);
        dbConnect.onupgradeneeded = function (e) {
            db = e.target.result;
            if(!db.objectStoreNames.contains(storeName)) {
                var store = db.createObjectStore(storeName,{keyPath:'key'});
                store.createIndex("UK_DicomID", "key", {unique: true});
            }
        };
        dbConnect.onblocked =function(){
            console.log('数据库被占用！');
        };
        dbConnect.onsuccess = function(e) {
            db = e.target.result;
            var transaction = db.transaction(storeName,"readonly");
            var imagePromise = transaction.objectStore(storeName).index("UK_DicomID").get(imageId);
            imagePromise.onsuccess = function(e) {
                var imagePromise = e.target.result;
                dtd.resolve(imagePromise);
            };
        };
        dbConnect.onerror = function (event) {
            alert("当前浏览器已禁用 IndexedDB 数据库功能，请检查相关设置。");
        };
        return dtd.promise();
    }

    function updateDicom(imageId, imagePromise) {
        var db,dbConnect = localDatabase.indexedDB.open(dbName,dbVersion);
        dbConnect.onupgradeneeded = function (e) {
            db = e.target.result;
            if(!db.objectStoreNames.contains(storeName)) {
                var store = db.createObjectStore(storeName,{keyPath:'key'});
                store.createIndex("UK_DicomID", "key", {unique: true});
            }
        };
        dbConnect.onsuccess = function(e) {
            db = e.target.result;
            var option = {
                key : imageId,
                value : imagePromise
            };
            var transaction = db.transaction(storeName,"readwrite");
            transaction.objectStore(storeName).get(imageId).put(option);
        };
        dbConnect.onerror = function (event) {
            alert("当前浏览器已禁用 IndexedDB 数据库功能，请检查相关设置。");
        };
    }

    function countDicom(key) {
        var db, dbConnect = localDatabase.indexedDB.open(dbName,dbVersion);
        dbConnect.onupgradeneeded = function (e) {
            db = e.target.result;
            if(!db.objectStoreNames.contains(storeName)) {
                var store = db.createObjectStore(storeName,{keyPath:'key'});
                store.createIndex("UK_DicomID", "key", {unique: true});
            }
        };
        dbConnect.onsuccess = function(e) {
            db = e.target.result;
            var countRequest = db.transactionSync(storeName,"readonly").objectStore(storeName).count(key);
            countRequest.onsuccess = function(e) {
                return e.target.result;
            };
        };
        dbConnect.onerror = function (event) {
            alert("当前浏览器已禁用 IndexedDB 数据库功能，请检查相关设置。");
        };

    }
    // module exports
    indexedDBObj.addDicom = addDicom;
    indexedDBObj.getDicom = getDicom;
    indexedDBObj.updateDicom = updateDicom;
    indexedDBObj.countDicom = countDicom;
}(indexedDBObj));

// wrap your task in an immediate function to avoid global namespace collisions with other tasks
(function () {

    var cacheConfig;

    function cacheTaskInitialize(config) {
        cacheConfig = config;
    }

    function cacheTaskHandler(data, doneCallback) {

        //通过ajax请求获取DICOM文件

        var xhr = new XMLHttpRequest();
        xhr.responseType = "arraybuffer";

        xhr.open("GET", data.data.wadoURL, false);
        xhr.key = data.data.key;
        xhr.onreadystatechange = function () {
            if (200 === this.status && 4 === this.readyState) {
                indexedDBObj.addDicom(this.key, this.response);
            }
        };
        xhr.send(null);

        wadoURL = null;
        key = null;
        doneCallback({ taskId: data.data.taskId});
    }

    // register ourselves to receive messages
    cornerstoneWADOImageLoaderWebWorker.registerTaskHandler({
        taskType :'cacheTask',
        handler: cacheTaskHandler,
        initialize: cacheTaskInitialize
    });
}());
