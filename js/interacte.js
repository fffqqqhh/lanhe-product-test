
let bleDevice;
let remoteCharacteristic;
let productTestCharacteristic;
let productTestWriteCharacteristic;

const logs = document.getElementById("logs");

let btnBleScan = document.querySelector("#btn-scan-connect");
let btnTestStart = document.querySelector("#btn-test-start");
let btnDBDataDown = document.querySelector("#btn-dbdata-down");
let btnDBDataClear = document.querySelector("#btn-dbdata-clear");

btnTestStart.disabled = true;
btnDBDataClear.disabled = true;

// 各项目标签,为了要改变背景颜色
let spanDeviceName = document.getElementById("span-devicename");
let spanDeviceVer = document.getElementById("span-devicever");
let spanDeviceMac = document.getElementById("span-devicemac");
let spanBatOffVol = document.getElementById("span-batoff");
let spanBatOnVol = document.getElementById("span-baton");
let spanLeftTecTemp = document.getElementById("span-lefttec");
let spanRightTecTemp = document.getElementById("span-righttec");
let spanNatureTemp = document.getElementById("span-nature");
let spanBatTemp = document.getElementById("span-battemp");
let spanBatVol = document.getElementById("span-batvol");

let spanColdLeftTecTemp = document.getElementById("span-coldlefttec");
let spanColdRightTecTemp = document.getElementById("span-coldrighttec");
let spanColdBatVol = document.getElementById("span-coldbatvol");

let spanHeatLeftTecTemp = document.getElementById("span-heatlefttec");
let spanHeatRightTecTemp = document.getElementById("span-heatrighttec");
let spanHeatBatVol = document.getElementById("span-heatbatvol");

let spanFinishBatVol = document.getElementById("span-finishbatvol");
let spanFinishBatTemp = document.getElementById("span-finishbattemp");
let spanFinishNatureTemp = document.getElementById("span-finishnaturetemp");

//各项目数据
let dataDeviceName = document.getElementById("input-devicename");
let dataDevicever = document.getElementById("input-devicever");
let dataDeviceMac = document.getElementById("input-devicemac");
let dataBatOffVol = document.getElementById("input-batoff");
let dataBatOnVol = document.getElementById("input-baton");
let dataLeftTecTemp = document.getElementById("input-lefttec");
let dataRightTecTemp = document.getElementById("input-righttec");
let dataNatureTemp = document.getElementById("input-nature");
let dataBatTemp = document.getElementById("input-battemp");
let dataBatVol = document.getElementById("input-batvol");

let dataColdLeftTecTemp = document.getElementById("input-coldlefttec");
let dataColdRightTecTemp = document.getElementById("input-coldrighttec");
let dataColdBatVol = document.getElementById("input-coldbatvol");


let dataHeatLeftTecTemp = document.getElementById("input-heatlefttec");
let dataHeatRightTecTemp = document.getElementById("input-heatrighttec");
let dataHeatBatVol = document.getElementById("input-heatbatvol");

let dataFinishBatVol = document.getElementById("input-finishbatvol");
let dataFinishBatTemp = document.getElementById("input-finishbattemp");
let dataFinishNatureTemp = document.getElementById("input-finishnaturetemp");

function initDisplay(){
    console.log("initDisplay");
    dataDeviceName.value = "";
    dataDevicever.value = "";
    dataDeviceMac.value = "";
    dataBatOffVol.value = "";
    dataBatOnVol.value = "";
    dataLeftTecTemp.value = "";
    dataRightTecTemp.value = "";
    dataNatureTemp.value = "";
    dataBatTemp.value = "";
    dataBatVol.value = "";

    dataColdLeftTecTemp.value = "";
    dataColdRightTecTemp.value = "";
    dataColdBatVol.value = "";

    dataHeatLeftTecTemp.value = "";
    dataHeatRightTecTemp.value = "";
    dataHeatBatVol.value = "";

    dataFinishBatVol.value = "";
    dataFinishBatTemp.value = "";
    dataFinishNatureTemp.value = "";

    spanDeviceName.style.backgroundColor = "white";
    spanDeviceVer.style.backgroundColor = "white";
    spanDeviceMac.style.backgroundColor = "white";
    spanBatOffVol.style.backgroundColor = "white";
    spanBatOnVol.style.backgroundColor = "white";
    spanLeftTecTemp.style.backgroundColor = "white";
    spanRightTecTemp.style.backgroundColor = "white";
    spanNatureTemp.style.backgroundColor = "white";
    spanBatTemp.style.backgroundColor = "white";
    spanBatVol.style.backgroundColor = "white";

    spanColdLeftTecTemp.style.backgroundColor = "white";
    spanColdRightTecTemp.style.backgroundColor = "white";
    spanColdBatVol.style.backgroundColor = "white";

    spanHeatLeftTecTemp.style.backgroundColor = "white";
    spanHeatRightTecTemp.style.backgroundColor = "white";
    spanHeatBatVol.style.backgroundColor = "white";

    spanFinishBatVol.style.backgroundColor = "white";
    spanFinishBatTemp.style.backgroundColor = "white";
    spanFinishNatureTemp.style.backgroundColor = "white";
}

