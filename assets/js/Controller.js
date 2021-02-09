"use strict";
/*Globals calcView, calcModel*/
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
        const method = "POST";
        const URL = "https://devweb2020.cis.strath.ac.uk/~aes02112/ecbxml_NONUPDATING_1feb21.php";
        fetch(URL, {
            method: method,
            mode: 'no-cors'
        })
            .then(response => response.text())
            .then(response => {
                const method = "GET";
                const URL = "./assets/data/data.xml";
                if (response === "") {
                    // Load the loal file to prevent error 
                    fetch(URL, {
                        method: method,
                        mode: 'no-cors'
                    })
                        .then(response => response.text())
                        .then(xmlText => {
                            let xml = (new DOMParser()).parseFromString(xmlText, "text/xml");
                            calcController.parseFile(xml);
                        })
                        .catch(console.log)
                } else {
                    let xml = (new DOMParser()).parseFromString(xmlText, "text/xml");
                    calcController.parseFile(xml);
                }
            })
            .catch(console.log)
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
    }
    this.parseFile = function (xml) {
        console.log("XML");
        let i;
        let jsonArray = [];
        let x = xml.getElementsByTagName("Cube");
        for (i = 2; i < 34; i++) {
            let rate = xml.getElementsByTagName("Cube")[i].getAttribute("rate");
            let currency = xml.getElementsByTagName("Cube")[i].getAttribute("currency");

            document.getElementsByClassName(currency)[0].value = rate;
            document.getElementsByClassName(currency)[1].value = rate;
            document.getElementsByClassName(currency).value = rate;
            let temp = [currency, rate];
            jsonArray[i] = temp;
        }
        let json = JSON.stringify(jsonArray);
        window.localStorage.setItem('json', json);
    };
}

function preventMotion(event) {
    window.scrollTo(0, 0);
    event.preventDefault();
    event.stopPropagation();
}

calcController = new Controller();
window.addEventListener("load", calcController.init());