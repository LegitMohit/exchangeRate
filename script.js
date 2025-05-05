const baseUrl ="https://latest.currency-api.pages.dev/v1/currencies"

const dropdowns = document.querySelectorAll(".dropdown select");
const btn=document.querySelector("form button")
let fromCurr= document.querySelector(".from select")
let toCurr= document.querySelector(".to select")
const msg = document.querySelector(".msg");

window.addEventListener("load",()=>{
    updateExchangeRate()
})

for(let select of dropdowns){
    for(let code in countryList){
        const newOption = document.createElement("option");
        newOption.innerText=code;
        newOption.value = code;
        if(select.name === "from" && code === "USD"){
            newOption.selected = true;
        }else if(select.name === "to" && code === "INR"){
            newOption.selected = true;
        }
        select.appendChild(newOption);
    }
    select.addEventListener("change",(evt)=>{
        updateFlag(evt.target)
    })
}

const updateFlag=(element)=>{
    let currCode=element.value
    let countryCode=countryList[currCode]
    let newSource= `https://flagsapi.com/${countryCode}/flat/64.png`
    let image=element.parentElement.querySelector("img")
    image.src=newSource
}

const updateExchangeRate = async ()=>{
    let amount=document.querySelector("#amount");
    let amtValue=amount.value
    if(amtValue===""||amtValue<1){
        amount.value="1"
        amtValue=1
    }
    const Url=`${baseUrl}/${fromCurr.value.toLowerCase()}.json`

    try {
        let response = await fetch(Url);
        let data = await response.json();
        
        const rate = data[fromCurr.value.toLowerCase()][toCurr.value.toLowerCase()];
        if(rate===undefined){
            rate=0
        }
        console.log(rate)
        const finalAmount = (amtValue * rate);
        if(finalAmount===0){
            msg.textContent = `Data for ${toCurr.value} can not be found`;
        }
        const msg = document.querySelector(".msg");
        msg.textContent = `${amtValue} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
    } catch (error) {
        console.error("Error fetching data:", error);
        const msg = document.querySelector(".msg");
        msg.textContent = "An error occurred while fetching exchange rates";
    }
}

btn.addEventListener("click", (evt)=>{
    evt.preventDefault();
    updateExchangeRate();
})