//这是remote数据
function sendDataPacket()
{
    let crcData = [];
    let crcResult;
    let cmdData = [];
    let b = [];

    cmdData[0] = 0x00;
    cmdData[1] = 0xcc;
    cmdData[4] = 0xff;
    cmdData[5] = 0xff;
    cmdData[6] = 0xff;
    cmdData[7] = 0xff;
    cmdData[8] = 0x00;/*app or testmode*/
    cmdData[9] = 0x00;/*none*/
    cmdData[10] = 0x01;/*turn on/off*/
    cmdData[11] = 0x00;/*none*/
    cmdData[12] = 0x00;/*none*/
    cmdData[13] = 0x11;/*buzzer and led*/
    cmdData[14] = 0x00;/*mode*/
    cmdData[15] = 0x00;/*nataure temp*/
    cmdData[16] = 0x00;/*set temp*/
    cmdData[17] = 0x00;/*set fan*/
    cmdData[18] = 0x00;/*场景模式*/
    cmdData[19] = 0x01;/*温度单位*/

    for(let i=0;i<16;i++)
    {
        crcData[i] = cmdData[4+i];
    }
    for(let i=0;i<16;i++)
    {
        crcData[16+i] = lhKey1[i];
    }
    // console.log("crcData length: "+crcData.length);
    crcResult = crc16Packet(crcData,32);
    cmdData[2] = crcResult;
    cmdData[3] = crcResult>>8;

    // console.log("cmdData length: "+cmdData.length);

    for(let i=0;i<cmdData.length;i++)
    {
        b.push('0x' + cmdData[i].toString(16).slice(-2));
    }
    // console.log(">"+b.join(' '));

    return b;
}

const filters = [{
    // name:'LH-Aice3 Lite'
    namePrefix : 'LH-Aice3'
}];

class PlaybulbCandle {
    constructor(){
        this.device = null;
        this.onDisconnected = this.onDisconnected.bind(this);
    }

    async request(){
        return navigator.bluetooth.requestDevice({filters,optionalServices:[0xFF00,0x180A,0x0001]})
        .then(device=>{
            this.device = device;
            console.log("Got device "+this.device.name);
            this.device.addEventListener('gattserverdisconnected',this.onDisconnected);
        })
    }

    async connect(){
        if(!this.device)
        {
            alert("Device is not connected");
        }
        if(this.device.gatt.connected)
        {
            console.log("ble was connected");
            return Promise.resolve();
        }
        await this.device.gatt.connect()
        .then(device=>{
            console.log("device is connectd");
            //可以打印出对象的信息
            // console.log(device.__proto__);
            showToast("Ble连接成功",2000);
            btnTestStart.disabled = false;
            // console.log("Getting service.");
            // return this.device.gatt.getPrimaryService(0xFF00);
        })
        // .then(service=>{
        //     console.log("Getting characteristic.");
        //     return service.getCharacteristic(0xFF03);
        //     // return service.getCharacteristics();
        // })
        // .then(characteristic=>{
        //     console.log("Got characteristic suc.");
        //     // console.log("Got characteristics: "+ characteristic.map(c=>c.uuid).join('\n'+' '.repeat(19)));

        //     remoteCharacteristic = characteristic;
        // /*
        //     //可以显示ble中特定特征的属性
        //     console.log("Characterisitic uuid: "+remoteCharacteristic.uuid);
        //     console.log("Characterisitic broadcast: "+remoteCharacteristic.properties.broadcast);
        //     console.log("Characterisitic Read: "+remoteCharacteristic.properties.read);
        //     // console.log("Characterisitic Write w/o response: "+remoteCharacteristic.properties.writeWithoutResponse);
        //     console.log("Characterisitic Write: "+remoteCharacteristic.properties.write);
        //     console.log("Characterisitic Notify: "+remoteCharacteristic.properties.notify);
        // */
        //     return remoteCharacteristic.startNotifications().then(()=>{
        //         console.log("Notification started.");
        //         remoteCharacteristic.addEventListener('characteristicvaluechanged',this.handleNotificatios);
        //     })
        // })
    }

