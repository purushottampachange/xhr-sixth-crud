
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
                            <button class="btn btn-sm btn-success">Edit</button>
                            <button class="btn btn-sm btn-danger">Remove</button>
                        </div>
                    </div>

        `;
    }).join("");

    cardContainer.innerHTML = res;
}

const Loader = (flag) =>{

    if(flag){

        spinner.classList.remove("d-none");
    }
    else{
        
        spinner.classList.add("d-none")
    }
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
        else{
            
            console.error(xhr.status);
        }
    }

    xhr.onerror = function(){

        console.error("newtowrk error");
        Loader(false);
    }
}

FetchPosts();