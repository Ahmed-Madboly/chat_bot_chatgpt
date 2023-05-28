import bot from "./assets/bot.svg"
import user from "./assets/user.svg"

const form = document.querySelector('form')
const chatContainer = document.querySelector("#chat_container")

let loadInterval;

//Loader function (...)
function loader(element){
    element.textContent = "";
    loadInterval = setInterval(()=>{
        element.textContent +="."
        if(element.textContent.length > 3){
            element.textContent = "";
        }
    },300)
}

//generate unique id

function generateUniqueId (){
    const date = Date.now();
    const random = Math.random();
    const hexa = random.toString(16)

    return `id${date}${hexa}`
}

// type Effect 

function typeText (element,text){
    let index = 0;
    let interval = setInterval(()=>{
        if(index < text.length){
            element.textContent += text.charAt(index)
            index++
        }else{
            clearInterval(interval)
        }
    })
}

function chatStrip (isAi,value,uniqueId){
    return (
        `
            <div class="wraper ${isAi && "ai"}">
                <div class="chat">
                    <div class="profile">
                        <img src='${isAi ? bot : user}' alt="${isAi ? 'bot' : 'user'}"/>
                    </div>
                    <div class="message" id='${uniqueId}'>${value}</div>
                </div>
            </div>
        `
    )
}

// handle Submit function 

const  handleSubmit = async(e)=>{
    e.preventDefault();
    let data = new FormData(form);
    chatContainer.innerHTML += chatStrip(false,data.get("prompt"))
    form.reset();

    const uniqueId = generateUniqueId()
    chatContainer.innerHTML += chatStrip(true,"",uniqueId)
    chatContainer.scrollTop = chatContainer.scrollHeight;
    const messageDiv = document.getElementById(uniqueId)
    loader(messageDiv)
    //fetch data 
    const response = await fetch("https://chat-bot-arpi.onrender.com/",{
        method:"POST",
        headers:{
            'Content-Type': 'application/json',
        },
        body:JSON.stringify({
            prompt:data.get("prompt")
        })
    })
    clearInterval(loadInterval)
    messageDiv.textContent=""
    if(response.ok){
        const da = await response.json();
        const parseddata = da.bot.trim()
        typeText(messageDiv,parseddata)
    }else{
        messageDiv.textContent="something went wrong"
    }
}
form.addEventListener("submit",handleSubmit);
form.addEventListener("keyup",(e)=>{
    if(e.keyCode ===13){
        handleSubmit(e)
    }
})