    disconnect(){
        if(!this.device)
        {
            alert("Device is not connected");
        }

        /*
        //停止notify
        remoteCharacteristic.stopNotifications()
        .then(()=>{
            remoteCharacteristic.removeEventListener('characteristicvaluechanged',handleNotificatios);
        })
        */
        
        return this.device.gatt.disconnect()
        .then(device=>{
            console.log("Ble is disconnected");
        })
    }

    async readData(){
        const service = await this.device.gatt.getPrimaryService(0x180A);
        const characteristic = await service.getCharacteristic(0x2A28);
        let value = await characteristic.readValue();

        //将object对象[ArrayBuffer] 转换成 字符串
        let emc = new TextDecoder();
        return console.log(emc.decode(value));
    }

    async writeData(){
        let testData = [];
        testData = sendDataPacket();
        // console.log("testdata datalength :"+testData.length);

        let dataBuffer = new ArrayBuffer(20);
        let u8View = new Uint8Array(dataBuffer);
        for(let i=0;i<u8View.length;i++){
            u8View[i]=testData[i];
        }

        return this.device.gatt.getPrimaryService(0xFF00)
        .then(service=>{
            return service.getCharacteristic(0xFF04)
        })
        .then(characteristic=>{
            return characteristic.writeValueWithoutResponse(u8View);
        })
        .then(result=>{
            console.log("Send Complete.");
        })
    }

    str2ab(str)
    {
        let buf = new ArrayBuffer(str.length);
        let bufView = new Uint8Array(buf);
        for(let i=0,strlen=str.length;i<strlen;i++)
        {
            bufView[i] = str.charCodeAt(i);
        }
        return buf;
    }

    async testCmd(str){
        let cmd = "TEST_LANHE";

        return this.device.gatt.getPrimaryService(0x0001)
        .then(service=>{
            service.getCharacteristic(0x0003).then(characteristic=>{
                productTestCharacteristic = characteristic;
            
                return productTestCharacteristic.startNotifications().then(()=>{
                    console.log("TestService Notification started.");
                    productTestCharacteristic.addEventListener('characteristicvaluechanged',this.handleNotificatios);

                    //先打开notify后再下发cmd
                    service.getCharacteristic(0x0002).then(characteristic=>{
                        productTestWriteCharacteristic = characteristic;
                        characteristic.writeValueWithoutResponse(this.str2ab(str)).then(result=>{
                            console.log("write data suc.");

                            let logdate = formatDate(new Date());
                            logs.append(logdate+'\n');
                            logs.scrollTop = logs.scrollHeight - logs.clientHeight;

                            jsondata = {};

                            deviceTestData.fault_flag = 0;
                            deviceTestData.testStep = 0;
                            deviceTestData.data_index = 1;

                            btnTestStart.disabled = true;
                            btnTestStart.innerHTML = "测试中...";

                            btnBleScan.disabled = true;
                            btnDBDataDown.disabled = true;

                            initDisplay();

                            // let timestamp = Date.now();//ms
                            let timestamp = Math.floor(Date.now() / 1000);//s
                            console.log("current time is "+timestamp);
                            jsondata.date = timestamp.toString();
                        })
                    })
                })
            })
        })
    }

    onDisconnected(){
        console.log("Device is disconnected");
        btnBleScan.disabled = false;
        btnTestStart.innerHTML = "开始测试";
        btnTestStart.disabled = true;
        btnDBDataDown.disabled = false;
        alert("Ble已经断开,请重新连接");
    }

