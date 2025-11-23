
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

const SnackBar = (icon, msg) => {

    Swal.fire({

        icon: icon,
        title: msg,
        timer: 1500
    })
}

const Templating = (arr) => {

    let res = arr.map(c => {

        return `
            
                    <div class="card mb-4" id="${c.id}">
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

const CreateCard = (obj, id) => {

    let card = document.createElement("div");

    card.id = id;

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

    cardForm.reset();
}

const Patchdata = (obj) => {

    title.value = obj.title;
    content.value = obj.body;
    userId.value = obj.userId;

    submitBtn.classList.add("d-none");
    updateBtn.classList.remove("d-none");
}

const UIUPdate = (obj, id) => {

    let card = document.getElementById(id);

    card.querySelector(".card-header h5").innerHTML = obj.title;

    card.querySelector(".card-body p").innerHTML = obj.body;

    cardForm.reset();

    submitBtn.classList.remove("d-none");

    updateBtn.classList.add("d-none");
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

const onEdit = (ele) => {

    Loader(true);

    let EDIT_ID = ele.closest(".card").id;

    let EDIT_URL = `${PostURL}/${EDIT_ID}`;

    localStorage.setItem("EDIT_ID", EDIT_ID);

    let xhr = new XMLHttpRequest();

    xhr.open("GET", EDIT_URL);

    xhr.send(null);

    xhr.onload = function () {

        if (xhr.status >= 200 && xhr.status <= 299) {

            let data = JSON.parse(xhr.response);

            Patchdata(data);
            Loader(false);
        }
        else {

            console.error(xhr.status);
        }
    }

    xhr.onerror = function () {

        console.error("network error");
        Loader(false);
    }
}

const onUpdate = () => {

    Loader(true);

    let UPDATE_ID = localStorage.getItem("EDIT_ID");

    let UPDATE_URL = `${PostURL}/${UPDATE_ID}`;

    let UPDATE_OBJ = {

        title: title.value,
        body: content.value,
        userId: userId.value,
        id: UPDATE_ID
    }

    let xhr = new XMLHttpRequest();

    xhr.open("PATCH", UPDATE_URL);

    xhr.send(JSON.stringify(UPDATE_OBJ));

    xhr.onload = function () {

        if (xhr.status >= 200 && xhr.status < 300) {

            UIUPdate(UPDATE_OBJ, UPDATE_ID);

            Loader(false);

             SnackBar("success","post Updated successfully");
        }
        else {

            console.error(xhr.status);
        }
    }

    xhr.onerror = function () {

        console.error("network error");
        Loader(false);
    }
}

const onRemove = (ele) => {

    Loader(true);

    Swal.fire({
        title: "Do you want Remove?",
        showCancelButton: true,
        confirmButtonText: "Remove",
    }).then((result) => {
        if (result.isConfirmed) {

            let REMOVE_ID = ele.closest(".card").id;

            let REMOVE_URL = `${PostURL}/${REMOVE_ID}`;

            let xhr = new XMLHttpRequest();

            xhr.open("DELETE", REMOVE_URL);

            xhr.send(null);

            xhr.onload = function () {

                if (xhr.status >= 200 && xhr.status <= 299) {

                    ele.closest(".card").remove();

                    Loader(false);

                    SnackBar("success","post removed successfully");

                } else {

                    console.error(xhr.status);
                }
            }

            xhr.onerror = function () {

                console.error("network error");
                Loader(false);
            }

        }
    });


}

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
            CreateCard(cardObj, res.id);
             SnackBar("success","post Created successfully");
        }
        else {

            console.error(xhr.status);
        }
    }

    xhr.onerror = function () {

        console.error("network error");
    }
}

cardForm.addEventListener("submit", onSubmit);

updateBtn.addEventListener("click", onUpdate);
