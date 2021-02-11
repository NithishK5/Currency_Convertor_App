"use strict";

/*global View,Model*/

let calcView = new View(),
    calcModel = new Model(),
    calcController = null;

function Controller() {

    this.updateDisplay = function (num) {
        calcModel.changeValue(num);
        calcView.showDisplay(calcModel.getCurrentValue(), calcView.getFromName());
    };
    this.init = function () {
        calcController.loadXML();

        calcView.setbutton0(function () {
            calcController.updateDisplay(0);
        });
        calcView.setbutton1(function () {
            calcController.updateDisplay(1);
        });
        calcView.setbutton2(function () {
            calcController.updateDisplay(2);
        });
        calcView.setbutton3(function () {
            calcController.updateDisplay(3);
        });
        calcView.setbutton4(function () {
            calcController.updateDisplay(4);
        });
        calcView.setbutton5(function () {
            calcController.updateDisplay(5);
        });
        calcView.setbutton6(function () {
            calcController.updateDisplay(6);
        });
        calcView.setbutton7(function () {
            calcController.updateDisplay(7);
        });
        calcView.setbutton8(function () {
            calcController.updateDisplay(8);
        });
        calcView.setbutton9(function () {
            calcController.updateDisplay(9);
        });
        calcView.setbuttonC(function () {
            calcModel.clear();
            calcView.showDisplay(calcModel.getCurrentValue(), calcView.getFromName());
        });
        calcView.setbuttonEquals(function () {
            calcModel.setCurrencies(calcView.getTo(), calcView.getFrom());
            calcModel.convert(calcView.getFee());
            calcView.showDisplay(calcModel.getCurrentValue(), calcView.getToName());
            calcModel.clear();
        });
        calcView.setApply(function () {
            window.localStorage.setItem('fromCur', calcView.fromIndex());
            window.localStorage.setItem('toCur', calcView.toIndex());
            window.localStorage.setItem('fee', calcView.feeIndex());
            calcView.setCurNames();
            calcModel.clear();
            calcView.showDisplay(calcModel.getCurrentValue(), calcView.getFromName());
        });

        calcView.setValues();
        calcView.setCurNames();
        calcView.showDisplay(calcModel.getCurrentValue(), calcView.getFromName());

        window.addEventListener("scroll", preventMotion, false);
        window.addEventListener("touchmove", preventMotion, false);


    };

    this.loadXML = function () {

        let xml = new XMLHttpRequest();
        xml.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                calcController.parseFile(this);
            } else {
                calcController.parseJson();
            }
        };

        fetch("http://worldtimeapi.org/api/timezone/CET")
        .then(response => response.json())
        .then( date => {
            let serverDateTime = new Date(date.datetime);
            let isDateUpdated = localStorage.getItem("data_updated");
            let updateHour = 16;

            if (serverDateTime.getUTCHours() + 1 > updateHour && isDateUpdated === 0) {
                xml.open("POST", "https://devweb2020.cis.strath.ac.uk/~aes02112/ecbxml.php", true);
                xml.send(null);
            } else if(serverDateTime.getUTCHours() + 1 < updateHour) {
                localStorage.setItem("data_updated", "0");
            } 
        })
        .catch(console.log);

        
    };

    this.parseJson = function () {
        let json = JSON.parse(localStorage.getItem('json'));
        if (json !== null) {
            let i;
            for (i = 2; i < 34; i++) {
                let currency = json[i][0];
                let rate = json[i][1];
                document.getElementsByClassName(currency)[0].value = rate;
                document.getElementsByClassName(currency)[1].value = rate;
                document.getElementsByClassName(currency).value = rate;
            }
        }
    };
    this.parseFile = function (xml) {
        console.log("XML");
        let i;
        let xmlDoc = xml.responseXML;
        let jsonArray = [];
        let x = xmlDoc.getElementsByTagName("CUBE");
        for(i=2; i < 34; i++) {
            let rate = xmlDoc.getElementsByTagName("Cube")[i].getAttribute("rate");
            let currency = xmlDoc.getElementsByTagName("Cube")[i].getAttribute("currency");

            document.getElementsByClassName(currency)[0].value = rate;
            document.getElementsByClassName(currency)[1].value = rate;
            document.getElementsByClassName(currency).value = rate;
            let temp = [currency, rate];
            jsonArray[i] = temp;
        }
        let json = JSON.stringify(jsonArray);
        window.localStorage.setItem('json', json);
        window.localStorage.setItem("data_updated", "1");
    };
}

function preventMotion(event) {
    window.scrollTo(0, 0);
    event.preventDefault();
    event.stopPropagation();
}

calcController = new Controller();
window.addEventListener("load", calcController.init());