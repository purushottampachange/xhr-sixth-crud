
const cl = console.log;

const cardForm = document.getElementById("cardForm");
const title = document.getElementById("title");
const content = document.getElementById("content");
const userId = document.getElementById("userId");
const submitBtn = document.getElementById("submitBtn");
const updateBtn = document.getElementById("updateBtn");
const cardContainer = document.getElementById("cardContainer");
const spinner = document.getElementById("spinner");

const BaseURL = "https://jsonplaceholder.typicode.com";

const PostURL = `${BaseURL}/posts`;

const Templating = (arr) => {

    let res = arr.map(c => {

        return `
            
                    <div class="card mb-4">
                        <div class="card-header">
                            <h5>${c.title}</h5>
                        </div>
                        <div class="card-body">
                            <p>${c.body}</p>
                        </div>
                        <div class="card-footer d-flex justify-content-between">
                            <button class="btn btn-sm btn-success" onclick = "onEdit(this)">Edit</button>
                            <button class="btn btn-sm btn-danger" onclick = "onRemove(this)">Remove</button>
                        </div>
                    </div>

        `;
    }).join("");

    cardContainer.innerHTML = res;
}

const Loader = (flag) => {

    if (flag) {

        spinner.classList.remove("d-none");
    }
    else {

        spinner.classList.add("d-none")
    }
}

const CreateCard = (obj,id) =>{

    let card = document.createElement("div");

    card.id = id ;

    card.className = "card mb-4";

    card.innerHTML = `
       
                        <div class="card-header">
                            <h5>${obj.title}</h5>
                        </div>
                        <div class="card-body">
                            <p>${obj.body}</p>
                        </div>
                        <div class="card-footer d-flex justify-content-between">
                            <button class="btn btn-sm btn-success" onclick = "onEdit(this)">Edit</button>
                            <button class="btn btn-sm btn-danger" onclick = "onRemove(this)">Remove</button>
                        </div>

    `;
    
    cardContainer.append(card);
}

const FetchPosts = () => {

    Loader(true)

    let xhr = new XMLHttpRequest();

    xhr.open("GET", PostURL);

    xhr.send(null);

    xhr.onload = function () {

        if (xhr.status >= 200 && xhr.status < 300) {

            let data = JSON.parse(xhr.response);
            cl(data);

            Templating(data);

            Loader(false);
        }
        else {

            console.error(xhr.status);
        }
    }

    xhr.onerror = function () {

        console.error("newtowrk error");
        Loader(false);
    }
}

FetchPosts();

const onSubmit = (eve) => {

    eve.preventDefault();

    let cardObj = {

        title: title.value,
        body: content.value,
        userId: userId.value
    }

    let xhr = new XMLHttpRequest();

    xhr.open("POST", PostURL);

    xhr.send(JSON.stringify(cardObj));

    xhr.onload = function () {

        if (xhr.status >= 200 && xhr.status < 300) {
        
             let res = JSON.parse(xhr.response);
             CreateCard(cardObj,res.id);
        }
        else{

            console.error(xhr.status);
        }
    }

   xhr.onerror = function(){

       console.error("network error");
   } 
}

cardForm.addEventListener("submit", onSubmit);