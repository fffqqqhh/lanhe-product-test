let db;
let sheettitle;

let dbVersion;

let versionStorage = window.localStorage;
if(versionStorage.getItem("DBVer") != null)
{
	let dbVerStr = versionStorage.getItem("DBVer");
	dbVersion = parseInt(dbVerStr,10);
	console.log("db version is "+dbVersion);
}
else
{
	console.log("Not found db.");
	dbVersion = 1;
	versionStorage.setItem("DBVer",dbVersion.toString());
}

let DBOpenRequest;
DBOpenRequest = window.indexedDB.open("AiceLiteData",dbVersion);
DBOpenRequest.onerror = (event) =>{
	console.error("open db fail");
};
DBOpenRequest.onsuccess = (event)=>{
	console.log("open succ.");
	sheettitle = new Date(new Date().setHours(0,0,0,0)).getTime()/1000;
	console.log(sheettitle.toString());
	
	db = event.target.result;
	if(!db.objectStoreNames.contains(sheettitle.toString()))
	{
		//没有当天的表，需要更新一下数据库
		dbVersion++;
		versionStorage.setItem("DBVer",dbVersion.toString());
		console.log("need open again");
		//重新加载页面为了更新数据库
		location.reload();
	}
}

DBOpenRequest.onupgradeneeded = (event)=>{
	//保存IDBDatabase接口
	console.log("upgradeneeded");
	db = event.target.result;
	console.log(db);
	//如果没有该表，则创建
	sheettitle = new Date(new Date().setHours(0,0,0,0)).getTime()/1000;
	if(!db.objectStoreNames.contains(sheettitle.toString())){
		//为数据库创建对象存储(objectStore)
		sheettitle = new Date(new Date().setHours(0,0,0,0)).getTime()/1000;
		const objectStore = db.createObjectStore(sheettitle.toString(),{autoIncrement:true});

		objectStore.createIndex('mac','mac',{unique:false});
		objectStore.createIndex('date','date',{unique:true});
	}
};

function DBaddData(jsondata){
	const transaction = db.transaction(sheettitle.toString(),"readwrite");
	transaction.onerror = ()=>{
		console.log("transaction error");
	}

	transaction.oncomplete = ()=>{
		console.log("transaction succ");
	}

	const obStore = transaction.objectStore(sheettitle.toString());
	obStore.add(jsondata);
}

function DBdownData(){
	if(db)
	{
		const downtransaction = db.transaction(sheettitle.toString());
		downtransaction.oncomplete = ()=>{
			console.log("transaction suc.");
		}

		const downobstore = downtransaction.objectStore(sheettitle.toString());
		const datarequest = downobstore.getAll();

		datarequest.onsuccess = (event)=>{
			const data = event.target.result;
			const json = JSON.stringify(data,null,"\t");
			const blob = new Blob([json],{type:'application/json'});
			const url = URL.createObjectURL(blob);

			const downLink = document.createElement('a');
			downLink.href = url;
			downLink.download = "TestData.json";
			document.body.appendChild(downLink);
			downLink.click();
			document.body.removeChild(downLink);
			URL.revokeObjectURL(url);
		}
	}
	else
	{
		console.log("db is not open");
	}
}