    handleNotificatios(event){
        // console.log(event.__proto__);

        //获取notify的特征uuid,可以区分是哪个功能上报的
        // console.log(event.target.uuid.substring(4,8));

        let value = event.target.value;
        let typeid = event.target.uuid.substring(4,8);
        //设备状态上报的
        if(typeid === 'ff03')
        {
            //用一个arraybuffer来处理数据
            let a = [];
            // console.log("Get the data length "+value.byteLength);

            for(let i=0;i<value.byteLength;i++)
            {
                a.push('0x' + ('00' + value.getUint8(i).toString(16)).slice(-2));
            }
            console.log(">"+a.join(' '));
        }
        //这里是产测数据上报的
        else if(typeid === '0003')
        {
            let testdata = new TextDecoder();

            switch(deviceTestData.testStep)
            {
                case 0:{
                    switch(deviceTestData.data_index)
                    {
                    case 1:
                        deviceTestData.NAME = testdata.decode(value);
                        deviceTestData.data_index++;
                        
                        logs.append(deviceTestData.NAME);
                        logs.scrollTop = logs.scrollHeight - logs.clientHeight;

                        jsondata.name = deviceTestData.NAME.substr(8,10);
                        if(jsondata.name !== configData.NAME)
                        {
                            //通过这种方式可以修改被important修饰的css
                            spanDeviceName.style.setProperty("background-color","red","important")

                            deviceTestData.fault_flag = 1;
                        }
                        dataDeviceName.value = jsondata.name;
                        break;
                    case 2:
                        deviceTestData.MUC_VERSION = testdata.decode(value);
                        deviceTestData.data_index++;
                        
                        logs.append(deviceTestData.MUC_VERSION);
                        logs.scrollTop = logs.scrollHeight - logs.clientHeight;

                        jsondata.ver = deviceTestData.MUC_VERSION.substr(12,11);
                        dataDevicever.value = jsondata.ver;
                        break;
                    case 3:
                        deviceTestData.MAC = testdata.decode(value);
                        deviceTestData.data_index++;
                        
                        logs.append(deviceTestData.MAC);
                        logs.scrollTop = logs.scrollHeight - logs.clientHeight;

                        jsondata.mac = deviceTestData.MAC.substr(4,17);
                        dataDeviceMac.value = jsondata.mac;
                        break;
                    case 4:
                        deviceTestData.BAT_VCC_OFF = testdata.decode(value);
                        deviceTestData.data_index++;
                        
                        logs.append(deviceTestData.BAT_VCC_OFF);
                        logs.scrollTop = logs.scrollHeight - logs.clientHeight;

                        jsondata.batvoloff = deviceTestData.BAT_VCC_OFF.substr(12,4);

                        dataBatOffVol.value = jsondata.batvoloff+" mV";
                        break;
                    case 5:
                        deviceTestData.BAT_VCC_ON = testdata.decode(value);
                        deviceTestData.data_index++;
                        
                        logs.append(deviceTestData.BAT_VCC_ON);
                        logs.scrollTop = logs.scrollHeight - logs.clientHeight;

                        jsondata.batvolon = deviceTestData.BAT_VCC_ON.substr(11,4);

                        dataBatOnVol.value = jsondata.batvolon+" mV";
                        break;
                    case 6:
                        deviceTestData.C1 = testdata.decode(value);
                        deviceTestData.data_index++;
                        
                        logs.append(deviceTestData.C1);
                        logs.scrollTop = logs.scrollHeight - logs.clientHeight;

                        jsondata.teclefttemp = deviceTestData.C1.substr(3,2);

                        dataLeftTecTemp.value = jsondata.teclefttemp+" °C";
                        if(jsondata.teclefttemp < configData.C_MIN || jsondata.teclefttemp > configData.C_MAX)
                        {
                            spanLeftTecTemp.style.setProperty("background-color","red","important")

                            deviceTestData.fault_flag = 1;
                        }
                        break;
                    case 7:
                        deviceTestData.C2 = testdata.decode(value);
                        deviceTestData.data_index++;
                        
                        logs.append(deviceTestData.C2);
                        logs.scrollTop = logs.scrollHeight - logs.clientHeight;

                        jsondata.tecrighttemp = deviceTestData.C2.substr(3,2);

                        dataRightTecTemp.value = jsondata.tecrighttemp+" °C";
                        if(jsondata.tecrighttemp < configData.C_MIN || jsondata.tecrighttemp > configData.C_MAX)
                        {
                            spanRightTecTemp.style.setProperty("background-color","red","important")

                            deviceTestData.fault_flag = 1;
                        }
                        break;
                    case 8:
                        deviceTestData.C3 = testdata.decode(value);
                        deviceTestData.data_index++;
                        
                        logs.append(deviceTestData.C3);
                        logs.scrollTop = logs.scrollHeight - logs.clientHeight;

                        jsondata.naturetemp = deviceTestData.C3.substr(3,2);

                        dataNatureTemp.value = jsondata.naturetemp+" °C";
                        if(jsondata.naturetemp < configData.C_MIN || jsondata.naturetemp > configData.C_MAX)
                        {
                            spanNatureTemp.style.setProperty("background-color","red","important")

                            deviceTestData.fault_flag = 1;
                        }
                        break;
                    case 9:
                        deviceTestData.C4 = testdata.decode(value);
                        deviceTestData.data_index++;
                        
                        logs.append(deviceTestData.C4);
                        logs.scrollTop = logs.scrollHeight - logs.clientHeight;

                        jsondata.battemp = deviceTestData.C4.substr(3,2);

                        dataBatTemp.value = jsondata.battemp+" °C";
                        if(jsondata.battemp < configData.C_MIN || jsondata.battemp > configData.C_MAX)
                        {
                            spanBatTemp.style.setProperty("background-color","red","important")

                            deviceTestData.fault_flag = 1;
                        }

                        if(((jsondata.teclefttemp-jsondata.tecrighttemp)< (-configData.C_DIFF)) || ((jsondata.teclefttemp-jsondata.tecrighttemp)> (configData.C_DIFF)))
                        {
                            // console.log("temp diff is "+ (jsondata.teclefttemp-jsondata.tecrighttemp));
                            if(((jsondata.teclefttemp-jsondata.naturetemp)< (-configData.C_DIFF)) || ((jsondata.teclefttemp-jsondata.naturetemp)> (configData.C_DIFF)))
                            {
                                spanLeftTecTemp.style.setProperty("background-color","red","important")

                                deviceTestData.fault_flag = 1;
                            }
                            else
                            {
                                if(((jsondata.tecrighttemp-jsondata.naturetemp)< (-configData.C_DIFF)) || ((jsondata.tecrighttemp-jsondata.naturetemp)> (configData.C_DIFF)))
                                {
                                    spanRightTecTemp.style.setProperty("background-color","red","important")

                                    deviceTestData.fault_flag = 1;
                                }
                            }
                        }
                        else
                        {
                            if(((jsondata.teclefttemp-jsondata.naturetemp)< (-configData.C_DIFF)) || ((jsondata.teclefttemp-jsondata.naturetemp)> (configData.C_DIFF)))
                            {
                                spanNatureTemp.style.setProperty("background-color","red","important")

                                deviceTestData.fault_flag = 1;
                            }
                            else
                            {
                                if(((jsondata.teclefttemp-jsondata.battemp)< (-configData.C_DIFF)) || ((jsondata.teclefttemp-jsondata.battemp)> (configData.C_DIFF)))
                                {
                                    spanBatTemp.style.setProperty("background-color","red","important")

                                    deviceTestData.fault_flag = 1;
                                }
                            }
                        }
                        
                        break;
                    case 10:
                        deviceTestData.V = testdata.decode(value);
                        
                        deviceTestData.data_index = 1;
                        deviceTestData.testStep = 1;

                        logs.append(deviceTestData.V);
                        logs.scrollTop = logs.scrollHeight - logs.clientHeight;

                        jsondata.batidlevol = deviceTestData.V.substr(2,4);
                        dataBatVol.value = jsondata.batidlevol+" mV";
                        if(jsondata.batidlevol < configData.V_MIN || jsondata.batidlevol > configData.V_MAX)
                        {
                            spanBatVol.style.setProperty("background-color","red","important")

                            deviceTestData.fault_flag = 1;
                        }
                        break;
                    default:
                        break;
                    }
                }break;

                case 1:{
                    switch(deviceTestData.data_index)
                    {
                    case 1:
                        deviceTestData.C_C1	= testdata.decode(value);
                        deviceTestData.data_index++;
                        
                        logs.append(deviceTestData.C_C1);
                        logs.scrollTop = logs.scrollHeight - logs.clientHeight;

                        jsondata.tecleftcold = deviceTestData.C_C1.substr(5,2);
                        dataColdLeftTecTemp.value = jsondata.tecleftcold+" °C";

                        if(((jsondata.teclefttemp-jsondata.tecleftcold)<configData.C_CX_MIN) || ((jsondata.teclefttemp-jsondata.tecleftcold)>configData.C_CX_MAX))
                        {
                            spanColdLeftTecTemp.style.setProperty("background-color","red","important");

                            deviceTestData.fault_flag = 1;
                        }
                        break;
                    case 2:
                        deviceTestData.C_C2	= testdata.decode(value);
                        deviceTestData.data_index++;
                        
                        logs.append(deviceTestData.C_C2);
                        logs.scrollTop = logs.scrollHeight - logs.clientHeight;

                        jsondata.tecrightcold = deviceTestData.C_C2.substr(5,2);
                        dataColdRightTecTemp.value = jsondata.tecrightcold+" °C";

                        if(((jsondata.tecrighttemp-jsondata.tecrightcold)<configData.C_CX_MIN) || ((jsondata.tecrighttemp-jsondata.tecrightcold)>configData.C_CX_MAX))
                        {
                            spanColdRightTecTemp.style.setProperty("background-color","red","important");

                            deviceTestData.fault_flag = 1;
                        }
                        break;
                    case 3:
                        deviceTestData.C_V	= testdata.decode(value);
                        
                        deviceTestData.data_index = 1;
                        deviceTestData.testStep = 2;

                        logs.append(deviceTestData.C_V);
                        logs.scrollTop = logs.scrollHeight - logs.clientHeight;

                        jsondata.batcoldvol = deviceTestData.C_V.substr(4,4);
                        dataColdBatVol.value = jsondata.batcoldvol+" mV";
                        if(((jsondata.batidlevol-jsondata.batcoldvol)<configData.V_CV_MIN) || ((jsondata.batidlevol-jsondata.batcoldvol)>configData.V_CV_MAX))
                        {
                            spanColdBatVol.style.setProperty("background-color","red","important");

                            deviceTestData.fault_flag = 1;
                        }
                        break;
                    default:break;
                    }
                }break;

                case 2:{
                    switch(deviceTestData.data_index)
                    {
                    case 1:
                        deviceTestData.H_C1	= testdata.decode(value);
                        deviceTestData.data_index++;
                        
                        logs.append(deviceTestData.H_C1);
                        logs.scrollTop = logs.scrollHeight - logs.clientHeight;

                        jsondata.tecleftheat = deviceTestData.H_C1.substr(5,2);
                        dataHeatLeftTecTemp.value = jsondata.tecleftheat+" °C";

                        if(((jsondata.tecleftheat-jsondata.tecleftcold)<configData.H_CX_MIN) || ((jsondata.tecleftheat-jsondata.tecleftcold)>configData.H_CX_MAX))
                        {
                            spanHeatLeftTecTemp.style.setProperty("background-color","red","important");

                            deviceTestData.fault_flag = 1;
                        }
                        break;
                    case 2:
                        deviceTestData.H_C2	= testdata.decode(value);
                        deviceTestData.data_index++;
                        
                        logs.append(deviceTestData.H_C2);
                        logs.scrollTop = logs.scrollHeight - logs.clientHeight;

                        jsondata.tecrightheat = deviceTestData.H_C2.substr(5,2);
                        dataHeatRightTecTemp.value = jsondata.tecrightheat+" °C";
                        if(((jsondata.tecrightheat-jsondata.tecrightcold)<configData.H_CX_MIN) || ((jsondata.tecrightheat-jsondata.tecrightcold)>configData.H_CX_MAX))
                        {
                            spanHeatRightTecTemp.style.setProperty("background-color","red","important");

                            deviceTestData.fault_flag = 1;
                        }
                        break;
                    case 3:
                        deviceTestData.H_V	= testdata.decode(value);

                        deviceTestData.data_index = 1;
                        deviceTestData.testStep = 3;

                        logs.append(deviceTestData.H_V);
                        logs.scrollTop = logs.scrollHeight - logs.clientHeight;

                        jsondata.batheatvol = deviceTestData.H_V.substr(4,4);
                        dataHeatBatVol.value = jsondata.batheatvol+" mV";
                        break;
                    default:break;
                    }
                }break;

                case 3:{
                    switch(deviceTestData.data_index)
                    {
                    case 1:
                        deviceTestData.K_V	= testdata.decode(value);
                        deviceTestData.data_index++;
                        
                        logs.append(deviceTestData.K_V);
                        logs.scrollTop = logs.scrollHeight - logs.clientHeight;

                        jsondata.batfinshvol = deviceTestData.K_V.substr(4,4);
                        dataFinishBatVol.value = jsondata.batfinshvol+" mV";
                        if(((jsondata.batfinshvol-jsondata.batheatvol)<configData.KV_HV_MIN) || ((jsondata.batfinshvol-jsondata.batheatvol)>configData.KV_HV_MAX))
                        {
                            spanHeatBatVol.style.setProperty("background-color","red","important");
                            spanFinishBatVol.style.setProperty("background-color","red","important");

                            deviceTestData.fault_flag = 1;
                        }
                        break;
                    case 2:
                        deviceTestData.K_C3	= testdata.decode(value);
                        deviceTestData.data_index++;
                        
                        logs.append(deviceTestData.K_C3);
                        logs.scrollTop = logs.scrollHeight - logs.clientHeight;

                        jsondata.naturefinshtemp = deviceTestData.K_C3.substr(5,2);
                        dataFinishNatureTemp.value = jsondata.naturefinshtemp+" °C";
                        break;
                    case 3:
                        deviceTestData.K_C4	= testdata.decode(value);
                        
                        deviceTestData.data_index = 1;
                        deviceTestData.testStep = 4;

                        logs.append(deviceTestData.K_C4);
                        logs.scrollTop = logs.scrollHeight - logs.clientHeight;

                        jsondata.batfnishtemp = deviceTestData.K_C4.substr(5,2);
                        dataFinishBatTemp.value = jsondata.batfnishtemp+" °C";
                        break;
                    default:break;
                    }
                }break;

                case 4:{
                    deviceTestData.RESULT = testdata.decode(value);
                    // console.log("is: "+deviceTestData.RESULT);
                    deviceTestData.RESULT = deviceTestData.RESULT.slice(0,9);
                    if(deviceTestData.RESULT == "FESULT=OK")
                    {
                        deviceTestData.data_index = 1;
                        deviceTestData.testStep = 0;
                        logs.append(deviceTestData.RESULT);
                        logs.scrollTop = logs.scrollHeight - logs.clientHeight;

                        if(deviceTestData.fault_flag === 0)
                        {
                            jsondata.result = "LH_OK";
                        }
                        else
                        {
                            jsondata.result = "LH_NG";
                        }

                        let userdata = JSON.stringify(jsondata);
                        localStorage.setItem(testNum.toString(),userdata);
                        localStorage.setItem("TestNum",testNum.toString());
                        //将数据添加到indexDB数据库
                        DBaddData(jsondata);
                        testNum++;

                        productTestWriteCharacteristic.writeValueWithoutResponse(deviceBle.str2ab(jsondata.result)).then(result=>{
                            if(deviceTestData.fault_flag === 1)
                            {
                                alert("测试失败，请检查异常项目");
                            }
                            else
                            {
                                alert("测试成功");
                            }
                        })

                        btnTestStart.disabled = false;
                        btnTestStart.innerHTML = "开始测试";

                        btnBleScan.disabled = false;
                        btnDBDataDown.disabled = false;
                    }
                }break;

                default:
                    break;
            }
            return console.log(testdata.decode(value));
        }
        
    }
}

let deviceBle = new PlaybulbCandle();

btnBleScan.addEventListener('click',async event => {
    try
    {
        await deviceBle.request();
        await deviceBle.connect().then(() => {
            console.log("Connected to device");
        })
    }
    catch(error)
    {
        console.log("Error connecting to device: " + error);
    }
})

btnTestStart.addEventListener('click',async event => {
    try
    {
        await deviceBle.testCmd("TEST_LANHE");
    }
    catch(error)
    {
        console.log("Error starting test: " + error);
    }
})

function formatDate(now)
{
    const hour = now.getHours()<10 ? '0'+now.getHours() : now.getHours();
    const min = now.getMinutes()<10 ? '0'+now.getMinutes() : now.getMinutes();
    const second = now.getSeconds()<10 ? '0'+now.getSeconds() : now.getSeconds();
    const millisecond = ('00'+now.getMilliseconds()).slice(-3);

    return `${hour}:${min}:${second}.${millisecond} :`;
}

function showToast(message,duration)
{
    let toast = document.getElementById('toast');
    toast.innerHTML = message;
    toast.style.visibility = 'visible';

    setTimeout(function(){
        toast.style.visibility = 'hidden';
    },duration);
}
